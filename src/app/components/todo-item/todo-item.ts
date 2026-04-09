import { Component, Input, Output,EventEmitter } from '@angular/core';
import{ FormsModule } from '@angular/forms';




@Component({
  selector: 'app-todo-item',
  imports: [  FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItemComponent {
  @Input() todo!: any
  @Input() add = new EventEmitter<{id: number, title: string, description: string }>();

  @Output() toggle = new EventEmitter <number>;
  @Output() delete = new EventEmitter <number>;
  @Output() edit = new EventEmitter <{id:number, title:string, description:string}>();
  @Output() select = new EventEmitter<number>();

  onToggleComplete() {
  this.todo.isCompleted = !this.todo.isCompleted;

  this.toggle.emit(this.todo.id);
  
  console.log('Status zmieniony na:', this.todo.isCompleted);
}

  Delete() {
    this.delete.emit(this.todo.id);
  }

  editing(){
    const newTitle = prompt('Nowy tytuł', this.todo.title);
    const newDescription = prompt('Nowy opis', this.todo.description);
    if (newTitle !== null && newDescription !== null) {
      this.edit.emit({id:this.todo.id, title: newTitle, description: newDescription});
    }
  }
  
}
