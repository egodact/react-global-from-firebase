import detachListeners from '../detachListeners';

describe('detachListeners.js', () => {
  it('calls the off method on all given refs with given listener', () => {
    const offSpy = jest.fn();
    const listeners = [
      {
        ref: {
          off: offSpy
        },
        listener: 'foo'
      },
      {
        ref: {
          off: offSpy
        },
        listener: 'bar'
      },
      {
        ref: {
          off: offSpy
        },
        listener: 'baz'
      }
    ];
    detachListeners(listeners);
    expect(offSpy.mock.calls.length).toBe(3);
    expect(offSpy.mock.calls[0]).toEqual(['value', 'foo']);
    expect(offSpy.mock.calls[1]).toEqual(['value', 'bar']);
    expect(offSpy.mock.calls[2]).toEqual(['value', 'baz']);
  });
});
