import React, { Component } from 'react'
import { render } from 'react-dom'
import GlobalVarSetup from '../../src'
import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig';

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

const ref = firebase.database().ref();

export default class Demo extends Component {
  componentDidMount = () => {
    setTimeout(() => {
      console.log(window.foo);
      this.forceUpdate();
    }, 2000);
  };

  render = () => (
    <GlobalVarSetup
      firebaseRefs={{
        foo: ref.child('foo'),
        bar: {
          ref: ref.child('bar'),
          idRef: ref.child('barId')
        }
      }}
      loadingScreen={() => <h1>Loading</h1>}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginTop: 0, fontFamily: 'sans-serif', fontWeight: 400 }}>
          react-global-from-firebase
        </h2>
        <pre style={{ textAlign: 'left', fontFamily: 'Andale Mono, monospace' }}>
          window: {'{'}{'\n'}
            {'\t'}foo: {global.foo},{'\n'}
            {'\t'}bar: {global.bar}{'\n'}
          {'}'},{'\n'}
          localStorage: {'{'}{'\n'}
            {'\t'}'react-global-from-firebase:bar': {localStorage.getItem('react-global-from-firebase:bar')},{'\n'}
            {'\t'}'react-global-from-firebase:barId': {localStorage.getItem('react-global-from-firebase:barId')}{'\n'}
          {'}'}
        </pre>
      </div>
    </GlobalVarSetup>
  );
}

render(<Demo />, document.querySelector('#demo'))
