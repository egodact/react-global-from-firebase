import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getEmptyState from './utils/getEmptyState';

export default class GlobalVarSetup extends Component {
  static propTypes = {
    firebaseRefs: PropTypes.object.isRequired
    children: PropTypes.node.isRequired
  };

  state = getEmptyState(this.props.firebaseRef);

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
    ref.on('value', (snapshot) => {
      this.setState({ [key]: snapshot.val() });
    });
  };

  loadFromCache = (key) => {
    this.setState({
      [key]: localStorage.getItem(`react-global-from-firebase:${key}`)
    });
  };

  listenForCacheUpdates = (key, ref) => {
    ref.idRef.on('value', (snapshot) => {
      const id = snapshot.val();
      const cachedId = localStorage.getItem(`react-global-from-firebase:${key}Id`);
      if (id !== cachedId) this.updateCache(key, ref, id);
    });
  };

  updateCache = (key, ref, id) => {
    ref.once('value').then((snapshot) => {
      const value = snapshot.val();
      // TODO: Make some helper function for this
      localStorage.setItem(`react-global-from-firebase:${key}`, value);
      localStorage.setItem(`react-global-from-firebase:${key}Id`, id);
      this.loadFromCache(key);
    });
  };

  // TODO: Make this work
  componentWillUnmount = () => {
    this.allowedEmailRef().off();
    this.allowedEmailPrefixRef().off();
    this.logoIdRef().off();
    this.loginBgIdRef().off();
  };

  // TODO: Update this
  syncStateToWindow = () => {
    const { allowedEmail, allowedEmailPrefix, logo, loginBg } = this.state;
    global.allowedEmail = allowedEmail;
    global.allowedEmailPrefix = allowedEmailPrefix;
    global.logo = logo;
    global.loginBg = loginBg;
  };

  render = () => {
    const { allowedEmail, allowedEmailPrefix, logo, loginBg } = this.state;
    this.syncStateToWindow();
    if (
      allowedEmail === null ||
      allowedEmailPrefix === null ||
      logo === null ||
      loginBg === null
    ) {
      return <LoadingScreen />;
    }
    return this.props.children;
  };
}
