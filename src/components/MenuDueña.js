import React from "react";
import Logo from "../img/logo.png";
import Icono from "../img/usuario-de-perfil.png";
import IconoInventario from "../img/listas-de-control.png";
import IconoClasificacion from "../img/clasificacion-de-datos.png";
import IconoEmpleado from "../img/empleados.png";
import IconoPedidos from "../img/pedido-en-linea.png";
import IconoVenta from "../img/zakat.png";
import "../style/menuDueña.css";
import { Link } from "react-router-dom";

function MenuDueña() {
  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="contenedorLogo">
            <img className="logo" src={Logo} alt="Logo de la farmacia" />
            <p className="nombreFarmacia">Farmacia ZAyOR</p>
          </div>
          <ul className="nav-menu">
            <li className="nav-link nav-menu">
              <button className="btn-cerrar-sesion">Cerrar sesion</button>
            </li>
            <li className="icono-usuario nav-link nav-menu">
              <img
                className="icono-usuario"
                src={Icono}
                alt="icono de usuario"
              />
            </li>
            <li className="usuario nav-link nav-menu">
              <p className="nav-menu-item">Usuario</p>
            </li>
          </ul>
        </nav>
      </header>

      <div className="contenedorPrincipal-menu">
        <Link to="/GestionInventario">
          <button className="menu">
            <img className="icono-menu" src={IconoInventario} alt="Imagen de inventario" />
            <p className="texto-menu">Inventario</p>
          </button>
        </Link>
        <Link to="/GestionarPedidos">
          <button className="menu">
            <img className="icono-menu" src={IconoPedidos} alt="Imagen de pedidos" />
            <p className="texto-menu">Pedidos</p>
          </button>
        </Link>
        <Link to="/GestionEmpleados">
          <button className="menu">
            <img className="icono-menu" src={IconoEmpleado} alt="Imagen de empleados" />
            <p className="texto-menu">Empleados</p>
          </button>
        </Link>
        <Link>
          <button className="menu">
            <img className="icono-menu" src={IconoVenta} alt="Imagen de ventas" />
            <p className="texto-menu">Ventas</p>
          </button>
        </Link>
        <Link to="/ClasificarMedicamentos">
          <button className="menu">
            <img className="icono-menu" src={IconoClasificacion} alt="Imahen de la clasificacion" />
            <p className="texto-menu">Clasificacion de medicamentos</p>
          </button>
        </Link>
      </div>
    </>
  );
}

export default MenuDueña;
