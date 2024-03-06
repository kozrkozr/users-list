import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit, Optional } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UserInfo, UserType } from '../users.model';
import { UserForm, UserFormControls } from './user-form';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { InputComponent } from '../../../shared/components/input/input.component';
import { UsersService } from '../users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlErrorRendererDirective } from '../../../shared/directives/control-error-renderer/control-error-renderer.directive';
import { ControlErrorsRendererService } from '../../../shared/directives/control-error-renderer/control-errors-renderer.service';
import { ServerSideErrorHandlerService } from '../../../shared/services/server-side-error-handler.service';
import {
  EqualControlsContainerDirective,
  NOT_EQUAL_CONTROL_ERROR_KEY
} from '../../../shared/directives/validators/is-control-equal-to/equal-controls-container.directive';
import { IsControlEqualToDirective } from '../../../shared/directives/validators/is-control-equal-to/is-control-equal-to.directive';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { OptionComponent } from '../../../shared/components/select/option/option.component';
import { NotificationsService } from '../../../shared/components/notifications/notifications.service';
import { NotificationsModule } from '../../../shared/components/notifications/notifications.module';
import { ReplaySubject } from 'rxjs';
import { indicate } from '../../../shared/rxjs-operators/indicate';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    InputComponent,
    ControlErrorRendererDirective,
    EqualControlsContainerDirective,
    IsControlEqualToDirective,
    KeyValuePipe,
    NgForOf,
    SelectComponent,
    OptionComponent,
    NotificationsModule,
    AsyncPipe
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
  providers: [ControlErrorsRendererService, ServerSideErrorHandlerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserModalComponent implements OnInit {
  modalTitle: string;
  isEditing: boolean;
  userForm: UserForm;

  isLoading = false;

  readonly userTypes = UserType;
  readonly userFormControls = UserFormControls;
  readonly passwordMismatchErrorDict = { [NOT_EQUAL_CONTROL_ERROR_KEY]: 'Password mismatch' };

  isPendingRequest$ = new ReplaySubject<boolean>();

  constructor(
    public dialogRef: DialogRef,
    @Optional() @Inject(DIALOG_DATA) public data: UserInfo | undefined,
    private usersService: UsersService,
    private destroyRef: DestroyRef,
    private controlErrorsRendererService: ControlErrorsRendererService,
    private serverSideErrorsHandler: ServerSideErrorHandlerService,
    private notificationService: NotificationsService
  ) {
    this.isEditing = !!this.data;
    this.modalTitle = this.isEditing ? `${this.data?.firstName} ${this.data?.lastName}` : 'Create new user';
    this.userForm = new UserForm(this.data);
  }

  ngOnInit(): void {
    this.isPendingRequest$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  save(): void {
    if (this.userForm.invalid) {
      this.controlErrorsRendererService.renderErrorsForInvalidControls();

      return;
    }

    const request$ = this.isEditing ? this.usersService.updateUser(this.userForm.value) : this.usersService.createUser(this.userForm.value);

    request$
      .pipe(indicate(this.isPendingRequest$), this.serverSideErrorsHandler.handleError(), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ data, error }) => {
        if (!error) {
          this.notificationService.success('User saved');
          this.dialogRef.close(data);
        }
      });
  }

  deleteUser(): void {
    this.usersService
      .deleteUser(this.userForm.value.id)
      .pipe(indicate(this.isPendingRequest$), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notificationService.success('User deleted');
        this.dialogRef.close();
      });
  }
}
