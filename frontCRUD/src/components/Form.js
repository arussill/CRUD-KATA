import React, { useContext, useRef, useState } from "react";
import { Store, HOST_API } from "../App";

export const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState({ item });
  
  //Método Agregar items conecta con la ruta del back
  const onAdd = (event) => {
    // event.preventDefault();
    const request = {
      name: state.name,
      id: null,
      isCompleted: false,
    };

    fetch(HOST_API + "/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };
  
  //Método editar conecta con la ruta del back
  const onEdit = (event) => {
    // event.preventDefault();
    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted,
    };

    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({ name: "" });
        formRef.current.reset();
      });
  };

  return (
    <form ref={formRef} className="input-group">
      <input
        className="form-control"
        placeholder="Escriba una tarea"
        type="text"
        name="name"
        defaultValue={item.name}
        onChange={(event) => {
          setState({ ...state, name: event.target.value });
        }}
      ></input>
      {item.id && (
        <button class="btn btn-success" onClick={onEdit}>
          Actualizar
        </button>
      )}
      {!item.id && (
        <button class="btn btn-dark" onClick={onAdd}>
          Agregar
        </button>
      )}
    </form>
  );
};
