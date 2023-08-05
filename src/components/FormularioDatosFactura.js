import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "../hooks/useForm";
import "../style/FormularioDatosFactura.css";
import Swal from "sweetalert2";

const inicialFormFactura = {
  rfc: "",
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  razonSocial: "",
  regimenFiscal: "",
  codigoPostal: "",
};

const validateForm = (form) => {
  let errors = {};

  return errors;
};

function FormularioDatosFactura({ closeModalDatosFactura }) {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(inicialFormFactura, validateForm);

  const [clientes, setClientes] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [text, setText] = useState("");

  const cerrar = () => {
    closeModalDatosFactura();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Compra reaizada",
      showConfirmButton: false,
      timer: 1500,
    });
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      fetch("https://servidor-farmacia-1-production.up.railway.app/api/datosFactura", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((Response) => Response.json())
        .then((error) => console.log(error));

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha registrado correctaente",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      return;
    }

    setForm(inicialFormFactura);
    closeModalDatosFactura();
    window.location.reload();
  };

  useEffect(() => {
    fetch(`https://servidor-farmacia-1-production.up.railway.app/api/registroDatosFactura`)
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((error) => console.log(error));
  }, []);

  let resultadoClientes = [];
  if (clientes.length <= 0) {
    resultadoClientes = resultadoClientes;
  } else {
    if (clientes.length >= 1) {
      resultadoClientes = clientes;
    }
  }

  const buscarProducto = (text) => {
    //console.log(form.nombreProducto);
    let matches = [];
    if (text.length > 0) {
      matches = resultadoClientes.filter((produc) => {
        //const regex = new RegExp(`${text}`, "gi");
        return produc.rfc
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase());
        //produc.codigoBarra.toString().match(regex);
      });
    }
    //console.log(matches);
    setOpciones(matches);
    setText(text);
    form.rfc = text;
  };

  const opcionElegida = (opc) => {
    setText(opc.nombre);
    form.rfc = opc.rfc;
    form.nombre = opc.nombre;
    form.apellidoPaterno = opc.apellidoPaterno;
    form.apellidoMaterno = opc.apellidoMaterno;
    form.razonSocial = opc.razonSocial;
    form.regimenFiscal = opc.regimenFiscal;
    form.codigoPostal = opc.codigoPostal; 
    //var precioCompraString = opc.precioCompra.toString();
    //datosIniciales.precioCompra = precioCompraString;
    setProductoSeleccionado(opc);
    setOpciones([]);
  };

  return (
    <>
      <div className="titulo-agregar-factura">Agregar datos de la factura</div>
      <div className="contenedor-formulario-factura">
        <form onSubmit={handleSubmit}>
          <div className="detalles-factura">
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">RFC</span>
              <input
                className="input-agregar"
                type="text"
                name="rfc"
                onBlur={handleBlur}
                onChange={(e) => buscarProducto(e.target.value)}
                value={form.rfc}
                autoComplete="off"
                required
              />
              {errors.nombreProducto && (
                <p className="mensaje-errores">{errors.nombreProducto}</p>
              )}
              <div className="contenedor-opciones">
                {opciones &&
                  opciones.map((opc, index) => (
                    <div
                      key={index}
                      className="opciones"
                      onClick={() => opcionElegida(opc)}
                    >
                      {opc.rfc} --- {opc.nombre}
                    </div>
                  ))}
              </div>
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Nombre</span>
              <input
                className="input-nombre"
                type="text"
                name="nombre"
                onChange={handleChange}
                value={form.nombre}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Apellido Paterno</span>
              <input
                className="input-AP"
                type="text"
                name="apellidoPaterno"
                onChange={handleChange}
                value={form.apellidoPaterno}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Apellido Materno</span>
              <input
                className="input-AM"
                type="text"
                name="apellidoMaterno"
                onChange={handleChange}
                value={form.apellidoMaterno}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Razon social</span>
              <input
                className="input-razon-social"
                type="text"
                name="razonSocial"
                onChange={handleChange}
                value={form.razonSocial}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Regimen fiscal</span>
              <input
                className="input-regimen-fiscal"
                type="text"
                name="regimenFiscal"
                onChange={handleChange}
                value={form.regimenFiscal}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-factura">
              <span className="detalle-factura-text">Codigo postal</span>
              <input
                className="input-codigo-postal"
                type="text"
                name="codigoPostal"
                onChange={handleChange}
                value={form.codigoPostal}
                autoComplete="off"
                required
              />
            </div>
          </div>
          <div className="contenedor-botones-factura">
            <input type="submit" value="Agregar" />
            <button
              className="btn-cancelar-factura"
              type="button"
              onClick={() => cerrar()}
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormularioDatosFactura;
