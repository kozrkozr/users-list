import { Component } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { UsersService } from './users.service';
import { UserInfo } from './users.model';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UserModalComponent } from './user-modal/user-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [AsyncPipe, NgForOf, DialogModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  columns: string[] = ['username', 'first name', 'last name', 'email', 'type'];
  users$ = this.usersService.getUsers();

  constructor(
    private usersService: UsersService,
    private dialog: Dialog
  ) {}

  openUserModal(user?: UserInfo): void {
    this.dialog.open<UserInfo>(UserModalComponent, {
      data: user,
      autoFocus: false
    });
  }
}
