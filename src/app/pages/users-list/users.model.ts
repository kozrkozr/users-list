export enum UserType {
  Admin = 'Admin',
  Driver = 'Driver'
}

export interface UserInfo {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  type: UserType;
  password: string;
}
