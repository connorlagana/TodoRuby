import React, { Component } from "react";
import {
  registerUser,
  verifyUser,
  indexTodos,
  postTodo
} from "./services/api_helper";
import RegisterForm from "./components/RegisterForm";
import CreateTodoForm from "./components/CreateTodoForm";

import { Route, Link, withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      currentUser: null,
      todos: []
    };
  }
  handleRegister = async (e, registerData) => {
    e.preventDefault();
    const currentUser = await registerUser(registerData);
    if (!currentUser.errorMessage) {
      this.setState({ currentUser });
    } else {
      this.setState({ errorText: currentUser.errorMessage });
    }
    this.setState({ currentUser });
  };

  handleLogout = () => {
    this.setState({
      currentUser: null
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  };

  componentDidMount() {
    verifyUser();
    this.readAllTodos();
    if (localStorage.getItem("authToken")) {
      const name = localStorage.getItem("name");
      const email = localStorage.getItem("email");
      const user = { name, email };
      user &&
        this.setState({
          currentUser: user
        });
    }
  }
  render() {
    return (
      <div className="App">
        {this.state.currentUser && (
          <div>
            <h1>Hello, {this.state.currentUser.name}</h1>
            <button onClick={this.handleLogout}>Logout!!</button>
          </div>
          :
          <Link to="/register"><button>register</button>></Link>
        )
        }
        <Route />
        <RegisterForm handleRegister={this.handleRegister} />
        <CreateTodoForm createTodo={this.createTodo} />
        {this.state.todos &&
          this.state.todos.map(todo => (
            <div key={todo.id}>
              <h3>{todo.title}</h3>
            </div>
          ))}
      </div>
    );
  }
}
export default withRouter(App);
