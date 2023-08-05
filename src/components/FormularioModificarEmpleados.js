import { useEffect, useState } from "react";
import { useForm } from "../hooks/useForm";
import Swal from "sweetalert2";
import "../style/FormularioModificarEmpleado.css";

// se inicializan las variables
const inicialForm = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  curp: "",
  puesto: "",
  usuario: "",
  contrasenia: "",
};
//funcion para validar los campos
const validateForm = (form) => {
  let errors = {};
  let regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/;
  let regexUsuarios = /^[a-zA-Z0-9\_\-]{4,16}$/;
  //let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  //let regexUsuarios = /^.{7}$/;
  let regexContrasenia = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
  let regexCurp =
    /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

  if (!form.nombre.trim()) {
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

  if (!form.curp.trim()) {
    errors.curp = "El campo 'Curp' es requerido";
  } else if (!regexCurp.test(form.curp.trim())) {
    errors.curp = "La curp ingresada no es valida";
  }

  if (!form.usuario.trim()) {
    errors.usuario = "El campo 'Usuario' es requerido";
  } else if (!regexUsuarios.test(form.usuario.trim())) {
    errors.usuario = "El usuario solo acepta letras y numeros";
  }

  if (!form.contrasenia.trim()) {
    errors.contrasenia = "El campo 'Contraseña' es requerido";
  } else if (!regexContrasenia.test(form.contrasenia.trim())) {
    errors.contrasenia =
      "El campo Contraseña La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula";
  }

  return errors;
};

function FormularioModificarEmpleados({
  closeModalModificar,
  modificarEmpleados,
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

  useEffect(() => {
    setForm(modificarEmpleados);
  }, [modificarEmpleados]);

  function cancelarModificar() {
    setForm(inicialForm);
    closeModalModificar();
    setErrors({});
    window.location.reload();
  }

  function handleSubmitModificar(e) {
    e.preventDefault();
    //console.log(modificarEmpleados.idEmpleados);

    fetch(
      `https://servidor-farmacia-1-production.up.railway.app/api/empleados/${modificarEmpleados.idEmpleados}`,
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
      title: "Empleado modificado",
      showConfirmButton: false,
      timer: 1500,
    });
    closeModalModificar();
  }
  return (
    <>
      <div className="titulo-modificar-empleado">Modificar empleado</div>
      <div className="contenedor-formulario-modificar-empleado">
        <form onSubmit={handleSubmitModificar}>
          <div className="detalles-modificar-empleado">
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">Nombre</span>
              <input
                className="input-modificar"
                type="text"
                name="nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.nombre}
                required
              />
              {errors.nombre && (
                <p className="mensaje-errores">{errors.nombre}</p>
              )}
            </div>
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">
                Apellido Paterno
              </span>
              <input
                className="input-modificar"
                type="text"
                name="apellidoPaterno"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.apellidoPaterno}
                required
              />
              {errors.apellidoPaterno && (
                <p className="mensaje-errores">{errors.apellidoPaterno}</p>
              )}
            </div>
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">
                Apellido Materno
              </span>
              <input
                className="input-modificar"
                type="text"
                name="apellidoMaterno"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.apellidoMaterno}
                required
              />
              {errors.apellidoMaterno && (
                <p className="mensaje-errores">{errors.apellidoMaterno}</p>
              )}
            </div>
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">Curp</span>
              <input
                className="input-modificar"
                type="text"
                name="curp"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.curp}
                required
              />
              {errors.curp && <p className="mensaje-errores">{errors.curp}</p>}
            </div>
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">Usuario</span>
              <input
                className="input-modificar"
                type="text"
                name="usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.usuario}
                required
              />
              {errors.usuario && (
                <p className="mensaje-errores">{errors.usuario}</p>
              )}
            </div>
            <div className="input-box-modificar-empleado">
              <span className="detalle-modificar-empleado-text">
                Contraseña
              </span>
              <input
                className="input-modificar"
                type="password"
                name="contrasenia"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={form.contrasenia}
                required
              />
              {errors.contrasenia && (
                <p className="mensaje-errores">{errors.contrasenia}</p>
              )}
            </div>
            <div className="modificar-puesto-detalles">
              <span className="detalle-modificar-empleado-text">Puesto</span>
              <select
                className="input-modificar-puesto"
                name="puesto"
                onChange={handleChange}
                value={form.puesto}
              >
                <option value="">Elige un puesto</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Responsable Sanitario">
                  Responsable Sanitario
                </option>
              </select>
              {errors.puesto && (
                <p className="mensaje-errores">{errors.puesto}</p>
              )}
            </div>
            <div className="contenedor-botones-modificar-empleado">
              <input type="submit" value="Modificar" />
              <button
                className="btn-cancelar-modificar-empleado"
                type="button"
                onClick={cancelarModificar}
              >
                Cacelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormularioModificarEmpleados;
