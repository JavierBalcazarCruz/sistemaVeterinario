import React, { useState, useEffect } from 'react';
import { Edit, Home, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Swal from "sweetalert2";
import cVacios from "../assets/registrarPaciente/images/CamposVacios.png";
import registroOk from "../assets/registrarPaciente/images/pacienteRegistrado.jpg";
import "../assets/EditarPerfilDoc/styles/style.css";
import { Link } from "react-router-dom";

const EditarPerfilDoc = () => {
  const { auth, actualizaPerfil } = useAuth();
  const [perfil, setPerfil] = useState(auth);
  const [perfilOriginal, setPerfilOriginal] = useState(auth);
  const [editando, setEditando] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);
  const navigate = useNavigate();

  const toggleEditar = () => {
    setEditando(!editando);
    setHayCambios(false);
    if (!editando) {
      setPerfilOriginal({...perfil});
    } else {
      setPerfil({...perfilOriginal});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      // Solo permitir dígitos y limitar a 10 caracteres
      const numeroLimpio = value.replace(/\D/g, '').slice(0, 10);
      setPerfil(prev => ({ ...prev, [name]: numeroLimpio }));
    } else {
      setPerfil(prev => ({ ...prev, [name]: value }));
    }
    setHayCambios(true);
  };

  const mostrarAlerta = (titulo, texto, rutaImg, altImg) => {
    return Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg,
    });
  };

  const validarTelefono = (telefono) => {
    if (telefono === "" || telefono === null) return true; // Permitir campo vacío
    if (telefono.length > 0 && telefono.length !== 10) {
      mostrarAlerta(
        "⚠️ Número de teléfono inválido ⚠️",
        "El número de teléfono debe tener exactamente 10 dígitos o estar vacío.",
        cVacios,
        "Alerta de número de teléfono inválido"
      );
      return false;
    }
    return true;
  };

  const handleGuardarTodo = async () => {
    if (perfil.nombre === "" || perfil.email === "") {
      await mostrarAlerta(
        "⚠️ Campos obligatorios vacíos ⚠️",
        "Los campos de Nombre y Email son obligatorios. Por favor, rellénalos.",
        cVacios,
        "Gato observándote porque están vacíos los campos"
      );
      return;
    }

    if (!validarTelefono(perfil.telefono)) {
      return;
    }

    const perfilParaEnviar = {
      ...perfil,
      telefono: perfil.telefono === "" ? null : perfil.telefono,
      web: perfil.web?.trim() || null
    };

    try {
      const resultado = await actualizaPerfil(perfilParaEnviar);
      if(resultado.error){
        await mostrarAlerta(
          "⚠️ Error al actualizar ⚠️",
          resultado.msg,
          cVacios,
          "Gato observándote porque hubo un error al actualizar"
        );
        setPerfil(prevPerfil => ({
          ...prevPerfil,
          email: perfilOriginal.email
        }));
        return;
      }
      setEditando(false);
      setHayCambios(false);
      setPerfilOriginal({...perfil});
      await mostrarAlerta(
        "Información actualizada",
        'Sus datos han sido actualizados correctamente.',
        registroOk,
        "Perro feliz por que actualizaste tu información"
      );
      
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      await mostrarAlerta(
        "⚠️ Error inesperado ⚠️",
        "Ocurrió un error al actualizar el perfil. Por favor, inténtalo de nuevo.",
        cVacios,
        "Gato observándote porque hubo un error inesperado"
      );
    }
  };

  const handleCancelarTodo = () => {
    setPerfil({...perfilOriginal});
    setEditando(false);
    setHayCambios(false);
  };

  const campos = [
    { nombre: 'nombre', label: 'Nombre', tipo: 'text' },
    { nombre: 'email', label: 'Email', tipo: 'email' },
    { nombre: 'telefono', label: 'Teléfono', tipo: 'tel' },
    { nombre: 'web', label: 'Sitio Web', tipo: 'url' },
  ];

  useEffect(() => {
    if (editando) {
      document.getElementById('nombre').focus();
    }
  }, [editando]);

  useEffect(() => {
    console.log("Estado de edición:", editando);
  }, [editando]);

  return (
    <div className="perfil-veterinario-container">
      <div className="perfil-card">
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
        <h1>Perfil del Veterinario</h1>
        <div className="avatar">
          <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${perfil.nombre}`} alt="Avatar" />
        </div>
        {campos.map(campo => (
          <div key={campo.nombre} className="campo-perfil">
            <label>{campo.label}</label>
            <div className={`campo-valor ${editando ? 'campo-edicion' : ''}`}>
              {editando ? (
                <input
                  id={campo.nombre}
                  type={campo.tipo}
                  name={campo.nombre}
                  value={perfil[campo.nombre] || ''}
                  onChange={handleChange}
                  className="input-edicion"
                />
              ) : (
                <span>{perfil[campo.nombre] || 'No especificado'}</span>
              )}
            </div>
          </div>
        ))}
        {!editando && (
          <div className="campo-perfil">
            <Link to="/admin/CambiarPassword" className="modificar-password-link">Modificar Password</Link>
          </div>
        )}
        {editando === true && (
          <div className="botones-accion-perfil">
            <button onClick={handleGuardarTodo} className="btn-accion-perfil btn-guardar-perfil">
              <Check size={18} />
              <span>Guardar</span>
            </button>
            <button onClick={handleCancelarTodo} className="btn-accion-perfil btn-cancelar-perfil">
              <X size={18} />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarPerfilDoc;