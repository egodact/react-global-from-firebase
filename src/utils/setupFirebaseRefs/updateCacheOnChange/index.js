import getCachedId from './getCachedId';
import updateCache from './updateCache';

const updateCacheOnChange = (key, ref, setStateAndGlobal) => {
  ref.idRef.on('value', async (snapshot) => {
    const id = snapshot.val();
    const cachedId = getCachedId(key)
    if (id !== cachedId) {
      const value = await updateCache(key, ref.ref, id);
      setStateAndGlobal(value);
    }
  });
};

export default updateCacheOnChange;
