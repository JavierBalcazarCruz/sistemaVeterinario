import express from "express";
const router = express.Router();

import{registrar,
    perfil,
    confirmar,
    autenticar
}from '../controllers/veterinarioController.js';

import checkAuth from '../middleware/authMiddleware.js';


/*Registrar doctor*/
router.post("/",registrar);

/*Confirmar Cuenta*/
router.get('/confirmar/:token', confirmar);

/*Autenticar Cuenta*/
router.post("/login",autenticar);

/*Perfil del doctor*/
router.get('/perfil',checkAuth, perfil);
export default router;