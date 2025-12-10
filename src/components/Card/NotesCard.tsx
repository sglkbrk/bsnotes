import React, { useEffect, useState } from 'react';
import { NoteUpdate } from '../../services/NoteService';
import { Note } from '../../interface/Note';
import { timeAgo } from '../../utils/utils';
import { FaTrashAlt } from 'react-icons/fa';
interface NoteProps extends Note {
  tags?: string | null;
  active?: boolean | null;
  share?: { userid: number; username: string; userimage: string }[] | null;
}

const NotesCard = ({
  item,
  selectedId,
  ItemSelect,
  updateList
}: {
  item: NoteProps;
  selectedId: number;
  ItemSelect: (id: number) => void;
  updateList: () => void;
}) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [tags, setTags] = useState<string[]>([]); // Etiketleri saklayacak state
  const [tagText, setTagText] = useState<string>('');
  const handleBlur = async () => {
    if (item) {
      item.title = title;
      item.description = description;
      item.location = location;
      item.tags = tags.join(',');
      item.updatedDate = new Date();
      updateList();
      await NoteUpdate(item);
    }
  };
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tags.length >= 3) return;
    if (e.key === 'Enter' && tagText.trim() !== '') {
      setTags([...tags, '#' + tagText.trim()]); // Etiketi diziye ekle
      setTagText(''); // Inputu temizle
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove)); // Silmek için filtreleme
  };
  useEffect(() => {
    if (item && item.tags) {
      const tagArray = item.tags.split(',');
      setTags(tagArray);
    }
  }, [item]);

  useEffect(() => {
    if (tags.length > 0 && item.tags !== tags.join(',')) handleBlur();
  }, [tags]);
  return (
    <div
      onClick={() => ItemSelect(item.id as number)}
      className={`cursor-pointer p-5 rounded-3xl shadow mb-2 h-44 flex flex-col flex-1 ${
        item.id === selectedId ? 'bg-orange-400 text-white' : 'bg-gray-50'
      }`}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        onBlur={() => {
          if (item.title !== title) handleBlur();
        }} // Dışarı tıklanınca kaydet
        className={`w-full bg-transparent focus:outline-none cursor-text text-[15px] font-semibold placeholder:text-zinc-600`}
        placeholder="Title..."
        style={{ resize: 'none' }}
      />
      {/* <p className={`mt-2 text-xs line-clamp-1 ${item.id === selectedId ? ' text-white' : 'text-gray-400 '}`}>{item.tags}</p> */}
      <div className="flex flex-wrap w-full  gap-2 mt-2">
        <div className="flex items-center">
          {tags.map((tag, index) => (
            <div key={index} className="group flex items-center mr-2">
              <span className={`mr-2 text-xs line-clamp-1 ${item.id === selectedId ? ' text-white' : 'text-gray-400 '}`}>{tag}</span>
              {/* <FaTrashAlt className="cursor-pointer text-xs hidden group-hover:flex  " onClick={() => handleRemoveTag(tag)} /> */}
              <FaTrashAlt
                className="cursor-pointer text-xs hidden group-hover:flex"
                onClick={() => handleRemoveTag(tag)}
                {...({} as any)}
              />
            </div>
          ))}
          {tags.length < 3 && (
            <input
              type="text"
              value={tagText}
              maxLength={10}
              onChange={(e) => setTagText(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags..."
              className="w-full border-0 w-full text-xs bg-transparent focus:outline-none cursor-text px-2 placeholder:text-zinc-600 "
              style={{ flex: 1 }}
            />
          )}
        </div>
      </div>
      <textarea
        rows={3}
        maxLength={300}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => {
          if (item.description !== description) handleBlur();
        }} // Dışarı tıklanınca kaydet
        className={`w-full bg-transparent focus:outline-none cursor-text text-xs mt-2 h-auto max-h-40  placeholder:text-zinc-600`}
        placeholder="description..."
        style={{ resize: 'none' }}
      />
      <div className="flex justify-between mt-auto">
        <p className={`text-sm min-w-14 ${item.id === selectedId ? ' text-white' : 'text-gray-400 '}`}>{timeAgo(item.updatedDate)}</p>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={15}
          onBlur={() => {
            if (item.location !== location) handleBlur();
          }} // Dışarı tıklanınca kaydet
          className={`bg-transparent focus:outline-none cursor-text  text-sm text-end placeholder:text-zinc-600 ${
            item.id === selectedId ? ' text-white' : 'text-orange-400 '
          }`}
          placeholder="location..."
          style={{ resize: 'none' }}
        />
        {item.share && item.share.length > 0 && (
          <div className="relative w-full h-8 flex justify-end">
            {item.share?.map((item) => (
              <div className="relative w-8 h-8 bg-blue-500 rounded-full ring-2 ring-white -ml-2">
                <img
                  alt=""
                  src={item.userimage}
                  className="text-xs text-white flex justify-center items-center h-full w-full rounded-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesCard;
