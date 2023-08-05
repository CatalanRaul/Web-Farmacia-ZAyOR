import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useForm } from "../hooks/useForm";
import "../style/ConfirmarVenta.css";
import { useModal } from "../hooks/useModal";
import FormularioDatosFactura from "./FormularioDatosFactura";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { dataDecrypt } from "../util/data-decrypt";

const datosIniciales = {
  descuento: "",
  cantidadRecibida: "",
};

const validateForm = (form) => {
  let errors = {};

  return errors;
};

function RealizarVenta({ total, closeModalRealizarVenta, data }) {
  const { form, setForm, setErrors, errors, handleChange, handleBlur } =
    useForm(datosIniciales, validateForm);

  const [
    isOpenAgregarDatosFactura,
    openModalDatosFactura,
    closeModalDatosFactura,
  ] = useModal(false);

  const [descuento, setDescuento] = useState(false);
  const [descuentoVentaTotal, setDescuentoVentaTotal] = useState("");
  const [cambioRegresar, setCambioRegresar] = useState("");
  const [dataJunta, setDataJunta] = useState([]);
  const [puesto, setPuesto] = useState("");
  const [curp, setCurp] = useState("");
  const [nombre, setNombre] = useState("");
  const [iva, setIva] = useState(0);

  const aplicarDescuento = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Ingresa la contraseña del administrador",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Validar",
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        if (login === "as") {
          setDescuento(true);
        } else {
          Swal.showValidationMessage(`Contraseña incorrecta`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Contraseña correcta`,
        });
      }
    });
  };

  useEffect(() => {
    handleSubmit();
  }, [cambioRegresar]);

  let totalIva = total + iva;

  useEffect(() => {
    if (descuento === false) {
      setDescuentoVentaTotal(totalIva);
    }
  }, [totalIva]);

  const descuentoTotal = (text) => {
    let descuentoVenta = totalIva - text;
    setDescuentoVentaTotal(descuentoVenta.toFixed(2));
    form.descuento = text;

    //console.log(descuentoVenta);
  };

  const cambio = (text) => {
    let cambioTotal = text - descuentoVentaTotal;
    setCambioRegresar(cambioTotal.toFixed(2));
    form.cantidadRecibida = text;
    //console.log(cambioTotal);
  };

  const cancelar = (e) => {
    e.preventDefault();
    setDescuento(false);
    setCambioRegresar("");
    setDescuentoVentaTotal(totalIva);
    form.descuento = datosIniciales.descuento;
    form.cantidadRecibida = datosIniciales.cantidadRecibida;
    //console.log(data);
    closeModalRealizarVenta();
  };

  const [totalSinDescuento, setTotalSinDescuento] = useState(0);
  useEffect(() => {
    setTotalSinDescuento(total);
  }, [total]);

  const handleSubmit = () => {
    setDataJunta([
      ...data,
      {
        total: total,
        ivaTotal: iva,
        totalDescuento: descuentoVentaTotal,
        descuento: form.descuento,
        cantidadRecibida: form.cantidadRecibida,
        cambioRegresar: cambioRegresar,
        curpEmpleado: curp,
        nombreEmpleado: nombre,
      },
    ]);
  };

  function handleSubmitData(e) {
    e.preventDefault();
    //setErrors(validateForm(form));

    fetch("https://servidor-farmacia-1-production.up.railway.app/api/detalleVenta", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJunta),
    })
      .then((Response) => Response.json())
      .then((error) => console.log(error));

    setDescuento(false);
    setCambioRegresar("");
    setDescuentoVentaTotal(total);
    form.descuento = datosIniciales.descuento;
    form.cantidadRecibida = datosIniciales.cantidadRecibida;
    localStorage.removeItem("procederVenta");
    localStorage.removeItem("idOrdenSostenida");
    //console.log(data);

    Swal.fire({
      title: "¿Desea realizar factura para esta venta?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        openModalDatosFactura();
        //closeModalRealizarVenta();
      } else if (result.isDenied) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Venta realizada",
          showConfirmButton: false,
          timer: 1500,
        });
        closeModalRealizarVenta();
        window.location.reload();
      }
    });
    //window.location.reload();
  }

  const navegar = useNavigate();

  const salir = () => {
    localStorage.removeItem("auth");
    navegar("/");
  };

  useEffect(() => {
    if (localStorage.getItem("auth") === null) {
      salir();
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("auth") !== null) {
      setPuesto(dataDecrypt(localStorage.getItem("puesto")));
      setCurp(dataDecrypt(localStorage.getItem("curp")));
      setNombre(dataDecrypt(localStorage.getItem("nombre")));
    }
  }, []);

  const [datosConfig, setDatosConfig] = useState([]);

  useEffect(() => {
    fetch("https://servidor-farmacia-1-production.up.railway.app/api/datosConfiguracion")
      .then((res) => res.json())
      .then((data) => setDatosConfig(data))
      .catch((error) => console.log(error));
  }, [datosConfig]);

  useEffect(() => {
    const obtenerIva = () => {
      datosConfig.map((item) => {
        setIva(total * (item.iva / 100));
      });
    };

    obtenerIva();
  });

  return (
    <>
      <h1 className="tutilo-confirmar-venta">Confirmar venta</h1>
      <div className="contenedor-formulario-confirmar-venta">
        <form onSubmit={handleSubmitData}>
          <div className="detalles-ventas">
            <div className="input-box-venta">
              <span className="detalle-venta-text">Total</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                name="total"
                value={total.toFixed(2)}
                autoComplete="off"
                maxLength="5"
                readOnly
                required
              />
            </div>
            <div className="input-box-venta">
              <span className="detalle-venta-text">iva</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                name="iva"
                value={iva.toFixed(2)}
                autoComplete="off"
                maxLength="5"
                readOnly
                required
              />
            </div>
            <div className="input-box-venta">
              <span className="detalle-venta-text">Total con IVA</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                name="totalIva"
                value={totalIva.toFixed(2)}
                autoComplete="off"
                maxLength="5"
                readOnly
                required
              />
            </div>
            {descuento === false ? (
              <button
                className="btn-aplicar-descuento"
                onClick={(e) => aplicarDescuento(e)}
              >
                aplicar descuento
              </button>
            ) : (
              <div className="input-box-venta">
                <span className="detalle-venta-text">Descuento</span>
                <input
                  className="input-total-sin-descuento"
                  type="number"
                  name="Descuento"
                  onChange={(e) => descuentoTotal(e.target.value)}
                  value={form.descuento}
                  autoComplete="off"
                  maxLength="5"
                  required
                />
              </div>
            )}
            <div className="input-box-venta">
              <span className="detalle-venta-text">Total con descuento</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                name="TotalDescuento"
                value={descuentoVentaTotal}
                readOnly
                autoComplete="off"
                maxLength="5"
                required
              />
            </div>
            <div className="input-box-venta">
              <span className="detalle-venta-text">Cantidad recibida</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                onChange={(e) => cambio(e.target.value)}
                value={form.cantidadRecibida}
                name="cantidadRecibida"
                autoComplete="off"
                maxLength="5"
                required
              />
            </div>
            <div className="input-box-venta">
              <span className="detalle-venta-text">Cambio</span>
              <input
                className="input-total-sin-descuento"
                type="number"
                name="cambio"
                value={cambioRegresar}
                autoComplete="off"
                maxLength="5"
                readOnly
                required
              />
            </div>
          </div>
          <div className="contenedor-botones-confirmar-venta">
            <input type="submit" value="Pagar" />
            <button className="btn-cancelar-venta" onClick={(e) => cancelar(e)}>
              Cerrar
            </button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isOpenAgregarDatosFactura}
        closeModalInventario={closeModalDatosFactura}
      >
        <FormularioDatosFactura
          closeModalDatosFactura={closeModalDatosFactura}
        />
      </Modal>
    </>
  );
}

export default RealizarVenta;
