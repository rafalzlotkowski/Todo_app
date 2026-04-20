import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';




@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css',
})
export class TodoEdit {
  todo: any = { title: '', description: '', dueDate: '' };

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private router: Router
  ) {}

  ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  const original = this.todoService.getTodoById(id);

  if (original) {
    this.todo = { ...original }; 
  }
}

onSave() {
  if (!this.todo.title.trim()) {
      this.todoService.notyfication('Tytuł nie może być pusty', 'error');
      return;
    }
    if ( !this.todoService.isValidDate(this.todo.dueDate)) {
    this.todoService.notyfication('Niepoprawna data (format DD-MM-RRRR)','error');
    return;
    }
    if ( !this.todoService.isNotPastDate(this.todo.dueDate)) {
    this.todoService.notyfication('Data nie może być z przeszłości !','error');
    return;
    }

    this.todoService.editTodo(
      this.todo.id,
      this.todo.title.trim(),
      this.todo.description.trim(),
      this.todo.dueDate
    );

    this.todoService.notyfication('Zapisano zmiany', 'success');
    this.router.navigate(['/']);
  }
  

onCancel() {
  const confirmed = confirm(
      "Czy na pewno chcesz odrzucić zmiany ?"
    );

    if (!confirmed) {
      return;
    }
  this.todoService.notyfication('Zmiany odrzucone ', 'success');
  this.router.navigate(['/']); 
}

}