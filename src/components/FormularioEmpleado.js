import { useForm } from "../hooks/useForm";
import Swal from "sweetalert2";
import "../style/FormularioEmpleados.css";
import { useEffect } from "react";

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
  let regexContrasenia = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
  let regexCurp =
    /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

  if (!form.nombre.trim()) {
    errors.nombre = "El campo 'Nombre' esta bacio";
  } else if (!regexNombre.test(form.nombre.trim())) {
    errors.nombre = "El campo nombre solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoPaterno.trim()) {
    errors.apellidoPaterno = "El campo 'Apellido Paterno' esta bacio";
  } else if (!regexNombre.test(form.apellidoPaterno.trim())) {
    errors.apellidoPaterno =
      "El campo Apellido Paterno solo acepta letras y espacios en blanco";
  }

  if (!form.apellidoMaterno.trim()) {
    errors.apellidoMaterno = "El campo 'Apellido Materno' esta bacio";
  } else if (!regexNombre.test(form.apellidoMaterno.trim())) {
    errors.apellidoMaterno =
      "El campo Apellido Paterno solo acepta letras y espacios en blanco";
  }

  if (!form.curp.trim()) {
    errors.curp = "El campo 'Curp' esta bacio";
  } else if (!regexCurp.test(form.curp.trim())) {
    errors.curp = "La curp ingresada no es valida";
  }

  if (!form.usuario.trim()) {
    errors.usuario = "El campo 'Usuario' esta bacio";
  } else if (!regexUsuarios.test(form.usuario.trim())) {
    errors.usuario = "El usuario solo acepta letras y numeros";
  }

  if (!form.contrasenia.trim()) {
    errors.contrasenia = "El campo 'Contraseña' esta bacio";
  } else if (!regexContrasenia.test(form.contrasenia.trim())) {
    errors.contrasenia =
      "El campo Contraseña La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula";
  }

  if (!form.puesto.trim()) {
    errors.puesto = "El campo 'Puesto' esta bacio";
  }

  return errors;
};

function FormularioEmpleado({ closeModalAgregar }) {
  //metodos y estados para agregar datos a la base de datos
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(inicialForm, validateForm);

  //metodo para cancelar el agregar empleados

  function cancelarAgregar() {
    setForm(inicialForm);
    closeModalAgregar();
    setErrors({});
  }

  //Metodo para agregar los empleados a la base de datos

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      fetch("https://servidor-farmacia-1-production.up.railway.app/api/empleados", {
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
        title: "Empleado agregado",
        showConfirmButton: false,
        timer: 1500,
      });

      setErrors([]);
      setForm(inicialForm);
    } else {
      console.log("Hay errores" + Object.keys(errors).length);
    }
  };

  return (
    <>
      <div className="titulo-agregar-empleado">Registrar empleado</div>
      <div className="contenedor-formulario-empleado">
        <form onSubmit={handleSubmit}>
          <div className="detalles-agregar-empleado">
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Nombre</span>
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
              {errors.nombre && (
                <p className="mensaje-errores">{errors.nombre}</p>
              )}
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Apellido Paterno</span>
              <input
                className="input-agregar"
                type="text"
                name="apellidoPaterno"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.apellidoPaterno}
                autoComplete="off"
                required
              />
              {errors.apellidoPaterno && (
                <p className="mensaje-errores">{errors.apellidoPaterno}</p>
              )}
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Apellido Materno</span>
              <input
                className="input-agregar"
                type="text"
                name="apellidoMaterno"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.apellidoMaterno}
                autoComplete="off"
                required
              />
              {errors.apellidoMaterno && (
                <p className="mensaje-errores">{errors.apellidoMaterno}</p>
              )}
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Curp</span>
              <input
                className="input-agregar"
                type="text"
                name="curp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.curp}
                autoComplete="off"
                required
              />
              {errors.curp && <p className="mensaje-errores">{errors.curp}</p>}
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Usuario</span>
              <input
                className="input-agregar"
                type="text"
                name="usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.usuario}
                autoComplete="off"
                required
              />
              {errors.usuario && (
                <p className="mensaje-errores">{errors.usuario}</p>
              )}
            </div>
            <div className="input-box-agregar-inventario">
              <span className="detalle-empleado-text">Contraseña</span>
              <input
                className="input-agregar"
                type="password"
                name="contrasenia"
                onBlur={handleBlur}
                onChange={handleChange}
                value={form.contrasenia}
                autoComplete="off"
                required
              />
              {errors.contrasenia && (
                <p className="mensaje-errores">{errors.contrasenia}</p>
              )}
            </div>
            <div className="input-puesto-detalles">
              <span className="puesto-titulo">Puesto</span>
              <select
                name="puesto"
                className="input-agregar-puesto-empleado"
                onChange={handleChange}
                value={form.puesto}
                required
              >
                <option value="">Elige un puesto</option>
                <option value="Vendedor">Vendedor</option>
              </select>

              {errors.puesto && (
                <p className="mensaje-errores">{errors.puesto}</p>
              )}
            </div>
            <div className="contenedor-botones-empleados">
              <input type="submit" value="Guardar" />
              <button
                className="btn-cancelar-empleados"
                type="button"
                onClick={cancelarAgregar}
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

export default FormularioEmpleado;
