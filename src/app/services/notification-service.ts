import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string | null;
  status: 'success' | 'error' | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification>({
    message: null,
    status: null
  });

  notification$ = this.notificationSubject.asObservable();

  show(message: string, status: 'success' | 'error' = 'success') {
    this.notificationSubject.next({ message, status });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.notificationSubject.next({ message: null, status: null });
  }
}