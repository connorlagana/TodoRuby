import React from "react";
import { Link, Route } from "react-router-dom";
export default function TodoList(props) {
  return (
    <div>
      {props.todos &&
        props.todos.map(todo => (
          <div key={todo.id}>
            <div key={todo.id}>
              <Link to={`./todos/${todo.id}`}>
                <h3>{todo.title}</h3>
              </Link>
            </div>
          </div>
        ))}
      <Link to="/todos/new">
        <button>Add a todo</button>
      </Link>
    </div>
  );
}
