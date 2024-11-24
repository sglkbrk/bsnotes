import React, { useEffect, useState, useRef } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';

interface EditableHeadingProps {
  type?: string;
  text?: string;
  item?: Content;
  editable: boolean;
}

const EditableHeading = ({ type = 'h1', item, editable }: EditableHeadingProps) => {
  const [value, setValue] = useState<string>(item?.contentValue || '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Textarea referansı

  // Başlık tipine göre dinamik stil
  const headingStyles: Record<string, string> = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-normal',
    h6: 'text-base font-light',
    p: 'text-sm font-normal'
  };

  // Textarea boyutunu güncelleyen fonksiyon
  const updateTextareaHeight = (asd: boolean) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Textarea içeriği değiştikçe
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    updateTextareaHeight(false); // Değişiklik sonrasında yüksekliği güncelle
  };

  const handleBlur = () => {
    if (item) {
      item.contentValue = value;
      ContentUpdate(item);
      console.log(value);
    }
  };
  useEffect(() => {
    if (item && item?.contentValue) setValue(item?.contentValue);
  }, [item]);

  // İlk renderda textarea'nın yüksekliğini ayarlamak için
  useEffect(() => {
    updateTextareaHeight(true);
  }, []);

  return (
    <div className="group relative flex items-center justify-center">
      <p className="font-semibold text-gray-200 uppercase min-w-12">{type}</p>
      <textarea
        disabled={editable}
        rows={1}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur} // Dışarı tıklanınca kaydet
        className={`w-full bg-transparent focus:outline-none cursor-text ${headingStyles[type]}`}
        placeholder="Başlık yazın..."
        style={{ resize: 'none' }} // Kullanıcıya yeniden boyutlandırma seçeneği verme
      />
    </div>
  );
};

export default EditableHeading;
