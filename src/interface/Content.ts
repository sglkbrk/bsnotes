import { User } from './User';
import { Note } from './Note';

// public int id { get; set; }
// public Note? Note { get; set; }
// public int NoteId { get; set; }
// public ContentType ContentType { get; set; }
// public required string ContentValue { get; set; }
// public int order { get; set; }
// public required DateTime CreatedDate { get; set; } = DateTime.Now;
// public required DateTime UpdatedDate { get; set; } = DateTime.Now;
// public User? CreatedUser { get; set; }
// public required int CreatedUserId { get; set; }
// public User? UpdatedUser { get; set; }
// public required int UpdatedUserId { get; set; }

export interface Content {
  id?: number;
  note?: Note | null;
  noteId?: number | null;
  contentType?: ContentType | null;
  contentValue?: string | null;
  order: number;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  createdUser?: User | null;
  createdUserId?: number;
  updatedUser?: User | null;
  updatedUserId?: number;
}

export enum ContentType {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  File,
  Image,
  Music,
  Video,
  Tags,
  Code,
  Todo,
  Link
}
