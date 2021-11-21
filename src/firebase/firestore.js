const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');
const { PubSub } = require('@google-cloud/pubsub');
const { publishMessage } = require('../publisher/publisher');

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCDXEbmBCX2BkeBUo7oWK7QgOAHlA0lEQ0',
  authDomain: 'atlan-backend-challenge.firebaseapp.com',
  projectId: 'atlan-backend-challenge',
  storageBucket: 'atlan-backend-challenge.appspot.com',
  messagingSenderId: '354148373983',
  appId: '1:354148373983:web:9a7d5a3a57ff509245e06a',
  measurementId: 'G-1PXC9ZJRBT',
});

const firestore = getFirestore();
const topicName = 'responses_topic';
const pubSubClient = new PubSub();

const addNewDocument = (response, res) => {
  const docReference = doc(firestore, `Users/${response.responseId}`);

  setDoc(docReference, response)
    .then(async () => {
      let myResponse = await readDocument(docReference);

      if (myResponse !== null)
        await publishMessage(pubSubClient, topicName, myResponse);

      res.render('showResponse', { response: response });
    })
    .catch((err) => {
      console.error(err);
    });
};

const readDocument = async (docName) => {
  const mySnapshot = await getDoc(docName);

  if (mySnapshot.exists()) {
    let docData = mySnapshot.data();
    docData = JSON.stringify(docData);
    return docData;
  } else {
    return null;
  }
};

module.exports = {
  addNewDocument,
  readDocument,
};
