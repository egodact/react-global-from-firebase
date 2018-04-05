const detachListeners = listeners =>
  listeners.forEach(({ ref, listener }) => ref.off('value', listener));

export default detachListeners;
