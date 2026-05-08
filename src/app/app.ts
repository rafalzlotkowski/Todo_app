import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification-service';

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
export class App implements OnInit {
  private todoService = inject(TodoService);
  private notificationService = inject(NotificationService);

  // Przypisanie następuje od razu, TypeScript jest zadowolony
  notification$ = this.notificationService.notification$;

  ngOnInit() {
    this.todoService.loadTodos().subscribe();
  }
}