class TodosController < ApplicationController
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /todos
  def index
    @todos = current_user.todos
    json_response(@todos)
  end

  # POST /todos
  def create
    @todo = current_user.todos.create!(todo_params)
    json_response(@todo, :created)
  end

  # GET /todos/:id
  def show
    json_response(@todo)
  end

  def index
    # get current user todos
    @todos = current_user.todos
    json_response(@todos)
  end
  # [...]
  # POST /todos
  def create
    # create todos belonging to current user
    @todo = current_user.todos.create!(todo_params)
    json_response(@todo, :created)
  end
  # [...]
  private

  # remove `created_by` from list of permitted parameters
  def todo_params
    params.permit(:title)
  end

  # PUT /todos/:id
  def update
    @todo.update(todo_params)
    json_response(status: 'SUCCESS', message: 'updated the todo', data: @todo.title)
  end

  # DELETE /todos/:id
  def destroy
    @todo.destroy
    json_response(status: 'SUCCESS', message: 'deleted the todo', data: @todo.title)

  end

  private

  def todo_params
    # whitelist params
    params.permit(:title)
  end

  def set_todo
    @todo = Todo.find(params[:id])
  end
end