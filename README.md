# SemVer

A lightweight service for managing versions for things.

Uses [Login With Link](http://login-with.link) to generate JWTs for auth, then proceed like this:

1. Create an API key:

```
$ curl -X POST -H "Content-Type: application/json" -H "Authorization: <LwL auth token>" http://<api host>/api/apikey

{"key":"<new API key>"}
```

2. Use your new API key to create a version.

```
$ curl -X POST -H "Content-Type: application/json" -H "X-API-Key: <API key>" <API host>/api/versions

{"version":"0.0.0","key":"<new version key>"}

```

3a. Increment your new version:

```
$ curl -X POST -H "Content-Type: application/json" -H "X-API-Key: <API key>" <API host>/api/versions/inc --data '{"level": "minor"}'
{"oldVersion":"0.0.0","newVersion":"0.1.0"}
```

3b. Or just set to new value:

```
$ curl -X POST -H "Content-Type: application/json" -H "X-API-Key: <API key>" <API host>/api/versions/set --data '{"version": "3.2.1"}'
{"oldVersion":"0.0.0","newVersion":"3.2.1"}
```
