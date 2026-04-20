import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
    
    
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    constructor(private todoService: TodoService) {}

get currentMessage() {
      return this.todoService.message;
    }
    get status(){
      return this.todoService.status;
    }





  
}

