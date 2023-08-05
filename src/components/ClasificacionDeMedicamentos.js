import React from "react";
import { useState, useEffect } from "react";
import Logo from "../img/logo.png";
import Icono from "../img/usuario-de-perfil.png";
import "../style/ClasificacionDeMedicamentos.css";
import buscar from "../img/buscar.png";
import Modal from "./Modal";
import { useModal } from "../hooks/useModal";
import FormularioAgregarClasificacion from "./FormularioAgregarClasificacion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dataDecrypt } from "../util/data-decrypt";

function ClasificacionDeMedicamentos() {
  const [
    isOpenAgregarClasificacion,
    openModalClasificacion,
    closeModalClasificacion,
  ] = useModal(false);

  const [clasificacion, setClasificacion] = useState([]);

  const [imageLogo, setImageLogo] = useState("");

  /*useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);*/

  useEffect(() => {
    fetch(
      "https://servidor-farmacia-1-production.up.railway.app/api/clasificacion"
    )
      .then((res) => res.json())
      .then((data) => setClasificacion(data))
      .catch((error) => console.log(error));
  }, [clasificacion]);

  let resultado = [];
  if (clasificacion.length <= 0) {
    resultado = resultado;
  } else {
    if (clasificacion.length >= 1) {
      resultado = clasificacion;
    }
  }

  const navegar = useNavigate();

  const salir = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("puesto");
    localStorage.removeItem("curp");
    localStorage.removeItem("nombre");
    navegar("/");
  };

  const [puesto, setPuesto] = useState("");
  const [curp, setCurp] = useState("");

  useEffect(() => {
    if (localStorage.getItem("auth") !== null) {
      setPuesto(dataDecrypt(localStorage.getItem("puesto")));
      setCurp(dataDecrypt(localStorage.getItem("curp")));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("auth") === null) {
      navegar("/");
    }
  }, []);

  if (puesto === "Vendedor") {
    navegar("/VentaMedicamento");
  }

  //console.log(puesto);

  const [datosConfig, setDatosConfig] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [tiempoTra, setTiempoTra] = useState(0);

  useEffect(() => {
    fetch(
      "https://servidor-farmacia-1-production.up.railway.app/api/datosConfiguracion"
    )
      .then((res) => res.json())
      .then((data) => setDatosConfig(data))
      .catch((error) => console.log(error));
  }, [datosConfig]);

  let resultado1 = [];
  if (datosConfig.length <= 0) {
    resultado1 = resultado1;
  } else {
    if (datosConfig.length >= 1) {
      resultado1 = datosConfig;
    }
  }

  useEffect(() => {
    resultado1.map((item) => {
      setTiempo(item.tiempoOrdenes);
    });
  });

  const [segundos, setSegundos] = useState(
    localStorage.getItem("temporizadorEstado")
  );

  /*useEffect(() => {
    // Recuperar el estado del temporizador del localStorage al cargar el componente
    const estadoGuardado = localStorage.getItem("temporizadorEstado");
    if (estadoGuardado) {
      setSegundos(parseInt(estadoGuardado));
    }

    const intervalId = setInterval(() => {
      setSegundos((prevSegundos) => prevSegundos + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Guardar el estado actual del temporizador en el localStorage
    localStorage.setItem("temporizadorEstado", segundos.toString());

    if (segundos === tiempo) {
      localStorage.removeItem("pendientes");
      setSegundos(0);
    }
  }, [segundos, tiempo]);*/

  if (localStorage.getItem("auth") !== null) {
    return (
      <>
        <nav className="sidebar">
          <header>
            <div className="image-text">
              <span className="image">
                <img src={Logo} alt="logo" />
              </span>
              <div className="text header-text">
                <span className="name">Farmacia ZAyOR</span>
                <span className="profession">Bienvenida {puesto}</span>
              </div>
            </div>
          </header>
          <div className="menu-bar">
            <div className="menu-bar-links">
              {puesto === "Vendedor" ? (
                <div>
                  <ul className="menu-links">
                    <li className="nav-link">
                      <Link to="/VentaMedicamento">
                        <a href="#">
                          <i className="bx bx-cart-add icon"></i>
                          <span className="text nav-text">
                            Vender Medicamento
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/registroVentas">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Registro de ventas
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/listaClientesFactura">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Lista de clientes
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <div>
                  <ul className="menu-links">
                    <li className="nav-link">
                      <Link to="/GestionInventario">
                        <a href="#">
                          <i className="bx bxs-capsule icon"></i>
                          <span className="text nav-text">Inventario</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/VentaMedicamento">
                        <a href="#">
                          <i className="bx bx-cart-add icon"></i>
                          <span className="text nav-text">
                            Vender Medicamento
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/ClasificarMedicamentos">
                        <a href="#">
                          <i className="bx bx-category icon"></i>
                          <span className="text nav-text">Clasificacion</span>
                        </a>
                      </Link>
                    </li>
                    <li
                      className="nav-link"
                      //onClick={() => navegar("/GestionEmpleados", { replace: true, state: {  } })}
                    >
                      <Link to="/GestionEmpleados">
                        <a href="#">
                          <i className="bx bx-male-female icon"></i>
                          <span className="text nav-text">Empleados</span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/GestionarPedidos">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Pedidos al proveedor
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/registroVentas">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Registro de ventas
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/listaClientesFactura">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Lista de clientes
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li className="nav-link">
                      <Link to="/OrdenesSostenidas">
                        <a href="#">
                          <i className="bx bxs-shopping-bag icon"></i>
                          <span className="text nav-text">
                            Ordenes pendientes
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="bottom-content">
              {/*<li className="nav-link">
              <Link to="/Configuracion">
                <a href="#">
                  <i class="bx bx-cog icon"></i>
                  <span className="text nav-text">Configuracion</span>
                </a>
              </Link>
            </li>*/}
              <li className="nav-link">
                <a href="#" onClick={() => salir()}>
                  <i className="bx bx-log-out icon"></i>
                  <span className="text nav-text">Cerrar sesion</span>
                </a>
              </li>
            </div>
          </div>
        </nav>
        <div className="contenedor-tarjetas">
          <div className="titulo-clasificacion">Clasificaciones</div>
          <div className="contenedor-botones-clasificacion">
            <button
              className="btn-agregar-clasificacion"
              onClick={openModalClasificacion}
            >
              Agregar clasificacion
            </button>
          </div>
          <div className="contenedor-tarjetas-clasificacion">
            {resultado.length === 0 ? (
              <p>Aun no se han agregado clasificaciones</p>
            ) : (
              resultado.map((clasi) => (
                <div
                  className="tarjeta-clasificacion"
                  key={clasi.idClasificacion}
                >
                  <h1 className="grupo-tarjeta">Grupo: {clasi.grupo} </h1>
                  <p className="advertencias-tarjeta">
                    Advertencias: {clasi.advertencias}
                  </p>
                  <p className="informacion-tarjeta">
                    Informacion farmacologica: {clasi.informacionFarmacologica}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <Modal
          isOpen={isOpenAgregarClasificacion}
          closeModalClasificacion={closeModalClasificacion}
        >
          <FormularioAgregarClasificacion
            closeModalClasificacion={closeModalClasificacion}
          />
        </Modal>
      </>
    );
  }
}

export default ClasificacionDeMedicamentos;
