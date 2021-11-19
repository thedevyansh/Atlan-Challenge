const redis = require("redis")

const subscriber = redis.createClient()

subscriber.on("message", (channel, message) => {
  console.log(typeof JSON.parse(message))
})

subscriber.subscribe("response-channel")