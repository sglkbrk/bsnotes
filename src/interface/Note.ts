import { User } from './User';
import { workspace } from './workspace';

// public int id { get; set; }
// public Workplace? Workplace { get; set; }
// public int WorkplaceId { get; set; }
// public required string Title { get; set; }
// public required string Description { get; set; }
// public required string Location { get; set; }
// public required DateTime CreatedDate { get; set; } = DateTime.Now;
// public required DateTime UpdatedDate { get; set; } = DateTime.Now;
// public Status Status { get; set; }
// public int Order { get; set; }
// public User? User { get; set; }
// public int UserId { get; set; }

export interface Note {
  id?: number;
  workspace?: workspace | null;
  WorkplaceId?: number | null;
  title?: string;
  description?: string;
  location?: string;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  status?: Status;
  order?: number;
  user?: User | null;
  userId?: number;
  tags?: string | null;
}

export const createNewNote = (overrides?: Partial<Note>): Note => {
  return {
    id: 0,
    workspace: null,
    WorkplaceId: 0,
    title: '',
    description: '',
    location: '',
    createdDate: new Date(),
    updatedDate: null,
    status: Status.Active,
    order: 0,
    user: null,
    userId: 0,
    tags: '',
    ...overrides // Gelen değerlerle varsayılanları değiştir
  };
};

export enum Status {
  Active = 0,
  Deleted = 1,
  Passive = 2
}
