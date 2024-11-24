import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaLink } from 'react-icons/fa';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';

interface EditableHeadingProps {
  item?: Content;
  editable: boolean;
}

const NoteWithLink = ({ item, editable }: EditableHeadingProps) => {
  const [value, setValue] = useState<string>(item?.contentValue || '');
  const handleBlur = () => {
    if (item) {
      item.contentValue = value;
      ContentUpdate(item);
      console.log(value);
    }
  };
  useEffect(() => {
    if (item && item.contentValue) setValue(item.contentValue);
  }, [item]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Eğer kullanıcı Ctrl tuşuna basılıyken input'a tıklarsa
    if (event.key === 'Control' && value) {
      window.open(value, '_blank'); // Bağlantıyı yeni bir sekmede aç
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    // Eğer kullanıcı Ctrl tuşuna basılı değilse normal tıklama izin ver
    if (!event.ctrlKey) {
      event.stopPropagation(); // Tıklamayı düzenleme modunda bırak
    } else if (value) {
      window.open(value, '_blank'); // Ctrl+Tıklama ile linki aç
    }
  };

  return (
    <div className="group relative flex items-center justify-center">
      <p className="font-semibold text-gray-200 uppercase min-w-12">
        <FaLink />
      </p>
      <input
        disabled={editable}
        value={value}
        onKeyDown={handleKeyDown} // Ctrl + Tıklama desteği
        onMouseDown={handleMouseDown} // Mouse tıklama için Ctrl kontrolü
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur} // Dışarı tıklanınca kaydet
        className={`w-full bg-transparent focus:outline-none cursor-text text-blue-600`}
        placeholder="Link yazın..."
        style={{ resize: 'none' }} // Kullanıcıya yeniden boyutlandırma seçeneği verme
      />
    </div>
  );
};

export default NoteWithLink;
