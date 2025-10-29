const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { deleteExpiredJourneys } = require('./deleteExpiredJourneys');

admin.initializeApp();

exports.deleteExpiredJourneys = deleteExpiredJourneys;