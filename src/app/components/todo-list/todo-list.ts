import { Component, Input, Output,EventEmitter } from '@angular/core';
import { TodoModels  } from '../../models/todo.models';
import { TodoItemComponent } from '../todo-item/todo-item';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoListComponent {

  @Input() todos: TodoModels[] = [];

  @Output() toggle = new EventEmitter<TodoModels>();
  @Output() delete = new EventEmitter<number>();
  @Output() select = new EventEmitter<number>();
  @Output() edit = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<string>();


  onFilterChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  this.filterChange.emit(value);
}
}
