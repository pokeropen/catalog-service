
import {chai, app} from './InitSpec';

describe("User Spec", () => {
	describe("GET ", () => {
		it("Get all users", (done) => {
			chai.request(app)
				.get("/catalog/user")
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eq(2)
					done();
				});
		});
		it("Get user with username", (done) => {
			chai.request(app)
				.get("/catalog/user/admin")
				.end((err, res) => {
					const user = {"firstName":"Administrator","lastName":".","username":"admin","password":"admin","balance":900};
					res.should.have.status(200);
					res.body.should.be.a('object');
	                res.body.should.have.property('firstName').eql(user.firstName);
                  	res.body.should.have.property('lastName').eql(user.lastName);
	                res.body.should.have.property('username').eql(user.username);
	                res.body.should.have.property('password').eql(user.password);
                  	res.body.should.have.property('balance').eql(user.balance);
					done();
				});
		});
	});
});

describe("Login and Logout", () => {
	it("Login valid user", (done) => {
		 let user = { username: "admin", password: "admin" }
		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
				userLoggedIn(done, "admin");
			});
	});
	it("Login invalid username", (done) => {
	 	let user = { username: "admin1", password: "admin" }
		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});
	it("Login invalid password", (done) => {
	 	let user = { username: "admin", password: "admin1" }
		chai.request(app)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
				res.should.have.status(401);
				chai.expect(res.error.text).to.be.equal("Invalid username or password")
				done();
			});
	});
	it("Logout user" , (done) => {
	 	let user = { username: "admin"}
		userLoggedIn(null, "admin");
		chai.request(app)
			.post('/api/logout')
			.send(user)
			.end((err, res) => {
				res.body.should.be.a('object');
				res.body.should.have.property('success').eql(true);
			});
		userLoggedIn(done);
	});
});

function userLoggedIn(done, user) {
	
	// Verify logged in user is active
	chai.request(app)
		.get("/api/activeUsers")
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('array');
			if(user)
				res.body.should.have.members(["admin"])
			if(done)
				done()
		})
}
