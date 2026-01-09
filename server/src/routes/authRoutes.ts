import { NextFunction, Request, Response, Router } from 'express'
import { pool } from '../config/databaseConfig';
import { OAuth2Client } from 'google-auth-library';
import { envs } from '../config/envs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
import { isAuth } from '../middleware/isAuth';
/* import jwt from 'jsonwebtoken'; */
const client = new OAuth2Client(envs.GOOGLE_CLIENT_ID);

export const auth = Router();

auth.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('Auth route is live...');
    } catch (err) {
        next(err);
    }
});

// Interfaz para el contenido del token
interface TokenPayload {
    userId: number;
}

// Autenticar al usuario en cada recarga
auth.get('/me', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. El ID ya viene inyectado gracias a isAuth
        const userId = req.userId;

        // 2. Buscamos al usuario en la base de datos para devolver su info actualizada
        const userQuery = await pool.query(
            'SELECT id, username, email, avatar FROM users WHERE id = $1',
            [userId]
        );

        const user = userQuery.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 3. Respondemos con la data necesaria para el frontend
        res.status(200).json({
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (err) {
        next(err); // Tu errorHandler global
    }
});

// Función reutilizable para generar el JWT y setear la Cookie
export const sendTokenCookie = (res: Response, userId: number) => {
    const token = jwt.sign({ userId }, envs.JWT_SECRET, {
        expiresIn: '24h', // El token de Google dura 1h, pero el tuyo puede durar más
    });

    let sameSiteStatus = envs.NODE_ENV === 'production' ? 'none' as const : 'strict' as const

    const cookieOptions = {
        httpOnly: true,
        secure: envs.NODE_ENV === 'production',
        sameSite: sameSiteStatus,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    };

    res.cookie('session_token', token, cookieOptions);
};

auth.post('/google', async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    const tokenString = typeof token === 'string' ? token : token.token;
    console.log(tokenString);
    try {
        // A. Validar el token con Google
        const ticket = await client.verifyIdToken({
            idToken: tokenString,
            audience: envs.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google Token');

        const { email, name, picture, sub: googleId } = payload;

        // B. Lógica de Base de Datos (Buscar o Crear)
        // Intentamos buscar al usuario por email
        let userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = userQuery.rows[0];

        if (!user) {
            // Si no existe, lo creamos
            const newUser = await pool.query(
                'INSERT INTO users (username, email, google_id, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, googleId, picture]
            );
            user = newUser.rows[0];
        }

        // C. Generar tu propio token y enviarlo en la cookie
        sendTokenCookie(res, user.id);

        res.status(200).json({
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.username, // Ojo: en tu INSERT usaste 'username'
                    email: user.email,
                    avatar: user.avatar
                }
            }
        });

    } catch (err) {
        next(err); // Tu errorHandler global se encargará
    }
});

// Logout
auth.post('/logout', isAuth, (req: Request, res: Response) => {
    res.clearCookie('session_token', {
        httpOnly: true,
        secure: envs.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
