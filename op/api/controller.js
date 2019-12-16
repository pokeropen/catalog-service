'use strict';

var services = require("../services");
var models = require("../models");
var MessageService = require("../eventsource");

const rooms = [ new models.Room(1, 5, 1, 2),
				new models.Room(2, 10, 2, 4)
			];

var controllers = {
	getRooms: function(req, res) {
		res.json(services.RoomMgt.getAll());
	},

	getRoomById: function(req, res) {
		var roomId = parseInt(req.params.roomId);
		var room = services.RoomMgt.get(roomId);
		if(room) {
			res.json(room);
		} else {
			console.log("Invalid room Id " + roomId);
			res.status(404)
				.send("Room not found");
		}
	},
	joinRoom: function(req, res) {
		var joinReq = req.body;
		var promise = services.RoomMgt.connect(joinReq.roomId, joinReq.pos, joinReq.username, joinReq.amount);
		promise.then((result) => {	
			if(result && result.success) {
				// If success send the event
				MessageService.sendEvent(result.roomName, {username : joinReq.username, event: "Joined_Room"})
								.then((msg)=> {
									res.json(result);
								}).catch((error) => {
									res.status(412).send(error);
								})
			}
			else {
				res.status(412).send(result);
			}
		})
	},
	login: function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		var result = services.UserMgt.login(username, password);
		if(result) {
			var result = {success : true};
			res.json(result);
		} else {
			res.status(401)
				.send("Invalid username or password");
		}
	},
	logout: function(req, res) {
		var username = req.body.username;
		var result = services.UserMgt.logout(username);
		if(result) {
			var result = {success : true};
			res.json(result);
		} else {
			res.status(401)
				.send("Invalid username " + username);
		}
	},
	register: function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		var firstname = req.body.firstName;
		var lastName = req.body.lastName;
		var result = services.UserMgt.create(username, password, firstname, lastName);
		if(result) {
			var result = {success : true};
			res.json(result);
		} else {
			res.status(401)
				.send("Invalid details or username pre-exists ");
		}
	},
	getActiveUsers: function(req, res) {
		res.json( services.UserMgt.getActiveUsers());
	},
	getUsers: function(req, res) {
		res.json( services.UserMgt.getAll());
	},
	getUser: function(req, res) {
		var username = (req.params.username);
		var user = services.UserMgt.get(username);
		if(user) {
			res.json( user);
		} else {
			res.status(401)
				.send("Invalid username " + username);
		}
	}
}

module.exports = controllers;