import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GlobalFromFirebase from '../index';
import * as setupFirebaseRefs from '../utils/setupFirebaseRefs';
import * as detachListeners from '../utils/detachListeners';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  global.originalSetupFirebaseRefs = setupFirebaseRefs.default;
  setupFirebaseRefs.default = jest.fn();

  global.originalDetachListeners = detachListeners.default;
  detachListeners.default = jest.fn();
});

afterEach(() => {
  setupFirebaseRefs.default = originalSetupFirebaseRefs;
  detachListeners.default = originalDetachListeners;

  delete global.originalSetupFirebaseRefs;
  delete global.originalDetachListeners;
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

  it('unmounts without crashing', () => {
    const globalFromFirebase = mount(
      <GlobalFromFirebase firebaseRefs={{ foo: {}, bar: {} }}>
        <span />
      </GlobalFromFirebase>
    );
    globalFromFirebase.instance().componentWillUnmount();
  });

  it('adds listeners correctly', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    const registerListenerSpy = jest.fn();
    globalFromFirebase.instance().registerListener = registerListenerSpy;

    const fakeRef = {
      on: jest.fn()
    };

    globalFromFirebase.instance().addListener('foo', fakeRef);

    expect(registerListenerSpy.mock.calls.length).toBe(1);
    expect(registerListenerSpy.mock.calls[0][0]).toBe('foo');
    expect(registerListenerSpy.mock.calls[0][1]).toBe(fakeRef);
    expect(fakeRef.on.mock.calls.length).toBe(1);
    expect(fakeRef.on.mock.calls[0][0]).toBe('value');
    const listener = fakeRef.on.mock.calls[0][1];
    expect(typeof listener).toBe('function');

    const setStateAndGlobalSpy = jest.fn();
    globalFromFirebase.instance().setStateAndGlobal = setStateAndGlobalSpy;

    listener({ val: () => 'bar' });

    expect(setStateAndGlobalSpy.mock.calls.length).toBe(1);
    expect(setStateAndGlobalSpy.mock.calls[0]).toEqual(['foo', 'bar']);
  });

  it('registers listeners correctly', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    expect(globalFromFirebase.instance().listeners).toEqual({});
    globalFromFirebase.instance().registerListener('foo', 'bar', 'baz');
    expect(globalFromFirebase.instance().listeners).toEqual({
      foo: {
        ref: 'bar',
        listener: 'baz'
      }
    });
  });

  it('it updates state and global at the same time', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    expect(globalFromFirebase.state('foo')).toBeUndefined();
    expect(global.foo).toBeUndefined();
    globalFromFirebase.instance().setStateAndGlobal('foo', 'bar');
    expect(globalFromFirebase.state('foo')).toBe('bar');
    expect(global.foo).toBe('bar');
  });

  it('detaches its listeners on unmount', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    globalFromFirebase.instance().listeners = { foo: 'baz', bar: '123' };
    globalFromFirebase.instance().componentWillUnmount();
    expect(detachListeners.default.mock.calls.length).toBe(1);
    expect(detachListeners.default.mock.calls[0][0]).toEqual(['baz', '123']);
  });

  it('determines correctly whether it\'s still loading or not', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    expect(globalFromFirebase.instance().isLoaded()).toBe(true);

    const globalFromFirebase2 = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    globalFromFirebase2.setState({ foo: null, bar: null });
    expect(globalFromFirebase2.instance().isLoaded()).toBe(false);

    const globalFromFirebase3= shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    globalFromFirebase3.setState({ foo: 'baz', bar: '123' });
    expect(globalFromFirebase3.instance().isLoaded()).toBe(true);

    const globalFromFirebase4 = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    globalFromFirebase4.setState({ foo: 'baz', bar: null });
    expect(globalFromFirebase4.instance().isLoaded()).toBe(false);

    const globalFromFirebase5 = shallow(
      <GlobalFromFirebase firebaseRefs={{}}><span /></GlobalFromFirebase>
    );
    globalFromFirebase5.setState({});
    expect(globalFromFirebase5.instance().isLoaded()).toBe(true);
  });

  it('renders its loadingScreen prop correctly', () => {
    const loadingScreen = props => <div {...props} />
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}} loadingScreen={loadingScreen}>
        <span />
      </GlobalFromFirebase>
    );
    globalFromFirebase.setState({ foo: null, bar: null });
    expect(globalFromFirebase.find('div').length).toBe(1);
    expect(globalFromFirebase.find('div').props()).toEqual({
      foo: null,
      bar: null
    });
    globalFromFirebase.setProps({ loadingScreen: undefined });
    expect(globalFromFirebase.html()).toBeNull();
    globalFromFirebase.setProps({ loadingScreen: <h1 /> });
    expect(globalFromFirebase.find('h1').length).toBe(1);
    globalFromFirebase.setProps({ loadingScreen: null });
    expect(globalFromFirebase.html()).toBeNull();
  });

  it('returns its children when it\'s done loading', () => {
    const globalFromFirebase = shallow(
      <GlobalFromFirebase firebaseRefs={{}}>
        <span />
      </GlobalFromFirebase>
    );
    expect(globalFromFirebase.find('span').length).toBe(1);
  });
});
