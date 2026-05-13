import { inject, Injectable, signal } from '@angular/core';
import { Priority, TodoModel } from '../models/todo.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import {NotificationService} from './notification-service';
@Injectable({
  providedIn: 'root',
  
})
export class TodoService {
  
  
  private apiUrl = 'http://localhost:3000';

    private http = inject(HttpClient);
    private notification = inject(NotificationService);
  

  private _todos = signal<TodoModel[]>([]);
  todos = this._todos.asReadonly();
  private handleErr<T>(message: string) {
  return catchError<T, Observable<never>>((err) => {
    this.notification.show(message, 'error');
    return throwError(() => err);
  });
  }
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`).pipe(
        this.handleErr('Pobieranie zadania nie powiodło się ')
      );
    
    
  }

  loadTodos(): Observable<TodoModel[]> {
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`).pipe(
    tap(todos => this._todos.set(todos)),
      this.handleErr('Pobieranie danych nie powiodło się')
      
    );
  }
  

  sortTodos(filter: string): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${this.apiUrl}/todos?filter=${filter}`).pipe(
      tap(todos => this._todos.set(todos)),
      
      this.handleErr('Błąd podczas sortowania')
  );
  }
  
  addTodo(title: string, description: string, priority : Priority ,dueDate?: string): Observable<TodoModel>{
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate,
      priority,
      completed: false
    };
       console.log(priority)

    return this.http.post<TodoModel>(`${this.apiUrl}/todos`, newTodo).pipe(
    tap((createdTodo) =>{
      this._todos.update(current => [...current,createdTodo])
      this.notification.show("Zadanie zostało dodane!", 'success');
     }),
   
        this.handleErr('Dodawanie zadania nie powiodło się ')
    );
  } 
    

  

  
  
  editTodo(id:number,title: string, description:string, priority: Priority ,dueDate?:string): Observable<TodoModel> {
    const updatedTodo: Partial<TodoModel> = {
  
      title,
      description,
      priority,
      dueDate
    };
    return this.http.patch<TodoModel>(`${this.apiUrl}/todos/${id}`, updatedTodo).pipe(
    tap((updatedTodo) => {
        this._todos.update(current => 
          current.map(todo => todo.id === id ? updatedTodo : todo)
        );
        this.notification.show("Zadanie zaktualizowane!", 'success');
    }),
      
    
        this.handleErr('Edytowanie nie powiodło się ')
  );
  }

  toggleCompleted(id: number, completed: boolean): Observable<TodoModel> {
  return this.http.patch<TodoModel>(
    `${this.apiUrl}/todos/${id}`,
    { completed }
    
    ).pipe(
      tap((updated) =>
        this._todos.update(current => current.map(t => t.id === id ? updated:t))
      ),
        this.handleErr('Zmiana statusu nie powiodła się  ')
    );
  }
  
  

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
    tap(() => {
        this._todos.update(current => current.filter(t => t.id !== id));
        this.notification.show("Zadanie usunięte", 'success');
      }),
        this.handleErr('Usuwanie nie powiodło się ')
    );
  } 
  deleteCompleted(): Observable<void> {
    return this.http.delete<void>(
    `${this.apiUrl}/todos/delete-completed`).pipe(
      tap(() => {
        this._todos.update(current => current.filter(t => !t.completed));
        this.notification.show("Usunięto zakończone zadania", 'success');
      }),    
        this.handleErr('Usuwanie nie powiodło się   ')
    );
    

  }

  toggleAllCompleted(completed: boolean): Observable<any> {
  return this.http.patch<any>(
    `${this.apiUrl}/todos/toggle-all`,
    { completed }
  ).pipe(
    tap(() => {
      this._todos.update(current => 
        current.map(todo => ({ ...todo, completed }))
      );
      this.notification.show("Zmieniono status wszystkich zadań", 'success');
    }),
        this.handleErr('Zmiana statusu nie powiodła się ')
  );
}
}
