import api from './api';

export interface TrashResponse {
  workplaces: {
    id: number;
    userId: number;
    name: string;
    icon: string;
    status: number;
    order: number;
    createdDate: string;
    deletedDate: string | null;
    daysLeft: number;
  }[];
  notes: {
    id: number;
    workplaceId: number;
    workplaceName: string;
    isWorkplaceDeleted: boolean;
    title: string | null;
    description: string | null;
    location: string | null;
    tags: string | null;
    createdDate: string | null;
    updatedDate: string | null;
    deletedDate: string | null;
    status: number;
    order: number;
    userId: number;
    daysLeft: number;
  }[];
}

export const GetTrash = async (): Promise<TrashResponse> => {
  try {
    const response = await api.get('Trash');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get trash items:', error);
    return { workplaces: [], notes: [] };
  }
};

export const RestoreTrash = async (type: 'workplace' | 'note', id: number, targetWorkplaceId?: number): Promise<any> => {
  try {
    const response = await api.post('Trash/restore', { type, id, targetWorkplaceId });
    return response.data;
  } catch (error: any) {
    console.error('Failed to restore trash item:', error);
    throw error;
  }
};

export const PermanentDeleteTrash = async (type: 'workplace' | 'note', id: number): Promise<any> => {
  try {
    const response = await api.post('Trash/permanent-delete', { type, id });
    return response.data;
  } catch (error: any) {
    console.error('Failed to permanently delete trash item:', error);
    throw error;
  }
};

export const EmptyTrash = async (): Promise<any> => {
  try {
    const response = await api.post('Trash/empty');
    return response.data;
  } catch (error: any) {
    console.error('Failed to empty trash:', error);
    throw error;
  }
};

