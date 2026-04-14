import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css',
})
export class TodoEdit {
  @Input() todo!: any;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.todo);
  }
  onCancel(){
    this.cancel.emit()
  }
}
