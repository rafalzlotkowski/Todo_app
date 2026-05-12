import { CommonModule } from '@angular/common';
import { Component, input, computed, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { TodoModel } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { getTodoStatus } from '../../utils/todo.utils';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItemComponent {
  todo = input.required<TodoModel>();
  
  toggle = output<TodoModel>();
  delete = output<number>();
  
  private todoservice = inject(TodoService);

  private readonly statusClasses: Record<string, string> = {
    checked: 'bg-gray-400',
    expired: 'bg-red-400',
    upcoming: 'bg-yellow-300',
    lowpriority: 'bg-green-300',
    mediumpriority: 'bg-orange-300',
    highpriority: 'bg-blue-400',
    ok: 'bg-gray-500',
  };

  todoState = computed(() => {
    const currentTodo = this.todo();
    const status = getTodoStatus(currentTodo, currentTodo.priority);
    return {
      status,
      className: this.statusClasses[status] || 'bg-gray-500'
    };
  });

  onToggleComplete() {
    this.toggle.emit(this.todo());
  }

  deleteitem() {
    if (!this.todo().completed) {
      const confirmed = confirm(
        "To zadanie nie jest oznaczone jako wykonane. Czy na pewno chcesz je usunąć?"
      );
      if (!confirmed) return;
    }
    this.delete.emit(this.todo().id);
  }
}