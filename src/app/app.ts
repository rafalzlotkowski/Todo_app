import { Component } from '@angular/core';
import {TodoInputComponent } from './components/todo-input/todo-input';
import { TodoListComponent } from './components/todo-list/todo-list';
import { TodoItemComponent } from './components/todo-item/todo-item'; 
import { TodoService } from './services/todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoEdit } from './components/todo-edit/todo-edit';
import { TodoModels as TodoModel } from './models/todo.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TodoInputComponent,
    TodoListComponent,
    TodoEdit
    
  
  
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  constructor(private todoService: TodoService) {}

  get todos() {
    return this.todoService.getTodos();
  }

  get currentMessage() {
    return this.todoService.message;
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

  selectedTodo: TodoModel | null = null;

onSelectTodo(id: number) {
  this.selectedTodo = this.todoService.getTodoById(id) || null;
}


onEditTodo(todo: any) {
  this.selectedTodo = { ...todo }; 
}
 onSaveEdit(todo: any) {
  this.todoService.editTodo(todo.id, todo.title, todo.description);
  this.selectedTodo = null;
}
onediting(todo: any){
  this.todoService.editTodo(todo.id,todo.title,todo.description);
  this.selectedTodo
}




  
}

