import { IsControlEqualToDirective } from './is-control-equal-to.directive';
import { NgControl } from '@angular/forms';
import { ValidationErrorRendererDirective } from '@mom-360-shared-components/commons/components/forms/validation-error/validation-error-renderer.directive';

describe('IsControlEqualToDirective', () => {
  it('should create an instance', () => {
    const directive = new IsControlEqualToDirective({} as NgControl, {} as ValidationErrorRendererDirective);
    expect(directive).toBeTruthy();
  });
});
