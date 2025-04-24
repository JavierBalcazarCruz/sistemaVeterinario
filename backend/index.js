import express from "express";
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';  // Añade esta importación

dotenv.config();

const app = express();
conectarDB();

// Configuración de CORS
const dominiosPermitidos = [process.env.FRONTEND_URL || "http://localhost:5173"];

const corsOptions = {
    origin: function (origin, callback) {
        // En desarrollo a veces no hay origin (como en Postman)
        if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true  // Permite incluir cookies en las peticiones
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

// Escuchar en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});