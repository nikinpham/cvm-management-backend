import { Router } from 'express';
import { AuthControllers } from '../controllers';

// eslint-disable-next-line new-cap
const AuthRouter = Router();

AuthRouter.post('/register', AuthControllers.register);
// router.post('/login', login);
// router.post('/refresh', refreshToken);
// router.delete('/remove', removeUser);

export { AuthRouter };
