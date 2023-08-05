import React, { useEffect } from "react";
import { useForm } from "../hooks/useForm";
import SelectList from "./SelectList";
import { useState } from "react";
import Swal from "sweetalert2";
import "../style/FormularioAgregarProducto.css";
import { useFetchClasificacion } from "../hooks/useFetchClasificacion";

const inicialFormInventario = {
  nombre: "",
  codigoBarra: "",
  sustanciaActiva: "",
  presentacion: "",
  precioCompra: "",
  precioVenta: "",
  cantidadEnStock: "",
  lote: "",
  fechaCaducidad: "",
  Clasificacion_idClasificacion: "",
};

const validateForm = (form) => {
  let errors = {};
  let regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/;
  //let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexUsuarios = /^.{8}$/;
  let regexContrasenia = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  /*if (!form.nombre.trim()) {
    errors.nombre = "El campo 'Nombre' es requerido";
  } else if (!regexNombre.test(form.nombre.trim())) {
    errors.nombre = "El campo nombre solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoPaterno.trim()) {
    errors.apellidoPaterno = "El campo 'Apellido Paterno' es requerido";
  } else if (!regexNombre.test(form.apellidoPaterno.trim())) {
    errors.apellidoPaterno =
      "El campo Apellido Paterno solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoMaterno.trim()) {
    errors.apellidoMaterno = "El campo 'Apellido Materno' es requerido";
  } else if (!regexNombre.test(form.apellidoMaterno.trim())) {
    errors.apellidoMaterno =
      "El campo Apellido Paterno solo acepta letras y espacios en blanco";
  }

  /*if (!form.puesto.trim()) {
      errors.puesto = "El campo 'Puesto' es requerido";
    } else if (!regexNombre.test(form.puesto.trim())) {
      errors.puesto = "El campo Puesto solo acepta letras y espacios en blanco";
    }
  
    if (!form.usuario.trim()) {
      errors.usuario = "El campo 'Usuario' es requerido";
    } else if (!regexUsuarios.test(form.usuario.trim())) {
      errors.usuario = "El campo usuario no puede tener mas de 7 caracteres";
    }

  if (!form.contrasenia.trim()) {
    errors.contrasenia = "El campo 'Contraseña' es requerido";
  } else if (!regexContrasenia.test(form.contrasenia.trim())) {
    errors.contrasenia =
      "El campo Contraseña La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula";
  }*/

  return errors;
};

function FormularioAgregarInventario({ closeModalInventario }) {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(inicialFormInventario, validateForm);

  const { data, error, loading } = useFetchClasificacion(
    "https://servidor-farmacia-1-production.up.railway.app/api/clasificacion"
  );
  const [fechaMin, setFechaMin] = useState("");

  const fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();
  let fechaActual = ``;

  let mesString = mes.toString();
  let diaString = dia.toString();

  if (mesString.length === 1) {
    if (diaString.length === 1) {
      fechaActual = `${anio}-0${mes}-0${dia}`;
    } else {
      fechaActual = `${anio}-0${mes}-${dia}`;
    }
  } else {
    if (mesString.length >= 1) {
      if (diaString.length >= 1) {
        fechaActual = `${anio}-${mes}-${dia}`;
      } else {
        fechaActual = `${anio}-${mes}-0${dia}`;
      }
    } else {
      if (mesString.length >= 1 && diaString.length >= 1) {
        fechaActual = `${anio}-${mes}-${dia}`;
      }
    }
  }

  //console.log(mesString.length);

  //console.log(data, error, loading);

  //metodo para cancelar el agregar empleados

  function cancelarAgregar() {
    setForm(inicialFormInventario);
    closeModalInventario();
    setErrors({});
  }

  //Metodo para agregar los empleados a la base de datos

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      fetch("https://servidor-farmacia-1-production.up.railway.app/api/inventario", {
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
        title: "Producto Agregado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      return;
    }
    setForm(inicialFormInventario);
  };

  /*validacion fecha*/

  useEffect(() => {
    function validarFecha() {
      setFechaMin(fechaActual);
    }
    validarFecha();
  }, []);

  //console.log(mes);

  return (
    <>
      <div className="titulo-agregar-inventario">Registrar Medicamento</div>
      <div className="contenedor-formulario">
        <form onSubmit={handleSubmit}>
          <div className="detalles-medicamento">
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">
                Nombre del medicamento
              </span>
              <input
                className="input-agregar"
                type="text"
                name="nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.nombre}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Codigo de barra</span>
              <input
                className="input-agregar"
                type="text"
                name="codigoBarra"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.codigoBarra}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Sustancia Activa</span>
              <input
                className="input-agregar"
                type="text"
                name="sustanciaActiva"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.sustanciaActiva}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Presentacion</span>
              <input
                className="input-agregar"
                type="text"
                name="presentacion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.presentacion}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Precio de Compra</span>
              <input
                className="input-agregar-numerico"
                type="text"
                name="precioCompra"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.precioCompra}
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Precio de Venta</span>
              <input
                className="input-agregar-numerico"
                type="text"
                name="precioVenta"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.precioVenta}
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Cantidad en Stock</span>
              <input
                className="input-agregar-numerico"
                type="numbre"
                name="cantidadEnStock"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.cantidadEnStock}
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">Lote</span>
              <input
                className="input-agregar"
                type="text"
                name="lote"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.lote}
                autoComplete="off"
                required
              />
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-inventario-text">
                Fecha de caducidad
              </span>
              <input
                className="input-agregar"
                type="date"
                name="fechaCaducidad"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.fechaCaducidad}
                min={fechaMin}
                autoComplete="off"
                required
              />
            </div>
            <div className="clasificacion-detalles">
              <span className="clasificacion-titulo">Clasificacion</span>
              <select
                className="input-clasificacion-inventario"
                name="Clasificacion_idClasificacion"
                onChange={handleChange}
                value={form.Clasificacion_idClasificacion}
              >
                <option value="">Elige la clasificacion</option>
                {data &&
                  data.map((el) => (
                    <option key={el.idClasificacion} value={el.idClasificacion}>
                      {el.grupo}
                    </option>
                  ))}
              </select>
            </div>
            <div className="contenedor-botones">
              <input
                className="btn-agregar-inventario"
                type="submit"
                value="Guardar"
              />
              <button
                className="btn-cancelar"
                type="button"
                onClick={cancelarAgregar}
              >
                Cacelar
              </button>
            </div>
          </div>

          {/*errors.nombre && <p className="mensaje-errores">{errors.nombre}</p>*/}
          {/*errors.apellidoPaterno && (
          <p className="mensaje-errores">{errors.apellidoPaterno}</p>
        )*/}

          {/*errors.apellidoMaterno && (
          <p className="mensaje-errores">{errors.apellidoMaterno}</p>
        )*/}

          {/*errors.apellidoMaterno && (
          <p className="mensaje-errores">{errors.apellidoMaterno}</p>
        )*/}

          {/*errors.apellidoMaterno && (
          <p className="mensaje-errores">{errors.apellidoMaterno}</p>
        )*/}

          {/*errors.usuario && <p className="mensaje-errores">{errors.usuario}</p>*/}

          {/*errors.puesto && <p className="mensaje-errores">{errors.puesto}</p>*/}
        </form>
      </div>
    </>
  );
}

export default FormularioAgregarInventario;
