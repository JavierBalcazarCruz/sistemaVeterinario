import {Link,useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState  } from 'react';
import '../assets/login/styles/style.css';
import regImg from '../assets/login/images/log.svg';
import cPeque from '../assets/login/images/password-peque.jpg';
import passwordImg from '../assets/login/images/CampoVacio.png';
import emailImg from '../assets/login/images/CampoVacio.png';
import emailCImg from '../assets/login/images/emailCorto.png';
import loginError from '../assets/login/images/loginError.png';
import loginOK from '../assets/login/images/loginOK.jpg';
import clienteAxios from '../config/axios';

import Swal from 'sweetalert2';

const ScrollToTop = () => {
    const { pathname } = useLocation();  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);  
    return null;
  };
  
const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { setAuth } = useAuth();
  const navigate =  useNavigate();

  const [signUpMode, setSignUpMode] = useState(false);

  const handleSignUpClick = () => {
      setSignUpMode(true);
  };

  const mostrarAlerta = (titulo,texto,rutaImg,altImg) =>{
    Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,        
      imageAlt: altImg
    });
  }

  const handleSubmit = async e =>{
    e.preventDefault();   
    console.log('validacion del form')
    
    if(email === ''){
      mostrarAlerta("⚠️ Campo de email vacio ⚠️","El campo email se encuentra vacio, escribe tu email e inicia sesón",emailImg,"Perrito cafe se equivoca al entrar");      
      return;
    }
    if(password === ''){
       mostrarAlerta("⚠️ Campo de contraseña vacio ⚠️","El campo contraseña se encuentra vacio",passwordImg,"Perrito cafe se equivoca al entrar");      
      return;
    }
    if(email.length < 7){
      mostrarAlerta("⚠️ Campo de email corto ⚠️","Creemos que tu email es muy corto, escribe tu email e inicia sesión",emailCImg,"Perrito cafe se equivoca al entrar");      
      return;
    } 
    if(password.length < 6){
        mostrarAlerta("⚠️ La contraseña es pequeña  ⚠️","Agrega un minimo 6 caracteres",cPeque,"Perrito  pequeño");     
        return; 
    }
    
    //Inicio de sesión
    try {
      const url = `/veterinarios/login`;
      const { data } =  await clienteAxios.post(url, {email, password});
      
      // Guarda el token
      localStorage.setItem('apv_token', data.token);
      
      // Setea la autenticación
      setAuth(data);
      
      // Redirección al administrador
      navigate('/admin');
      
    } catch (error) { 
      console.log(error.response?.data?.msg)
      mostrarAlerta("❌ Detalle al iniciar sesión ❌", 
        error.response?.data?.msg || "Error al iniciar sesión", 
        loginError, 
        "7 perros curiosos viendote");    
    }    
  }

  return(
    <>
      <ScrollToTop />
      <div className={`container ${signUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleSubmit} className="sign-in-form">
              <h2 className="title">Inicia sesión</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  autoComplete="current-password" 
                />
              </div>
              <input type="submit" value="Iniciar  Sesión" className="btn solid" />
            </form>
            
            <nav className='olvide-password'>
              <Link to="/olvide-password" className="olvide-password-link" id="">
                Olvide mi password
              </Link>
            </nav>

            <form action="#" className="sign-up-form">
              <h2 className="title">Registrate</h2>           
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Contraseña" />
              </div>
              <input type="submit" className="btn" value="Enviar" />
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>¿No tienes una cuenta?</h3>
              <p>Regístrate y comienza a administrar tu veterinaria con </p>
              <h1 className='marca'>MollyVet</h1>            
              <Link to="/registrar" className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}> 
                Regístrate
              </Link>
            </div>
            <img src={regImg} alt="2 mascotas invitandote a registrar" className="image" />          
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;