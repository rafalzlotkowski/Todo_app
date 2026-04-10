import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: TodoModel[] = [];
  private nextId: number = 1;

  

  getTodos(): TodoModel[] {
    return [...this.todos];
  }
  getTodoById(id:number):TodoModel | undefined {
    return this.todos.find(t=> t.id === id);
  }
  
  addTodo(title: string, description:string):void {
    const newTodo: TodoModel = {
      id: this.nextId++,
      title,
      description,
      completed: false,
    };
    this.todos = [...this.todos, newTodo];  
  }

  editTodo(id:number, title: string, description:string):void{
    const todo = this.todos.find(t=> t.id === id);
    this.todos = this.todos.map(t=> t.id === id ? {...t, title, description} : t);
  }

  toggleCompleted(id :number):void {
    this.todos = this.todos.map(t=> t.id === id ? {...t, completed: !t.completed} : t);
  }
  
  deletetodo(id: number) : void {
    this.todos = this.todos.filter(t=> t.id !== id);
    
  }
  
  
}
