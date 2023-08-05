import React, { useState, useEffect } from "react";
import Logo from "../img/logo.png";
import Icono from "../img/usuario-de-perfil.png";
import Actualizar from "../img/refresh.png";
import Eliminar from "../img/eliminar.png";
import Activar from "../img/boton-de-encendido.png";
import buscar from "../img/buscar.png";
import "../style/administrarEmpleados.css";
import Modal from "./Modal";
import "../style/Modal.css";
import { useModal } from "../hooks/useModal";
import FormularioEmpleado from "./FormularioEmpleado";
import FormularioModificarEmpleados from "./FormularioModificarEmpleados";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { dataDecrypt } from "../util/data-decrypt";

function AdministrarEmpleados() {
  /*se creo el estado del empleado para poder obtenerlos de la base de datos */
  const [empleados, setEmpleados] = useState([]);
  const [modificarEmpleados, setModificarEmpleados] = useState([]);
  const [url, setUrl] = useState(
    "https://servidor-farmacia-1-production.up.railway.app/api/empleadosActivos"
  );
  const [busqueda, setBusqueda] = useState("");

  const [imageLogo, setImageLogo] = useState("");

  /*useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);*/

  //busqueda por curp
  const handleChangeBusqueda = (e) => {
    setBusqueda(e.target.value);
    //filtrar(busqueda);
  };

  //filtrar la busqueda
  let resultado = [];
  if (empleados.length <= 0) {
    resultado = resultado;
  } else {
    if (!busqueda && empleados.length >= 1) {
      resultado = empleados;
    } else {
      if (busqueda && empleados.length >= 1) {
        resultado = empleados.filter(
          (dato) => dato.curp.toLowerCase().includes(busqueda.toLowerCase())
          //console.log(dato.curp.toLowerCase().includes(busqueda.toLowerCase()))
        );
      }
    }
  }

  /*Se utiliza useEffect para obtener los datos de la base de datos*/
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch((error) => console.log(error));
  }, [empleados]);

  /*Se utiliza la clase useModal para hacer las funciones de abrir o cerrar el modal*/
  const [isOpenAgregarEmpleado, openModalAgregar, closeModalAgregar] =
    useModal(false);
  const [isOpenModificarEmpleado, openModalModificar, closeModalModificar] =
    useModal(false);

  /*Metodo para eliminar un empleado*/
  function datosEmpleados(emp) {
    Swal.fire({
      title: "¿Estas seguro de eliminar este empleado?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Elimniar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(
          `https://servidor-farmacia-1-production.up.railway.app/api/empleados/${emp}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Empleado eliminado!", "", "success");
      }
    });
  }

  function datosModificar(emp) {
    openModalModificar();
    setModificarEmpleados(emp);
  }

  function activarEmpleado(emp) {
    Swal.fire({
      title: "¿Estas seguro de activar este empleado?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Activar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetch(
          `https://servidor-farmacia-1-production.up.railway.app/api/activarempleado/${emp}`,
          {
            method: "put",
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log(error));
        Swal.fire("Empleado activado!", "", "success");
      }
    });
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      setUrl(
        "https://servidor-farmacia-1-production.up.railway.app/api/empleados"
      );
    } else {
      setUrl(
        "https://servidor-farmacia-1-production.up.railway.app/api/empleadosActivos"
      );
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
        <section className="empleados">
          <h1 className="titulos-empleados-text">Empleados</h1>
          <div className="contenedor-buscar-mostrar-empleados">
            <div className="checkbox-contenedor-empleados">
              <input
                className="input-mostrar-todos-empleados"
                type="checkbox"
                name="mostrar"
                id="mostrar"
                onChange={handleCheckbox}
              />
              <label className="mostrar-empleado-texto" htmlFor="mostrar">
                Mostrar todos los empleados
              </label>
            </div>
            <div className="contenedor-busqueda-empleado">
              <input
                className="input-busqueda-empleados"
                type="text"
                name="busquedaClasificacion"
                placeholder="Ingresa la Curp"
                onChange={handleChangeBusqueda}
                value={busqueda}
                autoComplete="off"
              />
              <span className="buscar-empleado-icono">
                <i className="bx bx-search buscar-icono-empleado"></i>
              </span>
            </div>
          </div>
          <div className="contenedor-botones-empleados">
            <button className="btn-agregar-empleado" onClick={openModalAgregar}>
              Agregar nuevo empleado
            </button>
            <CSVLink data={resultado} filename={"Tabla-empleados"}>
              <button className="btn-exportar-excel-empleados">
                Exportar a Excel
              </button>
            </CSVLink>
          </div>
          <div className="contenedor-tabla-empleado">
            <table className="tabla-empleados">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido paterno</th>
                  <th>Apellido materno</th>
                  <th>Curp</th>
                  <th>Puesto</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultado.length === 0 ? (
                  <tr>
                    <td colSpan="8">No se encontraron datos</td>
                  </tr>
                ) : (
                  resultado.map((emp) => (
                    <tr key={emp.idEmpleados}>
                      <td>{emp.idEmpleados}</td>
                      <td>{emp.nombre}</td>
                      <td>{emp.apellidoPaterno}</td>
                      <td>{emp.apellidoMaterno}</td>
                      <td>{emp.curp}</td>
                      <td>{emp.puesto}</td>
                      <td>{emp.usuario}</td>
                      <td>{emp.contrasenia}</td>
                      <td>
                        {emp.estatus === 1 ? (
                          <button onClick={() => datosModificar(emp)}>
                            <img
                              className="btn-actualizar-empleado"
                              src={Actualizar}
                              alt="Imagen boton modificar"
                            />
                          </button>
                        ) : (
                          <p className="activar-texto-empleado">Activar</p>
                        )}
                        {emp.estatus === 1 ? (
                          <button
                            onClick={() => datosEmpleados(emp.idEmpleados)}
                          >
                            <img
                              className="btn-eliminar-empleado"
                              src={Eliminar}
                              alt="Imagen boton eliminar"
                            />
                          </button>
                        ) : (
                          <button
                            className="activar"
                            onClick={() => activarEmpleado(emp.idEmpleados)}
                          >
                            <img
                              className="btn-activar-empleado"
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
            isOpen={isOpenAgregarEmpleado}
            closeModalAgregar={closeModalAgregar}
          >
            <FormularioEmpleado closeModalAgregar={closeModalAgregar} />
          </Modal>
          <Modal
            isOpen={isOpenModificarEmpleado}
            closeModalAgregar={closeModalModificar}
          >
            <FormularioModificarEmpleados
              closeModalModificar={closeModalModificar}
              modificarEmpleados={modificarEmpleados}
            />
          </Modal>
        </section>
      </>
    );
  }
}

export default AdministrarEmpleados;
