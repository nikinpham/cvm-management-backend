import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Response } from 'express';
import 'express-async-errors';
import createError from 'http-errors';
import morgan from 'morgan';
import { AuthRouter } from './src/routes';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3306;

// environtment default = Dev
app.use(morgan('dev'));
app.get('/', (res: Response) => {
	res.send('Server starting!');
});
// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// sercurity
app.use(cors());

app.use('/auth', AuthRouter);
// app.use('/users', userRouter);

app.use((next: NextFunction) => {
	next(createError(404));
});

app.use((err: any, res: Response) => {
	res.status(err?.status || 500).send(err?.message);
});

const server = app.listen(PORT, () => {
	console.log(`Log: Server starting at ${PORT}`);
});

server.timeout = 10000;
