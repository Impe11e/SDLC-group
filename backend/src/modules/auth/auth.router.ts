import { Router } from 'express';
import { ConsoleEmailAdapter } from '../../adapters/email.adapter.js';
import { badRequest } from '../../errors/http-error.js';
import { PgAuthRepository } from './auth.repository.js';
import {
    validateForgotPassword,
    validateLogin,
    validateRegister,
    validateResetPassword,
} from './auth.schema.js';
import { AuthService } from './auth.service.js';
import { PgPasswordResetRepository } from './password-reset.repository.js';
import { PasswordResetService } from './password-reset.service.js';

const authService = new AuthService(new PgAuthRepository());

const passwordResetService = new PasswordResetService(
    new PgAuthRepository(),
    new PgPasswordResetRepository(),
    new ConsoleEmailAdapter(),
    process.env.APP_URL ?? 'http://localhost:5173'
);

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

authRouter.post('/forgot-password', async (req, res, next) => {
    const error = validateForgotPassword(req.body ?? {});
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        await passwordResetService.requestReset(req.body.email);
        res.json({ message: 'Якщо такий email існує, ми надіслали лист із посиланням' });
    } catch (err) {
        next(err);
    }
});

authRouter.post('/reset-password', async (req, res, next) => {
    const error = validateResetPassword(req.body ?? {});
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        await passwordResetService.resetPassword(req.body.token, req.body.password);
        res.json({ message: 'Пароль змінено' });
    } catch (err) {
        next(err);
    }
});
