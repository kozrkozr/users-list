import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { UserInfo } from './users.model';
import { USERS_MOCK } from './users-mock';
import { ApiResponse } from '../../shared/model';
import { generateDynamicId } from '../../shared/utils';

@Injectable({ providedIn: 'root' })
export class UsersService {
  allUsers$: BehaviorSubject<UserInfo[]> = new BehaviorSubject<UserInfo[]>([...USERS_MOCK]);

  getUsers(): Observable<UserInfo[]> {
    return this.allUsers$;
  }

  createUser(user: UserInfo): Observable<ApiResponse<UserInfo>> {
    const allUsers = this.allUsers$.getValue();

    const isUsernameDuplicated = allUsers.find(({ username }) => username === user.username);

    if (isUsernameDuplicated) {
      return throwError(() => ({
        error: {
          username: ['Username already in use. Please choose another.']
        }
      }));
    }

    this.allUsers$.next([...allUsers, { ...user, id: generateDynamicId() }]);

    return of({ data: user });
  }

  updateUser(updatedUser: UserInfo): Observable<ApiResponse<UserInfo>> {
    const allUsers = this.allUsers$.getValue();

    const userInDb = allUsers.find(({ id }) => id === updatedUser.id);

    if (!userInDb) {
      return of({ error: 'User Not Found' });
    }

    const allUsersWithUpdated = this.allUsers$.getValue().map((user) => {
      if (user === userInDb) {
        return { ...user, ...updatedUser };
      }

      return user;
    });

    this.allUsers$.next(allUsersWithUpdated);

    return of({ data: { ...userInDb } });
  }

  deleteUser(userId: number): Observable<ApiResponse<boolean>> {
    const allUsers = this.allUsers$.getValue();
    const usersWithoutDeletedUser = allUsers.filter(({ id }) => id !== userId);

    this.allUsers$.next(usersWithoutDeletedUser);

    return of({ data: true });
  }
}
