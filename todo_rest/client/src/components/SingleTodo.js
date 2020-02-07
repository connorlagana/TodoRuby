import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SingleTodo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: null
    };
  }

  setCurrentTodo = () => {
    const currentTodo = this.props.todos.find(
      todo => todo.id === parseInt(this.props.todoId)
    );
    this.setState({
      currentTodo
    });
  };

  componentDidMount() {
    this.setCurrentTodo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.todoId != this.props.todoId) {
      this.setCurrentTodo();
    }
  }

  render() {
    return (
      <div>
        {this.state.currentTodo && (
          <div>
            <h1>{this.state.currentTodo.title}</h1>
            <Link to={`/todos/${this.state.currentTodo.id}/edit`}>
              <button>edit</button>
            </Link>
          </div>
        )}
      </div>
    );
  }
}
