import { Component, Input, Output, EventEmitter, input, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { NotificationService } from '../../services/notification-service';
import { isValidDate, isNotPastDate } from '../../utils/todo.utils';




@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css',
})
export class TodoEdit {
  todo: any = {};
  priority: 'low' | 'medium' | 'high' = 'medium';

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService
     

  ) {}

ngOnInit() {
  
  const id = Number(this.route.snapshot.paramMap.get('id'));
  console.log('ID z route:', id);
  this.todoService.getTodoById(id).subscribe(original => {
  this.todo = { ...original };
  this.cdr.detectChanges();
  
});
 
  }
onSave() {
  if (!this.todo.title.trim()) {
      this.notification.show('Tytuł nie może być pusty', 'error');
      return;
    }
    if (!isValidDate(this.todo.dueDate)) {
    this.notification.show('Niepoprawna data (format DD-MM-RRRR)','error');
    return;
    }
    if ( !isNotPastDate(this.todo.dueDate)) {
    this.notification.show('Data nie może być z przeszłości !','error');
    return;
    }
    this.todoService.editTodo(
      this.todo.id,
      this.todo.title.trim(),
      this.todo.description.trim(),
      this.todo.priority,
      this.todo.dueDate
    ).subscribe(() => {
    this.notification.show('Zapisano zmiany', 'success');
    this.router.navigate(['/']);
  });
}
  

onCancel() {
  const confirmed = confirm(
      "Czy na pewno chcesz odrzucić zmiany ?"
    );

    if (!confirmed) {
      return;
    }
  this.notification.show('Zmiany odrzucone ', 'success');
  this.router.navigate(['/']); 
}

}