export const PREFIX = 'react-global-from-firebase';
export const getLocalKey = key => `${PREFIX}:${key}`;
export const getLocalKeyId = key => `${getLocalKey(key)}Id`;
