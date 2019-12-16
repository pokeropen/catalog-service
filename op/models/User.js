class User {
	constructor(username, password, firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
		this.balance = 1000;
	}
}
module.exports = User;