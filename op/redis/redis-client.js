let redis = require('redis');


const env = process.env.NODE_ENV;
if(env == "test1") {
	redis = require("redis-mock");
}

function retry_strategy(options) {
    console.log(" Retry ", options.error);
 	if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
}

const client = redis.createClient({retry_strategy: retry_strategy});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Unable to connect to redis client ' + err);
});

module.exports = client;