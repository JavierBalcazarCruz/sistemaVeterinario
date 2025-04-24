import { useState } from 'react';
import { Edit, Home, Check, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Swal from "sweetalert2";
import cVacios from "../assets/registrarPaciente/images/CamposVacios.png";
import registroOk from "../assets/registrarPaciente/images/pacienteRegistrado.jpg";
import "../assets/cambiarPassword/styles/style.css";

const CambiarPassword = () => {
  const { guardarPassword } = useAuth();
  const { auth, actualizaPassword } = useAuth();
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });
  const [editando, setEditando] = useState(false);
  const [mostrarPasswords, setMostrarPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });
  const navigate = useNavigate();

  const toggleEditar = () => {
    setEditando(!editando);
    setPasswords({ actual: '', nueva: '', confirmar: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const mostrarAlerta = (titulo, texto, rutaImg, altImg) => {
    return Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg,
    });
  };

  const validarPasswords = () => {
    if (passwords.actual === '' || passwords.nueva === '' || passwords.confirmar === '') {
      mostrarAlerta(
        "⚠️ Campos vacíos ⚠️",
        "Todos los campos son obligatorios.",
        cVacios,
        "Alerta de campos vacíos"
      );
      return false;
    }
    if (passwords.nueva.length < 6 || passwords.confirmar.length < 6 ) {
      mostrarAlerta(
        "⚠️ Contraseña muy corta ⚠️",
        "La nueva contraseña debe tener al menos 6 caracteres. revisa nueva contraseña o la confirmación",
        cVacios,
        "Alerta de contraseña corta"
      );
      return false;
    }
    if (passwords.nueva === passwords.actual) {
      mostrarAlerta(
        "⚠️ Contraseña igual ⚠️",
        "La nueva contraseña no puede ser igual a la actual.",
        cVacios,
        "Alerta de contraseña igual"
      );
      return false;
    }
    if (passwords.nueva !== passwords.confirmar) {
      mostrarAlerta(
        "⚠️ Contraseñas no coinciden ⚠️",
        "La nueva contraseña y su confirmación deben ser iguales.",
        cVacios,
        "Alerta de contraseñas no coincidentes"
      );
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validarPasswords()) return;
    const resultado = await guardarPassword(passwords);
    console.log(resultado)
    try {
      if (resultado.error) {
        await mostrarAlerta(
          "⚠️ Error al actualizar ⚠️",
          resultado.msg,
          cVacios,
          "Error al actualizar contraseña"
        );
        return;
      }
      setEditando(false);
      setPasswords({ actual: '', nueva: '', confirmar: '' });
      await mostrarAlerta(
        "Contraseña actualizada",
        'Su contraseña ha sido actualizada correctamente.',
        registroOk,
        "Contraseña actualizada exitosamente"
      );
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      await mostrarAlerta(
        "⚠️ Error inesperado ⚠️",
        "Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.",
        cVacios,
        "Error inesperado al actualizar contraseña"
      );
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setPasswords({ actual: '', nueva: '', confirmar: '' });
  };

  const toggleMostrarPassword = (campo) => {
    setMostrarPasswords(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

 
  return (
    <div className="cambiar-password-container">
      <div className="password-card">
        <div className="iconos-superiores">
          <Home 
            className="icono-home" 
            size={24} 
            onClick={() => navigate('/admin')}
          />
          <Edit 
            className="icono-editar" 
            size={24} 
            onClick={toggleEditar}
          />
        </div>
        <h1>Modificar Password</h1>
        <div className="avatar">
          <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${auth.nombre}`} alt="Avatar" />
        </div>
        <p className={`instrucciones ${editando ? 'oculto' : ''}`}>
          Haga clic en el ícono de edición para cambiar su contraseña.
        </p>
        <div className={`formulario-edicion ${editando ? 'visible' : ''}`}>       
          {['actual', 'nueva', 'confirmar'].map((campo) => (
            <div key={campo} className="campo-password">
              <label>{campo === 'actual' ? 'Contraseña Actual' : campo === 'nueva' ? 'Nueva Contraseña' : 'Confirmar Nueva Contraseña'}</label>
              <div className="input-password">
                <input
                  type={mostrarPasswords[campo] ? 'text' : 'password'}
                  name={campo}
                  value={passwords[campo]}
                  onChange={handleChange}
                  className="input-edicion"
                />
                {mostrarPasswords[campo] ? (
                  <EyeOff size={20} onClick={() => toggleMostrarPassword(campo)} />
                ) : (
                  <Eye size={20} onClick={() => toggleMostrarPassword(campo)} />
                )}
              </div>
            </div>
          ))}
          <div className="botones-accion">
            <button onClick={handleGuardar} className="btn-accion btn-guardar">
              <Check size={18} />
              <span>Guardar</span>
            </button>
            <button onClick={handleCancelar} className="btn-accion btn-cancelar">
              <X size={18} />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambiarPassword;
