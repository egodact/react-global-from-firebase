import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import getEmptyState from './utils/getEmptyState';
import setupFirebaseRefs from './utils/setupFirebaseRefs';
import detachListeners from './utils/detachListeners';
import arrayContainsNull from './utils/arrayContainsNull';

export default class GlobalVarSetup extends Component {
  static propTypes = {
    firebaseRefs: PropTypes.object.isRequired,
    loadingScreen: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
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
    this.setState({ [key]: value });
  };

  componentWillUnmount = () => detachListeners(Object.values(this.state));

  isLoaded = () => !arrayContainsNull(Object.values(this.state));

  render = () => {
    const loaded = this.isLoaded();
    const { loadingScreen, children } = this.props;

    if (loaded) return children;

    if (typeof loadingScreen === 'function') {
      return loadingScreen(this.state);
    }

    if (typeof loadingScreen !== 'undefined') {
      const LoadingScreen = Children.only(loadingScreen);
      return <LoadingScreen {...this.state} />
    }

    return null;
  };
}
