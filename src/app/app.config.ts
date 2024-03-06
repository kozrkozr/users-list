import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { CONTROL_VALIDATION_ERRORS_MESSAGES } from './shared/directives/control-error-renderer/control-error-renderer.directive';
import { ExtractErrorMessageFn } from './shared/directives/control-error-renderer/control-error-renderer.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    {
      provide: CONTROL_VALIDATION_ERRORS_MESSAGES,
      useValue: {
        required: 'Field is required',
        email: 'Invalid email format',
        get maxlength(): ExtractErrorMessageFn<{ requiredLength: number; actualLength: number }> {
          return (error: { requiredLength: number; actualLength: number }) => `Max length is ${error.requiredLength} symbols`;
        }
      }
    }
  ]
};
