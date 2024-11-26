import React, { useEffect, useState } from 'react';
import { GetUser, UpdateUser } from '../../services/UserService';
import { uploadFile, deleteFile } from '../../services/FileService';
import config from '../../config';

const EditProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [profileImage, setProfileImage] = useState(null as string | null);
  const [userItem, setUserItem] = useState(null as any);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [ChangeValue, setChangeValue] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    GetUser().then((res) => {
      setUserItem(res);
      setName(res.name);
      setSurname(res.surname);
      setEmail(res.email);
      setProfileImage(config.apiUrl + 'File/download/' + res.userImage);
      setUserImage(res.userImage);
    });
  }, [isOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Dosyayı al
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      upload(file);
    }
  };

  const upload = async (file: any) => {
    setIsLoading(true);
    const data = await uploadFile(file);
    if (data) {
      setUserImage(data.url);
      setIsLoading(false);
    } else setIsLoading(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    window.location.reload();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    UpdateUser({ id: userItem.id, name, surname, email, userImage }).then((res) => {
      debugger;
    });
  };
  const triggerFileInput = () => {
    var input = document.getElementById('profileImageInput');
    if (input) {
      input.click();
    }
  };
  useEffect(() => {
    if (userItem === null) return;
    if (userItem.name !== name || userItem.surname !== surname || userItem.email !== email || userItem.userImage !== profileImage)
      setChangeValue(true);
  }, [name, surname, email, profileImage]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Sayfa boş bir yere tıklanınca modal'ı kapatır
    >
      <div
        className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Modal içi tıklamaları engeller
      >
        {/* Kapatma İkonu */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose} // Kapatma ikonu tıklanınca modal'ı kapatır
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Kullanıcı Bilgileri</h2>
        <form>
          {/* Profil Resmi */}
          <div className="mb-4 text-center">
            <label className="block mb-2 text-gray-700 font-semibold">Profil Resmi</label>
            <div
              className="relative w-24 h-24 mx-auto mb-2 cursor-pointer"
              onClick={triggerFileInput} // Resme tıklanınca dosya seçtir
            >
              <img
                src={profileImage || 'https://via.placeholder.com/150'}
                alt="Profil"
                className="rounded-full w-full h-full object-cover border border-gray-300"
              />
            </div>
            {/* Gizli Dosya Girişi */}
            <input id="profileImageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <p className="text-sm text-gray-500">Resme tıklayarak değiştirin</p>
          </div>

          {/* Ad */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Ad</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Adınızı girin"
            />
          </div>

          {/* Soyad */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Soyad</label>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              type="text"
              name="surname"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Soyadınızı girin"
            />
          </div>

          {/* E-posta */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">E-posta</label>
            <input
              disabled
              value={email}
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="E-posta adresinizi girin"
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-between items-center">
            <button type="button" className="text-red-500 font-semibold" onClick={handleLogout}>
              Oturumu Kapat
            </button>
            <div>
              {ChangeValue && (
                <button onClick={handleSubmit} className="px-4 py-1 bg-blue-500 text-white rounded-lg">
                  Kaydet
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Çıkış Butonu */}
      <button onClick={onClose} className="absolute top-5 left-5 px-3 py-1 bg-red-500 text-white rounded-lg">
        Çıkış
      </button>
    </div>
  );
};

export default EditProfileModal;
