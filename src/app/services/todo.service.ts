 import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
import { RouterLink } from '@angular/router';
import { isValidDate } from 'rxjs/internal/util/isDate';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: TodoModel[] = [];
  private nextId: number = 1;
  message: string | null = null;  
  status: 'success' | 'error' | null = null;
  constructor() {
    const data= localStorage.getItem('todos') 
      if(data) {
        this.todos = JSON.parse(data);
        this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id))+1 :1;
      }      
  }
  notyfication(message: string, status: 'success' | 'error' = 'success') {
    this.message = message;
    this.status = status;
    
    setTimeout(() => {
      this.message = null;
    }, 1000);
  }
  


  getTodos(): TodoModel[] {
    return this.todos;
  }
  getTodoById(id:number):TodoModel | undefined {
    return this.todos.find(t=> t.id === id);
  }
  
  addTodo(title: string, description:string, dueDate?:string):void {
    const newTodo: TodoModel = {
      id: this.nextId++,
      title,
      description,
      dueDate,
      completed: false,
    };
    this.notyfication("Zadanie zostało dodane!" ,'success');
    this.todos.push(newTodo);
    localStorage.setItem('todos',JSON.stringify(this.todos));
    
  }

  editTodo(id:number,title: string, description:string, dueDate?:string):void{
    const todo = this.todos.find(t=> t.id === id);
    if (todo ){
      todo.title = title;
      todo.description = description;
      todo.dueDate = dueDate;
    }
    this.notyfication("Zadanie zostalo edytowane!",'success');
    
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
    this.notyfication("Zadanie zostało usunięte!", 'success');
  }  
  isValidDate(dueDate: string): boolean {
   if (!dueDate) return false;

  const [y, m, d] = dueDate.split('-').map(Number);
  const date = new Date(dueDate);

  return (
    date.getFullYear() === y &&
    date.getMonth() + 1 === m &&
    date.getDate() === d
  );
}

isNotPastDate(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dueDate);
  return date >= today;
}

  
}
