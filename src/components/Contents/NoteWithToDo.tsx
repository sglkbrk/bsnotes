import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp, FaList } from 'react-icons/fa';
import { FiTrash } from 'react-icons/fi';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';

const NoteWithToDo = ({ item, editable }: { item: Content; editable: boolean }) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTodos([...todos, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: number) => {
    setTodos(todos.filter((todo, index) => index !== tagToRemove));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setTodos(
      todos.map((tag: string, i: number) => {
        if (i === index) {
          tag = value;
        }
        return tag;
      })
    );
  };
  const updateTodo = () => {
    if (todos && item) {
      item.contentValue = todos.join(',');
      ContentUpdate(item);
    }
  };
  useEffect(() => {
    if (item && item.contentValue) {
      const tagArray = item.contentValue.split(',');
      setTodos(tagArray);
    }
  }, [item]);
  useEffect(() => {
    if (todos.length > 0 && item.contentValue !== todos.join(',')) updateTodo();
  }, [todos]);

  return (
    <div className="group relative flex items-center justify-center">
      <p className="font-semibold text-xl text-gray-200 uppercase min-w-12 mt-2">
        <FaList />
      </p>
      <div className="flex flex-wrap w-full  gap-2 mt-2">
        <div className="grid grid-cols-1 gap-2 items-center w-full">
          {todos.map((tag, index) => (
            <div key={index} className="group w-full flex flex-row items-center">
              <input
                type="checkbox"
                className="appearance-none border-2 rounded-full w-6 h-6 bg-transparent b border-gray-400 checked:bg-[#FDB460] cursor-pointer"
              />
              <input
                type="text"
                value={tag}
                onChange={(e) => handleChange(e, index)}
                // onBlur={handleBlur} // Dışarı tıklanınca kaydet
                className={`w-full bg-transparent px-3 py-1 focus:outline-none cursor-text text-sm font-normal`}
                placeholder="Başlık yazın..."
                style={{ resize: 'none' }}
              />
              <FiTrash
                className="cursor-pointer text-sm hidden group-hover:flex  hover:-scale-x-150"
                onClick={() => handleRemoveTag(index)}
              />
            </div>
          ))}
          <input
            type="text"
            disabled={editable}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add Todo..."
            className="w-full border-0w-full bg-transparent focus:outline-none cursor-text px-2 "
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteWithToDo;
