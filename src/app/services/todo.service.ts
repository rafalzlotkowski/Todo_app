 import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
import { RouterLink } from '@angular/router';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
  message: string | null = null;  
  status: 'success' | 'error' | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.loadTodos(); 
  }
  private todosSubject = new BehaviorSubject<TodoModel[]>([]);
  todos$ = this.todosSubject.asObservable();
  notification(message: string, status: 'success' | 'error' = 'success') {
    this.message = message;
    this.status = status;
    
    setTimeout(() => {
      this.message = null;
    }, 1000);
  }
  getTodos(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`)
    
    ;
  }
 
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`);
  }
  
  addTodo(title: string, description: string, dueDate?: string): Observable<TodoModel>{
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate,
      completed: false
    };
    return this.http.post<TodoModel>(`${this.apiUrl}/todos`, newTodo).pipe(
    tap(() => {
      this.notification("Zadanie zostało dodane!", 'success');
      this.loadTodos(); 
    })
  );
} 

  sortTodos(filter: string) {
    console.log(filter)
    
    this.http.get<TodoModel[]>(`${this.apiUrl}/todos?filter=${filter}`)
    .subscribe(todos => this.todosSubject.next(todos));
    error: () => this.notification('Błąd podczas sortowania', 'error')

  }

  loadTodos(): Observable<TodoModel[]> {
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`).pipe(
    tap(todos => this.todosSubject.next(todos))
  );
}
  
  editTodo(id:number,title: string, description:string, dueDate?:string): Observable<TodoModel> {
    const updatedTodo: Partial<TodoModel> = {
  
      title,
      description,
      dueDate
    };
    return this.http.patch<TodoModel>(`${this.apiUrl}/todos/${id}`, updatedTodo).pipe(
    tap(() => {
      this.loadTodos(); 
    })
  );
    

  }



  toggleCompleted(id: number, completed: boolean): Observable<TodoModel> {
  return this.http.patch<TodoModel>(
    `${this.apiUrl}/todos/${id}`,
    { completed }
    
    ).pipe(
      tap(() => {
        this.loadTodos(); 
      })
    );
  }

  


  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
      tap(() => {
        this.loadTodos(); 
      })
    );
  }


 
  
  isValidDate(dueDate: string): boolean {
   if (!dueDate) return false;

  const [y, m, d] = dueDate.split('-').map(Number);
  const date = new Date(dueDate);

  return (
    date.getFullYear() === y && y >= 1000 && y <= 9999 &&
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

  notifyUpCommingTodos(todo: TodoModel): string  {
    const today = new Date();
    today.setHours(0,0,0,0)
    const endDate = new Date(todo.dueDate!);
    endDate.setHours(0,0,0,0)
    const future = new Date(today);
    future.setDate(today.getDate()+2)
    const status = todo.completed!;
    if ( !status && endDate < today ){
    return 'expired';
    }
    if( !status && endDate < future ){
      return 'upcoming';
    }
    
    return 'ok';
    

  }
  
  

  
}
