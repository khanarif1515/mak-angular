export interface IUser {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
