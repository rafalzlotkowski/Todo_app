import { Component } from '@angular/core';
import {TodoInputComponent } from './components/todo-input/todo-input';
import { TodoListComponent } from './components/todo-list/todo-list';
import { TodoItemComponent } from './components/todo-item/todo-item'; 
import { TodoService } from './services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    TodoInputComponent,
    TodoListComponent,
  
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  constructor(private todoService: TodoService) {}

  get todos() {
    return this.todoService.getTodos();
  }

  onAddTodo(title: string, description: string) {
    this.todoService.addTodo(title, description);
  }

  ontoggleTodo(id: number) {
    this.todoService.toggleCompleted(id);
  }

  onDeleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }

  onSelectTodo(id: number) {
    this.todoService.getTodoById(id);
  }

  onEditTodo(id: number, title: string, description: string) {
    this.todoService.editTodo(id, title, description);
  }
}
