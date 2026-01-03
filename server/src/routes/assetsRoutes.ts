import { Request, Response, Router } from 'express'
import { pool } from '../config/databaseConfig';

export const assets = Router();

assets.get('/', async (req: Request, res: Response) => {
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
        console.error(err);
        res.status(500)
            .json({
                message: err,
            });
    }
});

assets.post('/', async (req: Request, res: Response) => {
    try {
        const {
            name,
            serial_number,
            status,
            value,
            purchase_date,
            category_id,
            user_id
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
                user_id
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
            RETURNING *
        `;
        const values = [
            name,
            serial_number,
            status,
            value,
            purchase_date,
            category_id,
            user_id,
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
        console.error(err);
        res.status(500)
            .json({
                message: err,
            });
    }
});

