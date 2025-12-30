import { Pool } from 'pg';
import { envs } from './envs';

// Configuramos el pool
export const pool = new Pool({
    connectionString: envs.DATABASE_URL,
    // Importante: Render requiere SSL para conexiones externas
    ssl: envs.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
});

// Verificación de conexión (Esto aparecerá en tus logs de Render)
pool.on('connect', () => {
    console.log('✅ Base de Datos conectada');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en el pool de Postgres', err);
});