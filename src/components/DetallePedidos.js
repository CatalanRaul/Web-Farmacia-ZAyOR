import React, { useState, useEffect } from "react";
import "../style/DetallePedidos.css";

const DetallePedidos = ({ closeModalDetallePedidos, detallePedido }) => {
  const [detalle, setDetalle] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/detallePedido/${detallePedido}`)
      .then((res) => res.json())
      .then((data) => setDetalle(data))
      .catch((error) => console.log(error));
  }, [detallePedido]);

  function cerrarDetallePedido() {
    closeModalDetallePedidos();
  }

  let resultado = [];
  if (detalle.length <= 0) {
    resultado = resultado;
  } else {
    if (detalle.length >= 1) {
      resultado = detalle;
    }
  }

  return (
    <>
      <div className="titulo-detalle-pedido">Detalle de pedido</div>
      <div className="contenedor-tabla-detalle-pedido">
        <table className="tabla-detalle-pedidos">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Cantidad pedidas</th>
              <th>Precio unitario de compra</th>
              <th>subTotal</th>
            </tr>
          </thead>
          <tbody>
            {resultado.length <= 0 ? (
              <tr>
                <td colSpan="4">No hay registro</td>
              </tr>
            ) : (
              resultado.map((dato) => (
                <tr key={dato.idDetallePedido}>
                  <td>{dato.nombreProducto}</td>
                  <td>{dato.cantidadPedido}</td>
                  <td>{dato.precioUnitario}</td>
                  <td>$ {dato.subTotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="contenedor-botones-detalle-Pedidos">
        <button
          className="btn-cerrar-detalle-pedido"
          onClick={() => cerrarDetallePedido()}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default DetallePedidos;
