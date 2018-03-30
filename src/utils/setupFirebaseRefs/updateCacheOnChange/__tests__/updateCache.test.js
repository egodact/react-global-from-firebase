import updateCache from '../updateCache';

beforeEach(() => {
  localStorage.setItem('react-global-from-firebase:foo', 'bar');
  localStorage.setItem('react-global-from-firebase:fooId', '123');
});

afterEach(() => {
  localStorage.removeItem('react-global-from-firebase:foo');
  localStorage.removeItem('react-global-from-firebase:fooId');
});

describe('updateCache.js', () => {
  it('updates the cached value and its cached ID with the value from given listener', async () => {
    const ref = {
      once: () => ({ val: () => 'newBar' })
    };
    await updateCache('foo', ref, '321');
    expect(localStorage.getItem('react-global-from-firebase:foo')).toBe(
      'newBar'
    );
    expect(localStorage.getItem('react-global-from-firebase:fooId')).toBe(
      '321'
    );
  });
});
