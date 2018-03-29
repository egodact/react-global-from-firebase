const getEmptyState = object =>
  Object.keys(object).reduce((acc, key) => ({ [key]: null, ...acc }), {});

export default getEmptyState;
