import jwt from "jsonwebtoken";
import conectarDB from "../config/db.js";

/**
* Middleware para verificar autenticación mediante JWT
* Protege rutas y proporciona datos del usuario
*/
const checkAuth = async (req, res, next) => {
 
   let connection;
   try {
       // Extraer token del header de autorización
       const bearerToken = req.headers.authorization;
       
       // Verificar formato Bearer token
       if(!bearerToken?.startsWith('Bearer ')) {
           return res.status(403).json({ msg: 'Formato de token inválido' });
       }

       // Extraer token sin 'Bearer '
       const token = bearerToken.split(' ')[1];
       
       if (!token) {
           return res.status(403).json({ msg: 'Token no proporcionado' });
       }

       try {
           // Verificar y decodificar token
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           
           connection = await conectarDB();
           
           // Buscar usuario y verificar estado
           const [users] = await connection.execute(
               `SELECT 
                   id, 
                   nombre, 
                   apellidos, 
                   email, 
                   rol,
                   account_status,
                   id_licencia_clinica
               FROM usuarios 
               WHERE id = ? 
               AND account_status = 'active'`,
               [decoded.id]
           );

           if (!users.length) {
               return res.status(403).json({ msg: 'Usuario no encontrado o inactivo' });
           }

           // Verificar licencia activa
           const [licencia] = await connection.execute(
               `SELECT status 
               FROM licencias_clinica 
               WHERE id = ? AND status = 'activa'`,
               [users[0].id_licencia_clinica]
           );

           if (!licencia.length) {
               return res.status(403).json({ msg: 'Licencia inactiva' });
           }

           // Almacenar datos del usuario en el request
           req.usuario = users[0];
           next();

       } catch (jwtError) {
           console.log('Error JWT:', jwtError);
           return res.status(403).json({ msg: 'Token inválido o expirado' });
       }

   } catch (error) {
       console.log('Error en autenticación:', error);
       return res.status(500).json({ msg: 'Error del servidor' });
   } finally {
       if (connection) {
           try {
               await connection.end();
           } catch (error) {
               console.log('Error al cerrar conexión:', error);
           }
       }
   }
};

export default checkAuth;