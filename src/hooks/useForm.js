import { useState } from "react";

export const useForm = (inicialForm, validateForm) => {
  const [form, setForm] = useState(inicialForm);
  const [errors, setErrors] = useState({});
  //const [loading, setLoading] = useState(false);

  //Metodo para obtener los valores de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    
  };

  //Metodo para mostrar las validaciones de los inputs
  const handleBlur = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  return {
    form,
    setForm,
    setErrors,
    errors,
    handleChange,
    handleBlur,
  };
};
