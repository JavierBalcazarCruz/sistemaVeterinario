//useContext podemos extraer los datos
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';


const useAuth = () =>{

    return useContext(AuthContext);
}

export default useAuth;
