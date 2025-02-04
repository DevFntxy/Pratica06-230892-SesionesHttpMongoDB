// Importaciones necesarias
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importación de rutas
import sessionRoutes from './routes/sessionRoutes.js';

// Configuración de variables de entorno
const app = express();
const PORT = process.env.PORT || 3500;

// Configuración de middleware
app.use(cors({
    origin: ['http://localhost:3500', 'http://localhost:192.168.27.55'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'p4-DSC#XUGABOX-controldesesiones',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 },
}));

// Rutas
app.use('/api/sessions', sessionRoutes);

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
