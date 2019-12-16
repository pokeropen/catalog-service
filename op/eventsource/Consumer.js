const { Consumer, ProduceRequest } = require('kafka-node');
const topics = require("./Bootstrap");

const config = {
	    groupId: "op-poker",
      autoCommit: true,
      autoCommitIntervalMs: 5000,
      fetchMaxWaitMs: 1000,
      fetchMinBytes: 1,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      keyEncoding: 'utf8',
      fromOffset: false
    }



/*const consumer = new Consumer(client, topics, config);

consumer.on("message", (message) => {
	console.log("Kafka Producer ready");
  console.log("Received Message " + message)
});

consumer.on("error", (err) => {
	console.log("Error while try to consume from kafka " + err);
})*/
