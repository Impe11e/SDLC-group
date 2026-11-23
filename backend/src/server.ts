import app from './app.js';
import { checkDbConnection } from './db/pool.js';

const port = Number(process.env.PORT) || 3000;

checkDbConnection()
    .then(() => console.info('Connected to PostgreSQL'))
    .catch((err: NodeJS.ErrnoException) =>
        console.error(
            `PostgreSQL is unavailable (${err.code ?? err.message}). Run: docker compose up -d`
        )
    );

app.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}`);
});
