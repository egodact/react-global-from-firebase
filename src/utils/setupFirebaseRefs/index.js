import setupFirebaseRef from './setupFirebaseRef';

const setupFirebaseRefs = (firebaseRefs, setStateAndGlobal, addListener) =>
  Object.keys(firebaseRefs).forEach((key) =>
    setupFirebaseRef(key, firebaseRefs[key], setStateAndGlobal, addListener)
  );

export default setupFirebaseRefs;
