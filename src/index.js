import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import getEmptyState from './utils/getEmptyState';
import { getLocalKey, getLocalKeyId } from './utils/getLocalKeys';

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

  componentDidMount = () => {
    const firebaseRefs = this.props.firebaseRefs;
    Object.keys(firebaseRefs).forEach((key) => {
      const ref = firebaseRefs[key];
      if (typeof ref === 'object' && ref.idRef) {
        this.loadFromCache(key);
        this.listenForCacheUpdates(key, ref);
        return;
      }
      if (typeof ref === 'object' && ref.ref) {
        this.addListener(key, ref.ref);
        return;
      }
      this.addListener(key, ref);
    });
  };

  addListener = (key, ref) => {
    const listener = (snapshot) => {
      const value = snapshot.val();
      global[key] = value;
      this.setState({ [key]: value });
    };
    ref.on('value', listener);
    this.listeners[key] = { ref, listener };
  };

  loadFromCache = (key) => {
    const value = localStorage.getItem(getLocalKey(key));
    global[key] = value;
    this.setState({ [key]: value });
  };

  listenForCacheUpdates = (key, ref) => {
    ref.idRef.on('value', (snapshot) => {
      const id = snapshot.val();
      const cachedId = localStorage.getItem(getLocalKeyId(key));
      if (id !== cachedId) this.updateCache(key, ref.ref, id);
    });
  };

  updateCache = (key, ref, id) => {
    ref.once('value').then((snapshot) => {
      const value = snapshot.val();
      localStorage.setItem(getLocalKey(key), value);
      localStorage.setItem(getLocalKeyId(key), id);
      this.loadFromCache(key);
    });
  };

  componentWillUnmount = () => {
    Object.values(this.listeners).forEach(({ ref, listener }) => {
      ref.off(listener);
    });
  };

  isLoaded = () =>
    Object.values(this.state).reduce(
      (acc, value) => acc && value !== null,
      true
    );

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
