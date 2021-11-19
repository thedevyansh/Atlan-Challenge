const redis = require('redis');
const { google } = require('googleapis');
const keys = require('../keys.json');

require('dotenv').config();

const GoogleSheetPlugin = redis.createClient();

GoogleSheetPlugin.on('message', (channel, message) => {
  message = JSON.parse(message);
  const formattedResponse = [
    [
      message.responseId,
      message.name,
      message.age,
      message.college,
      message.role,
    ],
  ];

  const client = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  client.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Connected.');
      gsrun(client);
    }
  });

  async function gsrun(client) {
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
});

GoogleSheetPlugin.subscribe('response-channel');
