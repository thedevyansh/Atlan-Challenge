const { initializeApp } = require('firebase/app');
const { getFirestore, getDoc, doc, setDoc } = require('firebase/firestore');

const redis = require('redis');

const publisher = redis.createClient();

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

function addnewDocument(response) {
  console.log(response)
  const docRef = doc(firestore, `Users/${response.responseId}`);
  setDoc(docRef, response)
    .then(() => {
      console.log('THE RESPONSE HAS BEEN WRITTEN TO THE DATABASE!');
      publisher.publish("response-channel", JSON.stringify(response));
    })
    .catch((err) => {
      console.log(err);
    });
}

async function readASingleDocument(docName) {
  const mySnapshot = await getDoc(docName);
  if (mySnapshot.exists()) {
    const docData = mySnapshot.data();
    console.log(`My data is  ${JSON.stringify(docData)}`);
  } else {
    console.log('No such document exists.');
  }
}

module.exports = {
  addnewDocument,
  readASingleDocument,
};
