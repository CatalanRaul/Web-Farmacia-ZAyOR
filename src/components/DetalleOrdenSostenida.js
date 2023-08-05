import React, { useEffect, useState } from "react";

function DetalleOrdenSostenida({
  closeModalDetalleOrdenSostenida,
  detalleOrdenSostenida,
  total,
  fechaPedido,
}) {
  const [ordenSostenidaDetalle, setOrdenSostenidaDetalle] = useState([]);

  useEffect(() => {
    setOrdenSostenidaDetalle(detalleOrdenSostenida);
  }, [detalleOrdenSostenida]);

  let resultado = [];
  if (ordenSostenidaDetalle.length <= 0) {
    resultado = resultado;
  } else {
    if (ordenSostenidaDetalle.length >= 1) {
      resultado = ordenSostenidaDetalle;
    }
  }

  return (
    <>
      <div className="contenedor-tabla-detalle-venta">
        <h1 className="titulo-detalle-venta">Farmacia ZAyOR</h1>
        <h1 className="titulo-detalle-venta-informcacion">
          Fecha del pedido: {fechaPedido}{" "}
        </h1>
        <p className="titulo-detalle-venta-informcacion">Detalle del pedido</p>
        <table className="tabla-detalle-venta">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>SubTotal</th>
            </tr>
          </thead>
          <tbody>
            {resultado.length <= 0 ? (
              <tr>
                <td colSpan="4">No hay registro</td>
              </tr>
            ) : (
              resultado.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.nombre}</td>
                  <td>{dato.precioVenta}</td>
                  <td>{dato.cantidad}</td>
                  <td>{dato.subTotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <p><strong>Total:</strong> ${total.toFixed(2)} </p>
        <p className="titulo-detalle-venta-informcacion">
          Esto no es una venta
        </p>
      </div>
      <div className="contenedor-botones-detalle-Pedidos">
        <button
          className="btn-cerrar-detalle-pedido"
          onClick={closeModalDetalleOrdenSostenida}
        >
          Cerrar
        </button>
      </div>
    </>
  );
}

export default DetalleOrdenSostenida;
