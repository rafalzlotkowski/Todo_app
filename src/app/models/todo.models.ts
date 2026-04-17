export interface TodoModels {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}