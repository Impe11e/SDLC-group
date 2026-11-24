import type { NextFunction, Request, Response } from 'express';
import { forbidden, unauthorized } from '../errors/http-error.js';
import { verifyToken } from '../modules/auth/token.js';
import type { UserRole } from '../types/auth.js';

export function authRequired(req: Request, res: Response, next: NextFunction) {
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        next(unauthorized('Потрібна авторизація'));
        return;
    }
    try {
        const payload = verifyToken(header.slice('Bearer '.length));
        res.locals.userId = payload.sub;
        res.locals.role = payload.role;
        next();
    } catch {
        next(unauthorized('Недійсний або прострочений токен'));
    }
}

export function requireRole(role: UserRole) {
    return (_req: Request, res: Response, next: NextFunction) => {
        if (res.locals.role !== role) {
            next(forbidden('Недостатньо прав доступу'));
            return;
        }
        next();
    };
}

export function getUserId(res: Response): number {
    return res.locals.userId as number;
}
