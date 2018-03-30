import { getLocalKey } from './getLocalKeys';

const getFromCache = key => localStorage.getItem(getLocalKey(key));

export default getFromCache;
