//useContext podemos extraer los datos
import { useContext } from 'react';
import PacientesContext from '../context/PacientesProvider';

//Todo lo que este disponible en pacientesProvider se puede extraer por medio del custom hook y este hook se importa en RegistroCliente.jsx
const usePacientes = () =>{

    return useContext(PacientesContext);
}

export default usePacientes;
