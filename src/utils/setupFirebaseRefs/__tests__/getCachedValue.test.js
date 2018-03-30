import getCachedValue from '../getCachedValue';

beforeEach(() => {
  localStorage.setItem('react-global-from-firebase:foo', 'bar');
});

afterEach(() => {
  localStorage.removeItem('react-global-from-firebase:foo');
});

describe('getCachedValue.js', () => {
  it('gets the cached value for given key', () => {
    expect(getCachedValue('foo')).toBe('bar');
  });

  it('returns null for non existent values', () => {
    expect(getCachedValue('bar')).toBeNull();
  });
});
