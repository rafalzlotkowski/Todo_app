export type Priority = 'low' | 'medium' | 'high';
export interface TodoModel {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
}