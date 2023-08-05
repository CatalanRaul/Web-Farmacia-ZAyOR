import React from "react";
import "../style/FormularioAgregarPedidos.css";
import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import Actualizar from "../img/refresh.png";
import Eliminar from "../img/eliminar.png";
import Swal from "sweetalert2";

const datosIniciales = {
  nombreProducto: "",
  cantidad: "",
  precioCompra: "",
  subTotal: "",
  id: null,
};

const validateForm = (form) => {
  let errors = {};

  if (!form.nombreProducto.trim()) {
    errors.nombreProducto = "El campo 'Nombre' es requerido";
  }

  if (!form.cantidad.trim()) {
    errors.cantidad = "El campo 'cantidad' es requerido";
  }

  if (!form.precioCompra.trim()) {
    errors.precioCompra = "El campo 'Precio de compra' es requerido";
  }

  if (!form.subTotal.trim()) {
    errors.subTotal = "El campo 'Precio de compra' es requerido";
  }

  return errors;
};

function FormularioAgregarPedido({ closeModalAgregarPedidos }) {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(datosIniciales, validateForm);

  const [listPedidos, setListPedidos] = useState([]);
  const [total, setTotal] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const suma2 = listPedidos.reduce(
      (anterior, actual) => anterior + parseFloat(actual.subTotal),
      0
    );
    setTotal(suma2);
  }, [listPedidos]);

  useEffect(() => {
    fetch(`https://servidor-farmacia-1-production.up.railway.app/api/inventario`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.log(error));
  }, []);

  let resultadoproductos = [];
  if (productos.length <= 0) {
    resultadoproductos = resultadoproductos;
  } else {
    if (productos.length >= 1) {
      resultadoproductos = productos;
    }
  }

  const buscarProducto = (text) => {
    //console.log(form.nombreProducto);
    let matches = [];
    if (text.length > 0) {
      matches = resultadoproductos.filter((produc) => {
        //const regex = new RegExp(`${text}`, "gi");
        return produc.codigoBarra.toString().toLowerCase().includes(text.toLowerCase())
        //produc.codigoBarra.toString().match(regex);
      });
    }
    //console.log(matches);
    setOpciones(matches);
    setText(text);
    form.nombreProducto = text;
  };

  const opcionElegida = (opc) => {
    setText(opc.nombre);
    datosIniciales.nombreProducto = opc.nombre;
    var precioCompraString = opc.precioCompra.toString();
    datosIniciales.precioCompra = precioCompraString;
    setProductoSeleccionado(opc);
    setOpciones([]);
  };

  let resultado = parseInt(form.cantidad) * parseFloat(form.precioCompra);

  let resultadoString = resultado.toString();

  form.subTotal = resultadoString;
  form.total = total;
  //listPedidos.total = total;

  const handleSubmitPedido = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      form.id = listPedidos.length + 1;
      setListPedidos([...listPedidos, form]);
    } else {
      return;
    }
    setForm(datosIniciales);
    datosIniciales.nombreProducto = "";
    datosIniciales.precioCompra = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //setErrors(validateForm(form));

    fetch("https://servidor-farmacia-1-production.up.railway.app/api/detallePedido", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listPedidos),
    })
      .then((Response) => Response.json())
      .then((error) => console.log(error));

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Pedido Agregado",
      showConfirmButton: false,
      timer: 1500,
    });

    setForm(datosIniciales);
    closeModalAgregarPedidos();
  };

  function cancelarAgregarPedidos() {
    setForm(datosIniciales);
    setErrors([]);
    setListPedidos([]);
    datosIniciales.nombreProducto = "";
    datosIniciales.precioCompra = "";
    closeModalAgregarPedidos();
  }

  function mostrarLista(pedido) {
    //console.log(pedido);
    setForm(pedido);
  }

  function limpiarInputs() {
    setForm(datosIniciales);
    datosIniciales.nombreProducto = "";
    datosIniciales.precioCompra = "";
  }

  function actualizarLista(e, pedido) {
    e.preventDefault();
    let lista = listPedidos.map((el) => (el.id === pedido.id ? pedido : el));
    setListPedidos(lista);
    limpiarInputs();
  }

  function eliminarLista(e, idPedido) {
    e.preventDefault();
    let lista = listPedidos.filter((el) => el.id !== idPedido);
    setListPedidos(lista);
  }

  return (
    <>
      <div className="titulo-agregar-pedido">Realizar Pedido</div>
      <div className="contenedor-principal-prdidos">
        <div className="contenedor-formulario-pedidos">
          <form onSubmit={handleSubmitPedido}>
            <div className="detalles-pedido">
              <div className="input-box-agregar-pedido">
                <span className="detalle-pedido-text">
                  Nombre del medicamento
                </span>
                <input
                  className="input-agregar"
                  type="text"
                  name="nombreProducto"
                  onBlur={handleBlur}
                  onChange={(e) => buscarProducto(e.target.value)}
                  value={form.nombreProducto}
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
                        {opc.nombre} --- ${opc.precioCompra}
                      </div>
                    ))}
                </div>
              </div>
              <div className="input-box-agregar-pedido">
                <span className="detalle-pedido-text">Cantidad</span>
                <input
                  className="input-agregar"
                  type="text"
                  name="cantidad"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.cantidad}
                  required
                />
                {errors.cantidad && (
                  <p className="mensaje-errores">{errors.cantidad}</p>
                )}
              </div>
              <div className="input-box-agregar-pedido">
                <span className="detalle-pedido-text">Precio de compra</span>
                <input
                  className="input-agregar"
                  type="text"
                  name="precioCompra"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.precioCompra}
                  required
                />
                {errors.precioCompra && (
                  <p className="mensaje-errores">{errors.precioCompra}</p>
                )}
              </div>
              <div className="input-box-agregar-pedido">
                <span className="detalle-pedido-text">Sub total</span>
                <input
                  className="input-agregar"
                  type="text"
                  name="subTotal"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={form.subTotal}
                  readOnly
                  required
                />
                {errors.precioCompra && (
                  <p className="mensaje-errores">{errors.precioCompra}</p>
                )}
              </div>
              <div className="contenedor-botones-pedidos">
                {form.id === null ? (
                  <input type="submit" value="Agregar a la lista" />
                ) : (
                  <button
                    className="btn-actualizar-pedidos"
                    onClick={(e) => actualizarLista(e, form)}
                  >
                    Actualizar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="contenedor-agregar-tabla-pedidos">
          <p className="total-pedidos">Total = $ {total}</p>
          <table className="tabla-registro-pedidos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio unitario de compra</th>
                <th>Sub total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listPedidos.length === 0 ? (
                <tr>
                  <td colSpan="4">Aun no hay pedidos</td>
                </tr>
              ) : (
                listPedidos.map((dato) => (
                  <tr key={dato.id}>
                    <td>{dato.nombreProducto}</td>
                    <td>{dato.cantidad}</td>
                    <td>${dato.precioCompra}</td>
                    <td>${dato.subTotal}</td>
                    <td>
                      <button onClick={() => mostrarLista(dato)}>
                        <img
                          className="btn-actualizar-tabla-pedidos"
                          src={Actualizar}
                          alt="Imagen boton editar"
                        />
                      </button>
                      <button onClick={(e) => eliminarLista(e, dato.id)}>
                        <img
                          className="btn-eliminar-tabla-pedidos"
                          src={Eliminar}
                          alt="Imagen boton eliminar"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {listPedidos.length === 0 ? (
            <p></p>
          ) : (
            <button
              className="btn-realizar-pedido"
              type="submit"
              onClick={handleSubmit}
            >
              Realizar Pedido
            </button>
          )}
          <button
            className="btn-cancelar-pedido"
            onClick={cancelarAgregarPedidos}
          >
            Cacelar
          </button>
        </div>
      </div>
    </>
  );
}

export default FormularioAgregarPedido;
