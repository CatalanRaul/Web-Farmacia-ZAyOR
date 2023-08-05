import React from "react";
import { useFetchClasificacion } from "../hooks/useFetchClasificacion";

function SelectList({ className, title, url, handleChange, value }) {
  const { data, error, loading } = useFetchClasificacion(url);
  console.log(data, error, loading);

  let id = `select-${title}`;
  let label = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        className={className}
        name={id}
        id={id}
        onChange={handleChange}
        value={value}
      >
        <option value="" >Elige la clasificacion</option>
        {data &&
          data.map((el) => (
            <option value={el.idClasificacion}>{el.grupo}</option>
          ))}
      </select>
    </>
  );
}

export default SelectList;
