const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const semver = require('semver');
const { getRecordByKeyValue } = require("./utils");
const authorise = require('./authorise');


const DEFAULT_VERSION = '0.0.0';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use((req, res, next) => {
  // Clear function name out of url for Firebase rewrite
  req.url = req.url.replace(/\/api/, "");
  next();
});


const userAuth = authorise(process.env.USER_AUTH_KEY);

const userAuthAndStore = (req, res, next) => {
  userAuth(req, res, async _ => {
    const { auth } = req;
    const { sub } = auth;
    console.log({auth});
    const user = await getRecordByKeyValue('users', 'sub', sub);
    if (!user) {
      await admin.firestore().collection('users').add(auth);
    }
    next();
  })
}


async function apiKeyAuth(req, res, next) {
  const key = await getRecordByKeyValue('apiKeys', 'key', req.get('X-API-Key'))

  if (key) {
    req.apiKey = key;
    next();
  } else {
    res.status(404).json({message: 'invalid-apikey'});
  }
};

async function getVersion(req, res, next) {
  const version = await getRecordByKeyValue('versions', 'key', req.params.key)
  if (version) {
    req.version = version;
    next();
  } else {
    res.status(404).json({message: 'invalid-version'});
  }
}

app.get("/apikeys", userAuthAndStore, async (req, res) => {
  admin.firestore().collection('apiKeys').get()
    .then(result => res.status(201).json(result.docs.map(d => d.data())));
});

app.post("/apikeys", userAuthAndStore, async (req, res) => {
  const key = uuidv4();
  admin.firestore().collection('apiKeys')
    .add({ createdAt: new Date().valueOf(), createdBy: req.auth.sub, key })
    .then(_ => res.status(201).json({key}));
});

app.get("/versions", userAuthAndStore, async (req, res) => {
  admin.firestore().collection('versions').get()
  .then(result => res.status(201).json(result.docs.map(d => d.data())));
});

app.post("/versions", apiKeyAuth, async (req, res) => {
  const key = uuidv4();
  const createdAt = new Date().valueOf();
  const createdBy = req.apiKey.key;

  const data = { version: DEFAULT_VERSION, key };

  admin.firestore().collection('versions')
    .add({ createdAt, createdBy, ...data })
    .then(_ => res.status(201).json(data));
});

app.get("/versions/:key", apiKeyAuth, getVersion, async (req, res) => {
  const {id, ...version} = req.version;
  res.status(200).json(version);
});

app.post("/versions/:key/set", apiKeyAuth, getVersion, async (req, res) => {
  const newVersion = req.body.version;

  if (!semver.valid(newVersion)) {
    return res.status(422).json({message: 'invalid-version', description: "new version must be a valid semantic version", link: "https://www.npmjs.com/package/semver"})
  }

  const {id, ...version} = req.version;

  console.log({newVersion})
  const oldVersion = version.version;
  await admin.firestore().doc(`versions/${id}`).update({version: newVersion});
  res.status(201).json({oldVersion, newVersion});
});

app.post("/versions/:key/inc", apiKeyAuth, getVersion, async (req, res) => {
  const {id, version: oldVersion} = req.version;

  const { level = 'patch' } = req.body;

  if(!semver.RELEASE_TYPES.includes(level)) {
    return res.status(422).json({message: 'invalid-level', levels: semver.RELEASE_TYPES});
  }

  const newVersion = semver.inc(oldVersion, level);

  await admin.firestore().doc(`versions/${id}`).update({version: newVersion});
  res.status(200).json({oldVersion, newVersion});
});

exports.apiApp = app;
