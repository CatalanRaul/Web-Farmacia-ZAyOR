import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dataDecrypt } from "../util/data-decrypt";
import Logo from "../img/logo.png";
import "../style/OrdenesSostenidas.css";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import DetalleOrdenSostenida from "./DetalleOrdenSostenida";

function ListaDeOrdenesSostenidas() {
  const [idListaPendientes, setIdListaPendientes] = useState(0);
  const [detalleOrdenSostenida, setDetalleOrdenSostenida] = useState([]);
  const [total, setTotal] = useState(0);
  const [fechaPedido, setFechaPedido] = useState("");
  const [listaPendientes, setListaPendientes] = useState(() => {
    const savePendientes = localStorage.getItem("pendientes");
    if (savePendientes) {
      return JSON.parse(savePendientes);
    } else {
      return [];
    }
  });

  const [imageLogo, setImageLogo] = useState("");

  /*useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);*/

  const [
    isOpenDetalleOrdenSostenida,
    openModalDetalleOrdenSostenida,
    closeModalDetalleOrdenSostenida,
  ] = useModal(false);

  const procederAVender = (dato) => {
    //console.log(dato.productos);

    //setIdListaPendientes(dato.id);

    for (let i = 0; i < dato.productos.length; i++) {
      //console.log(dato.productos[i]);
      //agregar el producto que se va a realizar la venta
      localStorage.setItem("procederVenta", JSON.stringify(dato.productos[i]));
      //setListaCarrito(dato.productos[i]);
    }

    let listaPendiente1 = listaPendientes.filter((el) => el.id !== dato.id);
    //console.log(listaPendiente1);
    //setListaPendientes(listaPendiente1);
    localStorage.setItem("pendientes", JSON.stringify(listaPendiente1));
    localStorage.setItem("idOrdenSostenida", dato.id);

    navegar("/VentaMedicamento");
  };

  const verDetalle = (dato) => {
    console.log(dato.productos[0]);
    setDetalleOrdenSostenida(dato.productos[0]);
    setTotal(dato.total);
    setFechaPedido(dato.fecha);
    openModalDetalleOrdenSostenida();
  };

  const fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();

  const fechaActual1 = `${anio}/${mes}/${dia}`;

  const navegar = useNavigate();
  //const location = useLocation();

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
    fetch(
      "https://servidor-farmacia-1-production.up.railway.app/api/datosConfiguracion"
    )
      .then((res) => res.json())
      .then((data) => setDatosConfig(data))
      .catch((error) => console.log(error));
  }, [datosConfig]);

  let resultado = [];
  if (datosConfig.length <= 0) {
    resultado = resultado;
  } else {
    if (datosConfig.length >= 1) {
      resultado = datosConfig;
    }
  }

  useEffect(() => {
    resultado.map((item) => {
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
              {puesto === "Vendedor" ? <></> : <></>}
              <li className="nav-link">
                <a href="#" onClick={() => salir()}>
                  <i className="bx bx-log-out icon"></i>
                  <span className="text nav-text">Cerrar sesion</span>
                </a>
              </li>
            </div>
          </div>
        </nav>
        <div className="contenedor-ordenes-sostenidas">
          <div className="titulo-lista-pendientes">
            Lista de ordenes sostenidas
          </div>
          <div className="contenedor-tabla-ordenes">
            <table className="tabla-ordenes-sostenidas">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Fecha</th>
                  <th>Total de venta</th>
                  <th>Realizar venta</th>
                  <th>Ver detalles</th>
                </tr>
              </thead>
              <tbody>
                {listaPendientes.length === 0 ? (
                  <tr>
                    <td colSpan="5">Aun no hay productos</td>
                  </tr>
                ) : (
                  listaPendientes.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.fecha}</td>
                      <td>{item.total.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-proceder-venta"
                          onClick={(e) => procederAVender(item)}
                        >
                          Hacer la venta
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-proceder-venta"
                          onClick={(e) => verDetalle(item)}
                        >
                          Ver tiket de presupuesto
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={isOpenDetalleOrdenSostenida}
          closeModalDetalleOrdenSostenida={closeModalDetalleOrdenSostenida}
        >
          <DetalleOrdenSostenida
            closeModalDetalleOrdenSostenida={closeModalDetalleOrdenSostenida}
            detalleOrdenSostenida={detalleOrdenSostenida}
            total={total}
            fechaPedido={fechaPedido}
          />
        </Modal>
      </>
    );
  }
}

export default ListaDeOrdenesSostenidas;
