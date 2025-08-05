import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const conectarDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'sisvet',
            port: process.env.DB_PORT || 3306,
            // Configuraciones válidas para MySQL2
            charset: 'utf8mb4',
            timezone: '+00:00'
        });

        await connection.connect();
        console.log(`MySQL conectado localmente en: ${connection.config.host}:${connection.config.port}`);
        console.log(`Base de datos: ${connection.config.database}`);
        
        return connection;
    } catch (error) {
        console.log(`Error de conexión: ${error.message}`);
        console.log('Verifica que MySQL esté ejecutándose y las credenciales sean correctas');
        process.exit(1);
    }
}

export default conectarDB;