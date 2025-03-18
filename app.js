import express from 'express';
import sessionRoutes from './src/routes/sessionsRoutes.js';
import mongoose from 'mongoose';
import os from 'os';
import "./database.js"
import cors from "cors"
const app = express();
const PORT = 3500;



// Obtener información del servidor
const getServerNetworkInfo = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return { ip: iface.address, mac: iface.mac };
            }
        }
    }
};


app.use(cors({
    origin: '*', // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

const { ip, mac } = getServerNetworkInfo();
app.locals.serverIP = ip;
app.locals.serverMac = mac;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/apiSesni', sessionRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
