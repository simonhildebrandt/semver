const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const semver = require('semver');
const { getRecordByKeyValue } = require("./utils");
const authorise = require('./authorise');


const DEFAULT_VERSION = '0.0.0';
const LEVELS = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use((req, res, next) => {
  // Clear function name out of url for Firebase rewrite
  req.url = req.url.replace(/\/api/, "");
  next();
});


const userAuth = authorise(process.env.USER_AUTH_KEY);

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


app.post("/apikey", userAuth, async (req, res) => {
  const key = uuidv4();
  admin.firestore().collection('apiKeys')
    .add({ createdAt: new Date().valueOf(), createdBy: req.auth.sub, key })
    .then(_ => res.status(201).json({key}));
});

app.post("/versions", apiKeyAuth, async (req, res) => {
  const key = uuidv4();
  const data = { version: DEFAULT_VERSION, key };

  admin.firestore().collection('versions')
    .add({ createdAt: new Date().valueOf(), createdBy: req.apiKey.key, ...data })
    .then(_ => res.status(201).json(data));
});

app.get("/versions/:key", apiKeyAuth, getVersion, async (req, res) => {
  const {id, ...version} = req.version;
  if (version) {
    res.status(200).json(version);
  } else {
    res.status(404).json({message: 'invalid-version'});
  }

});

app.post("/versions/:key/set", apiKeyAuth, getVersion, async (req, res) => {
  const newVersion = req.body.version;

  const {id, ...version} = req.version;

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
