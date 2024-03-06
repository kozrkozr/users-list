import { AfterContentInit, ContentChildren, Directive, QueryList } from '@angular/core';
import { merge } from 'rxjs';
import { IsControlEqualToDirective } from './is-control-equal-to.directive';

export const NOT_EQUAL_CONTROL_ERROR_KEY = 'notEqual';

@Directive({
  standalone: true,
  selector: '[appEqualControlsContainer]',
  exportAs: 'appEqualControlsContainer'
})
export class EqualControlsContainerDirective<T> implements AfterContentInit {
  @ContentChildren(IsControlEqualToDirective, { descendants: true }) private equalDirectives = new QueryList<IsControlEqualToDirective>();

  ngAfterContentInit(): void {
    merge(
      ...this.equalDirectives.toArray().map((directive: IsControlEqualToDirective) => {
        return directive.controlChanges;
      })
    ).subscribe(() => this.checkForEquality());
  }

  checkForEquality(): void {
    const equalDirectivesArr = this.equalDirectives.toArray();

    if (equalDirectivesArr.length < 2) return;

    const firstControlWithValue = equalDirectivesArr.find(({ control: value }) => !!value);

    if (!firstControlWithValue?.control.value) {
      return;
    }

    const allControlsAreEqual = equalDirectivesArr.every(
      ({ control: { value } }) => !value || value === firstControlWithValue.control.value
    );

    allControlsAreEqual ? this.markDirsAsValid(equalDirectivesArr) : this.markDirsAsInvalid(equalDirectivesArr);
  }

  private markDirsAsInvalid(equalDirectivesArr: IsControlEqualToDirective[]): void {
    equalDirectivesArr.forEach((directive) => {
      if (!directive.control.hasError(NOT_EQUAL_CONTROL_ERROR_KEY)) {
        directive.control.setErrors({ ...(directive.control.errors || {}), [NOT_EQUAL_CONTROL_ERROR_KEY]: true }, { emitEvent: false });
        directive.errorRenderer?.validate();
      }
    });
  }

  private markDirsAsValid(equalDirectivesArr: IsControlEqualToDirective[]): void {
    equalDirectivesArr.forEach((directive) => {
      if (directive.control.hasError(NOT_EQUAL_CONTROL_ERROR_KEY)) {
        const { [NOT_EQUAL_CONTROL_ERROR_KEY]: removedError, ...restErrors } = directive.control.errors || {};
        directive.control.setErrors(Object.keys(restErrors).length ? restErrors : null);

        if (!Object.keys(restErrors).length) {
          directive.errorRenderer?.removeErrors();
        }
      }
    });
  }
}
