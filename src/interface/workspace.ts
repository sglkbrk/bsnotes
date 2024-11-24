import { User } from './User';
export interface workspace {
  id?: number;
  user?: User | null;
  userId?: number;
  name?: string;
  icon: string;
  status?: Status;
  order?: number;
  createdDate?: Date;
}

export enum Status {
  Active = 0,
  Deleted = 1,
  Passive = 2
}
