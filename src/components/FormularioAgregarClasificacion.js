import React from "react";
import "../style/FormularioAgregarClasificacion.css";
import Swal from "sweetalert2";
import { useForm } from "../hooks/useForm";

const inicialFormClasificacion = {
  grupo: "",
  advertencias: "",
  informacionFarmacologica: "",
};

const validateForm = (form) => {
  let errors = {};
  let regexNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/;
  //let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  let regexUsuarios = /^.{8}$/;
  let regexContrasenia = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  if (!form.grupo.trim()) {
    errors.grupo = "El campo 'Nombre' es requerido";
  } else if (!regexNombre.test(form.grupo.trim())) {
    errors.grupo = "El campo nombre solo acepta letras y espacios en blanco";
  }

  if (!form.advertencias.trim()) {
    errors.advertencias = "El campo 'Advertencias' es requerido";
  } else if (!regexNombre.test(form.advertencias.trim())) {
    errors.advertencias =
      "El campo Advertencias solo acepta letras y espacios en blanco";
  }

  if (!form.informacionFarmacologica.trim()) {
    errors.informacionFarmacologica =
      "El campo 'Informacion Farmacologica' es requerido";
  } else if (!regexNombre.test(form.informacionFarmacologica.trim())) {
    errors.informacionFarmacologica =
      "El campo Informacion Farmacologica solo acepta letras y espacios en blanco";
  }

  return errors;
};

function FormularioAgregarClasificacion({ closeModalClasificacion }) {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(inicialFormClasificacion, validateForm);

  function cancelarAgregar() {
    setForm(inicialFormClasificacion);
    closeModalClasificacion();
    setErrors({});
  }

  const handleSubmitClasificacion = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      fetch("https://servidor-farmacia-1-production.up.railway.app/api/clasificacion", {
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
        title: "Clasificacion Agregada",
        showConfirmButton: false,
        timer: 1500,
      });

    } else {
      return;
    }

    setForm(inicialFormClasificacion);
    closeModalClasificacion();
  };

  return (
    <>
      <div className="titulo-agregar-clasificacion">Agregar Clasificacion</div>
      <div className="contenedor-principal-clasificacion">
        <div className="contenedor-formulario-clasificacion">
          <form onSubmit={handleSubmitClasificacion}>
            <div className="detalles-clasificacion">
              <div className="input-box-agregar-clasificacion">
                <span className="detalle-clasificacion-text">Grupo</span>
                <input
                  className="input-agregar-clasificacion"
                  type="text"
                  name="grupo"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.grupo}
                  required
                />
                {errors.grupo && (
                  <p className="mensaje-errores">{errors.grupo}</p>
                )}
              </div>
              <div className="input-box-agregar-clasificacion">
                <span className="detalle-clasificacion-text">Advertencias</span>
                <textarea
                  className="input-agregar-clasificacion textArea"
                  name="advertencias"
                  cols="50"
                  rows="5"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.advertencias}
                />
                {errors.advertencias && (
                  <p className="mensaje-errores">{errors.advertencias}</p>
                )}
              </div>
              <div className="input-box-agregar-clasificacion">
                <span className="detalle-clasificacion-text">
                  Informacion farmacologica
                </span>
                <textarea
                  className="input-agregar-clasificacion textArea"
                  name="informacionFarmacologica"
                  cols="50"
                  rows="5"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.informacionFarmacologica}
                />
                {errors.informacionFarmacologica && (
                  <p className="mensaje-errores">
                    {errors.informacionFarmacologica}
                  </p>
                )}
              </div>
            </div>
            <div className="contenedor-botones-clasificacion">
              <input type="submit" value="Guardar" />
              <button
                className="btn-cancelar-clasificacion"
                type="button"
                onClick={cancelarAgregar}
              >
                Cacelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormularioAgregarClasificacion;
