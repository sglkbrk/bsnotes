import React, { useEffect, useState } from 'react';
import { workspace } from '../../interface/workspace';
import { Status } from '../../interface/workspace';
import * as FiIcons from 'react-icons/fi';

interface AddWorkSpaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: workspace, type: number) => void;
  selectedItem: workspace | null;
}

const AddWorkSpace = ({ isOpen, onClose, onSave, selectedItem }: AddWorkSpaceProps) => {
  const [icon, setIcon] = useState('');
  const [name, setName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');

  const allIcons = Object.keys(FiIcons);
  const filteredIcons = allIcons.filter((iconName) => iconName.toLowerCase().includes(searchText.toLowerCase()));

  const handleIconSelect = (iconName: string) => {
    setIcon(iconName);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (!icon || !name) return;
    var item = null;
    if (selectedItem && selectedItem.id) {
      const id = selectedItem.id;
      const userId = selectedItem.userId;
      item = { id, userId, icon, name, status: Status.Active, order: 0, createdDate: new Date() };
      onSave(item, 1);
    } else {
      item = { icon, name, status: Status.Active, order: 0, createdDate: new Date() };
      onSave(item, 0);
    }
    setName('');
    setIcon('');
    onClose();
  };

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name || '');
      setIcon(selectedItem.icon || '');
    }
  }, [selectedItem]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{selectedItem?.name ? 'Edit' : 'Create'} Workspace</h2>
        <div className="relative">
          <div className="relative w-full">
            <div
              className="w-full border px-4 py-2 rounded-md flex items-center justify-between cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {icon ? (
                <>
                  {React.createElement(FiIcons[icon as keyof typeof FiIcons], {
                    size: 24
                  })}
                  <span className="ml-2">{icon}</span>
                </>
              ) : (
                <span>Select an icon</span>
              )}
              <span className="ml-auto">▼</span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 w-full border rounded-md shadow-lg bg-white z-10  overflow-y-hidden">
                <div className="p-2">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full top-0 px-2 py-1 border rounded-md"
                  />
                </div>
                <div className="h-40 bg-gray-200 overflow-y-auto">
                  {filteredIcons.length > 0 ? (
                    filteredIcons.map((iconName) => {
                      const IconComponent = FiIcons[iconName as keyof typeof FiIcons];
                      return (
                        <div
                          key={iconName}
                          onClick={() => handleIconSelect(iconName)}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <IconComponent size={24} />
                          <span className="ml-2">{iconName}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-gray-500 text-sm">No icons found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Dropdown Menu */}
        </div>
        {/* Workspace Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Name:</label>
          <input
            type="text"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workspace name"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-orange-400 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkSpace;
