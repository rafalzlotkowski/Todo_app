import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from '../../components/todo-input/todo-input';
import { TodoListComponent } from '../../components/todo-list/todo-list';
import { TodoService } from '../../services/todo.service';
import { TodoModels as TodoModel } from '../../models/todo.models';

@Component({
  selector: 'app-home',
  imports: [FormsModule,
    CommonModule,
    TodoInputComponent,
    TodoListComponent,
    
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private todoService: TodoService) {}
  
    get todos() {
      return this.todoService.getTodos();
    }
  
    get currentMessage() {
      return this.todoService.message;
    }
    onAddTodo(title: string, description: string,dueDate: string) {
      if(!this){

      }
      this.todoService.addTodo(title, description,dueDate);
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
    this.todoService.editTodo(todo.id, todo.title, todo.description,todo.dueDate);
    this.selectedTodo = null;
  }
  onediting(todo: any){
    this.todoService.editTodo(todo.id,todo.title,todo.description,todo.dueDate);
    this.selectedTodo
  }
  onCancelEdit() {
    this.selectedTodo = null;
  }
}
