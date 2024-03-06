import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  Inject,
  Injectable,
  InjectionToken,
  Optional
} from '@angular/core';
import { NotificationsConfig, NotificationType } from './notification.model';
import { NotificationComponent } from './notification.component';
import { DOCUMENT } from '@angular/common';

export const NOTIFICATIONS_CONFIG = new InjectionToken<NotificationsConfig>('Notifications config');

@Injectable()
export class NotificationsService {
  activeNotification: ComponentRef<NotificationComponent> | null = null;
  config: NotificationsConfig = { closeAfterMs: 1000 };

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @Optional() @Inject(NOTIFICATIONS_CONFIG) config: NotificationsConfig,
    @Inject(DOCUMENT) private document: Document,
    private applicationRef: ApplicationRef
  ) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private createNotificationComponent(type: NotificationType, message: string): void {
    this.clearNotificationComponent();

    this.activeNotification = createComponent(NotificationComponent, {
      environmentInjector: this.applicationRef.injector
    });

    this.activeNotification.instance.message = message;
    this.activeNotification.instance.type = type;

    this.applicationRef.attachView(this.activeNotification.hostView);

    this.document.body.append((<EmbeddedViewRef<any>>this.activeNotification.hostView).rootNodes[0]);

    this.timeoutId = setTimeout(() => {
      this.clearNotificationComponent();
    }, 1000);
  }

  private clearNotificationComponent(): void {
    this.clearTimeout();

    if (this.activeNotification) {
      this.applicationRef.detachView(this.activeNotification.hostView);
      this.activeNotification = null;

      return;
    }
  }

  success(message: string): void {
    this.createNotificationComponent(NotificationType.Success, message);
  }

  error(message: string): void {
    this.createNotificationComponent(NotificationType.Error, message);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
