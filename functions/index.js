const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { apiApp } = require('./api');
const { adminApp } = require('./admin');


var serviceAccount = require("./credentials/semver-517cc-firebase-adminsdk-fq3qs-a223434cda.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


exports.api = functions.https.onRequest(apiApp);
exports.admin = functions.https.onRequest(adminApp);




