import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoInputComponent } from './todo-input';

describe('TodoInput', () => {
  let component: TodoInputComponent;
  let fixture: ComponentFixture<TodoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
