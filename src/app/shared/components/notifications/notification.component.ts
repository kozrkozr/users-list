import { Component, Input } from '@angular/core';
import { NotificationType } from './notification.model';

@Component({
  selector: 'app-notification',
  template: `
    <div
      class="notification"
      [ngClass]="{
        'notification--success': type === notificationType.Success,
        'notification--error': type === notificationType.Error
      }"
    >
      {{ message }}
    </div>
  `,
  host: {
    class: 'notification'
  },
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() type: NotificationType = NotificationType.Success;
  @Input() message: string = '';

  protected readonly notificationType = NotificationType;
}
