import { Priority, TodoModels as TodoModel } from '../models/todo.models';

export const isValidDate = (dueDate: string): boolean => {
  if (!dueDate) return false;
  const [y, m, d] = dueDate.split('-').map(Number);
  const date = new Date(dueDate);
  return (
    date.getFullYear() === y && y >= 1000 && y <= 9999 &&
    date.getMonth() + 1 === m &&
    date.getDate() === d
  );
};

export const isNotPastDate = (dueDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dueDate);
  return date >= today;
};

export const getTodoStatus = (todo: TodoModel, priority: Priority): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!todo.dueDate) return 'ok';
  
  const endDate = new Date(todo.dueDate);
  endDate.setHours(0, 0, 0, 0);
  
  const future = new Date(today);
  future.setDate(today.getDate() + 2);
  
  if (todo.completed) return 'checked';
  if (endDate < today) return 'expired';
  if (endDate < future) return 'upcoming';
  
  if (priority === 'low') return 'lowpriority';
  if (priority === 'medium') return 'mediumpriority';
  if (priority === 'high') return 'highpriority';
  
  return 'ok';
};