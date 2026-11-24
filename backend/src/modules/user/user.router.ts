import { Router } from 'express';
import { badRequest } from '../../errors/http-error.js';
import { authRequired, getUserId } from '../../middleware/auth.middleware.js';
import { PgUserRepository } from './user.repository.js';
import { validateUpdateName } from './user.schema.js';
import { UserService } from './user.service.js';

const userService = new UserService(new PgUserRepository());

export const userRouter = Router();

userRouter.use(authRequired);

userRouter.get('/me', async (_req, res, next) => {
    try {
        res.json(await userService.getProfile(getUserId(res)));
    } catch (err) {
        next(err);
    }
});

userRouter.patch('/me', async (req, res, next) => {
    const error = validateUpdateName(req.body ?? {});
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        res.json(await userService.updateName(getUserId(res), req.body.nickname));
    } catch (err) {
        next(err);
    }
});
