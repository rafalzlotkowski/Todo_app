import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from '../../components/todo-input/todo-input';
import { TodoListComponent } from '../../components/todo-list/todo-list';
import { TodoModels as TodoModel } from '../../models/todo.models';
import { TodoService } from '../../services/todo.service';
import { Observable } from 'rxjs';


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
  todos$: Observable<TodoModel[]>;

constructor(private todoService: TodoService) {
  this.todos$ = this.todoService.getTodos();
}
  
    

    onAddTodo(title: string, description: string, dueDate?: string) {
  console.log('home dodanie zadania');

  this.todoService.addTodo(title, description, dueDate)
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
  
  onSelectTodo(id: number) {
    this.todoService.getTodoById(id).subscribe(todo => {
    this.selectedTodo = todo;
  });
}
  
  
  onEditTodo(todo: any) {
    this.selectedTodo = { ...todo }; 
  }
   onSaveEdit(todo: any) {
  this.todoService.editTodo(
    todo.id,
    todo.title,
    todo.description,
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
