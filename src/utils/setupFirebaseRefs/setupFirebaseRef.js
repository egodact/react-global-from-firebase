import getCachedValue from './getCachedValue';
import updateCacheOnChange from './updateCacheOnChange';

const setupFirebaseRef = (key, ref, setStateAndGlobal, addListener) => {
  if (typeof ref === 'object' && ref.idRef) {
    const value = getCachedValue(key);
    setStateAndGlobal(key, value);
    updateCacheOnChange(key, ref, setStateAndGlobal);
    return;
  }

  addListener(key, ref.ref || ref);
};

export default setupFirebaseRef;
