import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Plus, Edit2, Trash2, Filter, X } from 'lucide-react';
import { format, addDays, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import '../assets/citas/styles/style.css';
import imgbath from "../assets/citas/images/baños.jpg";
import imgCitaVeterinaria from "../assets/citas/images/citaVeterinaria.jpg";
import imgVeterinarioCuida from "../assets/citas/images/doctorCuida.jpg";
/*import { CSSTransition, TransitionGroup } from 'react-transition-group';*/

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroEspecie, setFiltroEspecie] = useState('todas');
  const [filtroHora, setFiltroHora] = useState('todas');
  const [nuevaCita, setNuevaCita] = useState({
    id: '',
    nombrePaciente: '',
    nombrePropietario: '',
    fecha: '',
    hora: '',
    tipo: 'medica',
    notas: '',
    especie: 'perro'
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCitas = async () => {
      setCargando(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const citasSimuladas = [
        { id: '1', nombrePaciente: 'Max', nombrePropietario: 'Juan Pérez', fecha: format(new Date(), 'yyyy-MM-dd'), hora: '10:00', tipo: 'medica', notas: 'Revisión anual', especie: 'perro' },
        { id: '2', nombrePaciente: 'Luna', nombrePropietario: 'María García', fecha: format(addDays(new Date(), 1), 'yyyy-MM-dd'), hora: '11:30', tipo: 'bano', notas: 'Alergias al champú', especie: 'gato' },
        { id: '3', nombrePaciente: 'Buddy', nombrePropietario: 'Carlos Sánchez', fecha: format(addDays(new Date(), 2), 'yyyy-MM-dd'), hora: '09:00', tipo: 'medica', notas: 'Vacunas', especie: 'perro' },
        { id: '4', nombrePaciente: 'Bella', nombrePropietario: 'Lucía Díaz', fecha: format(addDays(new Date(), 3), 'yyyy-MM-dd'), hora: '12:00', tipo: 'bano', notas: 'Cambio de pelaje', especie: 'gato' },
        { id: '5', nombrePaciente: 'Charlie', nombrePropietario: 'Miguel Torres', fecha: format(addDays(new Date(), 4), 'yyyy-MM-dd'), hora: '08:30', tipo: 'medica', notas: 'Consulta dental', especie: 'perro' },
        { id: '6', nombrePaciente: 'Daisy', nombrePropietario: 'Ana López', fecha: format(addDays(new Date(), 5), 'yyyy-MM-dd'), hora: '14:00', tipo: 'bano', notas: 'Corte de uñas', especie: 'gato' },
        { id: '7', nombrePaciente: 'Rocky', nombrePropietario: 'Pablo Martínez', fecha: format(addDays(new Date(), 6), 'yyyy-MM-dd'), hora: '10:30', tipo: 'medica', notas: 'Revisión de oídos', especie: 'perro' },
        { id: '8', nombrePaciente: 'Sadie', nombrePropietario: 'Laura Gómez', fecha: format(addDays(new Date(), 7), 'yyyy-MM-dd'), hora: '15:00', tipo: 'bano', notas: 'Limpieza de orejas', especie: 'gato' },
        { id: '9', nombrePaciente: 'Molly', nombrePropietario: 'Javier Balcazar Cruz', fecha: format(addDays(new Date(), 8), 'yyyy-MM-dd'), hora: '10:00', tipo: 'medica', notas: 'Control de peso', especie: 'perro' },
        { id: '10', nombrePaciente: 'Markov', nombrePropietario: 'Javier Balcazar Cruz', fecha: format(addDays(new Date(), 9), 'yyyy-MM-dd'), hora: '11:00', tipo: 'bano', notas: 'Baño completo', especie: 'perro' },
        { id: '11', nombrePaciente: 'Yui', nombrePropietario: 'Javier Balcazar Cruz', fecha: format(addDays(new Date(), 10), 'yyyy-MM-dd'), hora: '12:00', tipo: 'medica', notas: 'Consulta dental', especie: 'perro' },
        { id: '12', nombrePaciente: 'Forst', nombrePropietario: 'Javier Balcazar Cruz', fecha: format(addDays(new Date(), 11), 'yyyy-MM-dd'), hora: '13:00', tipo: 'bano', notas: 'Corte de uñas', especie: 'perro' },
        { id: '13', nombrePaciente: 'Zura', nombrePropietario: 'Ivonne Vaca', fecha: format(addDays(new Date(), 12), 'yyyy-MM-dd'), hora: '14:00', tipo: 'medica', notas: 'Vacunas', especie: 'perro' },
        { id: '14', nombrePaciente: 'Murci', nombrePropietario: 'Ivonne Vaca', fecha: format(addDays(new Date(), 13), 'yyyy-MM-dd'), hora: '15:00', tipo: 'bano', notas: 'Limpieza dental', especie: 'perro' },
        { id: '15', nombrePaciente: 'Obama', nombrePropietario: 'Ivonne Vaca', fecha: format(addDays(new Date(), 14), 'yyyy-MM-dd'), hora: '16:00', tipo: 'medica', notas: 'Control de peso', especie: 'perro' },
        { id: '16', nombrePaciente: 'Rayo', nombrePropietario: 'Ivonne Vaca', fecha: format(addDays(new Date(), 15), 'yyyy-MM-dd'), hora: '17:00', tipo: 'bano', notas: 'Desparasitación', especie: 'perro' },
      ];
      setCitas(citasSimuladas);
      setCargando(false);
    };
    cargarCitas();
  }, []);

  useEffect(() => {
    const guardarCitas = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Citas guardadas:', citas);
    };
    guardarCitas();
  }, [citas]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (nuevaCita.id) {
      setCitas(citas.map(cita => cita.id === nuevaCita.id ? nuevaCita : cita));
    } else {
      const nuevaCitaConId = { ...nuevaCita, id: Date.now().toString() };
      setCitas([...citas, nuevaCitaConId]);
    }
    setMostrarFormulario(false);
    setNuevaCita({
      id: '',
      nombrePaciente: '',
      nombrePropietario: '',
      fecha: '',
      hora: '',
      tipo: 'medica',
      notas: '',
      especie: 'perro'
    });
    setCargando(false);
  };

  const editarCita = (cita) => {
    setNuevaCita(cita);
    setMostrarFormulario(true);
  };

  const eliminarCita = async (id) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCitas(citas.filter(cita => cita.id !== id));
    setCargando(false);
  };

  const citasFiltradas = citas
    .filter(cita => cita.nombrePaciente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                    cita.nombrePropietario.toLowerCase().includes(terminoBusqueda.toLowerCase()))
    .filter(cita => filtroTipo === 'todas' || cita.tipo === filtroTipo)
    .filter(cita => filtroEspecie === 'todas' || cita.especie === filtroEspecie)
    .filter(cita => {
      if (filtroHora === 'todas') return true;
      const [inicio, fin] = filtroHora.split('-');
      const citaHora = parse(cita.hora, 'HH:mm', new Date());
      const horaInicio = parse(inicio, 'HH', new Date());
      const horaFin = parse(fin, 'HH', new Date());
      return citaHora >= horaInicio && citaHora < horaFin;
    })
    .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));

  const getFondoSegunFiltro = () => {
    switch(filtroTipo) {
      case 'medica':
        return `url(${imgVeterinarioCuida})`;
      case 'bano':
        return `url(${imgbath})`;
      default:
        return `url(${imgCitaVeterinaria})`;
    }
  };

  return (
    <div className="citas-app" style={{ backgroundImage: getFondoSegunFiltro() }}>
      <div className="gestor-citas">
        <div className="encabezado">
          <div className="titulo-container">
            <h1 className="titulo-principal">Administrador de Citas Veterinarias</h1>
            <p className="subtitulo">Genera y revisa tus citas pendientes</p>
          </div>
          <button className="boton-agregar" onClick={() => setMostrarFormulario(true)}>
            <Plus size={20} />
            Agregar Cita
          </button>
        </div>

        <div className="busqueda-filtro">
          <div className="barra-busqueda">
            <Search size={20} />
            <input
              className="input-busqueda"
              type="text"
              placeholder="Buscar citas..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <div className="opciones-filtro">
            <Filter size={20} />
            <select 
              className="select-filtro"
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todas">Tipo de Servicio</option>
              <option value="medica">Médicas</option>
              <option value="bano">Baños</option>
            </select>
            <select
              className="select-filtro"
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
            >
              <option value="todas">Especie</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otros">Otros</option>
            </select>
            <select
              className="select-filtro"
              value={filtroHora}
              onChange={(e) => setFiltroHora(e.target.value)}
            >
              <option value="todas">Todas las horas</option>
              <option value="08-09">08:00 - 09:00</option>
              <option value="09-10">09:00 - 10:00</option>
              <option value="10-11">10:00 - 11:00</option>
              <option value="11-12">11:00 - 12:00</option>
              <option value="12-13">12:00 - 13:00</option>
              <option value="13-14">13:00 - 14:00</option>
              <option value="14-15">14:00 - 15:00</option>
              <option value="15-16">15:00 - 16:00</option>
              <option value="16-17">16:00 - 17:00</option>
              <option value="17-18">17:00 - 18:00</option>
            </select>
          </div>
        </div>

        <CSSTransition
          in={mostrarFormulario}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className="modal">
            <div className="contenido-modal">
              <button className="boton-cerrar" onClick={() => setMostrarFormulario(false)}>
                <X size={20} />
              </button>
              <h2>{nuevaCita.id ? 'Editar Cita' : 'Agregar Nueva Cita'}</h2>
              <form className="formulario-cita" onSubmit={manejarEnvio}>
                <input
                  className="input-formulario"
                  type="text"
                  name="nombrePaciente"
                  placeholder="Nombre del Paciente"
                  value={nuevaCita.nombrePaciente}
                  onChange={manejarCambioInput}
                  required
                />
                <input
                  className="input-formulario"
                  type="text"
                  name="nombrePropietario"
                  placeholder="Nombre del Propietario"
                  value={nuevaCita.nombrePropietario}
                  onChange={manejarCambioInput}
                  required
                />
                <input
                  className="input-formulario"
                  type="date"
                  name="fecha"
                  value={nuevaCita.fecha}
                  onChange={manejarCambioInput}
                  required
                />
                <input
                  className="input-formulario"
                  type="time"
                  name="hora"
                  value={nuevaCita.hora}
                  onChange={manejarCambioInput}
                  required
                />
                <select
                  className="input-formulario"
                  name="tipo"
                  value={nuevaCita.tipo}
                  onChange={manejarCambioInput}
                  required
                >
                  <option value="medica">Médica</option>
                  <option value="bano">Baño</option>
                </select>
                <select
                  className="input-formulario"
                  name="especie"
                  value={nuevaCita.especie}
                  onChange={manejarCambioInput}
                  required
                >
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="otros">Otros</option>
                </select>
                <textarea
                  className="input-formulario"
                  name="notas"
                  placeholder="Notas"
                  value={nuevaCita.notas}
                  onChange={manejarCambioInput}
                />
                <button className="boton-enviar" type="submit" disabled={cargando}>
                  {cargando ? 'Procesando...' : (nuevaCita.id ? 'Actualizar Cita' : 'Agregar Cita')}
                </button>
              </form>
            </div>
          </div>
        </CSSTransition>

        <TransitionGroup className="lista-citas">
          {citasFiltradas.map(cita => (
            <CSSTransition
              key={cita.id}
              timeout={500}
              classNames="fade-slide"
            >
              <div className={`tarjeta-cita ${cita.tipo}`}>
                <div className="avatar-mascota">
                  <img 
                    src={cita.especie === 'perro' 
                      ? "https://pampermut.com/blog/wp-content/uploads/2020/05/Como-es-el-caracter-de-tu-perro-segun-su-horoscopo-scaled.jpg"
                      : "https://s1.elespanol.com/2020/05/18/como/gatos-mascotas-trucos_490961518_152142875_1706x960.jpg"
                    } 
                    alt={`Avatar de ${cita.especie}`}
                  />
                </div>
                <h3 className="nombre-paciente">{cita.nombrePaciente}</h3>
                <p className="info-cita"><strong>Propietario:</strong> {cita.nombrePropietario}</p>
                <p className="info-cita"><strong>Especie:</strong> {cita.especie}</p>
                <p className="info-cita">
                  <Calendar size={16} />
                  {format(new Date(cita.fecha), 'dd MMMM yyyy', { locale: es })}
                </p>
                <p className="info-cita">
                  <Clock size={16} />
                  {cita.hora}
                </p>
                <p className="info-cita"><strong>Tipo:</strong> {cita.tipo === 'medica' ? 'Médica' : 'Baño'}</p>
                {cita.notas && <p className="info-cita"><strong>Notas:</strong> {cita.notas}</p>}
                <div className="acciones-tarjeta">
                  <button className="boton-accion" onClick={() => editarCita(cita)} disabled={cargando}>
                    <Edit2 size={16} />
                  </button>
                  <button className="boton-accion" onClick={() => eliminarCita(cita.id)} disabled={cargando}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>

        {cargando && <div className="cargando">Cargando...</div>}
      </div>
    </div>
  );
};

export default Citas;