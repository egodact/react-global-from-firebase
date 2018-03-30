import React, { Component } from 'react'
import { render } from 'react-dom'
import GlobalVarSetup from '../../src'
import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import VarBlock from './VarBlock';

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

const ref = firebase.database().ref();

const Demo = () => (
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
      <VarBlock />
    </div>
  </GlobalVarSetup>
);

render(<Demo />, document.querySelector('#demo'))
