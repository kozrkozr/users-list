import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-control-errors-messages-outlet',
  standalone: true,
  imports: [NgForOf],
  template: `
    <div class="errors-messages">
      <div class="errors-messages__error" *ngFor="let message of errorsMessages">{{ message }}</div>
    </div>
  `,
  styleUrl: './control-errors-messages-outlet.component.scss'
})
export class ControlErrorsMessagesOutletComponent {
  @Input() errorsMessages: string[] = [];
}
