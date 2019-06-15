import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import getEmptyState from './utils/getEmptyState';
import setupFirebaseRefs from './utils/setupFirebaseRefs';
import detachListeners from './utils/detachListeners';
import inArray from 'in-array';

export default class GlobalFromFirebase extends Component {
  static propTypes = {
    firebaseRefs: PropTypes.object.isRequired,
    loadingScreen: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    onUpdate: PropTypes.func,
    children: PropTypes.node.isRequired
  };

  state = getEmptyState(this.props.firebaseRefs);

  listeners = {};

  componentDidMount = () =>
    setupFirebaseRefs(
      this.props.firebaseRefs,
      this.setStateAndGlobal,
      this.addListener
    );

  addListener = (key, ref) => {
    const listener = (snapshot) => {
      const value = snapshot.val();
      this.setStateAndGlobal(key, value);
    };
    ref.on('value', listener);
    this.registerListener(key, ref, listener);
  };

  registerListener = (key, ref, listener) => {
    this.listeners[key] = { ref, listener };
  };

  setStateAndGlobal = (key, value) => {
    global[key] = value;
    this.setState({ [key]: value }, () => {
      const onUpdate = this.props.onUpdate;
      if (onUpdate) {
        onUpdate(this.state);
      }
    });
  };

  componentWillUnmount = () => detachListeners(Object.values(this.listeners));

  isLoaded = () => !inArray(Object.values(this.state), null);

  render = () => {
    const loaded = this.isLoaded();
    const { loadingScreen, children } = this.props;

    if (loaded) return children;

    if (typeof loadingScreen === 'function') {
      return loadingScreen(this.state);
    }

    if (typeof loadingScreen !== 'undefined' && loadingScreen !== null) {
      return Children.only(loadingScreen);
    }

    return null;
  };
}
