import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter, output } from '@angular/core';
import{ FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import {  TodoModels as TodoModel } from '../../models/todo.models';




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
