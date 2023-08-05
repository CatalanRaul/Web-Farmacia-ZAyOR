import Login from "./components/login";
import MenuDueña from "./components/MenuDueña";
import AdministrarEmpleados from "./components/AdministrarEmpleados";
import { Route, Routes } from "react-router-dom";
import ClasificacionDeMedicamentos from "./components/ClasificacionDeMedicamentos";
import AdministrarInventario from "./components/AdministrarInventario";
import AdministrarPedidos from "./components/AdministrarPedidos";
import VentaDeMedicamento from "./components/VentaDeMedicamento";
import RegistroDeVentas from "./components/RegistroDeVentas";
import ListaClientesFactura from "./components/ListaClientesFactura";

import store from "./store";
import { Provider } from "react-redux";
import ListaDeOrdenesSostenidas from "./components/ListaDeOrdenesSostenidas";
import Configuraciones from "./components/Configuraciones";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/MenuDueña" element={<MenuDueña />} />
          <Route path="/GestionEmpleados" element={<AdministrarEmpleados />} />
          <Route
            path="/ClasificarMedicamentos"
            element={<ClasificacionDeMedicamentos />}
          />
          <Route
            path="/GestionInventario"
            element={<AdministrarInventario />}
          />
          <Route path="/GestionarPedidos" element={<AdministrarPedidos />} />
          <Route path="/VentaMedicamento" element={<VentaDeMedicamento />} />
          <Route path="/registroVentas" element={<RegistroDeVentas />} />
          <Route
            path="/listaClientesFactura"
            element={<ListaClientesFactura />}
          />
          <Route
            path="/OrdenesSostenidas"
            element={<ListaDeOrdenesSostenidas />}
          />
          <Route path="/Configuracion" element={<Configuraciones />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
