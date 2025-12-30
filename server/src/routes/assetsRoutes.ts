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

