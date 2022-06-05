import express from 'express';
import { AuthControllers } from '../controllers';

const AuthRouter = express.Router();

AuthRouter.post('/register', AuthControllers.register);
// router.post('/login', login);
// router.post('/refresh', refreshToken);
// router.delete('/remove', removeUser);

export { AuthRouter };
