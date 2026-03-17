const admin  = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseReady = false;

const initFirebase = () => {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase Admin SDK not configured — Google login will be unavailable');
    return;
  }

  if (admin.apps.length > 0) { firebaseReady = true; return; }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey:  FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    firebaseReady = true;
    logger.info('Firebase Admin SDK initialized');
  } catch (err) {
    logger.error(`Firebase Admin init failed: ${err.message}`);
  }
};

const isFirebaseReady = () => firebaseReady;

module.exports = { admin, initFirebase, isFirebaseReady };
