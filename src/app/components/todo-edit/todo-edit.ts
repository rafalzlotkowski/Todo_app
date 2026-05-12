import { Component, OnInit, signal, inject, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { NotificationService } from '../../services/notification-service';
import { isValidDate, isNotPastDate } from '../../utils/todo.utils';
import { TodoModel } from '../../models/todo.model';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css',
})
export class TodoEdit implements OnInit {
  todo = signal<Partial<TodoModel>>({});
  
  save = output<any>();
  cancel = output<void>();

  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.todoService.getTodoById(id).subscribe(original => {
      this.todo.set({ ...original });
    });
  }

  onSave() {
    const current = this.todo(); 

    if (!current.title?.trim()) {
      this.notification.show('Tytuł nie może być pusty', 'error');
      return;
    }

    if (!isValidDate(current.dueDate ?? '')) {
      this.notification.show('Niepoprawna data (format DD-MM-RRRR)', 'error');
      return;
    }

    if (!isNotPastDate(current.dueDate ?? '')) {
      this.notification.show('Data nie może być z przeszłości!', 'error');
      return;
    }

    this.todoService.editTodo(
      current.id!, 
      current.title.trim(), 
      current.description ?? '', 
      current.priority!, 
      current.dueDate ?? ''
    ).subscribe({
      next: () => {
        this.notification.show('Zapisano zmiany', 'success');
        this.router.navigate(['/']);
      },
      error: () => this.notification.show('Błąd podczas zapisu', 'error')
    });
  }

  onCancel() {
    if (confirm("Czy na pewno chcesz odrzucić zmiany?")) {
      this.router.navigate(['/']);
    }
  }
}