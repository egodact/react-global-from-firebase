import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GlobalFromFirebase from '../index';
import * as setupFirebaseRefs from '../utils/setupFirebaseRefs';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  global.originalSetupFirebaseRefs = setupFirebaseRefs.default;
  setupFirebaseRefs.default = jest.fn();
});

afterEach(() => {
  setupFirebaseRefs.default = originalSetupFirebaseRefs;
  delete global.originalSetupFirebaseRefs;
});

describe('GlobalFromFirebase.js', () => {
  it('renders without crashing', () => {
    const globalFromFirebase = render(
      <GlobalFromFirebase firebaseRefs={{}}>
        <span />
      </GlobalFromFirebase>
    );
    expect(globalFromFirebase).toBeDefined();
  });

  it('initializes the empty state correctly', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{ foo: {}, bar: {} }}>
        <span />
      </GlobalFromFirebase>
    );
    expect(globalFromFirebase.state()).toEqual({
      foo: null,
      bar: null
    });
  });

  it('calls setupFirebaseRefs correctly on mount', () => {
    const globalFromFirebase = mount(
      <GlobalFromFirebase firebaseRefs={{ foo: {}, bar: {} }}>
        <span />
      </GlobalFromFirebase>
    );
    expect(setupFirebaseRefs.default.mock.calls.length).toBe(1);
    expect(setupFirebaseRefs.default.mock.calls[0]).toEqual([
      { foo: {}, bar: {} },
      globalFromFirebase.instance().setStateAndGlobal,
      globalFromFirebase.instance().addListener
    ])
  });

  it('adds listeners correctly', () => {

  });

  it('registers listeners correctly', () => {

  });

  it('it updates state and global at the same time', () => {

  });

  it('detaches its listenenrs on unmount', () => {

  });

  it('determines correctly whether it\'s still loading or not', () => {

  });

  it('renders its loadingScreen prop correctly', () => {

  });

  it('returns its children when it\'s done loading', () => {

  });
});
