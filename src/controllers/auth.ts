import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { SALT_ROUNDS } from '../../variables';
import { HTTP_STATUS_CODES } from '../constants';
import { UserModel } from '../models';

const register = async (req: Request, res: Response) => {
	const { username = '', password = '' } = req.body;

	const user = await UserModel.getUser(username.toLowerCase());

	if (!isEmpty(user))
		return res.status(HTTP_STATUS_CODES.CONFLICT).send({
			message: 'The Username already exists',
			status: res.statusCode,
		});

	const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);

	const newUser = {
		username: username.toLowerCase(),
		password: hashPassword,
	};

	const createUser = await UserModel.createUser(newUser);

	if (!createUser) {
		return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
			message: 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.',
			status: res.statusCode,
		});
	}

	return res.send({
		message: 'Successful account registration',
		status: res.statusCode,
	});
};

// const login = async (req, res) => {
// 	const username = req.body.username.toLowerCase() || 'test';
// 	const password = req.body.password || '12345';

// 	const user = (await UserModel.getUser(username))[0];
// 	if (!user) {
// 		return res.status(401).send({ msg: 'Tên đăng nhập không tồn tại.' });
// 	}

// 	const isPasswordValid = bcrypt.compareSync(password, user.password);
// 	if (!isPasswordValid) {
// 		return res.status(401).send({ msg: "'Mật khẩu không chính xác.'" });
// 	}

// 	const accessTokenLife =
// 		process.env.ACCESS_TOKEN_LIFE || JWT_VARIABLE.accessTokenLife;
// 	const accessTokenSecret =
// 		process.env.ACCESS_TOKEN_SECRET || JWT_VARIABLE.accessTokenSecret;

// 	const dataForAccessToken = {
// 		username: user.username,
// 	};
// 	const accessToken = await AuthUtils.generateToken(
// 		dataForAccessToken,
// 		accessTokenSecret,
// 		accessTokenLife,
// 	);
// 	if (!accessToken) {
// 		return res
// 			.status(401)
// 			.send({ msg: 'Đăng nhập không thành công, vui lòng thử lại.' });
// 	}

// 	// Create Refresh Token
// 	let refreshToken = randToken.generate(JWT_VARIABLE.refreshTokenSize);
// 	if (!user.refreshToken) {
// 		await UserModel.updateRefreshToken(user.username, refreshToken);
// 	} else {
// 		refreshToken = user.refreshToken;
// 	}

// 	return res.json({
// 		msg: 'Đăng nhập thành công.',
// 		accessToken,
// 		refreshToken,
// 		user,
// 	});
// };

// const refreshToken = async (req, res) => {
// 	// Lấy access token từ header
// 	const accessTokenFromHeader = req.headers.x_authorization;
// 	if (!accessTokenFromHeader) {
// 		return res.status(400).send('Không tìm thấy access token.');
// 	}

// 	// Lấy refresh token từ body
// 	const refreshTokenFromBody = req.body.refreshToken;
// 	if (!refreshTokenFromBody) {
// 		return res.status(400).send('Không tìm thấy refresh token.');
// 	}

// 	const accessTokenSecret =
// 		process.env.ACCESS_TOKEN_SECRET || JWT_VARIABLE.accessTokenSecret;
// 	const accessTokenLife =
// 		process.env.ACCESS_TOKEN_LIFE || JWT_VARIABLE.accessTokenLife;

// 	// Decode access token đó
// 	const decoded = await AuthUtils.decodeToken(
// 		accessTokenFromHeader,
// 		accessTokenSecret,
// 	);
// 	if (!decoded) {
// 		return res.status(400).send('Access token không hợp lệ.');
// 	}

// 	const username = decoded.payload.username; // Lấy username từ payload

// 	const user = (await UserModel.getUser(username))[0];
// 	if (!user) {
// 		return res.status(401).send('User không tồn tại.');
// 	}

// 	if (refreshTokenFromBody !== user.refreshToken) {
// 		return res.status(400).send('Refresh token không hợp lệ.');
// 	}

// 	// Tạo access token mới
// 	const dataForAccessToken = {
// 		username,
// 	};

// 	const accessToken = await AuthUtils.generateToken(
// 		dataForAccessToken,
// 		accessTokenSecret,
// 		accessTokenLife,
// 	);
// 	if (!accessToken) {
// 		return res
// 			.status(400)
// 			.send('Tạo access token không thành công, vui lòng thử lại.');
// 	}
// 	return res.json({
// 		accessToken,
// 	});
// };

// const removeUser = async (req, res) => {
// 	const { body } = req;
// 	const { username } = body;
// 	const user = await UserModel.getUser(username);
// 	if (isEmpty(user)) return res.status(404).send({ msg: 'User khong ton tai' });
// 	else {
// 		const isRemoveUser = await UserModel.deleteUser(username);
// 		if (!isRemoveUser) {
// 			return res.status(400).send({
// 				msg: 'Co loi trong qua trinh xoa',
// 			});
// 		}
// 		return res.send({
// 			msg: 'Xoa thanh cong!',
// 		});
// 	}
// };

// export const AuthControllers = { login, register, removeUser, refreshToken };
export const AuthControllers = { register };
