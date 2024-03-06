import { AfterContentInit, Component, ContentChildren, DestroyRef, Input, QueryList } from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CustomControl } from '../../custom-control';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { OptionComponent } from './option/option.component';
import { startWith, switchMap, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItem, CdkOverlayOrigin, CdkConnectedOverlay],
  templateUrl: './select.component.html',
  host: {
    class: 'form-control d-block'
  },
  styleUrl: './select.component.scss',
  providers: [CustomControl.getControlProvider(SelectComponent)]
})
export class SelectComponent<T> extends CustomControl implements AfterContentInit {
  isOpen: boolean = false;

  selectedOption: OptionComponent<T> | null = null;
  value?: T;

  @Input() placeholder: string = 'Select';
  @ContentChildren(OptionComponent) options: QueryList<OptionComponent<T>> = new QueryList<OptionComponent<T>>();

  constructor(private destroyRef: DestroyRef) {
    super();
  }

  ngAfterContentInit(): void {
    this.options.changes
      .pipe(
        startWith(this.options),
        switchMap(() => merge(...this.options.toArray().map((option) => option.clicked))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((option) => {
        if (this.selectedOption) {
          this.selectedOption = null;
        }

        this.value = option.value;

        this.selectedOption = option;
        this.isOpen = false;

        this.onChange(this.selectedOption?.value);
      });
  }

  override writeValue(value: T): void {
    this.value = value;
  }
}
