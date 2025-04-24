import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { PacientesProvider } from './context/PacientesProvider';

import  AuthLayout  from './layout/AuthLayout';
import  RutaProtegida  from './layout/RutaProtegida';

import  Login  from './paginas/Login'; 
import  Registrar  from './paginas/Registrar';
import  OlvidePassword  from './paginas/OlvidePassword';
import  NuevoPassword from './paginas/NuevoPassword';
import  HomeScreen from './paginas/HomeScreen';
import  ConfirmarCuenta  from './paginas/ConfirmarCuenta';
import  RegistroCliente  from './paginas/RegistroCliente';
import  DatosPacientes  from './paginas/DatosPacientes';
import  EditarPerfilDoc  from './paginas/EditarPerfilDoc';
import  CambiarPassword  from './paginas/CambiarPassword';
import  Citas  from './paginas/Citas';


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>   {/* Tiene el state de la autentificación */}
        <PacientesProvider>
        {/* Definición de rutas */}
          <Routes>
            {/* Ruta principal, todas las que esten agrupadas en AuthLayout estaran agrupadas en route*/}
            <Route path="/" element={<AuthLayout/>} >
              <Route index element={<Login/>}/>
              <Route path="registrar" element={<Registrar/>}/>
              <Route path="olvide-password" element={<OlvidePassword/>}/>
              <Route path="olvide-password/:token" element={<NuevoPassword/>}/>
              <Route path="confirmar/:id" element={<ConfirmarCuenta/>}/>
            </Route>

            {/* Definicion de rutas privadas*/}
            <Route path="/admin" element={<RutaProtegida/>} >
              <Route index element={<HomeScreen/>}/>
              <Route path="registro-cliente" element={<RegistroCliente/>}/>
              <Route path="datosPacientes" element={<DatosPacientes/>}/>
              <Route path="EditarPerfilDoc" element={<EditarPerfilDoc />} />
              <Route path="datosPacientes" element={<DatosPacientes/>}/>
              <Route path="CambiarPassword" element={<CambiarPassword />} />
              <Route path="Citas" element={<Citas />} />

            </Route>
          </Routes>
        </PacientesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;