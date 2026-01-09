import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Añadimos la propiedad userId como opcional
    }
  }
}