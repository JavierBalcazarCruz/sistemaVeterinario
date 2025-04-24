import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RutaProtegida = () => {
  const {auth, cargando} = useAuth(); 

  if(cargando){
     {/*Se podria poner un spninner para que el usuario vea que esta cargando el usuario (pendiente), entra siempre como false */}
    return 'cargando...'
  }

  return (
    <>
      {/*tiene algo muestra el outlet, de caso contrario mandalo al navigate, a iniciar sesión */}
      {/*En caso de que exista el id del usuario (Este autenticado), entonces muestra el outlet(el contenido de cada uno de los componentes que se encuentran mapeados en aapp.jsx), de caso contrario llevalo a iniciar sesión, esta parte que se valida   {auth?._id ?  depende del veterinario controler que retornara el perfil del usuario  autenticado */}

      {auth?.id ? <Outlet/> : <Navigate to="/"/>}

    </>
  )
}

export default RutaProtegida