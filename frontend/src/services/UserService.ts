import { User } from '../interface/User';
import api from './api';
export const GetUser = async (): Promise<any> => {
  try {
    const response = await api.get('User/users-async/');
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const UpdateUser = async (items: User): Promise<any> => {
  try {
    const response = await api.put('User/update', items);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

export const GetUserImage = async (): Promise<any> => {
  try {
    const response = await api.get('User/user-image');
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
