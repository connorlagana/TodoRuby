# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) todos Part 1 - RESTful JSON API with Rails

| Title | Type | Duration | Author | 
| -- | -- | -- | -- |
| todos - RESTful JSON API with Rails (Part 1 of 2) | Lesson | 12:00 Total | Suresh Melvin Sigera |

## Objectives
By the end of this, developers should be able to create:
- Create rest API from scratch
- Understand how to manipulate data and routines
- Add JWT tokens to secure the Rest endpoints

## API endpoints

Our API will expose the following RESTful endpoints.

| Endpoint | Functionality | 
| -- | -- |
| POST /signup	| Signup |
| POST /auth/login | Login |
| GET /todos | List all todos |
| POST /todos | Create a new todo |
| GET /todos/:id | Get a todo |
| PUT /todos/:id | Update a todo |
| DELETE /todos/:id	| Delete a todo and its items |
| GET /todos/:id/items | Get a todo item |
| POST /todos/:id/items | Create a new item |
| PUT /todos/:id/items	| Update a todo item |
| DELETE /todos/:id/items | Delete a todo item |

## Project setup

Generate a new project `todos-api` by running:

```
rails new todo_rest --api --database=sqlite3
```

Note that we're using the --api argument to tell Rails that we want an API application and --database setup sqlite3 as our default storage.

## Models

Let's start by generating the `Todo` model

`rails g model Todo title:string created_by:string`

Notice that we've included the model attributes in the model generation command. This way we don't have to edit the migration file. The generator invokes active record and the migration, model respectively.

File path `db/migrate/[timestamp]_create_todos.rb`

```ruby
class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.string :title
      t.string :created_by

      t.timestamps
    end
  end
end
```

And now the `Item` model

`rails g model Item name:string done:boolean todo:references`

By adding `todo:references` we're telling the generator to set up an association with the `Todo` model. This will do the following:

- Add a foreign key column `todo_id` to the `items` table
- Setup a `belongs_to association` in the Item model

File path `db/migrate/[timestamp]_create_items.rb`

```ruby
class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :name
      t.boolean :done
      t.references :todo, null: false, foreign_key: true

      t.timestamps
    end
  end
end
```

Looks good? Let's run the migrations.

`rails db:create`

`rails db:migrate`

You should see the following output.

```
Created database 'db/development.sqlite3'
Created database 'db/test.sqlite3'
```

```
== 20200117000640 CreateTodos: migrating ======================================
-- create_table(:todos)
   -> 0.0018s
== 20200117000640 CreateTodos: migrated (0.0019s) =============================

== 20200117000647 CreateItems: migrating ======================================
-- create_table(:items)
   -> 0.0105s
== 20200117000647 CreateItems: migrated (0.0108s) =============================
```

## Add model associations.

File path `app/models/todo.rb`

```ruby
class Todo < ApplicationRecord
  # model association
  has_many :items, dependent: :destroy

  # validations
  validates_presence_of :title, :created_by
end
```

File path `app/models/item.rb`

```ruby
class Item < ApplicationRecord
  # model association
  belongs_to :todo

  # validation
  validates_presence_of :name
end
```

## Controllers

Now that our models are all setup, let's generate the controllers.

`rails g controller Todos`

`rails g controller Items`

Let's go ahead and define the controller methods.

File path `app/controllers/todos_controller.rb`

```ruby
class TodosController < ApplicationController
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /todos
  def index
    @todos = Todo.all
    json_response(@todos)
  end

  # POST /todos
  def create
    @todo = Todo.create!(todo_params)
    json_response(@todo, :created)
  end

  # GET /todos/:id
  def show
    json_response(@todo)
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
    params.permit(:title, :created_by)
  end

  def set_todo
    @todo = Todo.find(params[:id])
  end
end
```

Remember, our API returns json_response (JSON and an HTTP status code 200 by default). We can define this method in concerns folder.

