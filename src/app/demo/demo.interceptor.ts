import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

let demoTodos = [
  { id: 1, title: "zapłacenie rachunków", opis: "zapłacić za gaz/prąd", dueDate: "2026-06-10", priority: "high", completed: true},
  { id: 2, title: "Kupienie artykułów spożywczych", opis: "Lista: mleko, chleb, warzywa, makaron", dueDate: "2026-05-21", priority: "medium", completed: false },
  { id: 3, title: "Umówienie wizyty u dentysty", opis: "Kontrola + czyszczenie", dueDate: "2026-06-27", priority: "high", completed: false },
  { id: 4, title: "Przygotowanie prezentacji", opis: "Slajdy na spotkanie projektowe", dueDate: "2026-05-30", priority: "medium", completed: false },
  { id: 5, title: "Odebranie paczki", opis: "Paczkomat przy ul. Lipowej", dueDate: "2026-06-29", priority: "medium", completed: false },
  { id: 6, title: "Zrobienie prania", opis: "Białe + kolorowe osobno", dueDate: "2026-05-28", priority: "medium", completed: false },
  { id: 7, title: "Omówienie zagadnień", opis: " Zagadnienia z seminarium", dueDate: "2026-05-28", priority: "high", completed: false}
];

export const demoInterceptor: HttpInterceptorFn = (req, next) => {

  if (!environment.demo) {
    return next(req);
  }

  if (!req.url.includes('/todos')) {
    return next(req);
  }

  const cleanUrl = req.url.split('?')[0];
  const segments = cleanUrl.split('/').filter(segment => segment.length > 0);
  const lastSegment = segments[segments.length - 1] || '';

  const todosIndex = segments.indexOf('todos');
  let numericId = NaN;
  if (todosIndex !== -1 && segments[todosIndex + 1]) {
    numericId = parseInt(segments[todosIndex + 1], 10);
  }

  if (req.method === 'GET') {
    if (!isNaN(numericId)) {
      const todo = demoTodos.find(t => Number(t.id) === numericId);
      return of(new HttpResponse({ status: todo ? 200 : 404, body: todo || null }));
    }

    if (lastSegment === 'todos') {
      let filter = (req.params.get('filter') || '').toLowerCase().trim();
      let filteredResults = [...demoTodos];
      if (!filter && req.url.includes('filter=')) {
        const urlParts = req.url.split('filter=');
        if (urlParts.length > 1) {
          filter = urlParts[1].split('&')[0].toLowerCase().trim();
        }
      }
      if (filter === 'completed') filteredResults = filteredResults.filter(t => t.completed);
      else if (filter === 'incomplete') filteredResults = filteredResults.filter(t => !t.completed);
      else if (['low', 'medium', 'high'].includes(filter)) filteredResults = filteredResults.filter(t => t.priority === filter);

      return of(new HttpResponse({ status: 200, body: filteredResults }));
    }
  }

  if (req.method === 'POST' && lastSegment === 'todos') {
    const body = req.body as any;
    
   
    const newTodo = {
      id: Date.now(),
      title: body.title,
      opis: body.description || '', 
      priority: body.priority,
      dueDate: body.dueDate || new Date().toISOString(),
      completed: body.completed ?? false
    };
    
    demoTodos.push(newTodo);

    return of(new HttpResponse({ 
      status: 201, 
      body: { DaneZadania: newTodo } 
    }));
  }

  if (req.method === 'PATCH') {
    if (lastSegment === 'toggle-all') {
      const { completed } = req.body as any;
      demoTodos = demoTodos.map(todo => ({ ...todo, completed }));
      return of(new HttpResponse({ status: 200, body: { success: true } }));
    }
    
    if (!isNaN(numericId)) {
      const body = req.body as any;
      
      const updatedFields: any = { ...body };
      if ('description' in body) {
        updatedFields.opis = body.description;
        delete updatedFields.description;
      }

      demoTodos = demoTodos.map(todo => 
        Number(todo.id) === numericId ? { ...todo, ...updatedFields } : todo
      );
      
      const updated = demoTodos.find(todo => Number(todo.id) === numericId);
      return of(new HttpResponse({ status: updated ? 200 : 404, body: updated }));
    }
  }
  
  if (req.method === 'DELETE') {
    if (lastSegment === 'delete-completed') {
      demoTodos = demoTodos.filter(todo => !todo.completed);
      return of(new HttpResponse({ status: 200, body: null }));
    }
    if (!isNaN(numericId)) {
      const todoExist = demoTodos.some(todo => Number(todo.id) === numericId);
      if (!todoExist) {
        return of(new HttpResponse({ status: 404, body: null }));
      }
      demoTodos = demoTodos.filter(todo => Number(todo.id) !== numericId);
      return of(new HttpResponse({ status: 200, body: null }));
    }
  }
  
  return next(req);
};