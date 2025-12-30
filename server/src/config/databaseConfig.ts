import { Pool } from 'pg';
import { envs } from './envs';

let config;

if (envs.NODE_ENV === 'production') {
    // Configuración para RENDER (Producción)
    config = {
        connectionString: envs.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
    // Configuración para TU PC (Development)
    config = {
        user: 'postgres',
        database: 'assets-system-manager',
        port: 5432,
        password: '1214',
        host: 'localhost'
    };
}

export const pool = new Pool(config);

pool.on('connect', () => {
    console.log(`✅ Base de Datos conectada en modo: ${envs.NODE_ENV}`);
});