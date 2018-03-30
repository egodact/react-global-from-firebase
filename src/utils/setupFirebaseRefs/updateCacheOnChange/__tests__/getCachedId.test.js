import getCachedId from '../getCachedId';

beforeEach(() => {
  localStorage.setItem('react-global-from-firebase:fooId', '123');
});

afterEach(() => {
  localStorage.removeItem('react-global-from-firebase:fooId');
});

describe('getCachedId.js', () => {
  it('gets the ID of the given key from localStorage', () => {
    expect(getCachedId('foo')).toBe('123');
  });

  it('returns null for non existent IDs', () => {
    expect(getCachedId('bar')).toBeNull();
  });
});
