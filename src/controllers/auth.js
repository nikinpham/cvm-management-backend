const randToken = require('rand-token');
const bcrypt = require('bcrypt');

const userModel = require('../models/users');
const authMethod = require('../utils/auth');

const jwtVariable = require('../../variables/jwt');
const { SALT_ROUNDS } = require('../../variables/auth');
const { isEmpty } = require('lodash');
exports.register = async (req, res) => {
	var { body } = req
	const username = body.username.toLowerCase();

	const user = await userModel.getUser(username);

	if (user.length) return res.status(409).send({ msg: 'The Username already exists' });
	else {
		const hashPassword = bcrypt.hashSync(body.password, SALT_ROUNDS);
		const newUser = {
			username: username,
			password: hashPassword,
		};
		const createUser = await userModel.createUser(newUser);
		if (!createUser) {
			return res.status(400).send({
				msg: 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.',
			});
		}
		return res.send({
			msg: "Successful account registration",
		});
	}
};

exports.login = async (req, res) => {
	const username = req.body.username.toLowerCase() || 'test';
	const password = req.body.password || '12345';

	const user = (await userModel.getUser(username))[0];
	if (!user) {
		return res.status(401).send({ msg: 'Tên đăng nhập không tồn tại.' });
	}

	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).send({ msg: "'Mật khẩu không chính xác.'" });
	}

	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

	const dataForAccessToken = {
		username: user.username,
	};
	const accessToken = await authMethod.generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(401)
			.send({ msg: 'Đăng nhập không thành công, vui lòng thử lại.' });
	}

	// Create Refresh Token
	let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);
	if (!user.refreshToken) {
		await userModel.updateRefreshToken(user.username, refreshToken);
	} else {
		refreshToken = user.refreshToken;
	}

	return res.json({
		msg: 'Đăng nhập thành công.',
		accessToken,
		refreshToken,
		user,
	});
};

exports.refreshToken = async (req, res) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(400).send('Không tìm thấy access token.');
	}

	// Lấy refresh token từ body
	const refreshTokenFromBody = req.body.refreshToken;
	if (!refreshTokenFromBody) {
		return res.status(400).send('Không tìm thấy refresh token.');
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

	// Decode access token đó
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!decoded) {
		return res.status(400).send('Access token không hợp lệ.');
	}

	const username = decoded.payload.username; // Lấy username từ payload

	const user = (await userModel.getUser(username))[0];
	if (!user) {
		return res.status(401).send('User không tồn tại.');
	}

	if (refreshTokenFromBody !== user.refreshToken) {
		return res.status(400).send('Refresh token không hợp lệ.');
	}

	// Tạo access token mới
	const dataForAccessToken = {
		username,
	};

	const accessToken = await authMethod.generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(400)
			.send('Tạo access token không thành công, vui lòng thử lại.');
	}
	return res.json({
		accessToken,
	});
};

exports.removeUser = async (req, res) => {
	const { body } = req;
	const { username } = body;
	const user = await userModel.getUser(username);
	if (isEmpty(user)) return res.status(404).send({ msg: 'User khong ton tai' });
	else {
		const removeUser = await userModel.removeUser(username);
		if (!removeUser) {
			return res.status(400).send({
				msg: 'Co loi trong qua trinh xoa',
			});
		}
		return res.send({
			msg: "Xoa thanh cong!",
		});
	}
}