import React from "react";
import logo from "../img/logo.png";
import "../style/login.css";
import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import axios from "axios";

import { Route, useHistory, useNavigate } from "react-router-dom";
import { setDataUser } from "../store/slices/user";
import { useDispatch } from "react-redux";

import { dataEncrypt } from "../util/data-encrypt";
import { dataDecrypt } from "../util/data-decrypt";

const valoresIniciales = {
  usuario: "",
  contrasenia: "",
};

const validateForm = (form) => {
  let errors = [];
  return errors;
};

function Login() {
  const navegar = useNavigate();

  const dispatch = useDispatch();

  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(valoresIniciales, validateForm);

  const [user, setUser] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(form);
    setErrors(validateForm(form));
    if (Object.keys(errors).length === 0) {
      axios
        .post("https://servidor-farmacia-1-production.up.railway.app/api/login", form)
        .then(({ data }) => {
          if (data.length > 0) {
            localStorage.setItem("auth", dataEncrypt('"yes"'));
            //console.log(data[0]);
            let dataUser = data[0];

            localStorage.setItem("puesto", dataEncrypt(dataUser.puesto));
            localStorage.setItem("curp", dataEncrypt(dataUser.curp));
            localStorage.setItem("nombre", dataEncrypt(dataUser.nombre));

            /*//console.log(usuario);
            //setUser([usuario]);*/

            dispatch(setDataUser(dataUser));
            navegar("/VentaMedicamento");
          } else {
          }
        })
        .catch(({ response }) => {
          console.log(response.data);
        });
      setErrors([]);
      setForm(valoresIniciales);
    } else {
      console.log("Hay errores" + Object.keys(errors).length);
    }
  };

  const [puesto, setPuesto] = useState("");
  const [curp, setCurp] = useState("");

  useEffect(() => {
    if (localStorage.getItem("auth") !== null) {
      setPuesto(dataDecrypt(localStorage.getItem("puesto")));
      setCurp(dataDecrypt(localStorage.getItem("curp")));
    }
  }, []);

  if (localStorage.getItem("auth") !== null) {
    navegar("/VentaMedicamento");
  }


  return (
    <div className="contenedor-principal">
      <div className="contenedor">
        <img src={logo} alt="Logo de la farmacia" />
        <h1>Farmacia ZAyOR</h1>
        <h2>Inicio de sesion</h2>

        <form onSubmit={handleSubmit}>
          <label form="usuario">Usuario</label>
          <input
            className="inputs-datos"
            type="text"
            name="usuario"
            onChange={handleChange}
            value={form.usuario}
          />

          <label form="password">Contraseña</label>
          <input
            className="inputs-datos"
            type="password"
            name="contrasenia"
            onChange={handleChange}
            value={form.contrasenia}
          />

          <input type="submit" value="Iniciar Sesion" />
        </form>
      </div>
    </div>
  );
}

export default Login;
