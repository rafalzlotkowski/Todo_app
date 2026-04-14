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
  todo!: any

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
    this.todo = { ...original }; // ← KOPIA, nie oryginał
  }
}

onSave() {
  this.todoService.editTodo(
    this.todo.id,
    this.todo.title,
    this.todo.description
  );
  this.router.navigate(['/']);
  }

onCancel() {
  this.router.navigate(['/']); 
}

}