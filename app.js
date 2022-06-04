const express = require('express');
const createError = require('http-errors');
require('express-async-errors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const authRouter = require('./src/routes/auth');
const userRouter = require('./src/routes/users');

dotenv.config();

const app = express();

// environtment default = Dev
app.use(morgan('dev'));

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);

app.use(bodyParser.json());

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

// sercurity
app.use(cors());

app.get('/', (req, res) => {
	res.send('Server starting!');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res) => {
	res.status(err.status || 500).send(err.message);
});

const server = app.listen(process.env.PORT, () => {
	console.log(`Log: Starting → PORT ${server.address().port}`);
});

server.timeout = 0;
