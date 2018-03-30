import setupFirebaseRefs from '../index';
import * as setupFirebaseRef from '../setupFirebaseRef';

beforeAll(() => {
  global.originalSetupFirebaseRef = setupFirebaseRef.default;
  setupFirebaseRef.default = jest.fn();
});

afterAll(() => {
  setupFirebaseRef.default = originalSetupFirebaseRef;
  delete global.originalSetupFirebaseRef;
});

describe('setupFirebaseRefs.js', () => {
  it('calls setupFirebaseRef with each ref', () => {
    setupFirebaseRefs({ foo: 'bar', bar: 'foo' }, 'baz', '123');
    expect(setupFirebaseRef.default.mock.calls.length).toBe(2);
    expect(setupFirebaseRef.default.mock.calls[0]).toEqual([
      'foo',
      'bar',
      'baz',
      '123'
    ]);
    expect(setupFirebaseRef.default.mock.calls[1]).toEqual([
      'bar',
      'foo',
      'baz',
      '123'
    ]);
  });
});
