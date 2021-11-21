const { PubSub } = require('@google-cloud/pubsub');
const EventLogger = require('./logger/event-logger');

require('dotenv').config();

const pubSubClient = new PubSub();
const subscriptionName = 'logger-for-responses-sub';
const timeout = 60;

const logger = new EventLogger();

const subscriptionResponses = pubSubClient.subscription(subscriptionName);

const handleEvent = (msg) => {
    logger.info(`Message [${msg.id}] received.`, {success: true});
};

subscriptionResponses.on('message', handleEvent);

setTimeout(() => {
  subscriptionResponses.removeListener('message', handleEvent);
}, timeout * 1000);
