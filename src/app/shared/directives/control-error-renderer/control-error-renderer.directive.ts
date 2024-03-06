import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  ComponentRef,
  createComponent,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { ControlErrorsRendererService, ControlName } from './control-errors-renderer.service';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorsMessagesDict, isExtractErrorMessageFn } from './control-error-renderer.model';
import { ControlErrorsMessagesOutletComponent } from './control-errors-messages-outlet/control-errors-messages-outlet.component';
import { map } from 'rxjs';

export const CONTROL_VALIDATION_ERRORS_MESSAGES = new InjectionToken<Record<string, string>>(
  'Form controls validation errors messages dictionary'
);

export const HAS_RENDERED_ERRORS_CLASS = 'has-rendered-errors';

@Directive({
  selector: '[appControlErrorRenderer]',
  standalone: true
})
export class ControlErrorRendererDirective implements AfterViewInit, OnDestroy {
  private _errorsMessagesDict: ErrorsMessagesDict = {};
  @Input() set errorsMessagesDict(errorsMessagesDict: ErrorsMessagesDict) {
    this._errorsMessagesDict = errorsMessagesDict;

    if (this.defaultErrorsMessagesDict) {
      Object.keys(this.defaultErrorsMessagesDict).forEach((key) => {
        if (!this._errorsMessagesDict.hasOwnProperty(key)) {
          this._errorsMessagesDict[key] = this.defaultErrorsMessagesDict![key];
        }
      });
    }
  }

  get errorsMessagesDict(): ErrorsMessagesDict {
    return this._errorsMessagesDict;
  }

  @Input() errorMessagesContainer?: HTMLElement;

  errorMessagesOutlet: ComponentRef<ControlErrorsMessagesOutletComponent> | null = null;

  constructor(
    @Optional()
    @Self()
    private readonly ngControl: NgControl | null,
    @Optional()
    private controlErrorsRendererService: ControlErrorsRendererService,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef,
    private destroyRef: DestroyRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(CONTROL_VALIDATION_ERRORS_MESSAGES)
    private defaultErrorsMessagesDict: Record<string, string> | undefined,
    private environmentInjector: EnvironmentInjector,
    private applicationRef: ApplicationRef
  ) {
    if (this.defaultErrorsMessagesDict) {
      this._errorsMessagesDict = this.defaultErrorsMessagesDict;
    }
  }

  ngAfterViewInit(): void {
    if (this.ngControl) {
      this.listenFocusEvents();
      this.listenControlChange();
      this.listenManualControlValidation();
      this.listenRenderedErrors();
    }
  }

  ngOnDestroy(): void {
    this.removeErrors();
  }

  public get control(): AbstractControl | null | undefined {
    return this.ngControl?.control;
  }

  private listenFocusEvents(): void {
    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((origin: FocusOrigin) => {
        if (!origin) {
          this.validate();
        }
      });
  }

  private listenControlChange(): void {
    if (!this.ngControl) {
      return;
    }

    this.ngControl.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.validate();
    });
  }

  private listenManualControlValidation(): void {
    this.controlErrorsRendererService
      .validateControlsNotifier()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validate());
  }

  private listenRenderedErrors(): void {
    this.controlErrorsRendererService
      .renderErrorsNotifier()
      .pipe(
        map((errors) => this.extractControlError(errors)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((errors: string[]) => {
        if (errors?.length) {
          this.renderErrors(errors);
        }
      });
  }

  private extractControlError(errors: Record<ControlName, string[]>): string[] {
    const controlName = this.ngControl?.name || '';

    return errors[controlName] ?? [];
  }

  public validate(): void {
    if (!this.control) {
      return;
    }

    if (this.control.valid || !this.control.errors) {
      this.removeErrors();

      return;
    }

    const errors: string[] = this.extractErrorsMessages();

    this.renderErrors(errors);
  }

  public extractErrorsMessages(): string[] {
    if (!this.control) return [];

    return Object.keys(this.control.errors || {})
      .filter((errorKey) => this.errorsMessagesDict[errorKey])
      .map((errorKey) => {
        const errorMessage = this.errorsMessagesDict[errorKey];

        return isExtractErrorMessageFn(errorMessage) ? errorMessage(this.control?.errors?.[errorKey]) : errorMessage;
      });
  }

  renderErrors(errors: string[]): void {
    if (errors.length) {
      if (!this.errorMessagesOutlet) {
        this.errorMessagesOutlet = createComponent(ControlErrorsMessagesOutletComponent, {
          environmentInjector: this.environmentInjector
        });

        this.applicationRef.attachView(this.errorMessagesOutlet.hostView);
      }

      this.errorMessagesOutlet.instance.errorsMessages = errors;

      const parentElement = this.elementRef.nativeElement.parentNode;
      this.renderer.appendChild(parentElement, this.errorMessagesOutlet.location.nativeElement);
      this.renderer.addClass(this.elementRef.nativeElement, HAS_RENDERED_ERRORS_CLASS);

      this.changeDetectorRef.markForCheck();
    }
  }

  removeErrors(): void {
    if (this.errorMessagesOutlet) {
      const parentElement = this.elementRef.nativeElement.parentNode;
      this.renderer.removeChild(parentElement, this.errorMessagesOutlet.location.nativeElement);
      this.renderer.removeClass(this.elementRef.nativeElement, HAS_RENDERED_ERRORS_CLASS);

      this.applicationRef.detachView(this.errorMessagesOutlet.hostView);
      this.errorMessagesOutlet = null;

      this.changeDetectorRef.markForCheck();
    }
  }
}
