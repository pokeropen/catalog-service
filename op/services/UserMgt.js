var Models = require("../models")

class UserMgt {
	constructor() {

		this.users = [new Models.User("vj", "admin", "Vijay Kumar", "Jalagari"), new Models.User("admin", "admin", "Administrator",".")]
		this.usersMap = {
						"vj" : this.users[0],
						"admin" : this.users[1]
						}; 
		this.activeUsers = [];
	}

	login(username, password) {
		var user = this.usersMap[username];
		if(username && user && user.password == password) {
			if(this.activeUsers.indexOf(username) == -1) {
				this.activeUsers.push(username);
				console.log(" user " + username + " logged in");
			} else {
				console.log(" user " + username + " already logged in");
			}
			return true;
		} else {
			return false;
		}
	}

	logout(username) {
		var index = this.activeUsers.indexOf(username);
		if(username && index != -1) {
			this.activeUsers.splice(index, 1);
			return true;
		} else {
			console.log("Invalid Username " + username);
			return false;
		}
	}

	getActiveUsers() {
		return this.activeUsers;
	}

	get(username) {
		return this.usersMap[username];
	}

	getAll() {
		return this.users;
	}

	create(username, password, firstname, lastname) {

		var user = this.usersMap[username];
		if(!user) {
			this.usersMap[username] = new Models.User(username, password, firstname, lastname);
			return true;
		} else {
			return false;
		}
	}
}

module.exports = new UserMgt();