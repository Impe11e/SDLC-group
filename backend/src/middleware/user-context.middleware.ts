import type { NextFunction, Request, Response } from 'express';

const DEFAULT_USER_ID = 1;

/**
 * Визначає поточного користувача із заголовка X-User-Id.
 * Тимчасове рішення, доки модуль auth не видає справжній JWT:
 * тоді тут достатньо буде брати id з розшифрованого токена.
 */
export function userContext(req: Request, res: Response, next: NextFunction) {
    const header = req.header('X-User-Id');

    if (header === undefined || header === '') {
        res.locals.userId = DEFAULT_USER_ID;
        next();
        return;
    }

    const userId = Number(header);
    if (!Number.isInteger(userId) || userId <= 0) {
        res.status(400).json({ error: 'Некоректний заголовок X-User-Id' });
        return;
    }

    res.locals.userId = userId;
    next();
}

export function getUserId(res: Response): number {
    return res.locals.userId as number;
}
