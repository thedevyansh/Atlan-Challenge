const express = require('express');
const { engine } = require('express-handlebars');
const { v4: uuidv4 } = require('uuid');

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  getDoc,
  doc,
  setDoc
} = require('firebase/firestore');

const app = express();
const PORT = 3000;

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

async function addnewDocument(response) {
  try {
    const docRef = doc(firestore, `Users/${response.responseId}`);
    await setDoc(docRef, response);
    console.log('The response has been added to the database.');
  } catch (error) {
    console.log(`An error occured - ${error}`);
  }
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

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/submit-response', (req, res) => {
  res.render('submitResponse');
});

app.post('/show-response', async (req, res) => {
  const response = req.body;
  response.responseId = uuidv4();

  addnewDocument(response);
  readASingleDocument(doc(firestore, 'Users/kyx5dOmhMMKjZwTTIieJ'));

  res.render('showResponse', { response: response });
});

app.listen(PORT, () => console.log(`Server started running on port ${PORT}.`));
