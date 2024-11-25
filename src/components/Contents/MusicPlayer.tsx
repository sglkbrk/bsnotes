import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaMusic, FaPlus, FaAngleUp, FaAngleDown, FaTrash } from 'react-icons/fa';
import { uploadFile, deleteFile } from '../../services/FileService';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';
import Spinner from '../Spinner';
import config from '../../config';

// Müzik dosyası tipi
interface Music {
  name: string;
  url: string;
}

const MusicPlayer = ({ item, editable }: { item: Content; editable: boolean }) => {
  const [music, setMusic] = useState<Music | null>(null); // Müzik bilgisi
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Çalma durumu
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null); // Audio instance
  const [isLoading, setIsLoading] = useState(false);

  // Müzik dosyası eklemek için handler
  const handleAddMusic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Dosyayı al
    if (file) {
      const url = URL.createObjectURL(file); // Dosya URL'si oluştur
      setMusic({ name: file.name, url }); // Müzik bilgilerini güncelle
      upload(file);
      if (audioInstance) audioInstance.pause(); // Mevcut müziği durdur
      setAudioInstance(new Audio(url)); // Yeni müzik oluştur
    }
  };

  // Müzik çalma ve duraklatma işlemi
  const handlePlayPause = () => {
    if (!audioInstance) return;
    if (isPlaying) {
      audioInstance.pause();
      setIsPlaying(false);
    } else {
      audioInstance.play();
      setIsPlaying(true);

      // Çalma tamamlandığında otomatik durdurma
      audioInstance.onended = () => setIsPlaying(false);
    }
  };
  const upload = async (file: any) => {
    setIsLoading(true);
    const data = await uploadFile(file);
    debugger;
    if (data) {
      item.contentValue = file.name + '&' + data.url;
      await ContentUpdate(item);
      setIsLoading(false);
    } else setIsLoading(false);
  };
  const HandleRemoveMusic = () => {
    deleteFile(music!.url);
    item.contentValue = '';
    ContentUpdate(item);
    setMusic(null);
  };
  useEffect(() => {
    if (item && item.contentValue) {
      const [name, url] = item.contentValue.split('&');
      setMusic({ name, url });
      setAudioInstance(new Audio(config + 'File/download/' + url));
    }
  }, [item]);

  return (
    <div className="group flex items-center justify-center ">
      <p className="font-semibold text-gray-200 uppercase min-w-12">
        <FaMusic />
      </p>
      <div className="flex flex-row w-full items-center justify-center p-2 mx-auto space-y-4 bg-gray-100 rounded-lg shadow-md">
        {music && (
          <div className="flex items-center justify-between w-full p-2 ">
            <div className="flex items-center space-x-4">
              <span>{music.name}</span>
              <Spinner open={isLoading} />
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={HandleRemoveMusic} className="text-xl text-red-500 hover:text-red-600">
                <FaTrash className="text-xl text-red-500 hover:text-red-600" />
              </button>
              <button onClick={handlePlayPause} className="text-xl text-green-500 hover:text-green-600">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          </div>
        )}
        {!music && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <label htmlFor={'music-upload' + item.id} className="px-4 py-2rounded-lg cursor-pointer">
              <FaPlus className="text-xl text-gray-500 hover:text-gray-600" />
            </label>
            <input
              disabled={editable}
              id={'music-upload' + item.id}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAddMusic}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
