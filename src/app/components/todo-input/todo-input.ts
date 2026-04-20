import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';



@Component({
  selector: 'app-todo-input',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-input.html',
  styleUrl: './todo-input.css',
})
export class TodoInputComponent {
  title = '';
  description = '';
  dueDate ='';
  constructor(private todoService: TodoService) {}
  @Output() add = new EventEmitter<{ title: string; description: string ;dueDate: string }>();
  @Output() currentmessage = new EventEmitter<string>();
  isValidDate(dueDate: string): boolean {
  if (!dueDate) return false;

  const [year, month, day] = dueDate.split('-').map(Number);

  if (!year || !month || !day) return false;

  const parsed = new Date(dueDate);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() + 1 === month &&
    parsed.getDate() === day
  );
}

  submit(form :any) {
    if (!this.title.trim()) {
    this.currentmessage.emit("Niepoprawne zadanie !");
    return;
  }

  if (!this.isValidDate(this.dueDate)) {
    this.todoService.notyfication('Niepoprawna data (format RRRR-MM-DD)');
    return;
  }
    this.add.emit({
      title: this.title,
      description: this.description,
      dueDate:this.dueDate
    });

  this.title='',
  this.description='',
  this.dueDate = ''

}

}
