import { getLocalKeyId } from '../getLocalKeys';

const getCachedId = key => localStorage.getItem(getLocalKeyId(key));

export default getCachedId;
