import { getLocalKey, getLocalKeyId } from '../getLocalKeys';

const updateCache = (key, ref, id) =>
  ref.once('value').then((snapshot) => {
    const value = snapshot.val();
    localStorage.setItem(getLocalKey(key), value);
    localStorage.setItem(getLocalKeyId(key), id);
    return value;
  });

export default updateCache;
