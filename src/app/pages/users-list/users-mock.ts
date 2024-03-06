import { UserInfo, UserType } from './users.model';
import { generateDynamicId } from '../../shared/utils';

export const USERS_MOCK: UserInfo[] = [
  {
    id: generateDynamicId(),
    username: 'mperry1992',
    firstName: 'Matthew',
    lastName: 'Perry',
    email: 'matthew@mail.com',
    type: UserType.Driver,
    password: 'qwerty'
  }
];
