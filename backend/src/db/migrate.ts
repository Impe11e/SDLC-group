import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const migrationsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../db');

async function migrate(): Promise<void> {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS schema_migrations (
            filename   VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
        )`
    );

    const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
    const { rows } = await pool.query<{ filename: string }>(
        'SELECT filename FROM schema_migrations'
    );
    const applied = new Set(rows.map((r) => r.filename));

    for (const file of files) {
        if (applied.has(file)) continue;

        const sql = await readFile(path.join(migrationsDir, file), 'utf8');
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.info(`Applied migration ${file}`);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    console.info('Migrations are up to date');
}

migrate()
    .then(() => pool.end())
    .catch(async (err) => {
        console.error('Migration failed', err);
        await pool.end();
        process.exit(1);
    });
