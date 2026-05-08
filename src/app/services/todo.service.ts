import { Injectable } from '@angular/core';
import { Priority, TodoModels as TodoModel } from '../models/todo.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import {NotificationService} from './notification-service';
@Injectable({
  providedIn: 'root',
  
})
export class TodoService {
  
  
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private notification: NotificationService
  ) {
  }

  private todosSubject = new BehaviorSubject<TodoModel[]>([]);
  todos$ = this.todosSubject.asObservable();
 
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`).pipe(
      catchError(err => {
        this.notification.show('Pobieranie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    )
  }
  
  addTodo(title: string, description: string, priority : Priority ,dueDate?: string): Observable<TodoModel[]>{
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate,
      priority,
      completed: false
    };
       console.log(priority)

    return this.http.post<TodoModel>(`${this.apiUrl}/todos`, newTodo).pipe(
    tap(() => this.notification.show("Zadanie zostało dodane!", 'success')),
    switchMap(() => this.loadTodos()),
    
    catchError(err => {
        this.notification.show('Dodawanie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    );
  } 

  sortTodos(filter: string): Observable<TodoModel[]> {
    console.log(filter);
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos?filter=${filter}`).pipe(
    tap(todos => this.todosSubject.next(todos)),
    catchError(err => {
      this.notification.show('Błąd podczas sortowania', 'error');
      return throwError(() => err);
    })
  );
  }

  loadTodos(): Observable<TodoModel[]> {
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`).pipe(
    tap(todos => this.todosSubject.next(todos)),
    catchError(err => {
      this.notification.show('Pobieranie danych nie powiodło się', 'error');
      return throwError(() => err);
    })
    );
  }
  
  editTodo(id:number,title: string, description:string, priority: Priority ,dueDate?:string): Observable<TodoModel[]> {
    const updatedTodo: Partial<TodoModel> = {
  
      title,
      description,
      priority,
      dueDate
    };
    return this.http.patch<TodoModel>(`${this.apiUrl}/todos/${id}`, updatedTodo).pipe(
    
      switchMap(() => this.loadTodos()),
    
    catchError(err => {
        this.notification.show('Edytowanie nie powiodło się ','error');
        return throwError(() => err)
      })
  );
  }

  toggleCompleted(id: number, completed: boolean): Observable<TodoModel[]> {
  return this.http.patch<TodoModel>(
    `${this.apiUrl}/todos/${id}`,
    { completed }
    
    ).pipe(
      switchMap(() => this.loadTodos()),
      
      catchError(err => {
        this.notification.show('Zmiana statusu nie powiodła się  ','error');
        return throwError(() => err)
      })
    );
  }

  deleteTodo(id: number): Observable<TodoModel[]> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
      
      switchMap(() => this.loadTodos()),
      catchError(err => {
        this.notification.show('Usuwanie nie powiodło się ','error');
        return throwError(() => err)
      })
    );
  } 
}
