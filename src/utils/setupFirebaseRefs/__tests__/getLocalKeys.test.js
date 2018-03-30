import { PREFIX, getLocalKey, getLocalKeyId } from '../getLocalKeys';

describe('getLocalKeys.js', () => {
  it('exports a valid localStorage prefix', () => {
    expect(typeof PREFIX).toBe('string');
  });

  it('exports a function for getting localStorage keys', () => {
    expect(getLocalKey('foo')).toBe('react-global-from-firebase:foo');
  });

  it('exports a function for getting localStorage ID keys', () => {
    expect(getLocalKeyId('foo')).toBe('react-global-from-firebase:fooId');
  });
});
