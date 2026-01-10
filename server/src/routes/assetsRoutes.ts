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

export const uploadAssetImage = async (req: Request, res: Response) => {
    try {
        // 1. Verificación de seguridad para TypeScript
        if (!req.file) {
            return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
        }

        // 2. Convertir el buffer a Base64 para enviarlo a Cloudinary
        const fileBase64 = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        // 3. Subir a Cloudinary con promesas (más moderno que callbacks)
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'assets-manager',
            transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optimización automática
        });

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Cloudinary Error:", error);
        res.status(500).json({ message: "Error al subir la imagen" });
    }
};

assets.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        // 1. Verificación de seguridad para TypeScript
        if (!req.file) {
            return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
        }

        // Hacemos un "cast" local para que TS reconozca req.file
        const multerReq = req as Request & { file: Express.Multer.File };

        if (!multerReq.file) {
            return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
        }

        // 2. Convertir el buffer a Base64 para enviarlo a Cloudinary
        const fileBase64 = multerReq.file.buffer.toString('base64');
        const dataUri = `data:${multerReq.file.mimetype};base64,${fileBase64}`; // <-- esta es la linea 157

        // 3. Subir a Cloudinary con promesas (más moderno que callbacks)
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'assets-manager',
            transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optimización automática
        });

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Cloudinary Error:", error);
        res.status(500).json({ message: "Error al subir la imagen" });
    }
});

