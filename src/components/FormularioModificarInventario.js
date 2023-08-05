import React from "react";
import { useForm } from "../hooks/useForm";
import { useState, useEffect } from "react";
import { useFetchClasificacion } from "../hooks/useFetchClasificacion";
import Swal from "sweetalert2";
import "../style/FormularioModificarInventario.css";

const inicialForm = {
  nombre: "",
  codigoBarra: "",
  sustanciaActiva: "",
  presentacion: "",
  precioCompra: "",
  precioVenta: "",
  cantidadEnStock: "",
  lote: "",
  Clasificacion_idClasificacion: "",
};

const validateForm = (form) => {
  let errors = {};
  /*let regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/;
  //let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  //let regexUsuarios = /^.{7}$/;
  let regexContrasenia = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  if (!form.nombre) {
    errors.nombre = "El campo 'Nombre' es requerido";
  } else if (!regexNombre.test(form.nombre.trim())) {
    errors.nombre = "El campo nombre solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoPaterno) {
    errors.apellidoPaterno = "El campo 'Apellido Paterno' es requerido";
  } else if (!regexNombre.test(form.apellidoPaterno.trim())) {
    errors.apellidoPaterno =
      "El campo Apellido Paterno solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoMaterno) {
    errors.apellidoMaterno = "El campo 'Apellido Materno' es requerido";
  } else if (!regexNombre.test(form.apellidoMaterno.trim())) {
    errors.apellidoMaterno =
      "El campo Apellkido Paterno solo acepta letras y espacios en blanco";
  }

  if (!form.puesto) {
    errors.puesto = "El campo 'Puesto' es requerido";
  } else if (!regexNombre.test(form.puesto.trim())) {
    errors.puesto = "El campo Puesto solo acepta letras y espacios en blanco";
  }

  if (!form.usuario) {
    errors.usuario = "El campo 'Usuario' es requerido";
  }

  if (!form.contrasenia) {
    errors.contrasenia = "El campo 'Contraseña' es requerido";
  } else if (!regexContrasenia.test(form.contrasenia.trim())) {
    errors.contrasenia =
      "El campo Contraseña La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula";
  }*/

  return errors;
};

function FormularioModificarInventario({
  closeModalInventarioModificar,
  modificarInventario,
}) {
  const {
    form,
    setForm,
    setErrors,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(inicialForm, validateForm);

  const { data, error, loading } = useFetchClasificacion(
    "https://servidor-farmacia-1-production.up.railway.app/api/clasificacion"
  );

  useEffect(() => {
    setForm(modificarInventario);
  }, [modificarInventario]);

  function cancelarModificar() {
    setForm(inicialForm);
    closeModalInventarioModificar();
    setErrors({});
    window.location.reload();
  }

  function handleSubmitModificarInventario(e) {
    e.preventDefault();

    //console.log(modificarInventario.idProductos);

    fetch(
      `https://servidor-farmacia-1-production.up.railway.app/api/inventario/${modificarInventario.idProductos}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    )
      .then((Response) => Response.json())
      .then((error) => console.log(error));

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto modificado",
      showConfirmButton: false,
      timer: 1500,
    });

    closeModalInventarioModificar();
    //window.location.reload();
  }

  return (
    <>
      <div className="titulo-modificar-inventario">Modificar Producto</div>
      <div className="contenedor-formulario-modificar-inventario">
        <form onSubmit={handleSubmitModificarInventario}>
          <div className="detalles-modificar-inventario">
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Nombre del medicamento
              </span>
              <input
                className="input-modificar"
                type="text"
                name="nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.nombre}
                autoComplete="off"
                required
              />
              {errors.nombre && (
                <p className="mensaje-errores">{errors.nombre}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Codigo de barra
              </span>
              <input
                className="input-modificar"
                type="text"
                name="codigoBarra"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.codigoBarra}
                autoComplete="off"
                required
              />
              {errors.apellidoPaterno && (
                <p className="mensaje-errores">{errors.apellidoPaterno}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Sustancia activa
              </span>
              <input
                className="input-modificar"
                type="text"
                name="sustanciaActiva"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.sustanciaActiva}
                autoComplete="off"
                required
              />
              {errors.apellidoPaterno && (
                <p className="mensaje-errores">{errors.apellidoPaterno}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Presentacion
              </span>
              <input
                className="input-modificar"
                type="text"
                name="presentacion"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.presentacion}
                autoComplete="off"
                required
              />
              {errors.apellidoMaterno && (
                <p className="mensaje-errores">{errors.apellidoMaterno}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Precio de compra
              </span>
              <input
                className="input-modificar"
                type="text"
                name="precioCompra"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.precioCompra}
                autoComplete="off"
                required
              />
              {errors.usuario && (
                <p className="mensaje-errores">{errors.usuario}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Precio de venta
              </span>
              <input
                className="input-modificar"
                type="text"
                name="precioVenta"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.precioVenta}
                autoComplete="off"
                required
              />
              {errors.usuario && (
                <p className="mensaje-errores">{errors.usuario}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">
                Cantidad en stock
              </span>
              <input
                className="input-modificar"
                type="text"
                name="cantidadEnStock"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.cantidadEnStock}
                autoComplete="off"
                required
              />
              {errors.contrasenia && (
                <p className="mensaje-errores">{errors.contrasenia}</p>
              )}
            </div>
            <div className="input-box-modificar-inventario">
              <span className="detalle-modificar-inventario-text">Lote</span>
              <input
                className="input-modificar"
                type="text"
                name="lote"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.lote}
                autoComplete="off"
                required
              />
              {errors.apellidoPaterno && (
                <p className="mensaje-errores">{errors.apellidoPaterno}</p>
              )}
            </div>
            <div className="clasificacion-medicamento-modificar">
              <span className="clasificacion-titulo-modificar">
                Clasificacion
              </span>
              <select
                className="input-clasificacion-modificar-inventario"
                name="Clasificacion_idClasificacion"
                onChange={handleChange}
                defaultValue={form.Clasificacion_idClasificacion}
              >
                <option value="">{modificarInventario.grupo}</option>
                {data &&
                  data.map((el) => (
                    <option key={el.idClasificacion} value={el.idClasificacion}>
                      {el.grupo}
                    </option>
                  ))}
              </select>
              {errors.puesto && (
                <p className="mensaje-errores">{errors.puesto}</p>
              )}
            </div>
          </div>
          <div className="contenedor-botones-modificar-inventario">
            <input type="submit" value="Modificar" />
            <button
              className="btn-cancelar-modificar-inventario"
              type="button"
              onClick={cancelarModificar}
            >
              Cacelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormularioModificarInventario;
