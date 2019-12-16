require("./op/eventsource")
const express = require("express");
const cors = require("cors");
const cache = require("./op/redis/redis-client");
const app = express();
const port = process.env.PORT || 8080

const routes = require("./op/api/routes");

app.use(cors()); // TODO - Restrict access
app.use(express.json());      
app.use(express.urlencoded({ extended: true })); 

routes(app);
var server = app.listen(port, function(){
	console.log("Application Start on port " + port);
})

module.exports = server