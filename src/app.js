const express = require('express');
const { engine } = require('express-handlebars');
const { v4: uuidv4 } = require('uuid');
const { addNewDocument } = require('./firebase/firestore');

require('dotenv').config();

const app = express();

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

  addNewDocument(response, res);
});

app.listen(process.env.MAIN_PORT, () =>
  console.log(`Central server started running on port ${process.env.MAIN_PORT}.`)
);
