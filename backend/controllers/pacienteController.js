// pacienteController.js
import conectarDB from '../config/db.js';
/**
 * Agrega un nuevo paciente y su propietario al sistema*/
const agregarPaciente = async (req, res) => {
    let connection;
    try {
        // 1. Extraer y validar datos del propietario
        const {
            // Datos del propietario
            nombre_propietario,
            apellidos_propietario,
            email,
            telefono,
            tipo_telefono,
            // Datos de dirección
            calle,
            numero_ext,
            numero_int,
            codigo_postal,
            colonia,
            id_municipio,
            // Datos del paciente
            nombre_mascota,
            fecha_nacimiento,
            peso,
            id_raza,
            foto_url
        } = req.body;

        // 2. Validaciones básicas
        if (!nombre_propietario?.trim() || !apellidos_propietario?.trim() || !email?.trim()) {
            return res.status(400).json({ msg: 'Datos del propietario incompletos' });
        }

        if (!nombre_mascota?.trim() || !id_raza) {
            return res.status(400).json({ msg: 'Datos del paciente incompletos' });
        }

        // 3. Limpieza de datos
        const datosLimpios = {
            propietario: {
                nombre: nombre_propietario.trim(),
                apellidos: apellidos_propietario.trim(),
                email: email.trim().toLowerCase(),
            },
            direccion: {
                calle: calle?.trim(),
                numero_ext: numero_ext?.trim(),
                numero_int: numero_int?.trim(),
                codigo_postal: codigo_postal?.trim(),
                id_municipio
            },
            paciente: {
                nombre: nombre_mascota.trim(),
                fecha_nacimiento,
                peso: parseFloat(peso),
                id_raza,
                foto_url: foto_url?.trim()
            }
        };

        // 4. Validaciones específicas
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosLimpios.propietario.email)) {
            return res.status(400).json({ msg: 'Email no válido' });
        }

        if (datosLimpios.paciente.peso && datosLimpios.paciente.peso <= 0) {
            return res.status(400).json({ msg: 'El peso debe ser mayor a 0' });
        }

        // 5. Iniciar conexión y transacción
        connection = await conectarDB();
        await connection.beginTransaction();

        try {
            // 6. Verificar que el doctor existe y está activo
            const [doctores] = await connection.execute(
                `SELECT d.id 
                 FROM doctores d
                 INNER JOIN usuarios u ON u.id = d.id_usuario
                 WHERE d.id_usuario = ? AND d.estado = 'activo'
                 AND u.account_status = 'active'`,
                [req.usuario.id]
            );

            if (doctores.length === 0) {
                throw new Error('Doctor no autorizado');
            }

            const id_doctor = doctores[0].id;

            // 7. Verificar si el propietario ya existe por número de teléfono
            if (!telefono?.trim()) {
                return res.status(400).json({ msg: 'El número de teléfono es obligatorio' });
            }

            const telefonoLimpio = telefono.trim().replace(/\D/g, ''); // Elimina caracteres no numéricos
            
            // Validar longitud del teléfono (ajusta según tu país)
            if (telefonoLimpio.length < 10) {
                return res.status(400).json({ msg: 'Número de teléfono inválido' });
            }

            // Buscar propietario por teléfono
            const [propietarios] = await connection.execute(
                `SELECT p.id, p.nombre, p.apellidos, p.email 
                 FROM propietarios p
                 INNER JOIN telefonos t ON t.id_propietario = p.id
                 WHERE t.numero = ?`,
                [telefonoLimpio]
            );

            let id_propietario;

            if (propietarios.length === 0) {
                // 8. Insertar nuevo propietario
                const [resultPropietario] = await connection.execute(
                    `INSERT INTO propietarios (nombre, apellidos, email)
                     VALUES (?, ?, ?)`,
                    [
                        datosLimpios.propietario.nombre,
                        datosLimpios.propietario.apellidos,
                        datosLimpios.propietario.email
                    ]
                );
                id_propietario = resultPropietario.insertId;

                // 9. Insertar teléfono si se proporcionó
                if (telefono?.trim()) {
                    await connection.execute(
                        `INSERT INTO telefonos (id_propietario, tipo, numero, principal)
                         VALUES (?, ?, ?, TRUE)`,
                        [id_propietario, tipo_telefono || 'celular', telefono.trim()]
                    );
                }

                // 10. Insertar dirección si se proporcionó código postal
                if (datosLimpios.direccion.codigo_postal) {
                    await connection.execute(
                        `INSERT INTO direcciones (
                            id_propietario, tipo, calle, numero_ext, 
                            numero_int, id_codigo_postal
                        ) VALUES (?, 'casa', ?, ?, ?, 
                            (SELECT id FROM codigo_postal 
                             WHERE codigo = ? AND colonia = ? 
                             AND id_municipio = ? LIMIT 1)
                        )`,
                        [
                            id_propietario,
                            datosLimpios.direccion.calle,
                            datosLimpios.direccion.numero_ext,
                            datosLimpios.direccion.numero_int,
                            datosLimpios.direccion.codigo_postal,
                            colonia,
                            datosLimpios.direccion.id_municipio
                        ]
                    );
                }
            } else {
                // El propietario existe, verificar si los datos coinciden
                const propietarioExistente = propietarios[0];
                id_propietario = propietarioExistente.id;

                // Si los datos proporcionados no coinciden con los existentes, informar
                if (propietarioExistente.nombre.toLowerCase() !== datosLimpios.propietario.nombre.toLowerCase() ||
                    propietarioExistente.apellidos.toLowerCase() !== datosLimpios.propietario.apellidos.toLowerCase()) {
                    return res.status(400).json({
                        msg: 'Ya existe un propietario registrado con este teléfono pero los datos no coinciden',
                        propietarioExistente: {
                            nombre: propietarioExistente.nombre,
                            apellidos: propietarioExistente.apellidos,
                            email: propietarioExistente.email
                        }
                    });
                }

                // Los datos coinciden, continuamos con el registro del paciente
                console.log('Usando propietario existente:', propietarioExistente.nombre);
            }

            // 11. Verificar que la raza existe y está activa
            const [razas] = await connection.execute(
                'SELECT id FROM razas WHERE id = ? AND activo = TRUE',
                [datosLimpios.paciente.id_raza]
            );

            if (razas.length === 0) {
                throw new Error('Raza no válida');
            }

            // 12. Insertar paciente
            const [resultPaciente] = await connection.execute(
                `INSERT INTO pacientes (
                    id_propietario, id_doctor, id_usuario, id_raza, 
                    nombre_mascota, fecha_nacimiento, peso, foto_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_propietario,
                    id_doctor,           // Nuevo campo
                    req.usuario.id,      // Nuevo campo
                    datosLimpios.paciente.id_raza,
                    datosLimpios.paciente.nombre,
                    datosLimpios.paciente.fecha_nacimiento,
                    datosLimpios.paciente.peso,
                    datosLimpios.paciente.foto_url
                ]
            );

            // 13. Registrar en audit_logs
            await connection.execute(
                `INSERT INTO audit_logs (
                    tabla, id_registro, id_usuario, 
                    accion, datos_nuevos
                ) VALUES ('pacientes', ?, ?, 'crear', ?)`,
                [
                    resultPaciente.insertId,
                    req.usuario.id,
                    JSON.stringify(datosLimpios)
                ]
            );

            // 14. Commit de la transacción
            await connection.commit();

            // 15. Respuesta exitosa
            res.json({
                msg: 'Paciente registrado correctamente',
                id_paciente: resultPaciente.insertId,
                id_propietario
            });

        } catch (error) {
            // 16. Rollback en caso de error
            await connection.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error en agregarPaciente:', error);
        res.status(500).json({ 
            msg: error.message || 'Error al registrar el paciente' 
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (error) {
                console.error('Error al cerrar conexión:', error);
            }
        }
    }
};
const obtenerPacientes = async (req, res) => {
    let connection;
    try {
        // Obtener conexión a la base de datos
        connection = await conectarDB();
        
        // Verificar si el usuario es un doctor o tiene otro rol
        if (req.usuario.rol === 'doctor') {
            // Si es doctor, obtener su ID de doctor
            const [doctores] = await connection.execute(
                `SELECT id FROM doctores WHERE id_usuario = ?`,
                [req.usuario.id]
            );
            
            if (doctores.length === 0) {
                return res.status(404).json({ msg: 'No se encontró el doctor asociado al usuario' });
            }
            
            const id_doctor = doctores[0].id;
            
            // Consultar pacientes asociados a este doctor
            const [pacientes] = await connection.execute(
                `SELECT p.*, r.nombre AS nombre_raza, e.nombre AS especie,
                        pr.nombre AS nombre_propietario, pr.apellidos AS apellidos_propietario
                 FROM pacientes p
                 INNER JOIN razas r ON p.id_raza = r.id
                 INNER JOIN especies e ON r.id_especie = e.id
                 INNER JOIN propietarios pr ON p.id_propietario = pr.id
                 WHERE p.id_doctor = ?
                 ORDER BY p.nombre_mascota ASC`,
                [id_doctor]
            );
            
            return res.json(pacientes);
        } else if (req.usuario.rol === 'admin' || req.usuario.rol === 'superadmin') {
            // Para admin o superadmin, mostrar todos los pacientes de la clínica
            const [pacientes] = await connection.execute(
                `SELECT p.*, r.nombre AS nombre_raza, e.nombre AS especie,
                        pr.nombre AS nombre_propietario, pr.apellidos AS apellidos_propietario,
                        CONCAT(u.nombre, ' ', u.apellidos) AS doctor
                 FROM pacientes p
                 INNER JOIN razas r ON p.id_raza = r.id
                 INNER JOIN especies e ON r.id_especie = e.id
                 INNER JOIN propietarios pr ON p.id_propietario = pr.id
                 INNER JOIN doctores d ON p.id_doctor = d.id
                 INNER JOIN usuarios u ON d.id_usuario = u.id
                 WHERE u.id_licencia_clinica = ?
                 ORDER BY p.nombre_mascota ASC`,
                [req.usuario.id_licencia_clinica]
            );
            
            return res.json(pacientes);
        } else if (req.usuario.rol === 'recepcion') {
            // Para recepción, mostrar todos los pacientes de la clínica sin filtrar por doctor
            const [pacientes] = await connection.execute(
                `SELECT p.*, r.nombre AS nombre_raza, e.nombre AS especie,
                        pr.nombre AS nombre_propietario, pr.apellidos AS apellidos_propietario,
                        CONCAT(u.nombre, ' ', u.apellidos) AS doctor
                 FROM pacientes p
                 INNER JOIN razas r ON p.id_raza = r.id
                 INNER JOIN especies e ON r.id_especie = e.id
                 INNER JOIN propietarios pr ON p.id_propietario = pr.id
                 INNER JOIN doctores d ON p.id_doctor = d.id
                 INNER JOIN usuarios u ON d.id_usuario = u.id
                 WHERE u.id_licencia_clinica = ?
                 ORDER BY p.nombre_mascota ASC`,
                [req.usuario.id_licencia_clinica]
            );
            
            return res.json(pacientes);
        }
        
        // Si llega aquí, el rol no está contemplado
        return res.status(403).json({ msg: 'Rol no autorizado para esta operación' });
        
    } catch (error) {
        console.error('Error en obtenerPacientes:', error);
        res.status(500).json({ msg: 'Error al obtener los pacientes' });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (error) {
                console.error('Error al cerrar conexión:', error);
            }
        }
    }
};

/**
 * Obtiene información detallada de un paciente específico
 * Valida que el usuario tenga permisos para ver este paciente
 */
const obtenerPaciente = async (req, res) => {
    let connection;
    try {
        // 1. Extraer ID del paciente de los parámetros
        const { id } = req.params;
        
        // 2. Validar que el ID sea un número válido
        const pacienteId = parseInt(id);
        if (isNaN(pacienteId) || pacienteId <= 0) {
            return res.status(400).json({ msg: 'ID de paciente no válido' });
        }
        
        // 3. Establecer conexión a la BD
        connection = await conectarDB();
        
        // 4. Obtener información del paciente con datos relacionados
        const [pacientes] = await connection.execute(
            `SELECT p.*, r.nombre AS nombre_raza, e.nombre AS especie,
                    pr.nombre AS nombre_propietario, pr.apellidos AS apellidos_propietario,
                    d.id AS doctor_id, u.id AS doctor_usuario_id
             FROM pacientes p
             INNER JOIN razas r ON p.id_raza = r.id
             INNER JOIN especies e ON r.id_especie = e.id
             INNER JOIN propietarios pr ON p.id_propietario = pr.id
             INNER JOIN doctores d ON p.id_doctor = d.id
             INNER JOIN usuarios u ON d.id_usuario = u.id
             WHERE p.id = ?`,
            [pacienteId]
        );
        
        // 5. Verificar si el paciente existe
        if (pacientes.length === 0) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
        }
        
        const paciente = pacientes[0];
        
        // 6. Validar permisos según el rol del usuario
        if (req.usuario.rol === 'doctor') {
            // Obtener el ID del doctor del usuario autenticado
            const [doctores] = await connection.execute(
                `SELECT id FROM doctores WHERE id_usuario = ?`,
                [req.usuario.id]
            );
            
            if (doctores.length === 0) {
                return res.status(403).json({ msg: 'Doctor no encontrado' });
            }
            
            // Verificar que el paciente pertenezca a este doctor
            if (paciente.doctor_id !== doctores[0].id) {
                return res.status(403).json({ msg: 'No tienes permiso para acceder a este paciente' });
            }
        } else if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'superadmin' && req.usuario.rol !== 'recepcion') {
            // Si no es doctor, admin, superadmin o recepción, denegar acceso
            return res.status(403).json({ msg: 'No tienes permiso para acceder a este paciente' });
        }
        
        // 7. Limpiar información sensible o interna antes de enviar
        delete paciente.doctor_id;
        delete paciente.doctor_usuario_id;
        
        // 8. Devolver la información del paciente
        res.json(paciente);
        
    } catch (error) {
        console.error('Error en obtenerPaciente:', error);
        res.status(500).json({ msg: 'Error al obtener el paciente' });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (error) {
                console.error('Error al cerrar conexión:', error);
            }
        }
    }
};

const actualizarPaciente = async (req, res) => {   
};


const eliminarPaciente = async (req, res) => {
      
};

export{
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};