import updateCacheOnChange from '../index';

beforeEach(() => {
  localStorage.setItem('react-global-from-firebase:foo', 'bar');
  localStorage.setItem('react-global-from-firebase:fooId', '123');
});

afterEach(() => {
  localStorage.removeItem('react-global-from-firebase:foo');
  localStorage.removeItem('react-global-from-firebase:fooId');
});

describe('updateCacheOnChange.js', () => {
  it('attaches a listener to the given idRef', () => {
    const ref = {
      idRef: {
        on: jest.fn()
      }
    };
    updateCacheOnChange('foo', ref, () => {});
    expect(ref.idRef.on.mock.calls.length).toBe(1);
  });

  it('doesn\'t do anything when the cache ID didn\'t change', () => {
    let attachedListener;
    const ref = {
      idRef: {
        on: (type, listener) => {
          attachedListener = listener;
        }
      }
    };
    const updateSpy = jest.fn();
    updateCacheOnChange('foo', ref, updateSpy);
    attachedListener({ val: () => '123' });
    expect(updateSpy.mock.calls.length).toBe(0);
  });

  it('updates the cache when the cache ID changed', async () => {
    let attachedListener;
    const ref = {
      ref: {
        once: () => new Promise(resolve => resolve({ val: () => 'newBar' }))
      },
      idRef: {
        on: (type, listener) => {
          attachedListener = listener;
        }
      }
    };
    const updateSpy = jest.fn();
    updateCacheOnChange('foo', ref, updateSpy);
    await attachedListener({ val: () => '321' });
    expect(updateSpy.mock.calls.length).toBe(1);
    expect(updateSpy.mock.calls[0]).toEqual(['foo', 'newBar']);
    expect(localStorage.getItem('react-global-from-firebase:foo')).toBe(
      'newBar'
    );
    expect(localStorage.getItem('react-global-from-firebase:fooId')).toBe(
      '321'
    );
  });
});
