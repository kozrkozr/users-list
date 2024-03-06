import { Directive, Optional, Self } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { ControlErrorRendererDirective } from '../../control-error-renderer/control-error-renderer.directive';

@Directive({
  standalone: true,
  selector: '[appIsControlEqualTo]',
  exportAs: 'appIsControlEqualTo'
})
export class IsControlEqualToDirective {
  constructor(
    @Optional()
    @Self()
    private readonly controlDirective: NgControl | null,

    @Optional()
    @Self()
    public readonly errorRenderer: ControlErrorRendererDirective | null
  ) {}

  get controlChanges(): Observable<AbstractControl> {
    return this.controlDirective?.control ? this.controlDirective.control.valueChanges : EMPTY;
  }

  get control(): AbstractControl {
    return this.controlDirective!.control!;
  }
}
