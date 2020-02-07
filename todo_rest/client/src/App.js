import React, { Component } from "react";
import {
  registerUser,
  verifyUser,
  indexTodos,
  postTodo,
  loginUser
} from "./services/api_helper";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import TodoContainer from "./components/TodoContainer.js";

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
    console.log(this.state);
    if (!currentUser.errorMessage) {
      this.setState({ currentUser });
    } else {
      this.setState({ errorText: currentUser.errorMessage });
    }
  };

  handleLogout = () => {
    this.setState({
      currentUser: null
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  };

  handleLogin = () => {
    // this.setState({
    //   currentUser: null
    // });
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("name");
    // localStorage.removeItem("email");
  };

  componentDidMount() {
    verifyUser();
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
        {this.state.currentUser ? (
          <div>
            <h1>Hello, {this.state.currentUser.name}</h1>
            <button onClick={this.handleLogout}>Logout</button>
          </div>
        ) : (
          <nav>
            <Link to="/register">
              <button>Register</button>
            </Link>
            <Link to="/login">
              <button>Register</button>
            </Link>
          </nav>
        )}
        <Route
          path="/register"
          render={() => (
            <RegisterForm
              handleRegister={this.handleRegister}
              errorText={this.state.errorText}
            />
          )}
        />
        <Route path="/todos" render={() => <TodoContainer />} />
      </div>
    );
  }
}
export default withRouter(App);
