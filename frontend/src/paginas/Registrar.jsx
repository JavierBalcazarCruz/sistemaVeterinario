import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../config/axios';
import '../assets/registrar/styles/style.css';
import logImg from '../assets/login/images/log.svg';
import cVacios from '../assets/registrar/images/CamposVacios.jpg';
import cdif from '../assets/registrar/images/diferentesPass.jpg';
import cPeque from '../assets/registrar/images/password-peque.jpg';
import uRepetido from '../assets/registrar/images/usuarioRepetido.jpg';
import rExistoso from '../assets/registrar/images/registroE.png';

const Registrar = () => {
  const navigate = useNavigate();
  const [signUpMode, setSignUpMode] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [rol, setRol] = useState('doctor');

  const mostrarAlerta = (titulo, texto, rutaImg, altImg) => {
    Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if ([nombre, apellidos, email, password, repetirPassword].includes('')) {
      mostrarAlerta("⚠️ Los campos se encuentran vacios ⚠️", "Alguno de los campos se encuentran vacios revisa la información que  ingresaste.", cVacios, "Perrito triste por que no  hay campos llenos");
      return;
    }
    if (password !== repetirPassword) {
      mostrarAlerta("⚠️ Las contraseñas no son iguales ⚠️", "Revisa la información que  ingresaste.", cdif, "Perritos diferentes");
      return;
    }
    if (password.length < 6) {
      mostrarAlerta("⚠️ La contraseña es pequeña  ⚠️", "Agrega un minimo 6 caracteres", cPeque, "Perrito  pequeño");
      return;
    }

    try {
      const respuesta = await clienteAxios.post('/veterinarios', {
        nombre,
        apellidos,
        email,
        password,
        rol
      });
      console.log(respuesta)
      mostrarAlerta("Registrado correctamente", "Revisa tu email y confirma tu registro.", rExistoso, "Perrito sonriendo");
    } catch (error) {
      mostrarAlerta("Error al registrarse", error.response.data.msg, uRepetido, "GatoConPan");
    }
  }

  useEffect(() => {
    setSignUpMode(true);
  }, []);

  const handleSignInClick = () => {
    setSignUpMode(false);
    setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  return (
    <div className={`container ${signUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <h2 className="title">Inicia sesión</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Contraseña" autoComplete="current-password" />
            </div>
            <input type="submit" value="Iniciar  Sesión" className="btn solid" />
          </form>

          <form onSubmit={handleSubmit} className="sign-up-form form-scrollable">
            <h2 className="title">Registrate</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Repite tu Contraseña" value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} />
            </div>
            <div className="input-field select-field">
              <i className="fas fa-user-tag"></i>
              <select value={rol} onChange={e => setRol(e.target.value)} className="select-rol">
                <option value="doctor">Doctor</option>
                <option value="admin">Administrador</option>
                <option value="recepcion">Recepción</option>
              </select>
            </div>
           
            <input type="submit" className="btn" value="Crear Cuenta" />
          </form>
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
            <h3>¿Ya tienes cuenta?</h3>
            <p>Inicia sesión y comienza a administrar tus veterinaria</p>
            <br></br>
            <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
              Iniciar sesión
            </button>
          </div>
          <img src={logImg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Registrar;