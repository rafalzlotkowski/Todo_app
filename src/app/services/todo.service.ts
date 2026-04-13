import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: TodoModel[] = [];
  private nextId: number = 1;
  message: string |null = null;
  
  constructor() {
    const data= localStorage.getItem('todos') 
      if(data) {
        this.todos = JSON.parse(data);
        this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id))+1 :1;
      }      
  }
  notyfication(message:string){
    return this.message
  }


  getTodos(): TodoModel[] {
    return this.todos;
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
    this.notyfication("zadanie dodane" );
    this.todos.push(newTodo);
    localStorage.setItem('todos',JSON.stringify(this.todos));
    
  }

  editTodo(id:number, title: string, description:string):void{
    const todo = this.todos.find(t=> t.id === id);
    if (todo ){
      todo.title = title;
      todo.description = description;
      
    }
    localStorage.setItem('todos',JSON.stringify(this.todos));


  }

  toggleCompleted(id: number): void {
  const todo = this.todos.find(t => t.id === id);
  if (todo) { 
    todo.completed = !todo.completed;
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
  
  deleteTodo(id: number) : void {
    this.todos = this.todos.filter(t=> t.id !== id);
    localStorage.setItem('todos',JSON.stringify(this.todos))
  }  
  
}
