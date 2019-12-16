
var Models = require("../models")
var UserMgt = require("./UserMgt");
var cache = require("../redis/redis-client");
const {promisify} = require('util');
const getListItem = promisify(cache.lindex).bind(cache);



const EMPTY = "__empty__";

class RoomMgt {


	constructor() {
		this.rooms = [ new Models.Room(1, 5, 1, 2),
				new Models.Room(2, 10, 2, 4)
			];
		this.roomStates = {};
		this.populateRoom();
	}

	populateRoom() {
		this.rooms.forEach((room) => {
			cache.del(room.id);
			cache.rpush(room.id , new Array(room.capacity).fill(EMPTY));
		});
	}

	getAll() {
		return this.rooms;
	}

	get(roomId) {
		if(roomId > 0 && roomId <= this.rooms.length)
			return this.rooms[roomId-1];
		else
			return null;
	}

	async connect(roomId, pos, username, amount) {

		let room = this.get(roomId);
		let user = UserMgt.get(username);
		let result = {message : "", success: false};
		if(!room) {
			result.message = "Unable to find the room";
		}
		else if(!user) {
			result.message = "Unable to find the user";
		}
		else if(user.balance <= amount) {
			result.message = "insufficient balance";
		}
		else if(pos < 0 || pos >= room.capacity) {
			result.message = "Invalid room position";
		}
		else {
			
			let roomState = await getListItem(room.id, pos);

			if(roomState == EMPTY) { 
				user.balance = user.balance - amount; // TODO - Take lock on before updating the value
				cache.lset(room.id, pos, username); // TODO - Take lock on before updating the value
				result.message = username + " joined " + room.name;
				result.success = true;
				result.roomName = room.name;
			} else {
				result.message = "Position is already occupied";
			}

		}
		return result;
	}
};
module.exports = new RoomMgt();