import axios from "axios";

//Recibe todas las peticiones o el dominio principal donde se realizan las peticiones
const clienteAxios = axios.create({
    baseURL : `${import.meta.env.VITE_BACKEND_URL}/api`
});

export default clienteAxios;