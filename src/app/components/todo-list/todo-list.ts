import { Component, Input, Output,EventEmitter, inject, input, computed } from '@angular/core';
import { TodoModel  } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';


@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoListComponent {
  constructor(){};
  private todoService = inject(TodoService);
  // @Input() todos: TodoModel[] = [];
  todos = input.required<TodoModel[]>();
  completedCount = computed(() => this.todos().filter(t => t.completed).length);
  notCompletedCount = computed(() => this.todos().filter(t => !t.completed).length);

  
  @Output() toggle = new EventEmitter<TodoModel>();
  @Output() delete = new EventEmitter<number>();
  @Output() select = new EventEmitter<number>();
  @Output() edit = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() alltoggle = new EventEmitter<TodoModel>();
  
  toggleAll(completed: boolean) {
    this.todoService.toggleAllCompleted(completed).subscribe();
  }
  onDeleteCompleted() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie zakończone zadania?')) {
      this.todoService.deleteCompleted().subscribe();
    }
  }
  
  

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.filterChange.emit(value);
  }
}
