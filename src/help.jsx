import React from 'react';


const apiHost = "http://127.0.0.1:5001/semver-517cc/us-central1/api";


export default function Help() {
  const token = new URL(window.location.href).searchParams.get('lwl-token');

  if (!token) {
    return <>
      Login <a href="https://login-with.link/#/login/75b0d108-a3d5-4614-a7f7-e63a0c89ac8e">here</a> to get a token.
    </>
  }

  return <>
    <p>Your current token is { token }</p>
    <p>Create an API key:</p>
    <code>
      $ curl -X POST -H "Authorization: {token}" {apiHost}/api/apikeys
    </code>
    <pre>
      {`{"key":"[api key]"}`}
    </pre>

    <p>Use that key to create a version:</p>
    <code>
      $ curl -X POST -H "X-Api-Key: [api key]" {apiHost}/api/versions
    </code>
    <pre>
      {`{"version":"0.0.0","key":"[version key]"}`}
    </pre>

    <p>read your new version:</p>
    <code>
      $ curl -X GET -H "X-Api-Key: [api key]" {apiHost}/api/versions/[version key]
    </code>
    <pre>
      {`{"createdAt":${new Date().valueOf()},"createdBy":"[api key]","version":"0.0.0","key":"[version key]"}`}
    </pre>

    <p>Increment your new version:</p>
    <code>
      $ curl -X POST -H "X-Api-Key: [api key]" {apiHost}/api/versions/[version key]/inc
    </code>
    <pre>
      {`{"oldVersion":"0.0.0","newVersion":"0.0.1"}`}
    </pre>

    <p>...or just set it:</p>
    <code>
      $ curl -X POST -H "X-Api-Key: [api key]" -H "Content-Type: application/json" {apiHost}/api/versions/[version key]/set --data {`'{"version": "3.2.1"}'`}
    </code>
    <pre>
      {`{"oldVersion":"0.0.0","newVersion":"0.0.1"}`}
    </pre>
  </>

}
