import { Injectable } from '@angular/core';
import { Todo as TodoModel } from '../models/todo.models';
@Injectable({
  providedIn: 'root',
})
export class Todo {
  private todos: TodoModel[] = [];
  private nextId: number = 1;

  

  getTodos(): TodoModel[] {
    return this.todos;
  }
  
  addTodo(title: string, description:string):void {
    const newTodo: TodoModel = {
      id: this.nextId++,
      title,
      description,
      completed: false,
    };
    this.todos.push(newTodo);
  }

  editTodo(id:number, title: string, description:string):void{
    const todo = this.todos.find(t=> t.id === id);
    if (todo){
      todo.title = title;
      todo.description = description;
    }
  }

  toggleCompleted(id :number):void {
    const todo = this.todos.find(t=> t.id === id);
    if (todo) { 
      todo.completed = !todo.completed;
    }
  }
  
  deletetodo(id: number) : void {
    this.todos = this.todos.filter(t=> t.id !== id);
  }
  

}
