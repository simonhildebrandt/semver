import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom/client';

import { Switch, Route, getRouter, Redirect, } from "navigo-react";


import Help from './help';
import adminConfig from './admin-config';
import { db, auth } from './firebase';

import Admin from 'meta-admin-client';


const App = () => {
  return <Switch>
    <Route path="/admin">
      <Admin config={adminConfig} firestore={db} firebaseAuth={auth}/>
    </Route>
    <Route path="/">
      <Help/>
    </Route>
  </Switch>
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
