import React, { Component } from "react";
export default class CreateTodoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.props.createTodo(this.state);
        }}
      >
        <label htmlFor="title">title</label>
        <input
          type="text"
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        />
        <button>Submit</button>
      </form>
    );
  }
}
