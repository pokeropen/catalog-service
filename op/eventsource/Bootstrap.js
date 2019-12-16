const { KafkaClient, HighLevelProducer, ProduceRequest, Admin } = require('kafka-node');
const services = require("../services");

let topics = [];
let topics_consume = [];
let producer = null;

try {
	const kafkaHost = 'localhost:9092',
		  client = new KafkaClient({kafkaHost});

	producer = new HighLevelProducer(client);


	let rooms = services.RoomMgt.getAll();

	rooms.forEach((item) => {
		topics.push(item.name);
		topics_consume.push({ topic : item.name, partition: 0, offset: 0});
	})


	producer.on("ready", ()=>{
		console.log("Kafka Producer ready");
		console.log("Creating topics", topics);
		producer.createTopics(topics, false, (err, res) => {
			  if (err) {
			  	console.log('error in creating room topics', err);
			  } else {
			  	console.log('Room Topics created / already created');
			  }
			});
	});

	producer.on("error", (err) => {
		console.log("Error while connecting connecting to kafka " + err);
	});

	
} catch(error) {
	console.log("Error while setup kafka ", error);
}

 function sendEvent(topic, message) {
		return new Promise(function(resolve, reject) {
			console.log("Sending event ", topic, message);
			producer.send([{ topic: topic, messages: message, attributes : 0}],  // Use encoding
				((err, data) => {
					if(err) {
						console.log("Fail to delivery message ", err);
						reject(err);
					} else {
						console.log("Message delivered to topic ", data);
						resolve(data);
					}
				})
			);
	    });
	}

module.exports = { topics : topics_consume, sendEvent : sendEvent};
