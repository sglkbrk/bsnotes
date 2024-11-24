import React, { useState } from 'react';
import { Status } from '../../interface/workspace';
import { Note } from '../../interface/Note';

interface AddNotesProps {
  WorkplaceId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Note) => void;
}

const AddNotes = ({ WorkplaceId, isOpen, onClose, onSave }: AddNotesProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = () => {
    if (!title || !description) {
      alert('Lütfen gerekli alanları doldurunuz');
    } else {
      var tags = '';
      const newNote: Note = { title, description, location, status: Status.Active, order: 0, createdDate: new Date(), WorkplaceId, tags };
      debugger;
      // var item = { title, description, location, status: Status.Active, order: 0, createdDate: new Date(), WorkplaceId };
      onSave(newNote);
      setTitle('');
      setDescription('');
      setLocation('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Note</h2>
        <div className="relative"></div>
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700 ">Title</label>
          <input
            type="text"
            maxLength={20}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md"
          />
          <label className="block text-sm font-medium text-gray-700  ">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md"
          />
          <label className="block text-sm font-medium text-gray-700 ">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNotes;
