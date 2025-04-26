import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, User, Plus, Stethoscope, PawPrint, Calendar, Weight , Edit, EllipsisVertical,ArrowLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../assets/datosPacientes/styles/style.css";

import usePacientes from "../hooks/usePacientes";
import Swal from "sweetalert2";
import cVacios from "../assets/registrarPaciente/images/CamposVacios.png";
import registroOk from "../assets/registrarPaciente/images/pacienteRegistrado.jpg";

const DatosPacientes = () => {
  const { pacientes, guardarPaciente, eliminarPacientes } = usePacientes();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState('');

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const nuevaFecha = new Date(fecha);
    if (isNaN(nuevaFecha.getTime())) return 'Fecha inválida';
    
    // Ajustamos la fecha para que siempre se muestre en la zona horaria local
    const fechaLocal = new Date(nuevaFecha.getTime() + nuevaFecha.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('es-MX', { 
      dateStyle: 'long',
      timeZone: 'UTC'  // Esto asegura que la fecha se interprete como UTC
    }).format(fechaLocal);
  };

  const navigate = useNavigate();
  
  useEffect(() => {
    // Transformar los datos recibidos del backend MySQL
    const contactosTransformados = pacientes.map(paciente => ({
      id: paciente.id, // Cambiar de _id a id
      nombreMascota: paciente.nombre_mascota,
      propietario: `${paciente.nombre_propietario} ${paciente.apellidos_propietario}`,
      especie: paciente.especie,
      raza: paciente.nombre_raza, // Cambio para usar nombre_raza que viene del JOIN
      fechaNacimiento: paciente.fecha_nacimiento,
      peso: paciente.peso,
      // Valores por defecto para campos que no existen en la nueva estructura
      email: '', // Será llenado más adelante
      celular: '', 
      telefonoCasa: '',
      direccion: '',
      colonia: '',
      estado: '',
      color: '', // Este campo no existe en la nueva estructura
      edad: '' // Este campo no existe en la nueva estructura
    }));
    setContacts(contactosTransformados);
  }, [pacientes]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    const handleClickOutside = (event) => {
      if (selectedContact && isMenuOpen && !document.querySelector('.contacts-list').contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, selectedContact]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    const nombreMascota = contact.nombreMascota || '';
    const propietario = contact.propietario || '';
    const raza = contact.raza || '';
    const especie = contact.especie || '';
    
    return nombreMascota.toLowerCase().includes(searchLower) ||
           propietario.toLowerCase().includes(searchLower) ||
           raza.toLowerCase().includes(searchLower) ||
           especie.toLowerCase().includes(searchLower);
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const openEditModal = (type) => {
    setEditingType(type);
    setIsEditModalOpen(true);
    setIsClosing(false);
  };

  const closeEditModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditingType(null);
      setIsClosing(false);
    }, 500);
  };

  const mostrarAlerta = (titulo, texto, rutaImg, altImg) => {
    Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg,
    });
  };

  const mostrarAlertaEliminar = (titulo, texto, rutaImg, altImg, onConfirm) => {
    Swal.fire({
      title: titulo,
      text: texto,
      imageUrl: rutaImg,
      imageAlt: altImg,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  const handleEllipsisClick = (e, contact) => {
    e.stopPropagation();
    mostrarAlertaEliminar(
      "⚠️ ¿Estás seguro de eliminar este registro? ⚠️",
      `¿Deseas eliminar el registro de ${contact.nombreMascota}?`,
      cVacios,
      "Gato observándote porque estás a punto de eliminar un registro",
      () => {
        eliminarPacientes(contact.id);
        // Actualiza el estado local después de eliminar
        setContacts(prevContacts => prevContacts.filter(c => c.id !== contact.id));
        if (selectedContact && selectedContact.id === contact.id) {
          setSelectedContact(null);
        }
        Swal.fire(
          '¡Paciente eliminado!',
          'El registro ha sido eliminado exitosamente',
          'success'
        );
      }
    );
  };

  const handleSubmit = (e, updatedData) => {
    e.preventDefault();
    const { id, propietario, celular, telefonoCasa, email, colonia, direccion, estado, fechaNacimiento, nombreMascota, peso, raza } = updatedData;
    
    // Preparar datos para enviar al backend MySQL
    const pacienteData = {
      id,
      nombre_mascota: nombreMascota,
      fecha_nacimiento: fechaNacimiento,
      peso,
      // Datos del propietario (el backend maneja la separación de nombre y apellidos)
      nombre_propietario: propietario.split(' ')[0] || '',
      apellidos_propietario: propietario.split(' ').slice(1).join(' ') || '',
      email,
      telefono: celular,
      tipo_telefono: 'celular',
      // Dirección
      calle: direccion,
      numero_ext: '', // Estos campos pueden ser agregados si es necesario
      numero_int: '',
      codigo_postal: '',
      colonia,
      id_municipio: 1 // Valor por defecto, deberías ajustarlo según tu lógica
    };

    if (!nombreMascota || !fechaNacimiento || !peso || !propietario || !celular) {
      mostrarAlerta(
        "⚠️ Los campos se encuentran vacios ⚠️",
        "Alguno de los campos requeridos se encuentran vacios revisa la información que ingresaste.",
        cVacios,
        "Gato observándote porque están vacíos los campos"
      );
      return;
    }

    guardarPaciente(pacienteData);
    mostrarAlerta(
      "🎉 Actualización exitosa 🎉",
      "La información del paciente ha sido actualizada",
      registroOk,
      "Actualización exitosa"
    );
    closeEditModal();
  };

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
    'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
    'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
    'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  const EditModal = ({ type }) => {
    const [formData, setFormData] = useState({
      id: '',
      propietario: '',
      celular: '',
      telefonoCasa: '',
      email: '',
      direccion: '',
      colonia: '',
      estado: '',
      nombreMascota: '',
      especie: '',
      fechaNacimiento: '',
      raza: '',
      peso: '',
    });

    useEffect(() => {
      if (selectedContact) {
        setFormData({
          id: selectedContact.id,
          propietario: selectedContact.propietario || '',
          celular: selectedContact.celular || '',
          telefonoCasa: selectedContact.telefonoCasa || '',
          email: selectedContact.email || '',
          direccion: selectedContact.direccion || '',
          colonia: selectedContact.colonia || '',
          estado: selectedContact.estado || '',
          nombreMascota: selectedContact.nombreMascota || '',
          especie: selectedContact.especie || '',
          fechaNacimiento: selectedContact.fechaNacimiento 
            ? new Date(new Date(selectedContact.fechaNacimiento).getTime() + new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
            : '',
          raza: selectedContact.raza || '',
          peso: selectedContact.peso || '',
        });
      }
    }, [type, selectedContact]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'celular' || name === 'telefonoCasa') {
        const numericValue = value.replace(/\D/g, '').slice(0, 10);
        setFormData(prevData => ({
          ...prevData,
          [name]: numericValue,
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          [name]: value,
        }));
      }
    };

    const handleFormSubmit = (e) => {
      const updatedData = { ...formData };
      handleSubmit(e, updatedData);
    };

    return (
      <div className={`edit-modal ${isEditModalOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
        <div className="modal-content">
          <h2>Editar {type === 'owner' ? 'Información del Dueño' : 'Información de la Mascota'}</h2>
          <form onSubmit={handleFormSubmit}>
            {type === 'owner' ? (
              <>
                <div className="input-group">
                  <label htmlFor="propietario">Nombre del dueño</label>
                  <User size={20} />
                  <input
                    id="propietario"
                    name="propietario"
                    type="text"
                    placeholder="Dueño"
                    value={formData.propietario}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="celular">Celular</label>
                  <Phone size={20} />
                  <input
                    id="celular"
                    name="celular"
                    type="tel"
                    placeholder="Celular"
                    value={formData.celular}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="telefonoCasa">Teléfono de casa</label>
                  <Phone size={20} />
                  <input
                    id="telefonoCasa"
                    name="telefonoCasa"
                    type="tel"
                    placeholder="Teléfono de casa"
                    value={formData.telefonoCasa}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <Mail size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="direccion">Domicilio</label>
                  <MapPin size={20} />
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Domicilio"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="colonia">Colonia</label>
                  <MapPin size={20} />
                  <input
                    id="colonia"
                    name="colonia"
                    type="text"
                    placeholder="Colonia"
                    value={formData.colonia}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="estado">Estado</label>
                  <MapPin size={20} />
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Selecciona un estado</option>
                    {mexicanStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label htmlFor="nombreMascota">Mascota</label>
                  <PawPrint size={20} />
                  <input
                    id="nombreMascota"
                    name="nombreMascota"
                    type="text"
                    placeholder="Nombre de la mascota"
                    value={formData.nombreMascota}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="especie">Especie</label>
                  <Stethoscope size={20} />
                  <input
                    id="especie"
                    name="especie"
                    type="text"
                    placeholder="Especie"
                    value={formData.especie}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <Calendar size={20} />
                  <input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    placeholder="Fecha de nacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="raza">Raza</label>
                  <PawPrint size={20} />
                  <input
                    id="raza"
                    name="raza"
                    type="text"
                    placeholder="Raza"
                    value={formData.raza}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="peso">Peso</label>
                  <Weight size={20} />
                  <input
                    id="peso"
                    name="peso"
                    type="number"
                    placeholder="Peso (kg)"
                    value={formData.peso}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </>
            )}
            <div className="modal-actions">
              <button type="button" onClick={closeEditModal}>Cancelar</button>
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Actualiza el contacto seleccionado si el paciente ha sido editado
    if (selectedContact) {
      const updatedContact = contacts.find(contact => contact.id === selectedContact.id);
      if (updatedContact) {
        setSelectedContact(updatedContact);
      }
    }
  }, [contacts, selectedContact]);

  return (
    <div className={`full-height-container background-cover ${isEditModalOpen ? 'blur-background' : ''}`}>
      <div className="veterinary-contacts">
        {isMobile && (
          <button className="menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X size={18} /> : <Menu size={24} />}
          </button>
        )}
        <div className={`contacts-list ${isMobile && isMenuOpen ? 'open' : ''}`}>
          <div className="contacts-header">
            <button to="/admin" className="back-button" onClick={() => navigate('/admin')}>
              <ArrowLeft size={24} />
            </button>
            <h2 className='titPacientes'>Pacientes</h2>
            <button className="add-contact" onClick={() => navigate('/admin/registro-cliente')}>
              <Plus size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Buscar paciente"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact && selectedContact.id === contact.id ? 'selected' : ''}`}
            >
              <div className="contact-content" onClick={() => selectContact(contact)}>
                <div className="contact-avatar">
                  {contact.especie.toLowerCase() === 'perro' ? (
                    <img src="https://pampermut.com/blog/wp-content/uploads/2020/05/Como-es-el-caracter-de-tu-perro-segun-su-horoscopo-scaled.jpg" alt="Perro Avatar" />
                  ) : (
                    <img src="https://s1.elespanol.com/2020/05/18/como/gatos-mascotas-trucos_490961518_152142875_1706x960.jpg" alt="Cat Avatar" />
                  )}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.nombreMascota}</div>
                  <div className="contact-species">{contact.especie} - {contact.raza}</div>
                </div>
              </div>
              <div className="contact-actions">
                <EllipsisVertical 
                  size={20} 
                  className="ellipsis-icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEllipsisClick(e, contact);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={`contact-details ${selectedContact ? 'open' : ''}`}>
          {selectedContact ? (
            <>
              <div className="contact-header">
                <div className="contact-avatar large">
                  <img
                    src={
                      selectedContact.especie.toLowerCase() === 'perro'
                        ? 'https://pampermut.com/blog/wp-content/uploads/2020/05/Como-es-el-caracter-de-tu-perro-segun-su-horoscopo-scaled.jpg'
                        : 'https://s1.elespanol.com/2020/05/18/como/gatos-mascotas-trucos_490961518_152142875_1706x960.jpg'
                    }
                    alt={selectedContact.especie}
                  />
                </div>
                <h2>{selectedContact.nombreMascota}</h2>
              </div>
              <div className="contact-info-details">
                <div className="widgets">
                  <div className="widget">
                    <div className="widget-header">
                      <h2 className='tit-datosPacientes'>Información del Dueño</h2>
                      <Edit size={20} className="edit-icon" onClick={() => openEditModal('owner')} />
                    </div>
                    <div className="info-item">
                      <User size={20} />
                      <span><strong>Dueño:</strong> {selectedContact.propietario}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={20} />
                      <span><strong>Celular:</strong> {selectedContact.celular}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={20} />
                      <span><strong>Teléfono de casa:</strong> {selectedContact.telefonoCasa}</span>
                    </div>
                    <div className="info-item">
                      <Mail size={20} />
                      <span><strong>Email:</strong> {selectedContact.email}</span>
                    </div>  
                    <div className="info-item">
                      <MapPin size={20} />
                      <span><strong>Dirección:</strong> {selectedContact.direccion}</span>         
                    </div>
                    <div className="info-item">
                      <MapPin size={20} />
                      <span><strong>Estado:</strong> {selectedContact.estado}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={20} />
                      <span><strong>Colonia:</strong> {selectedContact.colonia}</span>
                    </div>    
                    <br />                   
                  </div>
                  <div className="widget">
                    <div className="widget-header">
                      <h2 className='tit-datosPacientes'>Información de la mascota</h2>
                      <Edit size={20} className="edit-icon" onClick={() => openEditModal('pet')} />
                    </div>
                    <div className="info-item">
                      <PawPrint size={20} />
                      <span><strong>Nombre:</strong> {selectedContact.nombreMascota}</span>
                    </div>
                    <div className="info-item">
                      <Stethoscope size={20} />
                      <span><strong>Especie:</strong> {selectedContact.especie}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={20} />
                      <span><strong>Fecha de nacimiento:</strong> {formatearFecha(selectedContact.fechaNacimiento)}</span>
                    </div>
                    <div className="info-item">
                      <PawPrint size={20} />
                      <span><strong>Raza:</strong> {selectedContact.raza}</span>
                    </div>
                    <div className="info-item">
                      <Weight size={20} />
                      <span><strong>Peso:</strong> {selectedContact.peso} kg</span>
                    </div>  
                    <br />
                  </div>
                  <div className="widget">
                    <h2 className='tit-datosPacientes'>Información reciente de la mascota</h2>
                  </div>        
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              { pacientes.length ? 
                (
                  <>
                    <h2>Listado de pacientes</h2>
                    <p className='tit-datosPacientes'>Administra tus pacientes </p>
                  </>
                ):
                (
                  <>
                    <h2>No hay pacientes</h2>
                    <p>Comienza agregando pacientes y aparecerán en este lugar</p>
                  </>
                )
              }
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && <EditModal type={editingType} />}
    </div>
  );
};

export default DatosPacientes;