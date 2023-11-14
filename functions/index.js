const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { apiApp } = require('./api');

admin.initializeApp();

exports.api = functions.https.onRequest(apiApp);




