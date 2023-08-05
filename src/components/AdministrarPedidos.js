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
import { dataDecrypt } from "../util/data-decrypt";

function AdministrarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState([]);

  const [imageLogo, setImageLogo] = useState("");

  /*useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);*/

  const [
    isOpenDetallePedidos,
    openModalDetallePedidos,
    closeModalDetallePedidos,
  ] = useModal(false);

  const [
    isOpenAgregarPedidos,
    openModalAgregarPedidos,
    closeModalAgregarPedidos,
  ] = useModal(false);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/pedidos")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((error) => console.log(error));
  }, [pedidos]);

  function datosEmpleados(emp) {
    Swal.fire({
      title: "¿Estas seguro de eliminar este pedido?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Elimniar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(
          `https://servidor-farmacia-1-production.up.railway.app/api/inventario/${emp}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Pedido eliminado!", "", "success");
      }
    });
  }

  function mostrarDetalles(dato) {
    openModalDetallePedidos();
    setDetallePedido(dato);
  }

  let resultado = [];
  if (pedidos.length <= 0) {
    resultado = resultado;
  } else {
    if (pedidos.length >= 1) {
      resultado = pedidos;
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

  if (puesto === "Vendedor") {
    navegar("/VentaMedicamento");
  }

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
        <section className="pedidos">
          <h1 className="pedidos-text">Pedidos</h1>
          <div className="contenedor-botones-pedidos">
            <button
              className="btn-registrar-pedido"
              onClick={openModalAgregarPedidos}
            >
              Agregar nuevo pedido
            </button>
          </div>
          <div className="contenedor-tabla-pedidos">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha de pedido</th>
                  <th>Monto Total</th>
                  <th>Detalle del pedido</th>
                </tr>
              </thead>
              <tbody>
                {resultado.length === 0 ? (
                  <tr>
                    <td colSpan="4">No se encontraron Pedidos</td>
                  </tr>
                ) : (
                  resultado.map((dato) => (
                    <tr key={dato.idPedidos}>
                      <td>{dato.idPedidos}</td>
                      <td>{dato.fecha}</td>
                      <td>${dato.montoTotal}</td>
                      <td>
                        <button
                          className="btn-detalle-pedido"
                          onClick={() => mostrarDetalles(dato.idPedidos)}
                        >
                          Ver detalle del pedido
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={isOpenDetallePedidos}
            closeModalDetallePedidos={closeModalDetallePedidos}
          >
            {detallePedido.length !== 0 && (
              <DetallePedidos
                closeModalDetallePedidos={closeModalDetallePedidos}
                detallePedido={detallePedido}
              />
            )}
          </Modal>
          <Modal
            isOpen={isOpenAgregarPedidos}
            closeModalDetallePedidos={closeModalAgregarPedidos}
          >
            <FormularioAgregarPedido
              closeModalAgregarPedidos={closeModalAgregarPedidos}
            />
          </Modal>
        </section>
      </>
    );
  }
}

export default AdministrarPedidos;
