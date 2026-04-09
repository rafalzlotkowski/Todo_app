import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-todo-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-input.html',
  styleUrl: './todo-input.css',
})
export class TodoInputComponent {
  title: string = '';
  description: string = '';

  @Output() add = new EventEmitter<{ title: string; description: string }>();

  submit() {
  this.add.emit({
    title: this.title,
    description: this.description
  });

  this.title = '';
  this.description = '';
}

}
