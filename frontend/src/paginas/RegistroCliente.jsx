// RegistroCliente.jsx - Versión Corregida
import "../assets/registrarPaciente/styles/style.css";
import { useState } from "react";
import logo from "../assets/registrarPaciente/images/logo.png";
import Swal from "sweetalert2";
import cVacios from "../assets/registrarPaciente/images/CamposVacios.png";
import registroOk from "../assets/registrarPaciente/images/pacienteRegistrado.jpg";
import usePacientes from "../hooks/usePacientes";
import { Link } from "react-router-dom";

const RegistroCliente = () => {
  const [active, setActive] = useState(1);
  const steps = 3;

  const nextStep = () => {
    const camposVacios = validarCampos(active);
    if (camposVacios.length > 0) {
      mostrarAlerta(
        "⚠️ Campos vacíos ⚠️",
        `Los siguientes campos están vacíos: ${camposVacios.join(", ")}. Por favor, completa todos los campos antes de continuar.`,
        cVacios,
        "Gato observándote porque hay campos vacíos"
      );
    } else {
      setActive((prev) => (prev < steps ? prev + 1 : steps));
    }
  };

  const prevStep = () => {
    setActive((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const [nombreMascota, setNombreMascota] = useState("");
  const [propietario, setPropietario] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cPostal, setcPostal] = useState("");
  const [colonia, setColonia] = useState("");
  const [telefonoCasa, setTelefonoCasa] = useState("");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [peso, setPeso] = useState("");
  const [edad, setEdad] = useState("");
  const [especie, setEspecie] = useState("");
  const [sexo, setSexo] = useState("");
  const [vacunas, setVacunas] = useState("");
  const [operado, setOperado] = useState("");
  const [estado, setEstado] = useState("");
  const [consentimiento, setConsentimiento] = useState(false);

  const { guardarPaciente } = usePacientes();

  const handleCodigoPostalChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setcPostal(value);
    }
  };

  const mostrarAlerta = (titulo, texto, rutaImg, altImg) => {
    Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg,
    });
  };

  const validarCampos = (paso) => {
    let camposVacios = [];
    switch(paso) {
      case 1:
        if (!propietario) camposVacios.push("Nombre del propietario");
        if (!direccion) camposVacios.push("Domicilio");
        if (!estado) camposVacios.push("Estado");
        if (!cPostal) camposVacios.push("Código Postal");
        if (!colonia) camposVacios.push("Colonia");
        break;
      case 2:
        if (!celular) camposVacios.push("Celular");
        if (!email) camposVacios.push("Correo electrónico");
        break;
      case 3:
        if (!nombreMascota) camposVacios.push("Nombre de la mascota");
        if (!especie) camposVacios.push("Especie");
        if (!raza) camposVacios.push("Raza");
        if (!peso) camposVacios.push("Peso");
        if (!consentimiento) camposVacios.push("Consentimiento");
        break;
    }
    return camposVacios;
  };

  // ✅ CORRECCIÓN PRINCIPAL: Mapear datos correctamente para el backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const camposVacios = validarCampos(3);
    if (camposVacios.length > 0) {
      mostrarAlerta(
        "⚠️ Campos vacíos ⚠️",
        `Los siguientes campos están vacíos: ${camposVacios.join(", ")}. Por favor, completa todos los campos antes de registrar al paciente.`,
        cVacios,
        "Gato observándote porque hay campos vacíos"
      );
      return;
    }

    try {
      // ✅ Separar nombre y apellidos del propietario
      const nombreCompleto = propietario.trim().split(' ');
      const nombre_propietario = nombreCompleto[0] || '';
      const apellidos_propietario = nombreCompleto.slice(1).join(' ') || '';

      // ✅ Mapear datos según estructura esperada por el backend
      const pacienteData = {
        // Datos del propietario (nombres de campos correctos)
        nombre_propietario,
        apellidos_propietario,
        email: email.trim(),
        telefono: celular.replace(/\D/g, ''), // Solo números
        tipo_telefono: 'celular',
        
        // Datos de dirección
        calle: direccion.trim(),
        numero_ext: '1', // Valor por defecto
        numero_int: '',
        codigo_postal: cPostal,
        colonia: colonia.trim(),
        id_municipio: 1, // Por defecto - debería configurarse según el estado
        referencias: '',
        
        // Datos del paciente/mascota
        nombre_mascota: nombreMascota.trim(),
        fecha_nacimiento: fechaNacimiento || null,
        peso: parseFloat(peso) || 0,
        id_raza: getIdRaza(raza, especie), // Función auxiliar para mapear raza
        foto_url: null
      };

      console.log('Datos a enviar:', pacienteData); // Para debugging

      await guardarPaciente(pacienteData);
      
      mostrarAlerta(
        "🎉 Registro exitoso 🎉",
        "El paciente ha sido registrado correctamente",
        registroOk,
        "Registro exitoso"
      );

      // Limpiar formulario
      limpiarFormulario();
      setActive(1);

    } catch (error) {
      console.error('Error en registro:', error);
      mostrarAlerta(
        "❌ Error en el registro ❌",
        "Hubo un problema al registrar el paciente. Por favor, inténtalo de nuevo.",
        cVacios,
        "Error en el registro"
      );
    }
  };

  // ✅ Función auxiliar para mapear raza a ID
  const getIdRaza = (razaNombre, especieNombre) => {
    // Mapeo básico - deberías obtener esto de una API
    const razasMap = {
      'perro': {
        'mestizo': 1,
        'labrador': 2,
        'golden retriever': 3,
      },
      'gato': {
        'mestizo': 4,
        'siamés': 5,
      },
      'otro': {
        'otro': 6,
      }
    };
    
    const especieLower = especieNombre?.toLowerCase() || 'perro';
    const razaLower = razaNombre?.toLowerCase() || 'mestizo';
    
    return razasMap[especieLower]?.[razaLower] || 1;
  };

  const limpiarFormulario = () => {
    setNombreMascota("");
    setPropietario("");
    setEmail("");
    setCelular("");
    setFechaNacimiento("");
    setDireccion("");
    setcPostal("");
    setColonia("");
    setTelefonoCasa("");
    setRaza("");
    setPeso("");
    setEdad("");
    setColor("");
    setEspecie("");
    setSexo("");
    setOperado("");
    setVacunas("");
    setEstado("");
    setConsentimiento(false);
  };

  const handleConsentimientoChange = (e) => {
    setConsentimiento(e.target.checked);
  };

  return (
    <div className="background-page">
      <div className="registro-cliente">
        <div className="contenedor">
          <div className="form-box glassmorphism">
            <div className="progreso glassmorphism">
              <div className="logo-registro">
                <img src={logo} alt="Logo" className="logo-reg" />
              </div>
              <ul className="progress-steps">
                <li className={`step ${active === 1 ? "active" : ""}`}>
                  <span>1</span>
                  <p>Cliente <br /><span className="desc">25 secs to complete</span></p>
                </li>
                <li className={`step ${active === 2 ? "active" : ""}`}>
                  <span>2</span>
                  <p>Continuación <br /><span className="desc">60 secs to complete</span></p>
                </li>
                <li className={`step ${active === 3 ? "active" : ""}`}>
                  <span>3</span>
                  <p>Mascota <br /><span className="desc">30 secs to complete</span></p>
                </li>
              </ul>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Paso 1 - Información del cliente */}
              <div className={`form-one form-step ${active === 1 ? "active" : "form-step-hidden"}`}>
                <div className="bg-svg"></div>
                <h2 className="subtitulos">Información del cliente</h2>
                <p>Ingrese la información personal del cliente</p>
                <div>
                  <label htmlFor="propietario">Nombre completo del propietario</label>
                  <input
                    id="propietario"
                    type="text"
                    className="form-input"
                    placeholder="Nombre y apellidos completos"
                    value={propietario}
                    onChange={(e) => setPropietario(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Domicilio</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Calle y número"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Estado</label>
                  <select
                    name="estado"
                    className="form-input select-color-text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    <option value="">Selecciona el estado</option>
                   <option value="Aguascalientes">Aguascalientes</option>
                    <option value="Baja California">Baja California</option>
                    <option value="Baja California Sur">
                      Baja California Sur
                    </option>
                    <option value="Campeche">Campeche</option>
                    <option value="Chiapas">Chiapas</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Ciudad de México">Ciudad de México</option>
                    <option value="Coahuila">Coahuila</option>
                    <option value="Colima">Colima</option>
                    <option value="Durango">Durango</option>
                    <option value="Estado de México">Estado de México</option>
                    <option value="Guanajuato">Guanajuato</option>
                    <option value="Guerrero">Guerrero</option>
                    <option value="Hidalgo">Hidalgo</option>
                    <option value="Jalisco">Jalisco</option>
                    <option value="Michoacán">Michoacán</option>
                    <option value="Morelos">Morelos</option>
                    <option value="Nayarit">Nayarit</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Oaxaca">Oaxaca</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Querétaro">Querétaro</option>
                    <option value="Quintana Roo">Quintana Roo</option>
                    <option value="San Luis Potosí">San Luis Potosí</option>
                    <option value="Sinaloa">Sinaloa</option>
                    <option value="Sonora">Sonora</option>
                    <option value="Tabasco">Tabasco</option>
                    <option value="Tamaulipas">Tamaulipas</option>
                    <option value="Tlaxcala">Tlaxcala</option>
                    <option value="Veracruz">Veracruz</option>
                    <option value="Yucatán">Yucatán</option>
                    <option value="Zacatecas">Zacatecas</option>
                  </select>
                </div>
                <div>
                  <label>Código Postal</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="5 dígitos"
                    value={cPostal}
                    onChange={handleCodigoPostalChange}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label>Colonia</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nombre de la colonia"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Paso 2 - Contacto */}
              <div className={`form-two form-step ${active === 2 ? "active" : "form-step-hidden"}`}>
                <div className="bg-svg"></div>
                <h2 className="subtitulos">Información de contacto</h2>
                <p>Datos para comunicarnos contigo</p>
                <div>
                  <label>Celular (obligatorio)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10 dígitos sin espacios"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label>Teléfono Casa (opcional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Número de casa (opcional)"
                    value={telefonoCasa}
                    onChange={(e) => setTelefonoCasa(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Paso 3 - Datos de la mascota */}
              <div className={`form-three form-step ${active === 3 ? "active" : "form-step-hidden"}`}>
                <div className="bg-svg"></div>
                <h2 className="subtitulos">Datos de la mascota</h2>
                <div>
                  <label htmlFor="mascota">Nombre de la mascota</label>
                  <input
                    id="mascota"
                    type="text"
                    className="form-input"
                    placeholder="Nombre de la mascota"
                    value={nombreMascota}
                    onChange={(e) => setNombreMascota(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Especie</label>
                  <select
                    name="especie"
                    className="form-input select-color-text"
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    required
                  >
                    <option value="">Selecciona la especie</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label>Raza</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Raza de la mascota"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Peso en Kg</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Peso en kilogramos"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    step="0.1"
                    min="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento (opcional)</label>
                  <input
                    id="fechaNacimiento"
                    type="date"
                    className="form-input"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                </div>
                <div>
                  <label>Sexo</label>
                  <select
                    name="sexo"
                    className="form-input select-color-text"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="">Selecciona el sexo</option>
                    <option value="hembra">Hembra</option>
                    <option value="macho">Macho</option>
                  </select>
                </div>
                <div>
                  <label>Color (opcional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Color de la mascota"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div>
                  <label>¿Cuenta con todas las vacunas?</label>
                  <select
                    name="vacunas"
                    value={vacunas}
                    onChange={(e) => setVacunas(e.target.value)}
                    className="form-input select-color-text"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label>¿Ha sido operado?</label>
                  <select
                    name="operado"
                    className="form-input select-color-text"
                    value={operado}
                    onChange={(e) => setOperado(e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    id="consentimiento"
                    checked={consentimiento}
                    onChange={handleConsentimientoChange}
                    required
                  />
                  <label htmlFor="consentimiento">
                    Estoy de acuerdo con la recopilación de información mía y de mi mascota
                  </label>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="btn-group">
                {active === 1 && (
                  <Link to="/admin" className="btn-prev app">
                    Home
                  </Link>
                )}

                {(active === 2 || active === 3) && (
                  <button type="button" className="btn-prev" onClick={prevStep}>
                    Regresar
                  </button>
                )}

                {active < steps && (
                  <button type="button" className="btn-next" onClick={nextStep}>
                    Siguiente
                  </button>
                )}

                {active === steps && (
                  <button type="submit" className="btn-submit">
                    Registrar paciente
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;