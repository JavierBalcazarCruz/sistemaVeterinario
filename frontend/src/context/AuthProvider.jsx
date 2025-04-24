import { useState, useEffect, createContext, useMemo } from 'react';
import clienteAxios from '../config/axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('apv_token');
            if (!token){
                setCargando(false);
                return;
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            try {
                const { data } = await clienteAxios('/veterinarios/perfil', config);
                setAuth(data);
            } catch (error) {
                setAuth({});
                console.log(error.response?.data?.msg);
            }
            setCargando(false);
        };
        autenticarUsuario();
    }, []);

    const cerrarSesion = () =>{
        localStorage.removeItem('apv_token');
        setAuth({});
    }

    const actualizaPerfil = async datos =>{
        const token = localStorage.getItem('apv_token');
        if (!token) {
            setCargando(false);
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const url = `/veterinarios/perfil/${auth.id}`;
            const { data } = await clienteAxios.put(url , datos, config);
            setAuth(data);
            return{
                msg:'Almacenado correctamente'
            }
        } catch (error) {
          return{
            msg: error.response?.data?.msg,
            error:true
          }
        }       
    }

    const guardarPassword = async datos =>{
        const token = localStorage.getItem('apv_token');
        if (!token) {
            setCargando(false);
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
      
        try {
            const url = `/veterinarios/actualizar-password`;
            const { data } = await clienteAxios.put(url , datos, config);
            return{
                msg: data.msg
            }
        } catch (error) {
          return{
            msg: error.response?.data?.msg,
            error:true
          }
        }       
    }

    const authValue = useMemo(() => ({ 
        auth, 
        setAuth, 
        cargando, 
        cerrarSesion, 
        actualizaPerfil,
        guardarPassword
    }), [auth, cargando]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export default AuthContext;