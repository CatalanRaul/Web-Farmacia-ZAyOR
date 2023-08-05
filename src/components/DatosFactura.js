import React, { useState, useEffect } from "react";
import "../style/DatosFactura.css";

function DatosFactura({ closeModalDatosFactura, detalleVenta }) {
  const [datosFactura, setDatosFactura] = useState({});

  useEffect(() => {
    fetch(`https://servidor-farmacia-1-production.up.railway.app/api/datosFactura/${detalleVenta}`)
      .then((res) => res.json())
      .then((data) => setDatosFactura(data))
      .catch((error) => console.log(error));
  }, [detalleVenta]);

  function cerrarDetalleVenta() {
    closeModalDatosFactura();
  }

  let resultado = [];
  if (datosFactura.length <= 0) {
    resultado = resultado;
  } else {
    if (datosFactura.length >= 1) {
      resultado = datosFactura;
    }
  }
  return (
    <>
      <div className="titulo-datos-factura">Datos para la factura</div>
      <div className="contenedor-datos-factura">
        {resultado.length <= 0 ? (
          <p className="datos-factura-cliente">No requiere factura</p>
        ) : (
          resultado.map((dato) => (
            <div key={dato.idDatosFactura}>
              <p className="datos-factura-cliente">
                <strong>RFC:</strong> {dato.rfc}
              </p>
              <p className="datos-factura-cliente">
                <strong>Nombre:</strong> {dato.nombre}
              </p>
              <p className="datos-factura-cliente">
                <strong>Apellido Paterno:</strong> {dato.apellidoPaterno}
              </p>
              <p className="datos-factura-cliente">
                <strong>Apellido Materno:</strong> {dato.apellidoMaterno}
              </p>
              <p className="datos-factura-cliente">
                <strong>Razon Social:</strong> {dato.razonSocial}
              </p>
              <p className="datos-factura-cliente">
                <strong>Regimen Fiscal:</strong> {dato.regimenFiscal}
              </p>
              <p className="datos-factura-cliente">
                <strong>Codigo Postal:</strong> {dato.codigoPostal}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="contenedor-botones-datos-factura">
        <button
          className="btn-cerrar-datos-factura"
          onClick={() => cerrarDetalleVenta()}
        >
          Cerrar
        </button>
      </div>
    </>
  );
}

export default DatosFactura;
