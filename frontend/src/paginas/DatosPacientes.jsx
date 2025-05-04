import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, User, Plus, Stethoscope, PawPrint, Calendar, Weight, Edit, EllipsisVertical, ArrowLeft } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(true);

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
      // Datos actualizados desde el backend
      email: paciente.email || '',
      celular: paciente.telefono_principal || '', 
      telefonoCasa: paciente.telefono_secundario || '',
      // Datos de dirección
      direccion: paciente.direccion?.calle && paciente.direccion?.numero_ext ? 
        `${paciente.direccion.calle} ${paciente.direccion.numero_ext}${paciente.direccion.numero_int ? ` Int. ${paciente.direccion.numero_int}` : ''}` : '',
      colonia: paciente.direccion?.colonia || '',
      codigo_postal: paciente.direccion?.codigo_postal || '',
      municipio: paciente.direccion?.municipio || '',
      estado: paciente.direccion?.estado || '',
      referencias: paciente.direccion?.referencias || '',
      color: '', // Este campo no existe en la nueva estructura
      edad: '' // Este campo no existe en la nueva estructura
    }));
    setContacts(contactosTransformados);
  }, [pacientes]);

  // Nuevo useEffect para manejar las animaciones
  useEffect(() => {
    // Iniciar la animación al montar el componente
    setIsAnimating(true);
    
    // Finalizar la animación después de un tiempo
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500); // Aumentamos el tiempo para asegurar que todas las animaciones terminen

    return () => clearTimeout(timer);
  }, []);

  // Definimos filteredContacts antes de usarlo
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

  // Animar los widgets solo cuando se selecciona un contacto por primera vez
  useEffect(() => {
    if (selectedContact && isAnimating) {
      const widgetts = document.querySelectorAll('.widgett');
      widgetts.forEach((widgett, index) => {
        setTimeout(() => {
          widgett.classList.add('animate-in');
        }, index * 200);
      });
    }
  }, [selectedContact, isAnimating]);

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
    const { id, propietario, celular, telefonoCasa, email, colonia, direccion, estado, fechaNacimiento, nombreMascota, peso, raza, codigo_postal, municipio, referencias } = updatedData;
    
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
      codigo_postal: codigo_postal,
      colonia,
      municipio,
      estado,
      referencias,
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
      codigo_postal: '',
      municipio: '',
      estado: '',
      referencias: '',
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
          codigo_postal: selectedContact.codigo_postal || '',
          municipio: selectedContact.municipio || '',
          estado: selectedContact.estado || '',
          referencias: selectedContact.referencias || '',
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

    // Owner fields configuration
    const ownerFields = [
      { id: 'propietario', name: 'propietario', label: 'Nombre del dueño', type: 'text', icon: User, required: true },
      { id: 'celular', name: 'celular', label: 'Celular', type: 'tel', icon: Phone, required: true },
      { id: 'telefonoCasa', name: 'telefonoCasa', label: 'Teléfono de casa', type: 'tel', icon: Phone },
      { id: 'email', name: 'email', label: 'Email', type: 'email', icon: Mail },
      { id: 'direccion', name: 'direccion', label: 'Domicilio', type: 'text', icon: MapPin },
      { id: 'colonia', name: 'colonia', label: 'Colonia', type: 'text', icon: MapPin },
      { id: 'codigo_postal', name: 'codigo_postal', label: 'Código Postal', type: 'text', icon: MapPin, maxLength: 5 },
      { 
        id: 'estado', 
        name: 'estado', 
        label: 'Estado', 
        type: 'select', 
        icon: MapPin, 
        required: true,
        options: mexicanStates.map(state => ({ value: state, label: state })),
        placeholder: 'Selecciona un estado'
      },
      { id: 'municipio', name: 'municipio', label: 'Municipio', type: 'text', icon: MapPin },
      { id: 'referencias', name: 'referencias', label: 'Referencias', type: 'text', icon: MapPin },
    ];

    // Pet fields configuration
    const petFields = [
      { id: 'nombreMascota', name: 'nombreMascota', label: 'Mascota', type: 'text', icon: PawPrint, required: true },
      { id: 'especie', name: 'especie', label: 'Especie', type: 'text', icon: Stethoscope, required: true },
      { id: 'fechaNacimiento', name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', icon: Calendar },
      { id: 'raza', name: 'raza', label: 'Raza', type: 'text', icon: PawPrint },
      { id: 'peso', name: 'peso', label: 'Peso', type: 'number', icon: Weight, min: "0", step: "0.1" },
    ];

    // Choose the appropriate field set based on modal type
    const fields = type === 'owner' ? ownerFields : petFields;

    return (
      <div className={`edit-modal ${isEditModalOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
        <div className="modal-content">
          <h2>{type === 'owner' ? 'Información del Dueño' : 'Información de la Mascota'}</h2>
          <form onSubmit={handleFormSubmit} className="edit-form">
            <div className="form-fields-grid">
              {fields.map((field) => (
                <div className="form-field" key={field.id}>
                  <label htmlFor={field.id}>{field.label}{field.required && <span className="required">*</span>}</label>
                  <div className="input-container">
                    <field.icon size={20} />
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="" disabled>{field.placeholder}</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        placeholder={field.label}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        maxLength={field.maxLength}
                        min={field.min}
                        step={field.step}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
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
      <div className={`veterinary-contacts ${isAnimating ? 'animate-in' : ''}`}>
        {isMobile && (
          <button className="menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X size={18} /> : <Menu size={24} />}
          </button>
        )}
        <div className={`contacts-list ${isMobile && isMenuOpen ? 'open' : ''} ${isAnimating && !isMobile ? 'animate-in' : ''}`}>
          <div className="contacts-header">
            <button className={`back-button ${isAnimating ? '' : 'animate-in'}`} onClick={() => navigate('/admin')}>
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
            className={`search-input ${isAnimating ? '' : 'animate-in'}`}
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
        <div className={`contact-details ${selectedContact ? 'open' : ''} ${isAnimating ? 'animate-in' : ''}`}>
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
                <div className="widgetts">
                  <div className={`widgett ${isAnimating ? '' : 'animate-in'}`}>
                    <div className="widgett-header">
                      <h2 className='tit-datosPacientes'>Información del Dueño</h2>
                      <Edit size={20} className="edit-icon" onClick={() => openEditModal('owner')} />
                    </div>
                    <div className="widgett-content">
                    <div className="info-item">
                        <User size={20} />
                        <span><strong>Dueño:</strong> {selectedContact.propietario}</span>
                      </div>
                    <div className="info-item">
                        <Phone size={20} />
                        <span><strong>Celular:</strong> {selectedContact.celular || 'No registrado'}</span>
                      </div>
                      <div className="info-item">
                        <Phone size={20} />
                        <span><strong>Teléfono de casa:</strong> {selectedContact.telefonoCasa || 'No registrado'}</span>
                      </div>
                      <div className="info-item">
                        <Mail size={20} />
                        <span><strong>Email:</strong> {selectedContact.email || 'No registrado'}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span><strong>Dirección:</strong> {selectedContact.direccion || 'No registrada'}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span><strong>Colonia:</strong> {selectedContact.colonia || 'No registrada'}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span><strong>Código Postal:</strong> {selectedContact.codigo_postal || 'No registrado'}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span><strong>Municipio:</strong> {selectedContact.municipio || 'No registrado'}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={20} />
                        <span><strong>Estado:</strong> {selectedContact.estado || 'No registrado'}</span>
                      </div>
                      {selectedContact.referencias && (
                        <div className="info-item">
                          <MapPin size={20} />
                          <span><strong>Referencias:</strong> {selectedContact.referencias}</span>
                        </div>
                      )}
                    </div>
                    <div className="widgett-footer">
                      <p>ver mas</p>
                    </div>
                  </div>
                  
                  <div className={`widgett ${isAnimating ? '' : 'animate-in'}`}>
                    <div className="widgett-header">
                      <h2 className='tit-datosPacientes'>Información de la mascota</h2>
                      <Edit size={20} className="edit-icon" onClick={() => openEditModal('pet')} />
                    </div>
                    <div className="widgett-content">
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
                    </div>
                    <div className="widgett-footer">
                      <p>ver mas</p>
                    </div>
                  </div>
                  
                  <div className={`widgett ${isAnimating ? '' : 'animate-in'}`}>
                    <div className="widgett-header">
                      <h2 className='tit-datosPacientes'>Información reciente de la mascota</h2>
                    </div>
                    <div className="widgett-content">
                      {/* Aquí iría el contenido de información reciente */}
                      <p>No hay información reciente disponible</p>
                    </div>
                    <div className="widgett-footer">
                      <p>ver mas</p>
                    </div>
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