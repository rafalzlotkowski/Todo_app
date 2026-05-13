import { Component, inject, input, computed, output, Signal } from '@angular/core';
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
   todoService = inject(TodoService);
  todos = input.required<TodoModel[]>();
  completedCount = computed(() => this.todos().filter(t => t.completed).length);
  notCompletedCount = computed(() => this.todos().filter(t => !t.completed).length);

  
  toggle = output<TodoModel>();
  delete = output<number>();
  select= output<number>();
  edit = output<any>();
  filterChange = output<string>();
  alltoggle = output<TodoModel>();
  
  toggleAll(completed: boolean) {
    this.todoService.toggleAllCompleted(completed).subscribe();
  }
  onDeleteCompleted() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie zakończone zadania?')) {
      this.todoService.deleteCompleted().subscribe();
    }
  }
  
  onSearchChange(event: Event) {
  const query = (event.target as HTMLInputElement).value;
  this.todoService.updateSearch(query);
}
  

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.filterChange.emit(value);
  }
}
