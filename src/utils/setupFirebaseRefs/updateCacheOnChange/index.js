import getCachedId from './getCachedId';
import updateCache from './updateCache';

const updateCacheOnChange = (key, ref, setStateAndGlobal) => {
  ref.idRef.on('value', (snapshot) => {
    const id = snapshot.val();
    const cachedId = getCachedId(key)
    if (id !== cachedId) {
      return updateCache(key, ref.ref, id).then(setStateAndGlobal);
    }
  });
};

export default updateCacheOnChange;
