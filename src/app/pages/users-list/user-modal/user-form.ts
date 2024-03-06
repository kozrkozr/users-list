import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInfo } from '../users.model';

export enum UserFormControls {
  Id = 'id',
  Username = 'username',
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Type = 'type',
  Password = 'password',
  RepeatPassword = 'repeatPassword'
}

export class UserForm extends FormGroup {
  constructor(user?: UserInfo) {
    super({
      [UserFormControls.Id]: new FormControl(user?.id),
      [UserFormControls.Username]: new FormControl(user?.username, Validators.required),
      [UserFormControls.FirstName]: new FormControl(user?.firstName, Validators.required),
      [UserFormControls.LastName]: new FormControl(user?.lastName, Validators.required),
      [UserFormControls.Email]: new FormControl(user?.email, [Validators.required, Validators.email]),
      [UserFormControls.Type]: new FormControl(user?.type, Validators.required),
      [UserFormControls.Password]: new FormControl(user?.password, [Validators.required]),
      [UserFormControls.RepeatPassword]: new FormControl(user?.password, [Validators.required])
    });
  }
}
