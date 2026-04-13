import { Component, Input, Output,EventEmitter, output } from '@angular/core';
import{ FormsModule } from '@angular/forms';




@Component({
  selector: 'app-todo-item',
  standalone:true,
  imports: [  FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItemComponent {
  @Input() todo!: any
  @Input() add = new EventEmitter<{id: number, title: string, description: string }>();
  @Output() toggle = new EventEmitter <number>;
  @Output() delete = new EventEmitter <number>;
  @Output() edit = new EventEmitter<any>();
  @Output() select = new EventEmitter<number>();

  onToggleComplete() {
  this.toggle.emit(this.todo.id);
  }

  deleteitem() {
  if (!this.todo.completed) {
    const confirmed = confirm(
      "To zadanie nie jest oznaczone jako wykonane. Czy na pewno chcesz je usunąć?"
    );

    if (!confirmed) {
      return;
    }
  }

  this.delete.emit(this.todo.id);
}


  


  
  
}
