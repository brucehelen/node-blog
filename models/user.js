

var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};


module.exports = User;

User.prototype.save = function(callback) {
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};

	// 打开数据库
	mongodb.open(function(err, db) {
		if (err) return callback(err);

		// 读取users集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//将用户信息插入users集合
			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
				if (err) return callback(err);
				console.log('User.prototype.save: ' + user[0]);
				callback(null, user[0]);
			});
		});
	});
};


User.get = function(name, callback) {
	mongodb.open(function(err, db) {
		console.log('User.get open err: ', err);
		if (err) return callback(err);

		// 读取user集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			};

			// 查找用户
			collection.findOne({name: name}, function(err, user) {
				mongodb.close();
				if (err) return callback(err);
				console.log('User.get: ' + user);
				callback(null, user);
			});
		});
	});
}


