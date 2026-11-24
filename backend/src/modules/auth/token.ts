import jwt from 'jsonwebtoken';
import type { UserRole } from '../../types/auth.js';

export interface TokenPayload {
    sub: number;
    role: UserRole;
}

const TOKEN_TTL = '24h';

function getSecret(): string {
    return process.env.JWT_SECRET ?? 'dev-secret-change-me';
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === 'string') throw new Error('Invalid token');
    return { sub: Number(decoded.sub), role: decoded.role as UserRole };
}
