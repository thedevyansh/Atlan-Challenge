const { google } = require('googleapis');
const sheets_api_key = require('../sheet-api-key.json');

const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const subscriptionName = 'sheet_sub';
const timeout = 60;

require('dotenv').config();

const client = new google.auth.JWT(
  process.env.SHEETS_CLIENT_EMAIL,
  null,
  process.env.SHEETS_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

async function gsrun(client, formattedResponse) {
  const gsapi = google.sheets({
    version: 'v4',
    auth: client,
  });

  const updateOptions = {
    spreadsheetId: '1J7yd_4iW24iKJmrmUwzlllSgfGu_CIdKvd-GEU7qlXg',
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: formattedResponse,
    },
  };

  await gsapi.spreadsheets.values.append(updateOptions);
}

const subscription = pubSubClient.subscription(subscriptionName);

subscription.on('message', (msg) => {
  message = JSON.parse(msg.data);

  const formattedResponse = [
    [
      message.responseId,
      message.name,
      message.age,
      message.college,
      message.role,
    ],
  ];

  client.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Connected to Google Sheets.');
      gsrun(client, formattedResponse);
    }
  });

  msg.ack();
});

setTimeout(() => {
  subscription.removeListener('message', messageHandler);
}, timeout * 1000);
