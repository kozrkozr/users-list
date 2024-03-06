import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationsService } from './notifications.service';
import { NgClass } from '@angular/common';

@NgModule({
  declarations: [NotificationComponent],
  imports: [NgClass],
  providers: [NotificationsService]
})
export class NotificationsModule {}
