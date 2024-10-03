export interface IUser {
  _id: string;
  sub: string;
  role: string;
  username: string;
  password: string;
  email: string;
  display_name: string;
  refreshToken: string;
}
