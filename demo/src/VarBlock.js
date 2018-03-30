import React from 'react';

const VarBlock = () => (
  <pre
    style={{
      padding: 18,
      textAlign: 'left',
      backgroundColor: '#E0E0E0',
      fontFamily: 'Andale Mono, monospace',
      borderRadius: 6
    }}
  >
    window: {'{'}{'\n'}
      {'\t'}foo: {window.foo},{'\n'}
      {'\t'}bar: {window.bar}{'\n'}
    {'}'},{'\n'}
    localStorage: {'{'}{'\n'}
      {'\t'}'react-global-from-firebase:bar': {localStorage.getItem('react-global-from-firebase:bar')},{'\n'}
      {'\t'}'react-global-from-firebase:barId': {localStorage.getItem('react-global-from-firebase:barId')}{'\n'}
    {'}'}
  </pre>
);

export default VarBlock;
