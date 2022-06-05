import { JWT_VARIABLE } from '../../variables';
import { UserModel } from '../models';
import { AuthUtils } from '../utils';

const isAuth = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || JWT_VARIABLE.accessTokenSecret;

	const verified = await AuthUtils.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.send('Bạn không có quyền truy cập vào tính năng này!');
	}

	const user = await UserModel.getUser(verified.payload.username);
	req.user = user;

	return next();
};

export const AuthMiddlewares = {
	isAuth,
};
