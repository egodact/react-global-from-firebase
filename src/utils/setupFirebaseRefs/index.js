import getFromCache from './getFromCache';
import updateCacheOnChange from './updateCacheOnChange';

const setupFirebaseRefs = (
  firebaseRefs,
  setStateAndGlobal,
  addListener
) =>
  Object.keys(firebaseRefs).forEach((key) => {
    const ref = firebaseRefs[key];

    if (typeof ref === 'object' && ref.idRef) {
      const value = getFromCache(key);
      setStateAndGlobal(key, value);
      updateCacheOnChange(key, ref, setStateAndGlobal);
      return;
    }

    addListener(key, ref.ref || ref);
  });

export default setupFirebaseRefs;
