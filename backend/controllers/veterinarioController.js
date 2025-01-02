import conectarDB from '../config/db.js';

const registrar = async (req, res) => {
    const connection = await conectarDB();
    
    try {
        const { nombre, apellidos, email, password_hash, rol, id_licencia_clinica, account_status } = req.body;

        // Realizamos la inserción
        const [resultado] = await connection.execute(
            `INSERT INTO usuarios (
                nombre, 
                apellidos, 
                email, 
                password_hash, 
                rol, 
                id_licencia_clinica, 
                account_status,
                email_verified_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                nombre,
                apellidos,
                email,
                password_hash,
                rol,
                id_licencia_clinica,
                account_status
            ]
        );

        res.json({
            msg: 'Usuario registrado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.log(error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }

        res.status(500).json({ msg: 'Hubo un error al registrar el usuario' });
    } finally {
        await connection.end();
    }
};

const perfil = async (req, res) => {
    res.json("Mostrando perfil");
};

export { registrar, perfil };