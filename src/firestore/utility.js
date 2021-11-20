const { initializeApp } = require('firebase/app');
const { getFirestore, getDoc, doc, setDoc } = require('firebase/firestore');

const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();

const { publishMessage } = require('../repositories/pub-sup-repo');

const topicName = 'responses_topic';


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

function addnewDocument(response, res) {
  const docRef = doc(firestore, `Users/${response.responseId}`);
  setDoc(docRef, response)
    .then(async () => {
      console.log('The response has been added to Firestore.');

      let myResponse = await readASingleDocument(docRef);
  
      await publishMessage(pubSubClient, topicName, myResponse);

      res.render('showResponse', { response: response });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function readASingleDocument(docName) {
  const mySnapshot = await getDoc(docName);
  if (mySnapshot.exists()) {
    let docData = mySnapshot.data();
    docData = JSON.stringify(docData);
    return docData;
  } else {
    console.log('No such document exists.');
    return null;
  }
}

module.exports = {
  addnewDocument,
  readASingleDocument,
};
