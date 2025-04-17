import express from "express";
const router = express.Router();

import{
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    reenviarVerificacion
}from '../controllers/veterinarioController.js';

import checkAuth from '../middleware/authMiddleware.js';

/**************************Inicio de Area pública******************************/
/*Registrar doctor*/
router.post("/",registrar);

/*Confirmar Cuenta*/
router.get('/confirmar/:token', confirmar);

/*Autenticar Cuenta*/
router.post("/login",autenticar);

/* Reenviar correo de verificación */
router.post("/reenviar-verificacion", reenviarVerificacion);

/*****************************Fin de Area pública******************************/

/**************************Inicio de Area privada******************************/
/*Perfil del doctor*/
router.get('/perfil',checkAuth, perfil);

/*Olvide mi password se valida el email que sea valido*/
router.post('/olvide-password',olvidePassword);
/*Comprobar token de olvide mi password, se lee el token generado*/
router.get('/olvide-password/:token',comprobarToken);
/*Se almacena el nuevo password*/
router.post('/olvide-password/:token',nuevoPassword); 
/*****************************Fin de Area privada******************************/


export default router;