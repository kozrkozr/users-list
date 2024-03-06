import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CustomControl } from '../../custom-control';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  host: {
    class: 'form-control d-flex align-items-center',
    '[class.readonly]': 'readonly',
    '[class.disabled]': 'disabled'
  },
  template: `
    <div class="hidden-if-empty form-control__prefix">
      <ng-content select="[input-prefix]"></ng-content>
    </div>
    <input
      [attr.type]="type"
      [readonly]="readonly"
      class="w-100"
      [formControl]="formControl"
      [placeholder]="placeholder"
      (blur)="onTouch(formControl.value)"
    />
  `,
  styleUrl: './input.component.scss',
  providers: [CustomControl.getControlProvider(InputComponent)]
})
export class InputComponent extends CustomControl<string> implements OnInit {
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;
  @Input() type: string = 'text';

  formControl = new FormControl();
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.onChange(value);
    });
  }

  override writeValue(value: string): void {
    this.formControl.setValue(value, { emitEvent: false });
  }
}
