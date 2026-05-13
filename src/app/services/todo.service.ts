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
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`).pipe(
      catchError(err => {
        this.notification.show('Pobieranie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    )
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
   
    catchError(err => {
        this.notification.show('Dodawanie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    );
  } 
    

  sortTodos(filter: string): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${this.apiUrl}/todos?filter=${filter}`).pipe(
      tap(todos => this._todos.set(todos)),
      
      catchError(err => {
      this.notification.show('Błąd podczas sortowania', 'error');
      return throwError(() => err);
    })
  );
  }

  loadTodos(): Observable<TodoModel[]> {
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`).pipe(
    tap(todos => this._todos.set(todos)),
    catchError(err => {
      this.notification.show('Pobieranie danych nie powiodło się', 'error');
      return throwError(() => err);
    })
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
      
    
    catchError(err => {
        this.notification.show('Edytowanie nie powiodło się ','error');
        return throwError(() => err)
      })
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
      catchError(err => {
        this.notification.show('Zmiana statusu nie powiodła się  ','error');
        return throwError(() => err)
      })
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
    catchError(err => {
        this.notification.show('Zmiana statusu nie powiodła się ','error');
        return throwError(() => err)
      })
  );
}

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
    tap(() => {
        this._todos.update(current => current.filter(t => t.id !== id));
        this.notification.show("Zadanie usunięte", 'success');
      }),
      catchError(err => {
        this.notification.show('Usuwanie nie powiodło się ','error');
        return throwError(() => err)
      })
    );
  } 
  deleteCompleted(): Observable<void> {
    return this.http.delete<void>(
    `${this.apiUrl}/todos/delete-completed`).pipe(
      tap(() => {
        this._todos.update(current => current.filter(t => !t.completed));
        this.notification.show("Usunięto zakończone zadania", 'success');
      }),    
      catchError(err => {
        this.notification.show('Usuwanie nie powiodło się   ','error');
        return throwError(() => err)
      })
    );
    

  }
}
