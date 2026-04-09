import { Component, Input, Output,EventEmitter } from '@angular/core';
import { TodoModels } from '../../models/todo.models';
import { TodoItemComponent } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoListComponent {
  @Input() todos: TodoModels[] = [];

  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() select = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{id:number, title:string, description:string}>();

}
