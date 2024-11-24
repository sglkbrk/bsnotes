import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaDownload, FaPlus, FaFile, FaTrash } from 'react-icons/fa';
import { uploadFile, deleteFile } from '../../services/FileService';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';
import Spinner from '../Spinner';

// file dosyası tipi
interface File {
  name: string;
  url: string;
}

const NoteWithFiles = ({ item, editable }: { item: Content; editable: boolean }) => {
  const [file, setFile] = useState<File | null>(null); // file bilgisi
  const [isLoading, setIsLoading] = useState(false);

  // file dosyası eklemek için handler
  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Dosyayı al
    if (file) {
      const url = URL.createObjectURL(file); // Dosya URL'si oluştur
      setFile({ name: file.name, url }); // file bilgilerini güncelle
      upload(file);
    }
  };
  const upload = async (file: any) => {
    setIsLoading(true);
    const data = await uploadFile(file);
    if (data) {
      item.contentValue = file.name + '&' + data.url;
      await ContentUpdate(item);
      setIsLoading(false);
    } else setIsLoading(false);
  };
  const HandleRemoveFile = () => {
    debugger;
    deleteFile(file!.url);
    item.contentValue = '';
    ContentUpdate(item);
    setFile(null);
  };
  useEffect(() => {
    if (item && item.contentValue) {
      const [name, url] = item.contentValue.split('&');
      setFile({ name, url });
    }
  }, [item]);

  return (
    <div className="group flex items-center justify-center ">
      <p className="font-semibold text-gray-200 uppercase min-w-12">
        <FaFile />
      </p>
      <div className="flex flex-row w-full items-center justify-center p-2 mx-auto space-y-4 bg-gray-100 rounded-lg shadow-md">
        {file && (
          <div className="flex items-center justify-between w-full p-2 ">
            <div className="flex items-center space-x-4">
              <span>{file.name}</span>
              <Spinner open={isLoading} />
            </div>
            <div className="flex items-center space-x-4">
              <FaTrash onClick={HandleRemoveFile} className="cursor-pointer text-red-500 hover:text-red-600" />
              <FaDownload
                onClick={() => window.open('api/File/download/' + file.url, '_blank')}
                className="cursor-pointer text-gray-500 hover:text-gray-600"
              />
            </div>
          </div>
        )}
        {!file && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <label htmlFor={'file-upload' + item.id} className="px-4 py-2rounded-lg cursor-pointer">
              <FaPlus className="text-xl text-gray-500 hover:text-gray-600" />
            </label>
            <input disabled={editable} id={'file-upload' + item.id} type="file" className="hidden" onChange={handleAddFile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteWithFiles;
