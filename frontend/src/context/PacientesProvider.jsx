// PacientesProvider.jsx - Versión Corregida
import { createContext, useState, useEffect } from "react";
import clienteAxios from '../config/axios';
import useAuth from "../hooks/useAuth";

const PacientesContext = createContext();

export const PacientesProvider = ({children}) => {
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const { auth } = useAuth();

    // Obtener pacientes cuando carga el componente
    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('apv_token');
                if (!token) return;
                
                setCargando(true);
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                };
                
                const { data } = await clienteAxios.get('/pacientes', config);
                setPacientes(data);
                
            } catch (error) {
                console.error('Error al obtener pacientes:', error);
                setPacientes([]);
            } finally {
                setCargando(false);
            }
        };

        if (auth?.id) {
            obtenerPacientes();
        }
    }, [auth]);

    // ✅ CORRECCIÓN PRINCIPAL: Función guardarPaciente corregida
    const guardarPaciente = async (paciente) => {
        const token = localStorage.getItem('apv_token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        setCargando(true);

        try {
            // ✅ Verificar si es actualización o creación por la presencia del campo 'id'
            if (paciente.id) {
                // ACTUALIZACIÓN - paciente existente
                console.log('Actualizando paciente con ID:', paciente.id);
                
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);
                
                // Actualizar el estado local
                const pacientesActualizados = pacientes.map(p => 
                    p.id === data.id ? data : p
                );
                setPacientes(pacientesActualizados);

                // Actualizar paciente seleccionado si coincide
                if (pacienteSeleccionado && pacienteSeleccionado.id === data.id) {
                    setPacienteSeleccionado(data);
                }

                return { success: true, data, msg: 'Paciente actualizado correctamente' };

            } else {
                // CREACIÓN - nuevo paciente
                console.log('Creando nuevo paciente:', paciente);
                
                const { data } = await clienteAxios.post('/pacientes', paciente, config);
                
                // ✅ Agregar al inicio del array para que aparezca primero
                setPacientes(prevPacientes => [data, ...prevPacientes]);

                return { success: true, data, msg: 'Paciente registrado correctamente' };
            }

        } catch (error) {
            console.error('Error en guardarPaciente:', error);
            
            // Manejar diferentes tipos de errores
            let mensajeError = 'Error desconocido';
            
            if (error.response?.data?.msg) {
                mensajeError = error.response.data.msg;
            } else if (error.response?.status === 400) {
                mensajeError = 'Datos incorrectos. Revisa la información ingresada.';
            } else if (error.response?.status === 401) {
                mensajeError = 'No tienes autorización. Inicia sesión nuevamente.';
            } else if (error.response?.status >= 500) {
                mensajeError = 'Error del servidor. Inténtalo más tarde.';
            } else if (error.message) {
                mensajeError = error.message;
            }

            throw new Error(mensajeError);
            
        } finally {
            setCargando(false);
        }
    };

    // ✅ Función mejorada para eliminar pacientes
    const eliminarPacientes = async (id) => {
        if (!id) {
            throw new Error('ID de paciente requerido');
        }

        const token = localStorage.getItem('apv_token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        setCargando(true);

        try {
            await clienteAxios.delete(`/pacientes/${id}`, config);
            
            // Actualizar estado local
            const pacientesActualizados = pacientes.filter(paciente => paciente.id !== id);
            setPacientes(pacientesActualizados);

            // Limpiar paciente seleccionado si era el eliminado
            if (pacienteSeleccionado?.id === id) {
                setPacienteSeleccionado(null);
            }

            return { success: true, msg: 'Paciente eliminado correctamente' };

        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            
            let mensajeError = 'Error al eliminar el paciente';
            if (error.response?.data?.msg) {
                mensajeError = error.response.data.msg;
            }

            throw new Error(mensajeError);
            
        } finally {
            setCargando(false);
        }
    };

    // ✅ Función para refrescar la lista de pacientes
    const refrescarPacientes = async () => {
        try {
            const token = localStorage.getItem('apv_token');
            if (!token) return;

            setCargando(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await clienteAxios.get('/pacientes', config);
            setPacientes(data);

        } catch (error) {
            console.error('Error al refrescar pacientes:', error);
        } finally {
            setCargando(false);
        }
    };

    // ✅ Función para buscar un paciente específico
    const obtenerPaciente = async (id) => {
        if (!id) return null;

        const token = localStorage.getItem('apv_token');
        if (!token) return null;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        try {
            setCargando(true);
            const { data } = await clienteAxios.get(`/pacientes/${id}`, config);
            return data;

        } catch (error) {
            console.error('Error al obtener paciente:', error);
            return null;
        } finally {
            setCargando(false);
        }
    };

    // ✅ Valor del contexto con todas las funciones y estados
    const contextValue = {
        // Estados
        pacientes,
        pacienteSeleccionado,
        cargando,
        
        // Funciones de estado
        setPacienteSeleccionado,
        
        // Funciones de API
        guardarPaciente,
        eliminarPacientes,
        refrescarPacientes,
        obtenerPaciente,

        // Utilidades
        totalPacientes: pacientes.length,
        pacientesActivos: pacientes.filter(p => p.estado === 'activo').length
    };

    return (
        <PacientesContext.Provider value={contextValue}>
            {children}
        </PacientesContext.Provider>
    );
};

export default PacientesContext;