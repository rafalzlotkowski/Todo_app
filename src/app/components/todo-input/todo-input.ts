import { Component, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-todo-input',
  imports: [],
  templateUrl: './todo-input.html',
  styleUrl: './todo-input.css',
})
export class TodoInputComponent {
  title: string = '';
  description: string = '';

  @Output() add = new EventEmitter<{ title: string; description: string }>();

  onAdd() {
    if (this.title.trim()) {
      this.add.emit({ title: this.title, description: this.description });
      this.title = '';
      this.description = '';
    }
  }
}
