'use strict';

const controller = require("./controller");

module.exports = function(app) {
	app.route("/api/login")
		.post(controller.login);
	app.route('/api/logout')
		.post(controller.logout);
	app.route("/api/activeUsers")
		.get(controller.getActiveUsers);
	app.route("/catalog/user")
		.get(controller.getUsers);
	app.route("/catalog/user/:username")
		.get(controller.getUser);
	app.route("/catalog/user")
		.post(controller.register);
	app.route("/catalog/room")
		.get(controller.getRooms);
	app.route("/catalog/room/join")
		.post(controller.joinRoom);
	app.route("/catalog/room/:roomId")
		.get(controller.getRoomById)
}