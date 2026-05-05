import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import {  TodoModels as TodoModel } from '../../models/todo.models';
import { TodoService } from '../../services/todo.service';




@Component({
  selector: 'app-todo-item',
  standalone:true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItemComponent {
  @Input() todo!: TodoModel;
  @Input() add = new EventEmitter<{id: number, title: string, description:string, dueDate?:string }>();
  @Output() toggle = new EventEmitter <TodoModel>;
  @Output() delete = new EventEmitter <number>;
  @Output() edit = new EventEmitter<any>();
  @Output() select = new EventEmitter<number>();
  
  constructor(private todoservice: TodoService ){};
  getclasses(todo:TodoModel){
  const status = this.todoservice.notifyUpCommingTodos(todo);
    return{
      'bg-red-400': status === 'expired',
      'bg-yellow-300': status === 'upcoming',
      'bg-gray-500': status === 'ok',
    }
  }
  getStatus(todo: TodoModel): string {
  return this.todoservice.notifyUpCommingTodos(todo);
}
  

  onToggleComplete() {
  this.toggle.emit(this.todo);
  }

  deleteitem() {
  if (!this.todo.completed) {
    const confirmed = confirm(
      "To zadanie nie jest oznaczone jako wykonane. Czy na pewno chcesz je usunąć?"
    );

    if (!confirmed) {
      return;
    }
  }

  this.delete.emit(this.todo.id);
  }  
  
  
}
