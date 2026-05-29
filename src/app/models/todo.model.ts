export type Priority = 'low' | 'medium' | 'high';
export interface TodoModel {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
}

export interface ApiTodoResponse {
  id: number;
  title: string;
  opis: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  metadata?: {
    createdAt: string;
    status: string;
  };
}