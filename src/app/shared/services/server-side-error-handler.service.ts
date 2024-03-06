import { Injectable } from '@angular/core';
import { ApiResponse } from '../model';
import { ControlErrorsRendererService } from '../directives/control-error-renderer/control-errors-renderer.service';
import { catchError, EMPTY, OperatorFunction, pipe } from 'rxjs';
import { NotificationsService } from '../components/notifications/notifications.service';

@Injectable()
export class ServerSideErrorHandlerService {
  constructor(
    private controlErrorsRendererService: ControlErrorsRendererService,
    private notificationService: NotificationsService
  ) {}

  handleError<T>(): OperatorFunction<ApiResponse<T>, ApiResponse<T>> {
    return pipe(
      catchError(({ error }: ApiResponse<T>) => {
        if (typeof error === 'string') {
          this.notificationService.error(error);
        }

        if (typeof error === 'object') {
          this.controlErrorsRendererService.renderErrors(error);
        }

        return EMPTY;
      })
    );
  }
}
