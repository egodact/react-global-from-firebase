import { getLocalKey } from './getLocalKeys';

const getCachedValue = key => localStorage.getItem(getLocalKey(key));

export default getCachedValue;
