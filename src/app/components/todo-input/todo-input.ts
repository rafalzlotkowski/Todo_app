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
  

  submit(form :any) {
    if (!this.title.trim()) {
    this.todoService.notyfication("Niepoprawne zadanie !" ,'error');
    return;
  }
  if ( !this.todoService.isValidDate(this.dueDate)) {
    this.todoService.notyfication('Niepoprawna data (format DD-MM-RRRR)','error');
    return;
  }
   if ( !this.todoService.isNotPastDate(this.dueDate)) {
    this.todoService.notyfication('Data nie może być z przeszłości !','error');
    return;
    }
  
    this.add.emit({
      title: this.title,
      description: this.description,
      dueDate: this.dueDate
    });

  this.title='',
  this.description='',
  this.dueDate = ''

}

}
