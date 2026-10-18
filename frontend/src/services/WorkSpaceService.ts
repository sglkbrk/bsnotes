import { workspace } from '../interface/workspace';

import api from './api';

export const GetUserWorkSpace = async (): Promise<workspace[]> => {
  try {
    const response = await api.get('Workplace');
    return response.data;
  } catch (error: any) {
    return error.status;
  }
};

export const WorkSpaceAdd = async (items: workspace): Promise<any> => {
  try {
    const response = await api.post('Workplace', items);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const WorkSpaceUpdate = async (items: workspace): Promise<any> => {
  try {
    const response = await api.put('Workplace/' + items.id, items);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const WorkSpaceDelete = async (ids: number[]): Promise<any> => {
  try {
    const response = await api.post('Workplace/Delete', ids);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
