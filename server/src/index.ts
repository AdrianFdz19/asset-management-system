import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { assets } from './routes/assetsRoutes';
import { errorHandler } from './middleware/errorHandler';
import { categories } from './routes/categoriesRoutes';

const app: Application = express();
 
const PORT = process.env.PORT || 4000;

// Midlewares

const whiteList = ['http://localhost:5173', 'https://assets-system-manager-app.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Si el origen está en la lista o es undefined (ej. Postman)
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS: Origen no permitido'));
    }
  }
}));

app.use(express.json());

// Rutas
app.use('/assets', assets);
app.use('/categories', categories);

// Ruta de prueba
app.get('/', ( req: Request, res: Response ) => {
    res.send('Asset Manager API con Typescript funcionando 🚀');
});

// Test client conection
app.get('/ping', (req: Request, res: Response) => {
    res.status(200)
        .json({ message: 'pong' });
}); 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});

app.use(errorHandler);
