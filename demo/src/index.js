import React from 'react';
import { render } from 'react-dom';
import GlobalFromFirebase from '../../src';
import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import VarBlock from './VarBlock';

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

const ref = firebase.database().ref();

const Demo = () => (
  <GlobalFromFirebase
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
      <VarBlock />
    </div>
  </GlobalFromFirebase>
);

render(<Demo />, document.querySelector('#demo'))
