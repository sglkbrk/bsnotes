import config from '../config';
import api from '../services/api';
export const uploadFile = async (file: any): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(config.apiUrl + 'file/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
    });

    // Yanıtı kontrol et
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // JSON veriyi çöz
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('File upload failed:', error);
    throw error; // Hatayı yeniden fırlatarak çağıran fonksiyonun da işlemesi sağlanır
  }
};

export const deleteFile = async (key: string): Promise<any> => {
  try {
    debugger;
    const response = await api.delete('File/delete/' + key);
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};
