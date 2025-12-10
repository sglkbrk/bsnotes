import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';

const NoteWithTags = ({ item, editable }: { item: Content; editable: boolean }) => {
  const [tags, setTags] = useState<string[]>([]); // Etiketleri saklayacak state
  const [inputValue, setInputValue] = useState<string>(''); // Kullanıcının inputtaki değeri

  // Tag eklemek için handler
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tags.length >= 5) return;
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, '#' + inputValue.trim()]); // Etiketi diziye ekle
      setInputValue(''); // Inputu temizle
    }
  };

  const updateTags = () => {
    if (tags && item) {
      item.contentValue = tags.join(',');
      ContentUpdate(item);
      console.log(tags.join(','));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove)); // Silmek için filtreleme
  };

  useEffect(() => {
    if (item && item.contentValue) {
      const tagArray = item.contentValue.split(',');
      setTags(tagArray);
    }
  }, [item]);
  useEffect(() => {
    if (tags.length > 0 && item.contentValue !== tags.join(',')) updateTags();
  }, [tags]);

  return (
    <div className="relative flex items-center justify-center">
      <p className="font-semibold text-xl text-gray-200 uppercase min-w-12 mt-2">#</p>
      <div className="flex flex-wrap w-full  gap-2 mt-2">
        <div className="flex items-center">
          {tags.map((tag, index) => (
            <div key={index} className="group flex items-center">
              <span className="px-3 py-1 rounded-full text-sm text-[#FDB460]">{tag}</span>
              {/* <FaTrashAlt className="cursor-pointer text-sm hidden group-hover:flex " onClick={() => handleRemoveTag(tag)} /> */}
              <FaTrashAlt
                className="cursor-pointer text-xs hidden group-hover:flex"
                onClick={() => handleRemoveTag(tag)}
                {...({} as any)}
              />
            </div>
          ))}
          {tags.length < 5 && (
            <input
              disabled={editable}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags..."
              className="w-full border-0w-full bg-transparent focus:outline-none cursor-text px-2 "
              style={{ flex: 1 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteWithTags;
