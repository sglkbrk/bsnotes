export interface LoginModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  name: string;
  surname: string;
  email: string;
  password: string;
  userImage?: string | null;
}

export interface UserDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  userImage: string | null;
}

export interface OrderDto {
  id?: number;
  order?: number;
  Id?: number;
  Order?: number;
}

export enum Status {
  Active = 0,
  Deleted = 1,
  Passive = 2
}

export enum ContentType {
  H1 = 0,
  H2 = 1,
  H3 = 2,
  H4 = 3,
  H5 = 4,
  H6 = 5,
  P = 6,
  File = 7,
  Image = 8,
  Music = 9,
  Video = 10,
  Tags = 11,
  Code = 12,
  Todo = 13,
  Link = 14
}

