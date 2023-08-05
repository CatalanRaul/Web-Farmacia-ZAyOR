import axios from "axios";
import React, { useEffect, useState } from "react";
import Logo from "../img/logo.png";
import "../style/Configuraciones.css";
import { Link, useNavigate } from "react-router-dom";
import { dataDecrypt } from "../util/data-decrypt";
import { useForm } from "../hooks/useForm";

const inicialFormInventario = {
  iva: "",
  tiempoOrdenes: "",
};

const validateForm = (form) => {
  let errors = {};

  return errors;
};

function Configuraciones() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageLogo, setImageLogo] = useState("");
  const [datosConfig, setDatosConfig] = useState([]);

  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(inicialFormInventario, validateForm);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/imageLogo")
      .then((data) => setImageLogo(data.url))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/datosConfiguracion")
      .then((res) => res.json())
      .then((data) => setDatosConfig(data))
      .catch((error) => console.log(error));
  }, [datosConfig]);
  //console.log(previewImage.url);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Previsualizar la imagen seleccionada
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  //console.log(selectedImage);

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

  const handleSubmit = async () => {
    if (selectedImage !== null) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        await axios.post("https://servidor-farmacia-1-production.up.railway.app/api/configuraciones", formData);
        console.log("Imagen subida con éxito");
      } catch (error) {
        console.error("Error al subir la imagen", error);
      }
    }

    fetch("https://servidor-farmacia-1-production.up.railway.app/api/EditarDatosConfig", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((Response) => Response.json())
      .then((error) => console.log(error));

    window.location.reload();
  };

  let resultado = [];
  if (datosConfig.length <= 0) {
    resultado = resultado;
  } else {
    if (datosConfig.length >= 1) {
      resultado = datosConfig;
    }
  }

  resultado.map((item) => {
    inicialFormInventario.iva = item.iva;
    inicialFormInventario.tiempoOrdenes = item.tiempoOrdenes;
  });

  const [tiempo, setTiempo] = useState(0);
  const [tiempoTra, setTiempoTra] = useState(0);

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
                        <span className="text nav-text">Lista de clientes</span>
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
                        <span className="text nav-text">Lista de clientes</span>
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

      <div className="configuraciones-sistema">
        <div className="titulo-configuraciones-sistema">Configuracion</div>
        <div className="contenedor-formulario-configuraciones">
          <form>
            <div className="detalles-configuraciones">
              <div className="input-box-configuraciones">
                <span className="detalle-text-configuraciones">
                  Logo de la farmacia
                </span>
                <input type="file" onChange={handleImageUpload} />
                {previewImage === "" ? (
                  <div>
                    <img
                      src={imageLogo}
                      alt="Preview"
                      className="imagen-logo-previo"
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="imagen-logo-previo"
                    />
                  </div>
                )}
              </div>
              <div className="input-box-configuraciones">
                <span className="detalle-text-configuraciones">
                  Modificar IVA
                </span>
                <input
                  type="text"
                  placeholder="IVA"
                  name="iva"
                  defaultValue={form.iva}
                  onChange={handleChange}
                />
              </div>
              <div className="input-box-configuraciones">
                <span className="detalle-text-configuraciones">
                  Duracion de las ordenes sostenidad
                </span>
                <input
                  type="text"
                  placeholder="Duracion de las ordenes sostenidas"
                  name="tiempoOrdenes"
                  onChange={handleChange}
                  defaultValue={form.tiempoOrdenes}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="contenedor-botones-configuracion">
          <button
            className="btn-guardar-configuracion"
            onClick={() => handleSubmit()}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

export default Configuraciones;
