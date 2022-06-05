import mysql from 'mysql';
import dotenv from 'dotenv';

const MYSQL_CONNECTION_LIFETIME = 15;
const CONNECTION_LIMIT = 10;

dotenv.config();

const dbConnectionInfo = {
	idleTimeoutMillis: MYSQL_CONNECTION_LIFETIME * 1000,
	connectionLimit: CONNECTION_LIMIT,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

// Create mysql connection pool
const DBConnection = mysql.createPool(dbConnectionInfo);

// Attempt to catch disconnects
DBConnection.on('connection', (connection: any) => {
	connection.on('error', (err: any) => {
		console.error(new Date(), 'MySQL error', err?.code);
	});

	connection.on('close', (err: any) => {
		console.error(new Date(), 'MySQL close', err);
	});
});

export default DBConnection;
