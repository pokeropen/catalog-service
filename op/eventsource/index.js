const Bootstrap = require("./Bootstrap");
const consumer = require("./Consumer");

module.exports = {topics : Bootstrap.topics, sendEvent : Bootstrap.sendEvent};