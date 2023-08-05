import React from "react";
import { useState, useEffect } from "react";
import Logo from "../img/logo.png";
import Icono from "../img/usuario-de-perfil.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/AdministrarPedidos.css";
import { useModal } from "../hooks/useModal";
import Swal from "sweetalert2";
import DetallePedidos from "./DetallePedidos";
import Modal from "./Modal";
import FormularioAgregarPedido from "./FormularioAgregarPedido";
import "../style/RegistroDeVentas.css";
import DetalleVenta from "./DetalleVenta";
import DatosFactura from "./DatosFactura";
import { dataDecrypt } from "../util/data-decrypt";

function RegistroDeVentas() {
  const [ventas, setVentas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [facturas, setFacturas] = useState({});

  const [imageLogo, setImageLogo] = useState("");

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);

  const [isOpenDetalleVenta, openModalDetalleVenta, closeModalDetalleVenta] =
    useModal(false);

  const [isOpenDatosFactura, openModalDatosFactura, closeModalDatosFactura] =
    useModal(false);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/registroVentas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((error) => console.log(error));
  }, [ventas]);

  function mostrarDetallesVenta(dato) {
    openModalDetalleVenta();
    setDetalleVenta(dato);
  }

  function mostrarDatosFactura(dato) {
    openModalDatosFactura();
    setDetalleVenta(dato);
  }

  let resultado = [];
  if (ventas.length <= 0) {
    resultado = resultado;
  } else {
    if (ventas.length >= 1) {
      resultado = ventas;
    }
  }

  let registroFactura = [];
  if (facturas.length <= 0) {
    registroFactura = registroFactura;
  } else {
    if (facturas.length >= 1) {
      registroFactura = facturas;
    }
  }

  const navegar = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth") === null) {
      navegar("/");
    }
  }, []);

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

  const [datosConfig, setDatosConfig] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [tiempoTra, setTiempoTra] = useState(0);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/datosConfiguracion")
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

  useEffect(() => {
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
  }, [segundos, tiempo]);

  if (localStorage.getItem("auth") !== null) {
    return (
      <>
        <nav className="sidebar">
          <header>
            <div className="image-text">
              <span className="image">
                {imageLogo === "" ? (
                  <img src={Logo} alt="logo" />
                ) : (
                  <img src={imageLogo} alt="logo" />
                )}
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
              {puesto === "Vendedor" ? (
                <></>
              ) : (
                <></>
              )}
              <li className="nav-link">
                <a href="#" onClick={() => salir()}>
                  <i className="bx bx-log-out icon"></i>
                  <span className="text nav-text">Cerrar sesion</span>
                </a>
              </li>
            </div>
          </div>
        </nav>
        <section className="ventas">
          <h1 className="ventas-text">Registro de ventas</h1>
          <div className="contenedor-tabla-ventas">
            <table className="tabla-ventas">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha de venta</th>
                  <th>Curp del Vendedor</th>
                  <th>Vendedor</th>
                  <th>Descuento</th>
                  <th>Total de la venta</th>
                  <th>iva</th>
                  <th>Total</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {resultado.length === 0 ? (
                  <tr>
                    <td colSpan="8">No se encontraron ventas</td>
                  </tr>
                ) : (
                  resultado.map((dato) => (
                    <tr key={dato.idVentas}>
                      <td>{dato.idVentas}</td>
                      <td>{dato.fecha}</td>
                      <td>{dato.curpEmpVenta}</td>
                      <td>{dato.nombreEmpVenta}</td>
                      <td>${dato.descuento}</td>
                      <td>${dato.totalVenta}</td>
                      <td>${dato.iva}</td>
                      <td>${dato.totalDescuento}</td>
                      <td>
                        <button
                          className="btn-detalle-venta"
                          onClick={() => mostrarDetallesVenta(dato)}
                        >
                          Ver ticket de venta
                        </button>
                        <button
                          className="btn-detalle-datos-factura"
                          onClick={() => mostrarDatosFactura(dato.idVentas)}
                        >
                          Ver datos para la factura
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={isOpenDetalleVenta}
            closeModalDetalleVenta={closeModalDetalleVenta}
          >
            {detalleVenta.length !== 0 && (
              <DetalleVenta
                closeModalDetalleVenta={closeModalDetalleVenta}
                detalleVenta={detalleVenta}
              />
            )}
          </Modal>
          <Modal
            isOpen={isOpenDatosFactura}
            closeModalDatosFactura={closeModalDatosFactura}
          >
            {detalleVenta.length !== 0 && (
              <DatosFactura
                closeModalDatosFactura={closeModalDatosFactura}
                detalleVenta={detalleVenta}
              />
            )}
          </Modal>
        </section>
      </>
    );
  }
}

export default RegistroDeVentas;
