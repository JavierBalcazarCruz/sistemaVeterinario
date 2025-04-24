import { Link,useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../assets/nuevo-Password/styles/style.css'; // Importa los estilos CSS
import logImg from '../assets/nuevo-Password/images/olvidar-password.svg';
import passwordImg from '../assets/nuevo-Password/images/CampoVacio.png';
import cPeque from '../assets/nuevo-Password/images/password-peque.jpg';
import cPass from '../assets/nuevo-Password/images/cambioPassword.png';
import NoExisteUsuarioImg from '../assets/nuevo-Password/images/NoExisteUsuario.jpg';

import clienteAxios from '../config/axios';
import Swal from 'sweetalert2';

export const NuevoPassword = () => {
    console.log('Olvide pass');
    const navigate = useNavigate();
    const [signUpMode, setSignUpMode] = useState(false);
    const [password, setPassword] = useState('');
    const [tokenValido, setTokenValido] = useState(false);
    
    //Se recupera el token de la url con params
    const params = useParams();
    const { token } = params;    

    const mostrarAlerta = (titulo,texto,rutaImg,altImg) =>{
      Swal.fire({
        title: titulo,
        text: texto,
        imageUrl: rutaImg,        
        imageAlt: altImg
      });
    }
  
    useEffect(() => {
        const comprobarToken = async () =>{
            try {
                console.log('es true');
                //Peticion get para validar si existe el token
                await clienteAxios(`/veterinarios/olvide-password/${token}`);
                //En caso de que el token sea valido, se muestra el formulario
                setTokenValido(true);
               return;
            } catch (error) {
                mostrarAlerta("❌ Hubo un error con el enlace ❌", 'Intenelo nuevamente, si continua el error restableza su contraseña nuevamente', NoExisteUsuarioImg, "2 perros que con letrero no permiten perros");    
                setTokenValido(false);
            }
            
        }

        setSignUpMode(true);
        comprobarToken();
      //return () => {};
    }, [token, tokenValido]);
  
    const handleSignInClick = () => {
      // Evitar el comportamiento predeterminado del enlace 
       setSignUpMode(false);
       setTimeout(() => {
         navigate('/'); // Navegar a la ruta principal sin refresh
       }, 1800); // Espera a que termine la animación antes de navegar   
     };

  const handleSubmit = async e =>{
        e.preventDefault();   
        if(password === ''){
            mostrarAlerta("⚠️ Campo de contraseña vacio ⚠️","El campo contraseña se encuentra vacio",passwordImg,"Perrito cafe se equivoca al entrar");      
          return;
        }
        if(password.length < 6){
            mostrarAlerta("⚠️ La contraseña es pequeña  ⚠️","Agrega un minimo 6 caracteres",cPeque,"Perrito  pequeño");     
            return; 
        }   
        try {
            const url = `/veterinarios/olvide-password/${token}`;
            const { data } =  await clienteAxios.post(url, {password});
            console.log(data)
            mostrarAlerta("Contraseña cambiada 🔒", data.msg, cPass,"Perrito feliz, con hojas verdes");
        } catch (error) { 
            mostrarAlerta("❌ Error al recuperar tu contraseña ❌", error.response.data.msg, NoExisteUsuarioImg, "2 perros que con letrero no permiten perros");    
        }    
}

  return (
    <>
    <div className={`container ${signUpMode ? 'sign-up-mode' : ''}`}>
     <div className="forms-container">
       <div className="signin-signup">    
       <form  className="sign-in-form"> 
        </form> 
            {tokenValido && (
                  <form onSubmit={handleSubmit} className="sign-up-form">
                  <h2 className="title">Nueva contraseña</h2>          
                  <div className="input-field">
                  
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Tu nueva contraseña" value={password} onChange={e => setPassword(e.target.value)}/>
                  </div>
               
                  <input type="submit" className="btn" value="Guardar" />
                </form>


            )}
       
       </div>
     </div>

     <div className="panels-container">
       <div className="panel left-panel">
         <div className="content">
           <h3>¿No tienes una cuenta?</h3>
           <p>Regístrate y comienza a administrar tu veterinaria con </p>
           <h1>MollyVet</h1>
           <br />
           <Link to="index" className="btn transparent" id="sign-up-btn">
             Regístrate
           </Link>
         </div>
         <img src={logImg} alt="2 mascotas invitandote a registrar" className="image" />
       </div>

       <div className="panel right-panel">
         <div className="content">
           <h3>Restablece tu contraseña 😉</h3>
           <p>Y no pierdas acceso a tus pacientes</p>
           <br></br>
           <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
             Iniciar sesión
           </button>
         </div>
         
         <img src={logImg} className="image" alt="" />
       </div>
     </div>
   </div>
  </>
  )
}
export default NuevoPassword;