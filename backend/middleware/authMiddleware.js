// authMiddleware.js - Versión Corregida
import jwt from "jsonwebtoken";
import conectarDB from "../config/db.js";

/**
 * ✅ MIDDLEWARE CORREGIDO: Verificar autenticación mediante JWT
 * Protege rutas y proporciona datos del usuario
 */
const checkAuth = async (req, res, next) => {
    let connection;
    try {
        // ✅ Extraer token del header de autorización
        const bearerToken = req.headers.authorization;
        
        // ✅ Verificar formato Bearer token
        if (!bearerToken?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                msg: 'Token no proporcionado o formato inválido. Use: Bearer <token>' 
            });
        }

        // ✅ Extraer token sin 'Bearer '
        const token = bearerToken.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ msg: 'Token vacío' });
        }

        try {
            // ✅ Verificar y decodificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded.id) {
                return res.status(401).json({ msg: 'Token inválido: falta ID de usuario' });
            }
            
            connection = await conectarDB();
            
            // ✅ Buscar usuario y verificar estado con licencia
            const [users] = await connection.execute(
                `SELECT 
                    u.id, 
                    u.nombre, 
                    u.apellidos, 
                    u.email, 
                    u.rol,
                    u.account_status,
                    u.id_licencia_clinica,
                    lc.status as licencia_status,
                    lc.nombre_clinica
                FROM usuarios u
                INNER JOIN licencias_clinica lc ON u.id_licencia_clinica = lc.id
                WHERE u.id = ?`,
                [decoded.id]
            );

            if (!users.length) {
                return res.status(401).json({ msg: 'Usuario no encontrado' });
            }

            const usuario = users[0];

            // ✅ Verificar estado de la cuenta del usuario
            if (usuario.account_status !== 'active') {
                let mensaje = 'Cuenta inactiva';
                switch(usuario.account_status) {
                    case 'pending':
                        mensaje = 'Cuenta pendiente de verificación. Revisa tu email.';
                        break;
                    case 'suspended':
                        mensaje = 'Cuenta suspendida. Contacta al administrador.';
                        break;
                }
                return res.status(403).json({ msg: mensaje });
            }

            // ✅ Verificar estado de la licencia
            if (!['activa', 'free'].includes(usuario.licencia_status)) {
                let mensaje = 'Licencia inactiva';
                switch(usuario.licencia_status) {
                    case 'suspendida':
                        mensaje = 'Licencia suspendida. Contacta al administrador.';
                        break;
                    case 'cancelada':
                        mensaje = 'Licencia cancelada. Renueva tu suscripción.';
                        break;
                }
                return res.status(403).json({ msg: mensaje });
            }

            // ✅ Almacenar datos del usuario en el request (sin datos sensibles)
            req.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol,
                id_licencia_clinica: usuario.id_licencia_clinica,
                nombre_clinica: usuario.nombre_clinica
            };

            // ✅ Continuar con la siguiente función
            next();

        } catch (jwtError) {
            console.error('Error JWT:', jwtError.message);
            
            let mensajeError = 'Token inválido';
            if (jwtError.name === 'TokenExpiredError') {
                mensajeError = 'Token expirado. Inicia sesión nuevamente.';
            } else if (jwtError.name === 'JsonWebTokenError') {
                mensajeError = 'Token malformado o inválido.';
            }
            
            return res.status(401).json({ msg: mensajeError });
        }

    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(500).json({ 
            msg: 'Error interno del servidor en autenticación' 
        });
    } finally {
        // ✅ Cerrar conexión de manera segura
        if (connection) {
            try {
                await connection.end();
            } catch (closeError) {
                console.error('Error al cerrar conexión en middleware:', closeError);
            }
        }
    }
};

export default checkAuth;