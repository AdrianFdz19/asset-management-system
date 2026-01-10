import { NextFunction, Request, Response, Router } from 'express'
import { pool } from '../config/databaseConfig';
import { isAuth } from '../middleware/isAuth';
import cloudinary from '../config/cloudinary';
import upload from '../services/multer';

export const assets = Router();

assets.get('/', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = `SELECT * FROM assets`;
        const response = await pool.query(query);
        const data = response.rows;

        res.status(200)
            .json({
                message: '',
                data
            });
    } catch (err) {
        next(err);
    }
});

assets.post('/', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    console.log('El usuario con el id ', userId, 'Esta subiendo su asset.');
    try {
        const {
            name,
            serial_number,
            status,
            value,
            purchase_date,
            category_id,
            user_id,
            image_url, // <--- Nuevo campo
            image_public_id // <--- Nuevo campo
        } = req.body;
        const query = `
            INSERT INTO assets
            (
                name, 
                serial_number,
                status,
                value,
                purchase_date,
                category_id,
                user_id,
                image_url,
                image_public_id
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )
            RETURNING *
        `;
        const values = [
            name,
            serial_number,
            status,
            value,
            purchase_date,
            category_id,
            userId,
            image_url || null,
            image_public_id || null
        ]
        const response = await pool.query(query, values);
        const data = response.rows[0];
        console.log(data);

        res.status(200)
            .json({
                message: '',
                data
            });
    } catch (err) {
        next(err);
    }
});

assets.get('/dashboard-stats', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
        const query = `
            SELECT
            -- 1. Agregados básicos
                COALESCE(SUM(value), 0) AS total_value,
                COUNT(*) AS asset_count,
    
                -- 2. Conteo de categorías únicas
                COUNT(DISTINCT category_id) AS category_count,
    
                 -- 3. Activo más caro (usando una subconsulta limitada a 1)
                (
                    SELECT name 
                    FROM assets 
                    WHERE user_id = $1 
                    ORDER BY value DESC 
                    LIMIT 1
                ) AS top_asset_name
            FROM 
                assets
            WHERE 
                user_id = $1;
        `;
        const result = await pool.query(query, [userId]);
        const stats = result.rows[0];
        res.json({
            total_value: parseFloat(stats.total_value),
            asset_count: parseInt(stats.asset_count),
            category_count: parseInt(stats.category_count),
            top_asset_name: stats.top_asset_name || 'N/A'
        });

    } catch (err) {
        next(err);
    }
});

assets.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        // 1. Verificación de seguridad (Type Guard)
        // Gracias al declare global, TS ya sabe que req.file existe
        if (!req.file) {
            return res.status(400).json({ message: "No se proporcionó imagen" });
        }

        // 2. Convertir el buffer a Base64
        // req.file.buffer contiene los datos binarios en RAM
        const fileBase64 = req.file.buffer.toString('base64');
        
        // CORRECCIÓN: El mimetype sale de req.file, no de la variable fileBase64
        const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        // 3. Subir a Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'assets-manager',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

        // 4. Respuesta al Frontend
        res.status(200).json({
            success: true,
            url: result.secure_url, // Esta es la URL que guardarás en Postgres
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Cloudinary Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al subir la imagen a la nube" 
        });
    }
});

