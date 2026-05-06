import { Injectable } from '@angular/core';
import { TodoModels as TodoModel } from '../models/todo.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
  message: string | null = null;  
  status: 'success' | 'error' | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  private todosSubject = new BehaviorSubject<TodoModel[]>([]);
  todos$ = this.todosSubject.asObservable();
  notification(message: string, status: 'success' | 'error' = 'success') {
    this.message = message;
    this.status = status;
    
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
  
 
  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<TodoModel>(`${this.apiUrl}/todos/${id}`).pipe(
      catchError(err => {
        this.notification('Pobieranie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    )
  }
  
  addTodo(title: string, description: string, dueDate?: string): Observable<TodoModel[]>{
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate,
      completed: false
    };
    return this.http.post<TodoModel>(`${this.apiUrl}/todos`, newTodo).pipe(
    tap(() => this.notification("Zadanie zostało dodane!",'success')),
    switchMap(() => this.loadTodos()),
    catchError(err => {
        this.notification('Dodawanie zadania nie powiodło się ','error');
        return throwError(() => err)
      })
    );
  } 

  sortTodos(filter: string): Observable<TodoModel[]> {
    console.log(filter)
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos?filter=${filter}`).pipe(
    tap(todos => this.todosSubject.next(todos)),
    catchError(err => {
      this.notification('Błąd podczas sortowania','error');
      return throwError(() => err);
    })
  );
  }

  loadTodos(): Observable<TodoModel[]> {
  return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`).pipe(
    tap(todos => this.todosSubject.next(todos)),
    catchError(err => {
      this.notification('Pobieranie danych nie powiodło się', 'error');
      return throwError(() => err);
    })
    );
  }
  
  editTodo(id:number,title: string, description:string, dueDate?:string): Observable<TodoModel[]> {
    const updatedTodo: Partial<TodoModel> = {
  
      title,
      description,
      dueDate
    };
    return this.http.patch<TodoModel>(`${this.apiUrl}/todos/${id}`, updatedTodo).pipe(
    
      switchMap(() => this.loadTodos()),
    
      catchError(err => {
        this.notification('Edytowanie nie powiodło się ','error');
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
        this.notification('Zmiana statusu nie powiodła się  ','error');
        return throwError(() => err)
      })
    );
  }

  


  deleteTodo(id: number): Observable<TodoModel[]> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
      
      switchMap(() => this.loadTodos()),
      catchError(err => {
        this.notification('Usuwanie nie powiodło się ','error');
        return throwError(() => err)
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
