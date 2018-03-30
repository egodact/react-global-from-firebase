import setupFirebaseRef from '../setupFirebaseRef';
import * as getCachedValue from '../getCachedValue';
import * as updateCacheOnChange from '../updateCacheOnChange';

beforeAll(() => {
  global.originalGetCachedValue = getCachedValue.default;
  getCachedValue.default = jest.fn(() => 'baz');

  global.originalUpdateCacheOnChange = updateCacheOnChange.default;
  updateCacheOnChange.default = jest.fn();
});

afterAll(() => {
  getCachedValue.default = originalGetCachedValue;
  updateCacheOnChange.default = originalUpdateCacheOnChange;

  delete global.originalGetCachedValue;
  delete global.originalUpdateCacheOnChange;
});

describe('setupFirebaseRef.js', () => {
  it('calls addListener correctly for normal refs', () => {
    const addListenerSpy = jest.fn();
    setupFirebaseRef('foo', 'bar', () => {}, addListenerSpy);
    expect(addListenerSpy.mock.calls.length).toBe(1);
    expect(addListenerSpy.mock.calls[0]).toEqual(['foo', 'bar']);
  });

  it('calls addListener correctly for refs that are wrapped in an object', () => {
    const addListenerSpy = jest.fn();
    setupFirebaseRef('foo', { ref: 'bar' }, () => {}, addListenerSpy);
    expect(addListenerSpy.mock.calls.length).toBe(1);
    expect(addListenerSpy.mock.calls[0]).toEqual(['foo', 'bar']);
  });

  it('handles refs that should be cached correctly', () => {
    const setStateAndGlobalSpy = jest.fn();
    const addListenerSpy = jest.fn();
    const ref = { idRef: 'bar' };
    setupFirebaseRef(
      'foo',
      ref,
      setStateAndGlobalSpy,
      addListenerSpy
    );
    expect(setStateAndGlobalSpy.mock.calls.length).toBe(1);
    expect(setStateAndGlobalSpy.mock.calls[0]).toEqual(['foo', 'baz']);
    expect(addListenerSpy.mock.calls.length).toBe(0);
    expect(getCachedValue.default.mock.calls.length).toBe(1)
    expect(getCachedValue.default.mock.calls[0][0]).toBe('foo');
    expect(updateCacheOnChange.default.mock.calls.length).toBe(1);
    expect(updateCacheOnChange.default.mock.calls[0]).toEqual([
      'foo',
      ref,
      setStateAndGlobalSpy
    ]);
  });
});
