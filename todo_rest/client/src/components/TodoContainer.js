import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import {
  indexTodos,
  postTodo,
  putTodo,
  verifyUser
} from "../services/api_helper.js";
import TodoList from "./TodoList.js";
import SingleTodo from "./SingleTodo.js";
import CreateTodoForm from "./CreateTodoForm";
import UpdateTodoForm from "./UpdateTodoForm";

export default class TodoContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: []
    };
  }

  componentDidMount() {
    verifyUser();
    this.readAllTodos();
  }

  // Read all todos
  readAllTodos = async () => {
    const todos = await indexTodos();
    this.setState({
      todos
    });
  };

  createTodo = async todoData => {
    const newTodo = await postTodo(todoData);
    this.setState({
      todos: [...this.state.todos, newTodo]
    });
  };

  updateTodo = async (id, todosData) => {
    const updateTodo = await putTodo(id, todosData);
    const changedTodos = this.state.todos.map(todo =>
      todo.id === parseInt(id) ? todosData : todo
    );

    this.setState({
      todos: changedTodos
    });
    // this.props.params.history;
  };

  render() {
    return (
      <div>
        <Route
          exact
          path="/todos"
          render={() => <TodoList todos={this.state.todos} />}
        />
        <Route
          exact
          path="/todos/:id"
          render={props => (
            <SingleTodo
              todoId={props.match.params.id}
              todos={this.state.todos}
            />
          )}
        />
        <Route
          path="/todos/new"
          render={() => <CreateTodoForm createTodo={this.createTodo} />}
        />
        <Route
          path="/todos/:id/edit"
          render={props => (
            <UpdateTodoForm
              todos={this.state.todos}
              updateTodos={this.updateTodos}
              todoId={props.match.params.id}
            />
          )}
        />
      </div>
    );
  }
}
