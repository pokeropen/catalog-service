

import {chai, app} from './InitSpec';


describe("Room Spec", () => {
	describe("GET ", () => {
		it("Get all rooms" , (done) => {
			chai.request(app)
				.get("/catalog/room")
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eq(2)
					done();
				});
		});
		it("Get single room" ,(done) => {
			chai.request(app)
				.get("/catalog/room/1")
				.end((err, res) => {
					const room = {id:1, capacity:5, smallBlind:1,bigBlind:2,name:"Room_1"};
					res.should.have.status(200);
					res.body.should.be.a('object');
	                res.body.should.have.property('id').eql(room.id);
                  	res.body.should.have.property('capacity').eql(room.capacity);
	                res.body.should.have.property('smallBlind').eql(room.smallBlind);
	                res.body.should.have.property('bigBlind').eql(room.bigBlind);
                  	res.body.should.have.property('name').eql(room.name);
					done();
				});
		});
	});
	describe("POST ", () => {
		it("Join the room", (done) => {
			const joinRoom = {roomId: 1, username: "admin", amount: 100, pos : 1};
			verifyJoin(joinRoom, 200, true, "admin joined Room_1", done, 900);
		});
		it("Try to join with invalid room Id", (done) => {
			const joinRoom = {roomId: 3, username: "admin", amount: 100, pos : 1};
			verifyJoin(joinRoom, 412, false, "Unable to find the room", done, 900);
		});
		it("Try to join with invalid username", (done) => {
			const joinRoom = {roomId: 1, username: "admin1", amount: 100, pos : 1};
			verifyJoin(joinRoom, 412, false, "Unable to find the user", done, 900);
			
		});
		it("Try to join with insufficient balance", (done) => {
			const joinRoom = {roomId: 1, username: "admin", amount: 10000, pos : 1};
			verifyJoin(joinRoom, 412, false, "insufficient balance", done, 900);
			
		});
		it("Try to join with on occupied seat", (done) => {
			const joinRoom = {roomId: 1, username: "admin", amount: 10, pos : 1};
			verifyJoin(joinRoom, 412, false, "Position is already occupied", done, 900);
			
		});
		it("Try to join invalid room position", (done) => {
			const joinRoom = {roomId: 1, username: "admin", amount: 10, pos : 6};
			verifyJoin(joinRoom, 412, false, "Invalid room position", done, 900);
			
		});
	})
});

function verifyJoin(joinRoom, statusCode, result, message, done, amount) {
	chai.request(app)
		.post("/catalog/room/join")
		.send(joinRoom)
		.end((err, res) => {
			console.log(res.body);
			res.should.have.status(statusCode);
			res.body.should.be.a('object');
			res.body.should.have.property("success").eql(result);
			res.body.should.have.property("message").eql(message);
			if(message.indexOf("user") == -1) { // Ignore below check if its invalid user test case
				chai.request(app)
					.get("/catalog/user/" + joinRoom.username)
					.end((err, res) => {
	          			res.body.should.have.property('balance').eql(amount);
						done();
					});
			} else {
				done();
			}
		});
}
