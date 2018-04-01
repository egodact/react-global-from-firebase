# react-global-from-firebase
React component that sets up a global state from Firebase refs

![Demo screenshot](https://github.com/rafaelklaessen/react-global-from-firebase/raw/master/screenshots/screenshot.png "Screenshot of the demo")

## Install
`yarn add react-global-from-firebase` or `npm install --save react-global-from-firebase`

## Usage
See the [demo](https://github.com/rafaelklaessen/react-global-from-firebase/tree/master/demo/src) for full example.

```javascript
import * as firebase from 'firebase';
import GlobalFromFirebase from 'react-global-from-firebase'

const ref = firebase.database().ref();

const App = () => (
  <GlobalFromFirebase
    firebaseRefs={{
      foo: ref.child('foo'),
      bar: {
        ref: ref.child('bar'),
        idRef: ref.child('barId') // For caching
      }
    }}
    loadingScreen={() => <h1>Loading</h1>}
  >
    <div>Blah</div>
  </GlobalFromFirebase>
);
```

## Caveats
For some reason, the direct children of GlobalFromFirebase cannot use the `global` object correctly (since the ref values haven't been set yet). This shouldn't be too much of an issue since you could just put the code that relies on `global` in a separate component, that'll work.

See the [demo](https://github.com/rafaelklaessen/react-global-from-firebase/tree/master/demo/src) for an example.

## Props
`*` = required

Prop | Description | Type
---- | ----------- | ----
`firebaseRefs*` | The refs that should be loaded into the `global` object. The ref value will be added to the `global` object under given key (eg if you do `{ foo: ref.child('bar') }`, `global.foo` will be set to the value of `ref.child('bar')`). | `object`
`loadingScreen` | Node to show while the ref values are loading. Can also take a function that returns an node <br> *Signature of the function when passed:* <br> `function(state: object) => node` | `node` or `function`
`children*` | Children of the component | `node`

## Caching
Normally, the object you'd pass to the `firebaseRefs` prop would look like this:
```javascript
{
  foo: someRef.child('foo'),
  bar: someRef.child('baz')
}
```
It is however possible to cache the values of refs. To do this, an `idRef` is expected (see example below). The `idRef` is supposed to be a ref that contains some unique ID of the given ref's value. The value of the given ref will only be fetched when this ID changes or when it isn't cached yet. Below is an example with two cached refs:
```javascript
{
  foo: {
    ref: someRef.child('foo'),
    idRef: someRef.child('fooId')
  },
  bar: {
    ref: someRef.child('baz'),
    idRef: someRef.child('bazId')
  }
}
```
Caching only makes sense when the ref contains a large value that should be fetched as little as possible.

## Development
### Installation
`yarn install` or `npm install`

### Run demo
`yarn start` or `npm start`

### Run tests
`yarn test` or `npm test`

#### Building
`yarn build` or `npm run build` will build the component for publishing to npm and also bundle the demo app.

`yarn clean` or `npm run clean` will delete built resources.

Notice that you'll need to temporarily delete `.babelrc` to be able to build the component (just put it back after you're done building).
