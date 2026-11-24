import express, { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError } from './errors/http-error.js';
import routes from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../../frontend/dist'
    );
    app.use(express.static(frontendDist));
    app.get(/^\/(?!api(\/|$)).*/, (_req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
});

app.use(
    (
        err: Error & { status?: number; type?: string; code?: string },
        req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        if (err instanceof HttpError) {
            res.status(err.status).json({ error: err.message });
            return;
        }
        if (err.type === 'entity.parse.failed') {
            res.status(400).json({ error: 'Некоректний JSON у тілі запиту' });
            return;
        }
        if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
            console.error(`Database unavailable: ${err.code}`);
            res.status(503).json({ error: 'База даних тимчасово недоступна' });
            return;
        }
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
);

export default app;
