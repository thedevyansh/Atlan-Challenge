const express = require('express');
const { engine } = require('express-handlebars');
const { v4: uuidv4 } = require('uuid');

const { addnewDocument, readASingleDocument } = require('./firestore/utility');

require('dotenv').config();

const app = express();
const PORT = 3000;

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

  addnewDocument(response, res);
});

app.listen(PORT, () => console.log(`Server started running on port ${PORT}.`));
