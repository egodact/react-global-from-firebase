const detachListeners = listeners =>
  listeners.forEach(({ ref, listener }) => ref.off(listener));

export default detachListeners;
