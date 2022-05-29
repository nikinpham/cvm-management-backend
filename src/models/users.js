const conn = require('../config/db');

exports.getUser = async username => {
	let sql = 'SELECT * FROM USERS WHERE username = ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, [username], (error, users) => {
			if (error) {
				return reject(error);
			}
			return resolve(JSON.parse(JSON.stringify(users)));
		});
	});
};

exports.createUser = async user => {
	let sql = 'INSERT INTO USERS SET ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, [user], (error, result) => {
			if (error) {
				return reject(error);
			}
			return resolve(result.insertId);
		});
	});
};

exports.updateRefreshToken = async (username, refreshToken) => {
	let sql = 'UPDATE USERS SET refreshToken = ? WHERE username = ?';

	console.log(username, refreshToken)
	return new Promise((resolve, reject) => {
		conn.query(sql, [refreshToken, username], (error) => {
			if (error) {
				return reject(error);
			}
			return resolve();
		});
	});
};
