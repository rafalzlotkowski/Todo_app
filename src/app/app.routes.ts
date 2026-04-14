import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TodoEdit } from './components/todo-edit/todo-edit';

export const routes: Routes = [
    {path: '',component:Home},
    {path: 'edit/:id', component: TodoEdit},
];
