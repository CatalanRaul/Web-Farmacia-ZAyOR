import React from "react";
import Logo from "../img/logo.png";
import { Link, useLocation, useParams } from "react-router-dom";
import "../style/VentaDeMedicamento.css";
import { useForm } from "../hooks/useForm";
import { useState, useEffect } from "react";
import { useModal } from "../hooks/useModal";
import Modal from "./Modal";
import RealizarVenta from "./RealizarVenta";
import Swal from "sweetalert2";
import { useHistory, useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";
import { useSelector } from "react-redux";

import { dataDecrypt } from "../util/data-decrypt";

const datosIniciales = {
  nombre: "",
  cantidad: "",
};

const validateForm = (form) => {
  let errors = {};

  return errors;
};

function VentaDeMedicamento() {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(datosIniciales, validateForm);

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [text, setText] = useState("");
  const [listaCarrito, setListaCarrito] = useState(() => {
    const savePendientes = localStorage.getItem("procederVenta");
    if (savePendientes) {
      return JSON.parse(savePendientes);
    } else {
      return [];
    }
  });
  const [total, setTotal] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [borrar, setBorrar] = useState(false);
  const [masCinco, setMasCinco] = useState(false);
  const [listaPendientes, setListaPendientes] = useState(() => {
    const savePendientes = localStorage.getItem("pendientes");
    if (savePendientes) {
      return JSON.parse(savePendientes);
    } else {
      return [];
    }
  });
  const [usuario1, setUsuario1] = useState([]);
  const [dataUser, setDataUser] = useState([]);

  const [pendientesLocal, setPendientesLocal] = useState([]);

  const [imageLogo, setImageLogo] = useState("");

  /*useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);*/

  const [isOpenRealizarVenta, openModalRealizarVenta, closeModalRealizarVenta] =
    useModal(false);

  useEffect(() => {
    const suma2 = listaCarrito.reduce(
      (anterior, actual) => anterior + actual.precioVenta * actual.cantidad,
      0
    );
    setTotal(suma2);
  }, [listaCarrito]);

  useEffect(() => {
    fetch(
      `https://servidor-farmacia-1-production.up.railway.app/api/inventario`
    )
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  const buscarProducto = (text, e) => {
    e.preventDefault();
    //console.log(form.nombreProducto);
    let matches = [];
    if (text.length > 0) {
      matches = resultado.filter((produc) => {
        //const regex = new RegExp(`${text}`, "gi");
        //let busca = parseInt(regex);
        return (
          produc.codigoBarra
            .toString()
            .toLowerCase()
            .includes(text.toLowerCase()) ||
          produc.nombre.toString().toLowerCase().includes(text.toLowerCase())
        );
        //produc.codigoBarra.toString().match(regex);
      });
    }
    //console.log(matches);
    setOpciones(matches);
    setText(text);
    form.nombre = text;
  };

  useEffect(() => {
    if (listaCarrito <= 0) {
      setBorrar(false);
      localStorage.removeItem("procederVenta");
      localStorage.removeItem("idOrdenSostenida");
    }
  }, [listaCarrito]);

  const opcionElegida = (opc, e) => {
    e.preventDefault();
    setText(opc.nombre);
    //console.log(opc);

    //var precioCompraString = opc.precioCompra.toString();
    //datosIniciales.precioCompra = precioCompraString;

    let resultado = listaCarrito.filter((dato) => dato.id === opc.idProductos);

    if (resultado.length >= 1) {
      listaCarrito.forEach((item) => {
        if (item.id === opc.idProductos) {
          item.cantidad = item.cantidad + 1;
          item.subTotal = item.precioVenta * item.cantidad;
        }

        setListaCarrito([...listaCarrito]);
        setCantidad(item.cantidad);
      });
    } else {
      setListaCarrito([
        ...listaCarrito,
        {
          id: opc.idProductos,
          codigoBarra: opc.codigoBarra,
          nombre: opc.nombre,
          precioVenta: opc.precioVenta,
          cantidad: 1,
          subTotal: opc.precioVenta,
        },
      ]);
    }

    setProductoSeleccionado(opc);
    //form.nombre = datosIniciales.nombre;
    setForm(datosIniciales);
    setText("");
    setOpciones([]);
  };

  const resta = (id, cant, e) => {
    if (cant === "Mas de 5") {
      cant = 6;
    }
    listaCarrito.forEach((item) => {
      if (item.id === id) {
        if (cant.length === 0 || cant < 1) {
          item.cantidad = 1;
          item.subTotal = item.precioVenta;
        } else {
          if (cant.length >= 1 || cant >= 1 || cant === "Mas de 5") {
            item.cantidad = parseInt(cant);
            item.subTotal = item.precioVenta * item.cantidad;
          }
        }
      }
      setListaCarrito([...listaCarrito]);
      //setCantidad(cant);
    });
  };

  function eliminarLista(e, idVenta) {
    let lista = listaCarrito.filter((el) => el.id !== idVenta);
    setListaCarrito(lista);
  }

  const permisoBorrar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Ingresa la contraseña del administrador",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Validar",
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        if (login === "as") {
          setBorrar(true);
        } else {
          Swal.showValidationMessage(`Contraseña incorrecta`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Contraseña correcta`,
        });
      }
    });
  };

  //console.log(listaCarrito);

  let resultado = [];
  if (productos.length <= 0) {
    resultado = resultado;
  } else {
    if (productos.length >= 1) {
      resultado = productos;
    }
  }

  const obtenerCantidad = (canti) => {
    //console.log(canti);
    let cantidadProducto = cantidad;
    if (cantidadProducto.length === 0) {
      setCantidad(1);
      setMasCinco(true);
    } else {
      setCantidad(canti);
      setMasCinco(true);
    }
  };

  const focus = () => {
    setMasCinco(true);
  };

  const restaMasCinco = (id) => {
    listaCarrito.forEach((item) => {
      if (item.id === id) {
        if (cantidad.length === 0 || cantidad < 1) {
          item.cantidad = 1;
          item.subTotal = item.precioVenta;
        } else {
          if (
            cantidad.length >= 1 ||
            cantidad >= 1 ||
            cantidad === "Mas de 5"
          ) {
            item.cantidad = parseInt(cantidad);
            item.subTotal = item.precioVenta * item.cantidad;
          }
        }
      }
      setListaCarrito([...listaCarrito]);
      //setCantidad(cant);
      setMasCinco(false);
    });
  };

  const [idListaPendientes, setIdListaPendientes] = useState(0);

  useEffect(() => {
    setIdListaPendientes(localStorage.getItem("idOrdenSostenida"));
  }, []);

  const agregarListaPendientes = () => {
    let id;
    if (idListaPendientes === 0 || idListaPendientes === null) {
      id = Math.floor(Math.random() * 200);
    } else {
      id = idListaPendientes;
    }

    setListaPendientes([
      ...listaPendientes,
      {
        id: id,
        fecha: fechaActual1,
        productos: [listaCarrito],
        total: total,
      },
    ]);

    setListaCarrito([]);
    setIdListaPendientes(0);
    localStorage.removeItem("procederVenta");
    localStorage.removeItem("idOrdenSostenida");
  };

  useEffect(() => {
    localStorage.setItem("pendientes", JSON.stringify(listaPendientes));
  }, [listaPendientes]);

  const procederAVender = (dato) => {
    //console.log(dato.productos);

    //setIdListaPendientes(dato.id);

    for (let i = 0; i < dato.productos.length; i++) {
      //console.log(dato.productos[i]);
      //agregar el producto que se va a realizar la venta
      //localStorage.setItem("procederVenta", JSON.stringify(dato.productos[i]));
      setListaCarrito(dato.productos[i]);
    }

    let listaPendiente = listaPendientes.filter((el) => el.id !== dato.id);
    setListaPendientes(listaPendiente);
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
        <div className="venta-medicamento">
          <h1 className="titulo-venta-medicamento">Venta de medicamento</h1>
          <div className="contenedor-formulario-venta-medicamento">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="detalles-buscar-producto-venta">
                <div className="input-box-venta-producto">
                  <span className="detalle-venta-text">
                    Codigo de barra o nombre del medicamento
                  </span>
                  <input
                    className="input-agregar"
                    type="text"
                    name="nombre"
                    onBlur={handleBlur}
                    onChange={(e) => buscarProducto(e.target.value, e)}
                    value={text}
                    autoComplete="off"
                    required
                  />
                  {errors.nombreProducto && (
                    <p className="mensaje-errores">{errors.nombreProducto}</p>
                  )}
                  <div className="contenedor-opciones">
                    {opciones &&
                      opciones.map((opc, index) =>
                        opc.cantidadEnStock <= 0 ? (
                          <div className="opciones">
                            {opc.nombre} --- Producto agotado
                          </div>
                        ) : opc.estatus === 0 ? (
                          <div className="opciones">
                            {opc.nombre} --- Producto caducado
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="opciones"
                            onClick={(e) => opcionElegida(opc, e)}
                          >
                            {opc.nombre} --- {opc.cantidadEnStock} --- fecha
                            Caducidad: {opc.fecha}
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="contenedor-botones-venta">
            {listaCarrito < 1 ? (
              <></>
            ) : (
              <button
                className="btn-realizar-compra"
                onClick={openModalRealizarVenta}
              >
                Proceder al pago
              </button>
            )}
            {listaCarrito.length === 0 ? (
              <></>
            ) : (
              <button
                className="btn-agregar-lista-pendiente"
                onClick={(e) => agregarListaPendientes()}
              >
                Sostener orden
              </button>
            )}
            {listaCarrito.length === 0 ? (
              <></>
            ) : (
              <button
                className="btn-permiso-borrar"
                onClick={(e) => permisoBorrar(e)}
              >
                Borrar productos
              </button>
            )}
          </div>
          <div className="mostrar-lista-carrito">
            <div className="contenedor1">
              <div className="Total-compra">
                <p>Total: ${total.toFixed(2)} </p>
              </div>
              <table className="tabla-venta-productos">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Sub Total</th>
                    {borrar === false ? <></> : <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {listaCarrito.length === 0 ? (
                    <tr>
                      <td colSpan="5">Aun no hay productos</td>
                    </tr>
                  ) : (
                    listaCarrito.map((lista) => (
                      <tr key={lista.id}>
                        <td>{lista.nombre}</td>
                        <td>{lista.precioVenta.toFixed(2)}</td>
                        <td>
                          {lista.cantidad <= 5 ? (
                            <select
                              name="cantidad"
                              onChange={(e) =>
                                resta(lista.id, e.target.value, e)
                              }
                              value={lista.cantidad}
                            >
                              <option defaultValue="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="Mas de 5">Mas de 5</option>
                            </select>
                          ) : (
                            <div>
                              <input
                                type="number"
                                className="input-cantidad"
                                //value={lista.cantidad}
                                onChange={(e) =>
                                  obtenerCantidad(e.target.value)
                                }
                                onFocus={(e) => focus()}
                                defaultValue={lista.cantidad}
                              />
                              {masCinco === true ? (
                                <button
                                  className="btn-actualizar-cantidad"
                                  onClick={(e) => restaMasCinco(lista.id)}
                                >
                                  Actualizar
                                </button>
                              ) : (
                                <></>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{lista.subTotal.toFixed(2)}</td>
                        {borrar === false ? (
                          <></>
                        ) : (
                          <td>
                            <button onClick={(e) => eliminarLista(e, lista.id)}>
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Modal
            isOpen={isOpenRealizarVenta}
            closeModalAgregar={closeModalRealizarVenta}
          >
            <RealizarVenta
              total={total}
              closeModalRealizarVenta={closeModalRealizarVenta}
              data={listaCarrito}
            />
          </Modal>
        </div>
      </>
    );
  }
}

export default VentaDeMedicamento;
