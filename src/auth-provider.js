import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Subject } from 'rxjs';

import { signInWithCustomToken } from "firebase/auth";


export function getIdToken(auth) {
  return auth.currentUser.getIdToken();
}

async function authWithToken(auth, token) {
  console.log('authWithToken', token)
  return signInWithCustomToken(auth, token)
    .then((userCredential) => {
      console.log({userCredential})
      return userCredential;
    })
    .catch((error) => {
      console.log({error})
    });
}


export function useLoginState() {
  const [token, setToken] = useState(localStorage.getItem('cached-admin-token'));

  useEffect(_ => {
    const sub = loginState.subscribe(({type, payload}) => {
      console.log({type, payload});
      setToken(payload);
      localStorage.setItem('cached-admin-token', payload);
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const api = axios.create({
    baseURL: "http://localhost:5001/semver-517cc/us-central1/admin",
    transformRequest: [
      function(data, headers) {
        headers['Authorization'] = token;
        return data;
      },
      ...axios.defaults.transformRequest
    ]
  })

  api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response.status < 200 || error.response.status >= 300) {
      loginState.next({type: "auth", payload: null});
    }
    return Promise.reject(error);
  });


  return {token, api};
}


export const ApiContext = createContext(null);

const loginState = new Subject();


export class AuthError extends Error {
  constructor(original) {
    super(original.message);
    this.original = original;
  }
};

export const authProvider = ({firebaseAuth}) => ({
  // authentication
  login: async token => {
    return axios.post("http://localhost:5001/semver-517cc/us-central1/admin/auth", {token})
      .then(({data}) => {
        const { customToken } = data;
        return authWithToken(firebaseAuth, customToken)
          .then(_ => {
            return getIdToken(firebaseAuth);
          })
          .then(id => {
            loginState.next({type: "auth", payload: id});
          })
      })
      .catch(error => {
        console.error(error);
        return Promise.reject("Invalid token");
      });
  },
  checkError: error => {
    console.log('checking error', {error})
    if (error instanceof AuthError) {
      console.log('is auth error')
      return Promise.reject();
    } else {
      console.log('isn\'t auth error')
      return Promise.resolve();
    }
  },
  checkAuth: _ => {
    // return axios.get("http://localhost:5001/semver-517cc/us-central1/admin/check-auth")
    // .then(_ => Promise.resolve())
    // .catch(_ => Promise.reject())
    return Promise.resolve();
  },
  logout: () => {
    return Promise.resolve()
  },
  getIdentity: () => Promise.resolve(/* ... */),
  handleCallback: () => Promise.resolve(/* ... */), // for third-party authentication only
  // authorization
  getPermissions: () => Promise.resolve(/* ... */),
});
