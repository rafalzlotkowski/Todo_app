import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string | null;
  status: 'success' | 'error' | null;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
private notificationSignal = signal<Notification>({
      message: null,
    status: null
  });

  notification = this.notificationSignal.asReadonly();
  show(message: string, status: 'success' | 'error' = 'success') {
    this.notificationSignal.set({ message, status });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.notificationSignal.set({ message: null, status: null });
  }
}