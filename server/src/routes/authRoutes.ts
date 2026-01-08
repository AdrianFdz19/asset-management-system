import { NextFunction, Request, Response, Router } from 'express'
import { pool } from '../config/databaseConfig';
import { OAuth2Client } from 'google-auth-library';
import { envs } from '../config/envs';
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

auth.post('/google', async (req: Request, res: Response, next: NextFunction) => {
    const {token} = req.body;
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

        // C. Generar tu propio token (JWT) o Sesión
        // Por ahora, enviaremos los datos del usuario para probar
        // Más adelante aquí firmarás tu propio JWT con 'jsonwebtoken'
        
        res.status(200).json({
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                },
                token: "TU_JWT_GENERADO_AQUI" // Implementaremos esto luego
            }
        });

    } catch (err) {
        next(err); // Tu errorHandler global se encargará
    }
});
