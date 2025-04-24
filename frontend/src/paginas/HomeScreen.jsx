import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

import logo from '../assets/homeScreen/images/logo.png';
import rgpacientes from '../assets/homeScreen/images/registrarPacientes.jpg';
import vPacientes from '../assets/homeScreen/images/verPacientes.jpg';
import vDashboard from '../assets/homeScreen/images/verDashboard.jpg';
import vCalendario from '../assets/homeScreen/images/verCalendario.jpg';
import vInventario from '../assets/homeScreen/images/verInventario.jpg';
import '../assets/homeScreen/styles/style.css';
import '../assets/TopMenu/styles/style.css';

import AppIcon from '../components/AppIcon';
import WidgetHoraActual from '../components/WidgetHoraActual';
import WidgetCitasProgramadas from '../components/WidgetCitasProgramadas';
import WidgetMetaDelMes from '../components/WidgetMetaDelMes';
import TopMenu  from '../components/TopMenu';

const HomeScreen = () => {
  const { cerrarSesion, auth } = useAuth();
  const [saludo, setSaludo] = useState('');
  
  useEffect(() => {
    // Agregar la clase al body cuando el componente se monte
    document.body.classList.add('home-screen-body');
    return () => {
      // Eliminar la clase del body cuando el componente se desmonte
      document.body.classList.remove('home-screen-body');
    };
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 12) {
      setSaludo('Buenos días');
    } else if (currentHour >= 12 && currentHour < 19) {
      setSaludo('Buenas tardes');
    } else {
      setSaludo('Buenas noches');
    }
  }, []);

  return (
    <div className="contain">
       <TopMenu />
      <header>
        <div className="logo-contain">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1>{saludo} {auth.nombre}.</h1>
    
      </header>
      <div className="widgets">
        <WidgetHoraActual />
        <WidgetCitasProgramadas />
        <WidgetMetaDelMes />
      </div>
      <nav className="apps">
        <AppIcon to="/admin/registro-cliente" imageUrl={rgpacientes} name="Registrar Clientes" />
        <AppIcon to="/admin/datosPacientes" imageUrl={vPacientes} name="Pacientes" />
        <AppIcon to="/admin/citas" imageUrl={vCalendario} name="Citas" />
        <AppIcon to="/dashboard"imageUrl={vDashboard} name="Dashboard" />
        <AppIcon to="/inventory" imageUrl={vInventario} name="Inventario" />
        {/* <AppIcon to="/directory" color="#F39C12" name="Directorio" /> */}
        {/* <AppIcon to="/bathrooms" color="#8E44AD" name="Baños" /> */}
        {/* <AppIcon to="/recipe-generator" color="#1ABC9C" name="Generador de recetas" /> */}

      </nav>
    </div>
  );
};

export default HomeScreen;
