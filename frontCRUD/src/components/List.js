import React, { useContext, useEffect } from "react";
import { Store, HOST_API } from "../App";

export const List = () => {
  const { dispatch, state } = useContext(Store);
  
  //Método de GET trae todos los elementos de la bd
  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);
  
  //Método DELETE 
  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };
  
  //Obtiene los itemes que se van a editar para actualizar 
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };
  
  //actualiza los items 
  const onChange = (event, todo) => {
    const request = {
      name: todo.name,
      id: todo.id,
      completed: event.target.checked,
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
      });
  };

  return (
    <div className="tabla">
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tarea</th>
            <th scope="col">Completado</th>
            <th scope="col">Eliminar</th>
            <th scope="col">Editar</th>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => (
            <tr>
              <th scope="row">{todo.id}</th>
              <td className={todo.completed ? "tachado" : {}}>{todo.name}</td>
              <td>
                <input
                  type="checkbox"
                  defaultChecked={todo.completed}
                  onChange={(event) => onChange(event, todo)}
                ></input>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={() => onDelete(todo.id)}
                >
                  Eliminar
                </button>
              </td>

              <td>
                <button class="btn btn-warning" onClick={() => onEdit(todo)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
