import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { indexTodos, postTodo, verifyUser } from "../services/api_helper.js";
import TodoList from "./TodoList.js";
import SingleTodo from "./SingleTodo.js";
import CreateTodoForm from "./CreateTodoForm";

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
    const Todos = await indexTodos();
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
      </div>
    );
  }
}