File path `app/controllers/concerns/response.rb`

```ruby
module Response
  def json_response(object, status = :ok)
    render json: object, status: status
  end
end
```

So far so good! But what if the case where we don't have any records? Let's use exception handling so we can return 404 message.

File path `app/controllers/concerns/exception_handler.rb`

```ruby
module ExceptionHandler
  # provides the more graceful `included` method
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound do |e|
      json_response({ message: e.message }, :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      json_response({ message: e.message }, :unprocessable_entity)
    end
  end
end
```
`set_todo` - callback method to find a todo by id. In the case where the record does not exist, ActiveRecord will throw an exception `ActiveRecord::RecordNotFound`. 
We'll rescue from this exception and return a `404` message.

In our `create` method in the `TodosController`, note that we're using `create!` instead of `create`. 
This way, the model will raise an exception `ActiveRecord::RecordInvalid`. This way, we can avoid deep nested if statements in the controller. Thus, we rescue from this exception in the `ExceptionHandler` module.

However, our controller classes don't know about these helpers yet. Let's fix that by including these modules in the application controller.

File path `app/controllers/application_controller.rb`

```ruby
class ApplicationController < ActionController::API
  include Response
  include ExceptionHandler
end
```

Everything looks good, so let's setup the routes. 

## Routes

Now lets' add the routes to our application. Go ahead and define them in `config/routes.rb`.

File path `config/routes.rb`

```ruby
Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :todos do
    resources :items
  end
end
```

In our route definition, we're creating todo resource with a nested items resource. This enforces the `1:m` (one to many) associations at the routing level. To view the routes, you can run:

`rails routes`

You should see an output similar to the following

```ruby
suresh@snowball:~/Documents/GA/sei-nyc-cheetahs/rails/todo_rest$ rails routes
                               Prefix Verb   URI Pattern                                                                              Controller#Action
                           todo_items GET    /todos/:todo_id/items(.:format)                                                          items#show
                                      PATCH  /todos/:todo_id/items(.:format)                                                          items#update
                                      PUT    /todos/:todo_id/items(.:format)                                                          items#update
                                      DELETE /todos/:todo_id/items(.:format)                                                          items#destroy
                                      POST   /todos/:todo_id/items(.:format)                                                          items#create
                                todos GET    /todos(.:format)                                                                         todos#index
                                      POST   /todos(.:format)                                                                         todos#create
                                 todo GET    /todos/:id(.:format)                                                                     todos#show
                                      PATCH  /todos/:id(.:format)                                                                     todos#update
                                      PUT    /todos/:id(.:format)                                                                     todos#update
                                      DELETE /todos/:id(.:format)                                                                     todos#destroy
        rails_mandrill_inbound_emails POST   /rails/action_mailbox/mandrill/inbound_emails(.:format)                                  action_mailbox/ingresses/mandrill/inbound_emails#create
        rails_postmark_inbound_emails POST   /rails/action_mailbox/postmark/inbound_emails(.:format)                                  action_mailbox/ingresses/postmark/inbound_emails#create
           rails_relay_inbound_emails POST   /rails/action_mailbox/relay/inbound_emails(.:format)                                     action_mailbox/ingresses/relay/inbound_emails#create
        rails_sendgrid_inbound_emails POST   /rails/action_mailbox/sendgrid/inbound_emails(.:format)                                  action_mailbox/ingresses/sendgrid/inbound_emails#create
         rails_mailgun_inbound_emails POST   /rails/action_mailbox/mailgun/inbound_emails/mime(.:format)                              action_mailbox/ingresses/mailgun/inbound_emails#create
       rails_conductor_inbound_emails GET    /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#index
                                      POST   /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#create
        rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#show
                                      PATCH  /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
                                      PUT    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
                                      DELETE /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#destroy
rails_conductor_inbound_email_reroute POST   /rails/conductor/action_mailbox/:inbound_email_id/reroute(.:format)                      rails/conductor/action_mailbox/reroutes#create
                   rails_service_blob GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
            rails_blob_representation GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
                   rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
            update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
                 rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)                                           active_storage/direct_uploads#create

```

