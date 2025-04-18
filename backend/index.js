import express from "express";
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
conectarDB();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
//Cuando visitemos esa url, va llamar ese routing de veterinarios
app.use("/api/veterinarios", veterinarioRoutes);

//Cuando visitemos esa url, va llamar ese routing de pacientes
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});



