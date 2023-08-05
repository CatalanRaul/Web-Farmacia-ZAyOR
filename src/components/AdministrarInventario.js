import React from "react";
import Logo from "../img/logo.png";
//import Icono from "../img/usuario-de-perfil.png";
import Activar from "../img/boton-de-encendido.png";
import buscar from "../img/buscar.png";
import { useModal } from "../hooks/useModal";
import FormularioAgregarInventario from "./FormularioAgregarInventario";
import Modal from "./Modal";
import "../style/AdministrarInventario.css";
import { useState, useEffect } from "react";
import Actualizar from "../img/refresh.png";
import Eliminar from "../img/eliminar.png";
import FormularioModificarInventario from "./FormularioModificarInventario";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import moment from "moment/moment";
import { dataDecrypt } from "../util/data-decrypt";

function AdministrarInventario() {
  const [isOpenAgregarInventario, openModalInventario, closeModalInventario] =
    useModal(false);
  const [
    isOpenModificarInventario,
    openModalInventarioModificar,
    closeModalInventarioModificar,
  ] = useModal(false);

  const [medicamento, setMedicamento] = useState([]);
  const [modificarInventario, setModificarInventario] = useState([]);
  const [url, setUrl] = useState("https://servidor-farmacia-1-production.up.railway.app/api/inventarioActivo");
  const [busqueda, setBusqueda] = useState("");

  const [imageLogo, setImageLogo] = useState("");

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);

  const handleChangeBusqueda = (e) => {
    setBusqueda(e.target.value);
    //filtrar(busqueda);
  };

  //filtrar la busqueda
  let resultado = [];
  if (medicamento.length <= 0) {
    resultado = resultado;
  } else {
    if (!busqueda && medicamento.length >= 1) {
      resultado = medicamento;
    } else {
      if (busqueda && medicamento.length >= 1) {
        resultado = medicamento.filter(
          (dato) => {
            return (
              dato.codigoBarra.toString().includes(busqueda.toLowerCase()) ||
              dato.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
          }

          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }
    }
  }

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMedicamento(data))
      .catch((error) => console.log(error));
  }, [medicamento]);

  function datosModificar(emp) {
    openModalInventarioModificar();
    setModificarInventario(emp);
  }

  function datosEmpleados(emp) {
    Swal.fire({
      title: "¿Estas seguro de eliminar este medicamento?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Elimniar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`https://servidor-farmacia-1-production.up.railway.app/api/inventario/${emp}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Medicamento eliminado!", "", "success");
      }
    });
  }

  function activarProducto(emp) {
    Swal.fire({
      title: "¿Estas seguro de activar este medicamento?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Activar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(`https://servidor-farmacia-1-production.up.railway.app/api/activarProducto/${emp}`, {
          method: "put",
        })
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Medicamento activado!", "", "success");
      }
    });
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      setUrl("https://servidor-farmacia-1-production.up.railway.app/api/inventario");
    } else {
      setUrl("https://servidor-farmacia-1-production.up.railway.app/api/inventarioActivo");
    }
  }

  const fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();

  const fechaActual1 = `${anio}/${mes}/${dia}`;

  //console.log(fechaActual);
  var fecha1 = moment(fechaActual1);
  //var fecha2 = moment("2023/06/10");
  var fecha2;

  //console.log(fecha2.diff(fecha1, "days"), " dias de diferencia");

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
        <section className="inventario">
          <h1 className="inventario-text">INVENTARIO</h1>
          <div className="contenedor-buscar-mostrar-inventario">
            <div className="checkbox-contenedor-inventario">
              <input
                className="input-mostrar-todos-inventario"
                type="checkbox"
                name="mostrar"
                id="mostrar"
                onChange={handleCheckbox}
              />
              <label className="mostrar-inventario-texto" htmlFor="mostrar">
                Mostrar todos productos
              </label>
            </div>
            <div className="contenedor-busqueda-inventario">
              <input
                className="input-busqueda-inventario"
                type="text"
                name="busquedaClasificacion"
                placeholder="Ingresa el nombre o codigo de barra..."
                onChange={handleChangeBusqueda}
                value={busqueda}
              />
              <span className="buscar">
                <i className="bx bx-search buscar-icono"></i>
              </span>
            </div>
          </div>
          <div className="contenedor-botones">
            <button
              className="btn-registrar-medicamento"
              onClick={openModalInventario}
            >
              Agregar nuevo medicamento
            </button>

            <CSVLink data={resultado} filename={"Tabla-inventario"}>
              <button className="btn-exportar-excel">Exportar a Excel</button>
            </CSVLink>
          </div>
          <div className="contenedor-tabla" id="Registro-inventario">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Codigo de barra</th>
                  <th>Sustancia Activa</th>
                  <th>Presentacion</th>
                  <th>Precio de compra</th>
                  <th>Precio de venta</th>
                  <th>Cantidad</th>
                  <th>Lote</th>
                  <th>Fecha de caducidad</th>
                  <th>Clasificacion</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultado.length < 1 ? (
                  <tr>
                    <td colSpan="10">No se encontraron productos</td>
                  </tr>
                ) : (
                  resultado.map((emp) => (
                    <tr key={emp.idProductos}>
                      <td>{emp.nombre}</td>
                      <td>{emp.codigoBarra}</td>
                      <td>{emp.sustanciaActiva}</td>
                      <td>{emp.presentacion}</td>
                      <td>{emp.precioCompra}</td>
                      <td>{emp.precioVenta}</td>
                      <td>{emp.cantidadEnStock}</td>
                      <td>{emp.lote}</td>
                      {moment(emp.fecha).diff(fecha1, "days") >= 1 &&
                      moment(emp.fecha).diff(fecha1, "days") <= 5 ? (
                        <td className="por-caducar">{emp.fecha}</td>
                      ) : //<td className="no-caducar">{emp.fecha}</td>
                      moment(emp.fecha).diff(fecha1, "days") <= 0 ? (
                        <td className="caducada">{emp.fecha}</td>
                      ) : (
                        <td className="no-caducar">{emp.fecha}</td>
                      )}
                      <td>{emp.grupo}</td>
                      <td>
                        {emp.estatus === 1 ? (
                          <button onClick={() => datosModificar(emp)}>
                            <img
                              className="btn-actualizar-inventario"
                              src={Actualizar}
                              alt="Imagen boton modificar"
                            />
                          </button>
                        ) : (
                          <p className="activar-texto-inventario">Activar</p>
                        )}
                        {emp.estatus === 1 ? (
                          <button
                            onClick={() => datosEmpleados(emp.idProductos)}
                          >
                            <img
                              className="btn-eliminar-inventario"
                              src={Eliminar}
                              alt="Imagen boton eliminar"
                            />
                          </button>
                        ) : (
                          <button
                            className="activar-inventario"
                            onClick={() => activarProducto(emp.idProductos)}
                          >
                            <img
                              className="btn-activar-inventario"
                              src={Activar}
                              alt="Imagen boton Activar"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={isOpenAgregarInventario}
            closeModalInventario={closeModalInventario}
          >
            <FormularioAgregarInventario
              closeModalInventario={closeModalInventario}
            />
          </Modal>
          <Modal
            isOpen={isOpenModificarInventario}
            closeModalInventarioModificar={closeModalInventarioModificar}
          >
            <FormularioModificarInventario
              closeModalInventarioModificar={closeModalInventarioModificar}
              modificarInventario={modificarInventario}
            />
          </Modal>
        </section>
      </>
    );
  }
}

export default AdministrarInventario;
