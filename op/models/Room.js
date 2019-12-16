class Room {
	constructor(id, capacity, smallBlind, bigBlind ) {
		this.id = id;
		this.capacity = capacity;
		this.smallBlind = smallBlind;
		this.bigBlind = bigBlind;
		this.name = "Room_" + this.id;
	}
}
module.exports = Room;