Now let's check our restAPI using the postman.


## Testing our restAPI with Postman

Create a new todo (`POST /todos`)	

Here is my JSON input.

```json
{
	"title": "Learn Python",
	"created_by": 1
}
```
```json
{
	"title": "Learn C",
	"created_by": 1
}
```
```json
{
	"title": "Learn C++",
	"created_by": 1
}
```
```json
{
	"title": "Learn Java",
	"created_by": 1
}
```

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-post.png" width="800">
</p>

<hr>

Let's fetch all the records

List all todos (`GET /todos`)	

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-get.png" width="800">
</p>

<hr>

Get a todo `GET /todos/:id`

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-get-a-todo.png" width="800">
</p>

<hr>

Update a todo `PUT /todos/:id`

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-update-a-todo.png" width="800">
</p>

<hr>

Delete a todo and its items `DELETE /todos/:id`

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-delete-a-todo.png" width="800">
</p>

So far you guys are doing wonderful! Now let's go ahead and todo items functionally. Let's define the todo items controller.

File path `app/controllers/items_controller.rb`

```ruby
class ItemsController < ApplicationController
  before_action :set_todo
  before_action :set_todo_item, only: [:show, :update, :destroy]

  # GET /todos/:todo_id/items
  def index
    json_response(@todo.items)
  end

  # GET /todos/:todo_id/items/:id
  def show
    json_response(@item)
  end

  # POST /todos/:todo_id/items
  def create
    @todo.items.create!(item_params)
    # json_response(@todo, :created)
    json_response(status: "SUCCESS", message: 'item created successfully.', data: @item.name)

  end

  # PUT /todos/:todo_id/items/:id
  def update
    @item.update(item_params)
    json_response(status: 'SUCCESS', message: 'item updated successfully.', data: @item.name)
  end

  # DELETE /todos/:todo_id/items/:id
  def destroy
    @item.destroy
    json_response(status: 'SUCCESS', message: 'item deleted successfully.', data: @item.name)
  end

  private

  def item_params
    params.permit(:name, :done)
  end

  def set_todo
    @todo = Todo.find(params[:todo_id])
  end

  def set_todo_item
    @item = @todo.items.find_by!(id: params[:id]) if @todo
  end
end
```

## Testing our restAPI with Postman

Create a todo item (POST `/todos/:id/items` )

Here is my JSON input.
```json
{
	"name": "learn how to make coffee",
	"done": false,
	"todo_id": 6
}
```

```json
{
	"name": "learn how to make butter cake",
	"done": false,
	"todo_id": 6
}
```


```json
{
	"name": "learn how to make bread pudding",
	"done": true,
	"todo_id": 6
}
```

```json
{
	"name": "learn how to make bread",
	"done": true,
	"todo_id": 6
}
```

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-post-add-a-item.png" width="800">
</p>

<hr>

Let's fetch all the items from the todo list

List all todos (`GET /todos/:todo_id/items`)	

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-item-get-all-todo-list.png" width="800">
</p>

<hr>

Update an item from the todo list `PUT /todos/:todo_id/items/1`

Here is my JSON input.

```json
{
	"name": "Some info",
	"done": true,
	"todo_id": 6
}
```

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-list-update-an-item.png" width="800">
</p>

<hr>

Delete an item from the todo list `DELETE /todos/:todo_id/items/1`

<p align="center">
    <img src="https://git.generalassemb.ly/sei-nyc-cheetahs/Ruby/blob/master/images/todo-delete-an-item-from-the-todo-list.png" width="800">
</p>

## End of Part one :satisfied:

## QA
<p>
<img src="https://media.giphy.com/media/kDfGTmnbS9Ljm9hnwq/source.gif" width="480" height="480">
</p>
