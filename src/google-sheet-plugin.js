const express = require('express');
const { google } = require('googleapis');
const { PubSub } = require('@google-cloud/pubsub');

require('dotenv').config();

const app = express();

const pubSubClient = new PubSub();
const subscriptionName = 'sheet_sub';
const timeout = 60;

const subscription = pubSubClient.subscription(subscriptionName);

const sheetsClient = new google.auth.JWT(
  process.env.SHEETS_CLIENT_EMAIL,
  null,
  process.env.SHEETS_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const callbackOnPull = (msg) => {
  console.log(`Message [${msg.id}] received: `);
  message = JSON.parse(msg.data);
  console.log(message);

  const formattedResponse = [[ message.responseId, message.name, message.age, message.college, message.role]];

  sheetsClient.authorize((err, tokens) => {
    if (err) {
      console.error(err);
      return;
    } else {
      addResponseToSheet(sheetsClient, formattedResponse);
    }
  });

  msg.ack();
};

subscription.on('message', callbackOnPull);

setTimeout(() => {
  subscription.removeListener('message', callbackOnPull);
}, timeout * 1000);

const addResponseToSheet = async (sheetsClient, response) => {
  const gsapi = google.sheets({
    version: 'v4',
    auth: sheetsClient,
  });

  const options = {
    spreadsheetId: '1J7yd_4iW24iKJmrmUwzlllSgfGu_CIdKvd-GEU7qlXg',
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: response,
    },
  };

  await gsapi.spreadsheets.values.append(options);
};

app.listen(process.env.SHEETS_PORT, () =>
  console.log(
    `Sheets server started running on port ${process.env.SHEETS_PORT}.`
  )
);
