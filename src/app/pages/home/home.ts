import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from '../../components/todo-input/todo-input';
import { TodoListComponent } from '../../components/todo-list/todo-list';
import { Priority, TodoModel } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    TodoInputComponent,
    TodoListComponent,
    
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
  todoService = inject(TodoService);
  
  ngOnInit() {
    this.todoService.loadTodos();
  }
    

  onAddTodo(title: string, description: string,priority: Priority , dueDate?: string) {

    this.todoService.addTodo(title, description,priority, dueDate)
      .subscribe(res => {
        console.log('Dodano:', res);
      });
  }
  
  ontoggleTodo(todo: TodoModel) {
    this.todoService.toggleCompleted(todo.id, !todo.completed).subscribe();
  }
  
  onDeleteTodo(id: number) {
    this.todoService.deleteTodo(id)
    .subscribe();
  }
  
    selectedTodo: TodoModel | null = null;
  
  
  onfilterChange(filter: string) {
    this.todoService.sortTodos(filter).subscribe();
  }
  
  onEditTodo(todo: any) {
    this.selectedTodo = { ...todo }; 
  }
  onSaveEdit(todo: any) {
    this.todoService.editTodo(
      todo.id,
      todo.title,
      todo.description,
      todo.priority,
      todo.dueDate
    ).subscribe(() => {
      this.selectedTodo = null;
    });
  }
  onediting(todo: any){
  }
  onCancelEdit() {
    this.selectedTodo = null;
  }
  
}
