import { Component, Input, Output,EventEmitter } from '@angular/core';




@Component({
  selector: 'app-todo-item',
  imports: [],
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
    this.toggle.emit(this.todo.id);
  }

  onDelete() {
    this.delete.emit(this.todo.id);
  }

  onEdit(){
    const newTitle = prompt('Nowy tytuł', this.todo.title);
    const newDescription = prompt('Nowy opis', this.todo.description);
    if (newTitle !== null && newDescription !== null) {
      this.edit.emit({id:this.todo.id, title: newTitle, description: newDescription});
    }
  }
  onSelect() {
    this.select.emit(this.todo.id);
  }
}
