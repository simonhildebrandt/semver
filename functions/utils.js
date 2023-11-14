const admin = require('firebase-admin');

function getRecordByKeyValue(collection, key, value) {
  return admin.firestore().collection(collection)
    .where(key, "==", value)
    .limit(1)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size < 1) {
        return null;
      }

      const doc = querySnapshot.docs[0];

      return { id: doc.id, ...doc.data() };
    });
}

exports.getRecordByKeyValue = getRecordByKeyValue;
