 import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
import { RouterLink } from '@angular/router';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
  message: string | null = null;  
  status: 'success' | 'error' | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // const data= localStorage.getItem('todos') 
    //   if(data) {
    //     this.todos = JSON.parse(data);
    //     this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id))+1 :1;
    //   }      
  }
  notyfication(message: string, status: 'success' | 'error' = 'success') {
    this.message = message;
    this.status = status;
    
    setTimeout(() => {
      this.message = null;
    }, 1000);
  }
  getTodos(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`);
  }
  // getTodos(): TodoModel[] {
  //   return this.todos;
    
  // }
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`);
  }
  // getTodoById(id:number):TodoModel | undefined {
  //   return this.todos.find(t=> t.id === id);
  // }
  addTodo(title: string, description: string, dueDate?: string): Observable<TodoModel>{
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate,
      completed: false
    };
    console.log('dodawanie zadania serwis',title)
    this.notyfication("Zadanie zostało dodane!" ,'success');
    return this.http.post<TodoModel>(`${this.apiUrl}/todos`, newTodo)
  }
  // addTodo(title: string, description:string, dueDate?:string):void {
  //   const newTodo: TodoModel = {
  //     id: this.nextId++,
  //     title,
  //     description,
  //     dueDate,
  //     completed: false,
  //   };
  //   this.notyfication("Zadanie zostało dodane!" ,'success');
  //   this.todos.push(newTodo);
  //   localStorage.setItem('todos',JSON.stringify(this.todos));
    
  // }

  editTodo(id:number,title: string, description:string, dueDate?:string): Observable<TodoModel> {
    const updatedTodo: Partial<TodoModel> = {
  
      title,
      description,
      dueDate
    };
    return this.http.patch<TodoModel>(`${this.apiUrl}/todos/${id}`, updatedTodo)
  }

  // editTodo(id:number,title: string, description:string, dueDate?:string):void{
  //   const todo = this.todos.find(t=> t.id === id);
  //   if (todo ){
  //     todo.title = title;
  //     todo.description = description;
  //     todo.dueDate = dueDate;
  //   }
  //   this.notyfication("Zadanie zostalo edytowane!",'success');
    
  //   localStorage.setItem('todos',JSON.stringify(this.todos));


  // }

  toggleCompleted(id: number, completed: boolean): Observable<TodoModel> {
  return this.http.patch<TodoModel>(
    `${this.apiUrl}/todos/${id}`,
    { completed }
    
  );
}
//   toggleCompleted(id: number): void {
//   const todo = this.todos.find(t => t.id === id);
//   if (todo) { 
//     todo.completed = !todo.completed;
//     localStorage.setItem('todos', JSON.stringify(this.todos));
//   }

// }

deleteTodo(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/todos/${id}`)
}
  // deleteTodo(id: number) : void {
  //   this.todos = this.todos.filter(t=> t.id !== id);
  //   localStorage.setItem('todos',JSON.stringify(this.todos))
  //   this.notyfication("Zadanie zostało usunięte!", 'success');
  // }  
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
