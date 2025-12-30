import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 4000;

// Midlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', ( req: Request, res: Response ) => {
    res.send('Asset Manager API con Typescript funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
