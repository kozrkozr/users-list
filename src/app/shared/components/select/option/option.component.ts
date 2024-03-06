import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [],
  template: ` <ng-content></ng-content> `,
  styleUrl: './option.component.scss'
})
export class OptionComponent<T> {
  @Input() value?: T;
  @Output() clicked: EventEmitter<OptionComponent<T>> = new EventEmitter<OptionComponent<T>>();

  @HostListener('click')
  onClick(): void {
    this.clicked.emit(this);
  }
}
