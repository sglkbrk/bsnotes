import React, { useEffect, useState } from 'react';
import { FiTrash, FiDownload, FiFile, FiEdit, FiPlusCircle, FiUser } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import MotionDiv from './Motion/MotionDiv';
import MotionText from './Motion/MotionText';
import { workspace } from '../interface/workspace';
import AddWorkSpace from './Popup/AddWorkSpace';
import TemplateModal from './Popup/TemplateModal';
import ImportModal from './Popup/ImportModal';
import TrashModal from './Popup/TrashModal';
import { WorkSpaceAdd, WorkSpaceDelete, WorkSpaceUpdate } from '../services/WorkSpaceService';
import Spinner from './Spinner';
import { useConfirmation } from '../Context/ConfirmationContext';
import EditProfileModal from '../components/Popup/EditProfileModal';
import { GetUserImage } from '../services/UserService';
import config from '../config';

interface SideProps {
  items: workspace[];
  setItem: any;
  onItemSelect: (item: number) => void;
  onNoteCreated?: (newNote: any) => void;
  onRefreshWorkspaces?: () => void;
}

const Side = ({ items, setItem, onItemSelect, onNoteCreated, onRefreshWorkspaces }: SideProps) => {
  const { openModal } = useConfirmation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpen2, setIsPopupOpen2] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<workspace>({} as workspace);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string>('');
  const handleSave = async (data: workspace, type: number) => {
    setIsLoading(true);
    if (type === 0) {
      const addedItem = await WorkSpaceAdd(data);
      items.push(addedItem);
    } else {
      const updatedItem = await WorkSpaceUpdate(data);
      setItem(items);
      items[items.findIndex((x: any) => x.id === data.id)] = data;
    }
    setIsPopupOpen(false);
    setIsLoading(false);
  };
  const ItemSelect = (id: number) => {
    setActiveIndex(id);
    onItemSelect(id);
  };
  const onUpdate = (item: workspace) => {
    setIsPopupOpen(true);
    setSelectedItem(item);
  };
  const getSelectedCheckboxes = async () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox-WorkspaceItem');
    const selectedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
    const selectedIds = selectedCheckboxes.map((checkbox) => parseInt(checkbox.value));
    openModal(`Are you sure you want to delete`, async () => {
      await WorkSpaceDelete(selectedIds);
      items = items.filter((item: any) => !selectedIds.includes(item.id));
      setItem(items);
      setDeleteMode(false);
    });
  };
  useEffect(() => {
    getUserImage();
  }, []);
  const getUserImage = async (): Promise<any> => {
    var image = await GetUserImage();
    setUserImage(image);
  };
  useEffect(() => {
    if (items && items?.length) setActiveIndex(items[0].id || 0);
  }, [items]);
  return (
    <div className="hidden sm:flex  w-full sm:w-1/12 sm:min-w-[300px] pr-0   flex-col h-screen">
      {/* Üst Kısım */}
      <div>
        <div className="flex w-full h-28 pr-10 justify-between items-center ">
          <p className="font-signature text-[50px]">
            <MotionText delayOffset={0}>Bs Notes </MotionText>
          </p>
          <div onClick={() => setIsPopupOpen2(true)} className="w-10 h-10 rounded-full bg-gray-200">
            {userImage ? (
              <img alt="" src={config.apiUrl + 'File/download/' + userImage} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full object-cover rounded-full justify-center items-center flex">
                <FiUser className="w-5 h-5 rounded-full" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-12 mt-2">
          <div>
            <ul className="flex flex-col items-start space-y-5 tracking-wider text-[16px] text-black text-sm">
              <MotionDiv delayOffset={0.2}>
                <li onClick={() => setIsTemplateModalOpen(true)} className="flex items-center space-x-4 cursor-pointer hover:text-[#FDB460] transition">
                  <FiFile className="text-xl" />
                  <p className="font-serif ">Templates</p>
                </li>
              </MotionDiv>
              <MotionDiv delayOffset={0.4}>
                <li onClick={() => setIsImportModalOpen(true)} className="flex items-center space-x-4 cursor-pointer hover:text-blue-500 transition">
                  <FiDownload className="text-xl" />
                  <p className="font-serif">Import</p>
                </li>
              </MotionDiv>
              <MotionDiv delayOffset={0.6}>
                <li onClick={() => setIsTrashModalOpen(true)} className="flex items-center space-x-4 cursor-pointer hover:text-red-500 transition">
                  <FiTrash className="text-xl" />
                  <p className="font-serif">Trash</p>
                </li>
              </MotionDiv>
            </ul>
          </div>
          <div className=" flex flex-col">
            <div className="group flex items-center justify-between">
              <h5 className="text-[13px] font-semibold text-gray-500 uppercase">workspace</h5>
              <div className="flex items-center space-x-4 mr-12">
                {deleteMode && (
                  <p onClick={getSelectedCheckboxes} className="text-sm text-red-400 hover:text-black cursor-pointer">
                    Delete
                  </p>
                )}
                {deleteMode && (
                  <p onClick={() => setDeleteMode(false)} className="text-sm text-gray-400  hover:text-black cursor-pointer">
                    Cancel
                  </p>
                )}
                {items && !deleteMode && items.length > 0 && (
                  <FiTrash
                    className="text-lg text-gray-400 hidden group-hover:block  hover:text-black cursor-pointer"
                    onClick={() => setDeleteMode(true)}
                  />
                )}
              </div>
              <Spinner open={isLoading} />
            </div>
            <ul className="flex flex-col items-start space-y-5 tracking-wider text-[15px] text-black text-sm mt-8">
              {items &&
                items.map((item: workspace, index: number) => {
                  const IconComponent = (item.icon && FiIcons[item.icon as keyof typeof FiIcons]) as
                    | React.ComponentType<{ className?: string }>
                    | undefined;
                  return (
                    <MotionDiv key={item.id} delayOffset={0.2 + index * 0.05}>
                      <div className="flex items-center">
                        {deleteMode && (
                          <input type="checkbox" className="checkbox-WorkspaceItem mr-4 " value={item.id} id={`checkbox-${item.id}`} />
                        )}
                        <li key={item.id} className="group flex w-full items-center justify-between">
                          <div onClick={() => ItemSelect(item.id as number)} className="flex items-center space-x-4 cursor-pointer">
                            {IconComponent ? (
                              <IconComponent className="text-xl" />
                            ) : item.icon && item.icon.length <= 4 ? (
                              <span className="text-xl leading-none">{item.icon}</span>
                            ) : (
                              <FiIcons.FiFolder className="text-xl" />
                            )}
                            <p className={` ${activeIndex === item.id ? 'text-black' : 'text-gray-400 '}`}>{item.name}</p>
                          </div>
                          {/* Ayar ikonu sağa yaslanmış */}
                          <FiEdit
                            onClick={() => onUpdate(item as workspace)}
                            className="hidden group-hover:flex text-xl cursor-pointer text-gray-400 hover:text-gray-600 mr-4"
                          />
                        </li>
                      </div>
                    </MotionDiv>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>

      {/* Alt Kısım (Buton) */}
      <div className="mt-auto mb-8">
        <div
          onClick={() => {
            setIsPopupOpen(true);
            setSelectedItem({} as workspace);
          }}
          className="flex  space-x-4 px-4 py-2  hover:bg-gray-100 cursor-pointer text-sm font-bold rounded-lg"
        >
          <FiPlusCircle className="text-xl" />
          <span>New Page</span>
        </div>
      </div>
      <EditProfileModal isOpen={isPopupOpen2} onClose={() => setIsPopupOpen2(false)} />
      <AddWorkSpace isOpen={isPopupOpen} selectedItem={selectedItem} onClose={() => setIsPopupOpen(false)} onSave={handleSave} />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        workspaces={items}
        currentWorkspaceId={activeIndex}
        onTemplateApplied={(newNote) => onNoteCreated && onNoteCreated(newNote)}
      />
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        workspaces={items}
        currentWorkspaceId={activeIndex}
        onNoteImported={(newNote) => onNoteCreated && onNoteCreated(newNote)}
      />
      <TrashModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        workspaces={items}
        onItemRestored={() => onRefreshWorkspaces && onRefreshWorkspaces()}
      />
    </div>
  );
};

export default Side;
