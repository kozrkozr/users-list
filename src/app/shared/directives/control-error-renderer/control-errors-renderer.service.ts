import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ControlName = string;

@Injectable()
export class ControlErrorsRendererService {
  private errorsStream$ = new Subject<Record<ControlName, string[]>>();
  private validateControlsStream$ = new Subject<void>();

  renderErrorsNotifier(): Observable<Record<ControlName, string[]>> {
    return this.errorsStream$;
  }

  validateControlsNotifier(): Observable<void> {
    return this.validateControlsStream$.asObservable();
  }

  renderErrorsForInvalidControls(): void {
    this.validateControlsStream$.next();
  }

  renderErrors(errorsMap: Record<ControlName, string[]>): void {
    this.errorsStream$.next(errorsMap);
  }
}
