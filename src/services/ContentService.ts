import { Content } from '../interface/Content';
import api from './api';
export const GetContents = async (noteId: number): Promise<any> => {
  try {
    const response = await api.get('Content/Note/' + noteId);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const ContentAdd = async (items: Content): Promise<any> => {
  try {
    const response = await api.post('Content', items);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const ContentUpdate = async (item: Content): Promise<any> => {
  try {
    const response = await api.put('Content/' + item.id, item);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const ContentDelete = async (ids: number[]): Promise<any> => {
  try {
    const response = await api.post('Content/Delete', ids);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const SortBy = async (ids: any): Promise<any> => {
  try {
    const response = await api.post('Content/SortBy', ids);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
