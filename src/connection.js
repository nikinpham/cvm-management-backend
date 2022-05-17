const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

dbConnectionInfo = {
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
}

// Single Connection
// var dbconnection = mysql.createConnection(dbConnectionInfo);

// dbconnection.connect(function (err) {
// 	if (!err) {
// 		console.log("Database is connected");
// 	} else {
// 		console.log("Error connecting database");
// 	}
// });


// Create mysql connection pool
var dbconnection = mysql.createPool(
	dbConnectionInfo
);

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
	console.log('DB Connection established');

	connection.on('error', function (err) {
		console.error(new Date(), 'MySQL error', err.code);
	});
	connection.on('close', function (err) {
		console.error(new Date(), 'MySQL close', err);
	});

});

module.exports = dbconnection;

