import React, {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

const HOST_API = "http://localhost:8080/api";
const initialState = {
  list: [],
  item: {},
};
const Store = createContext(initialState);

const Form = () => {
  const formRef = useRef(null);
  const {
    dispatch,
    state: { item },
  } = useContext(Store);
  const [state, setState] = useState({ item });

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
        <button class="btn btn-primary" onClick={onEdit}>
          Actualizar
        </button>
      )}
      {!item.id && (
        <button id="Agregar" class="btn btn-primary" onClick={onAdd}>
          Agregar
        </button>
      )}
    </form>
  );
};

const List = () => {
  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then((response) => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [state.list.length, dispatch]);

  const onDelete = (id) => {
    fetch(HOST_API + "/" + id + "/todo", {
      method: "DELETE",
    }).then((list) => {
      dispatch({ type: "delete-item", id });
    });
  };

  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo });
  };

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
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">¿Esta completado?</th>
            <th scope="col">Eliminar</th>
            <th scope="col">Editar</th>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => (
            <tr>
              <td scope="row">{todo.id}</td>
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
                  id="Eliminar"
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

function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const listUpdateEdit = state.list.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      return { ...state, list: listUpdateEdit, item: {} };
    case "delete-item":
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return { ...state, list: listUpdate };
    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

function App() {
  return (
    <Fragment>
      <div className="titulo">
        <h2>TO-DO (CRUD-KATA)</h2>
      </div>
      <StoreProvider>
        <Form />
        <List />
      </StoreProvider>
    </Fragment>
  );
}

export default App;