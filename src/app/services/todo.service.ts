import { computed, inject, Injectable, signal } from '@angular/core';
import { Priority, TodoModel, ApiTodoResponse } from '../models/todo.model'; 
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private notification = inject(NotificationService);

  private _todos = signal<TodoModel[]>([]);
  todos = this._todos.asReadonly();

  private _searchQuery = signal('');

  filteredTodos = computed(() => {
    const query = this._searchQuery().toLowerCase();
    return this._todos().filter(t => 
      t.title.toLowerCase().includes(query) ||
      (t.description?.toLowerCase() || '').includes(query)    );
  });

  private handleErr<T>(message: string) {
    return catchError<T, Observable<never>>((err) => {
      this.notification.show(message, 'error');
      return throwError(() => err);
    });
  }
  
  updateSearch(query: string) {
    this._searchQuery.set(query);
  }

  getTodoById(id: number): Observable<TodoModel> {
    return this.http.get<ApiTodoResponse>(`${this.apiUrl}/todos/${id}`).pipe(
      map(rawTodo => mapToTodoModel(rawTodo)), 
      this.handleErr('Pobieranie zadania nie powiodło się')
    );
  }

  loadTodos(): Observable<TodoModel[]> {
    return this.http.get<ApiTodoResponse[]>(`${this.apiUrl}/todos`).pipe(
      map(rawTodos => rawTodos.map(mapToTodoModel)),
      tap(todos => this._todos.set(todos)),
      this.handleErr('Pobieranie danych nie powiodło się')
    );
  }

  sortTodos(filter: string): Observable<TodoModel[]> {
    return this.http.get<ApiTodoResponse[]>(`${this.apiUrl}/todos?filter=${filter}`).pipe(
      map(rawTodos => rawTodos.map(mapToTodoModel)), 
      tap(todos => this._todos.set(todos)),
      this.handleErr('Błąd podczas sortowania')
    );
  }

  addTodo(title: string, description: string, priority: Priority, dueDate?: string): Observable<TodoModel> {    
    const newTodo: Omit<TodoModel, 'id'> = {
      title,
      description,
      dueDate: dueDate || new Date().toISOString(),
      priority,
      completed: false
    };

    return this.http.post<{ DaneZadania: ApiTodoResponse }>(`${this.apiUrl}/todos`, newTodo).pipe(
      map(response => mapToTodoModel(response.DaneZadania)),
      tap((createdTodo) => {
        this._todos.update(current => [...current, createdTodo]);
        this.notification.show("Zadanie zostało dodane!", 'success');
      }),
      this.handleErr('Dodawanie zadania nie powiodło się')
    );
  } 
    
  editTodo(id: number, title: string, description: string, priority: Priority, dueDate?: string): Observable<TodoModel> {
    const updatedTodo: Partial<TodoModel> = { title, description, priority, dueDate };

    return this.http.patch<ApiTodoResponse>(`${this.apiUrl}/todos/${id}`, updatedTodo).pipe(
      map(rawTodo => mapToTodoModel(rawTodo)),
      tap((updated) => {
          this._todos.update(current => 
            current.map(todo => todo.id === id ? updated : todo)
          );
          this.notification.show("Zadanie zaktualizowane!", 'success');
      }),
      this.handleErr('Edytowanie nie powiodło się')
    );
  }

  toggleCompleted(id: number, completed: boolean): Observable<TodoModel> {
    return this.http.patch<ApiTodoResponse>(`${this.apiUrl}/todos/${id}`, { completed }).pipe(
      map(rawTodo => mapToTodoModel(rawTodo)), 
      tap((updated) =>
        this._todos.update(current => current.map(t => t.id === id ? updated : t))
      ),
      this.handleErr('Zmiana statusu nie powiodła się')
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}`).pipe(
      tap(() => {
        this._todos.update(current => current.filter(t => t.id !== id));
        this.notification.show("Zadanie usunięte", 'success');
      }),
      this.handleErr('Usuwanie nie powiodło się')
    );
  } 

  deleteCompleted(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todos/delete-completed`).pipe(
      tap(() => {
        this._todos.update(current => current.filter(t => !t.completed));
        this.notification.show("Usunięto zakończone zadania", 'success');
      }),    
      this.handleErr('Usuwanie nie powiodło się')
    );
  }

  toggleAllCompleted(completed: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/todos/toggle-all`, { completed }).pipe(
      tap(() => {
        this._todos.update(current => 
          current.map(todo => ({ ...todo, completed }))
        );
        this.notification.show("Zmieniono status wszystkich zadań", 'success');
      }),
      this.handleErr('Zmiana statusu nie powiodła się')
    );
  }
}

function mapToTodoModel(apiTodo: ApiTodoResponse): TodoModel {
  return {
    id: apiTodo.id,
    title: apiTodo.title ,
    description: apiTodo.opis || '',
    priority: apiTodo.priority as Priority,
    completed: apiTodo.completed,
    dueDate: apiTodo.dueDate
  };
}