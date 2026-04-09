import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoInputComponent } from './components/todo-input/todo-input';  
import { TodoListComponent } from './components/todo-list/todo-list';
import { TodoService } from './services/todo.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('ToDo_app');
  protected readonly todos = signal([]);
  
}
