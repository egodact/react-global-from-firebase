import { getLocalKey, getLocalKeyId } from './getLocalKeys';

const updateCache = async (key, ref, id) => {
  const snapshot = await ref.once('value');
  const value = snapshot.val();
  localStorage.setItem(getLocalKey(key), value);
  localStorage.setItem(getLocalKeyId(key), id);
  return value;
};

export default updateCache;
