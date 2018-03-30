import getEmptyState from '../getEmptyState';

describe('getEmptyState.js', () => {
  it('returns an empty state', () => {
    expect(getEmptyState({ foo: 'bar', bar: 'foo' })).toEqual({
      foo: null,
      bar: null
    });
  });

  it('doesn\'t crash on empty objects', () => {
    expect(getEmptyState({})).toEqual({});
  });
});
