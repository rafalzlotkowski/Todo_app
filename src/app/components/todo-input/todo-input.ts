import { Component, Output, EventEmitter, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Priority } from '../../models/todo.model';
import {NotificationService} from '../../services/notification-service';
import { isValidDate, isNotPastDate } from '../../utils/todo.utils';



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
  priority: 'low' | 'medium' | 'high' = 'medium';
  private todoService = inject(TodoService);
  private notification = inject(NotificationService);

  add = output<{ title: string; description: string; dueDate: string; priority: Priority }>();
  currentmessage = output<string>();
  

  

  submit(form :any) {
    if (!this.title.trim()) {
    this.notification.show("Niepoprawne zadanie !" ,'error');
    return;
  }
  if ( !isValidDate(this.dueDate)) {
    this.notification.show('Niepoprawna data (format DD-MM-RRRR)','error');
    return;
  }
   if ( !isNotPastDate(this.dueDate)) {
    this.notification.show('Data nie może być z przeszłości !','error');
    return;
    }
    this.add.emit({
      title: this.title,
      description: this.description,
      priority: this.priority,
      dueDate: this.dueDate
    });

  this.title='',
  this.description='',
  this.dueDate = ''
  

}

}
