import { Note } from '../interface/Note';
import api from './api';
export const GetUserNote = async (WorkplaceId: number): Promise<any> => {
  try {
    const response = await api.get('Note/Workplace/' + WorkplaceId);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const NoteAdd = async (items: Note): Promise<any> => {
  try {
    const response = await api.post('Note', items);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const NoteDelete = async (ids: number[]): Promise<any> => {
  try {
    const response = await api.post('Note/Delete', ids);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const NoteUpdate = async (item: Note): Promise<any> => {
  try {
    const response = await api.put('Note/' + item.id, item);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
