import React, { Component } from "react";
export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }

  setFormData = () => {
    if (this.props.todos.length) {
      const { title } = this.props.find(todo => {
        return todo.id === parseInt(this.props.todoId);
      });

      this.setState({
        title
      });
    }
  };

  componentDidMount() {
    this.setFormData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.todos != this.props.todos) {
      this.setFormData();
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.props.updateTodo(this.props.todoId, this.state);
        }}
      >
        <label htmlFor="title">title</label>
        <input type="text" name="title" value={this.state.title} />
        <h1>helllo</h1>
      </form>
    );
  }
}
