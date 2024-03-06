import { Directive, forwardRef, Provider, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive()
export abstract class CustomControl<T = any> implements ControlValueAccessor {
  disabled = false;

  static getControlProvider(component: Type<any>): Provider {
    return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => component),
      multi: true
    };
  }

  abstract writeValue(value: T): void;

  protected onChange: (value: T) => T = (v) => v;
  protected onTouch: (value: T) => T = (v) => v;

  registerOnTouched(fn: (value: T) => T): void {
    this.onTouch = fn;
  }

  registerOnChange(fn: (value: T) => T): void {
    this.onChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
