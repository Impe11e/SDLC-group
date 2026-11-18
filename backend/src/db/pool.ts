import pg from 'pg';

export const pool = new pg.Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER ?? 'shop',
    password: process.env.DB_PASSWORD ?? 'shop',
    database: process.env.DB_NAME ?? 'shop',
    max: 10,
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error', err);
});

export async function checkDbConnection(): Promise<void> {
    await pool.query('SELECT 1');
}
