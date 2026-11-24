import { Router } from 'express';
import { badRequest } from '../../errors/http-error.js';
import { PgAuthRepository } from './auth.repository.js';
import { validateLogin, validateRegister } from './auth.schema.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService(new PgAuthRepository());

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
    const error = validateRegister(req.body ?? {});
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        const { nickname, email, password } = req.body;
        const user = await authService.register(nickname, email, password);
        res.status(201).json({ id: user.id, nickname: user.nickname, email: user.email });
    } catch (err) {
        next(err);
    }
});

authRouter.post('/login', async (req, res, next) => {
    const error = validateLogin(req.body ?? {});
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        const { login, password } = req.body;
        res.json({ token: await authService.login(login, password) });
    } catch (err) {
        next(err);
    }
});
