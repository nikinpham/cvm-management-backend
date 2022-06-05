import DBConnection from '../config';
import { Response } from 'express';
import { TABLE } from '../constants';
import { UserType } from '../types';

const getUser = async (username: string) => {
	const sql = `SELECT * FROM ${TABLE.USERS} WHERE username = ?`;
	return new Promise((resolve, reject) => {
		DBConnection.query(sql, [username], (error: any, users: UserType) => {
			if (error) {
				return reject(error);
			}
			return resolve(JSON.parse(JSON.stringify(users)));
		});
	});
};

const createUser = async (user: UserType) => {
	const sql = `INSERT INTO ${TABLE.USERS} SET ?`;
	return new Promise((resolve, reject) => {
		DBConnection.query(sql, [user], (error: any, result: Response) => {
			if (error) {
				return reject(error);
			}
			return resolve(result);
		});
	});
};

// const deleteUser = async username => {
// 	let sql = `DELETE FROM USERS WHERE username = ?`;
// 	return new Promise((resolve, reject) => {
// 		DBConnection.query(sql, [username], (error, result) => {
// 			if (error) {
// 				console.log(error);
// 				return reject(error);
// 			}
// 			return resolve(result);
// 		});
// 	});
// };

// const updateRefreshToken = async (username, refreshToken) => {
// 	// let sql = 'UPDATE USERS SET refreshToken = ? WHERE username = ?';
// 	// console.log(username, refreshToken)
// 	// return new Promise((resolve, reject) => {
// 	// 	DBConnection.query(sql, [refreshToken, username], (error) => {
// 	// 		if (error) {
// 	// 			return reject(error);
// 	// 		}
// 	// 		return resolve();
// 	// 	});
// 	// });
// };

export const UserModel = {
	getUser,
	createUser,
	// deleteUser,
	// updateRefreshToken,
};
