import dotenv from 'dotenv';

dotenv.config();

export const envs = {
    PORT: process.env.PORT || 4000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL
};

// Validación opcional (Muy pro para tu portafolio)
if (!envs.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in .env file');
}