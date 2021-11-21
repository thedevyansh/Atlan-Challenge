module.exports = {
  publishMessage: async (pubSubClient, topicName, payload) => {
    const dataBuffer = Buffer.from(payload);
    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);

    console.log(`Message [${messageId}] published to Sheets topic.`);

    return messageId;
  },
};
