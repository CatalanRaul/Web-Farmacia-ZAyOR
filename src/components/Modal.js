import React from "react";

const Modal = ({ children, isOpen, closeModalAgregar }) => {
  const handleModalContenedorClick = (e) => e.stopPropagation();
  return (
    <article className={`modal ${isOpen && "is-open"}`}>
      <div className="modal-contenedor" onClick={handleModalContenedorClick}>
        {children}
      </div>
    </article>
  );
};

export default Modal;
