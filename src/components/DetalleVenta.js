import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../style/DetalleVentas.css";

function DetalleVenta({ closeModalDetalleVenta, detalleVenta }) {
  const [detalle, setDetalle] = useState([]);
  const [total, setTotal] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [totalDescuento, setTotalDescuento] = useState(0);
  const [cantidadRecibida, setCantidadRecibida] = useState(0);
  const [cambioRegresar, setCambioRegresar] = useState(0);

  useEffect(() => {
    setTotal(detalleVenta.totalVenta);
    setDescuento(detalleVenta.descuento);
    setTotalDescuento(detalleVenta.totalDescuento);
    setCantidadRecibida(detalleVenta.cantidadRecibida);
    setCambioRegresar(detalleVenta.cambioRegresar);
  }, []);

  const componentRef = useRef();
  const pageStyle = `
  @page {
    size: 30mm 20mm
  };
  @media all{
    .pageBreak {
      display: none
    }
  };
  @media print {
    .pageBreak {
      page-break-before: always;
    }
  };

  `;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Ticket-de-compra-#${detalleVenta.idVentas}`,
    onAfterPrint: () => alert("Print success"),
    pageStyle: pageStyle,
  });
  //const [idVentas, fecha, descuento, total] = detalleVenta;

  useEffect(() => {
    fetch(`https://servidor-farmacia-1-production.up.railway.app/api/detalleVentas/${detalleVenta.idVentas}`)
      .then((res) => res.json())
      .then((data) => setDetalle(data))
      .catch((error) => console.log(error));
  }, [detalleVenta]);

  function cerrarDetalleVenta() {
    closeModalDetalleVenta();
  }

  let resultado = [];
  if (detalle.length <= 0) {
    resultado = resultado;
  } else {
    if (detalle.length >= 1) {
      resultado = detalle;
    }
  }

  useEffect(() => {}, []);

  return (
    <>
      <div ref={componentRef} className="contenedor-tabla-detalle-venta">
        <h1 className="titulo-detalle-venta">Farmacia ZAyOR</h1>
        <p className="titulo-detalle-venta-informcacion">
          Fecha: {detalleVenta.fecha}{" "}
        </p>
        <p className="titulo-detalle-venta-informcacion">
          Numero de tiket: {detalleVenta.idVentas}{" "}
        </p>
        <p className="titulo-detalle-venta-informcacion">
          Lo atendio: {detalleVenta.nombreEmpVenta}{" "}
        </p>
        <p className="titulo-detalle-venta-informcacion">
          Ave. 20 de noviembre, colonia Santa Anita
        </p>
        <div className="contenedor-tabla-detalle-venta">
          <table className="tabla-detalle-venta">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>subTotal</th>
              </tr>
            </thead>
            <tbody>
              {resultado.length <= 0 ? (
                <tr>
                  <td colSpan="3">No hay registro</td>
                </tr>
              ) : (
                resultado.map((dato) => (
                  <tr key={dato.idDetalleVentas}>
                    <td>{dato.nombre}</td>
                    <td>{dato.cantidadVenta}</td>
                    <td>${dato.subTotal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p>Total: ${detalleVenta.totalVenta}</p>
          <p>Descuento: ${detalleVenta.descuento}</p>
          <p>Total con descuento: ${detalleVenta.totalDescuento}</p>
          <p>Efectivo: ${detalleVenta.cantidadRecibida}</p>
          <p>Cambio: ${detalleVenta.cambioRegresar}</p>
        </div>
      </div>

      <div className="contenedor-botones-detalle-Pedidos">
        <button
          className="btn-cerrar-detalle-pedido"
          onClick={() => cerrarDetalleVenta()}
        >
          Cerrar
        </button>
        <button className="btn-imprimir-ticket" onClick={handlePrint}>
          Imprimir ticket
        </button>
      </div>
    </>
  );
}

export default DetalleVenta;
