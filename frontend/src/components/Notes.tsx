import React, { useEffect, useState } from 'react';
import { FiPlusCircle, FiAlignLeft } from 'react-icons/fi';
import MotionDiv from './Motion/MotionDiv';
import NoteSkeleton from './Skeletons/NoteSkeleton';
import { AddNotes } from './Popup';
import { Note, createNewNote } from '../interface/Note';
import { NoteAdd, NoteDelete } from '../services/NoteService';
import { GetUserNote } from '../services/NoteService';
import { timeAgo } from '../utils/utils';
import Spinner from './Spinner';
import { useConfirmation } from '../Context/ConfirmationContext';
import NotesCard from './Card/NotesCard';
import { debug } from 'console';

interface NoteProps extends Note {
  tags?: string | null;
  active?: boolean | null;
  share?: { userid: number; username: string; userimage: string }[] | null;
}
const Notes = ({ WorkplaceId, onItemSelect }: { WorkplaceId: number | null; onItemSelect: (id: number) => void }) => {
  const { openModal } = useConfirmation();
  const [list, setList] = useState<NoteProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const handleSave = async () => {
    setIsLoading(true);
    const newNote = createNewNote({
      WorkplaceId
    });
    var item = await NoteAdd(newNote);
    debugger;
    list.push(item);
    setList([...list]);
    setIsPopupOpen(false);
    setIsLoading(false);
  };
  useEffect(() => {
    if (WorkplaceId) {
      GetNotes(WorkplaceId);
    }
  }, [WorkplaceId]);
  const GetNotes = async (WorkplaceId: number) => {
    setLoading(true);
    var items = await GetUserNote(WorkplaceId);
    setLoading(false);
    setList(items);
  };

  const ItemSelect = (id: number) => {
    setSelectedId(id);
    onItemSelect(id);
  };
  const getSelectedCheckboxes = async () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox-noteItem');
    const selectedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
    const selectedIds = selectedCheckboxes.map((checkbox) => parseInt(checkbox.value));
    openModal(`Are you sure you want to delete`, async () => {
      await NoteDelete(selectedIds);
      const items = list.filter((item: any) => !selectedIds.includes(item.id));
      setList(items);
      setDeleteMode(false);
    });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Sadece arama terimini güncelle
  };
  const filteredList = list
    .filter((item) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchValue) || // Title alanına göre arama
        item.tags?.toLowerCase().includes(searchValue) || // Tags alanına göre arama
        item.description?.toLowerCase().includes(searchValue) // Description alanına göre arama
      );
    })
    .sort((a, b) => {
      // En yeni tarih en üstte olacak şekilde sıralama
      const dateA = new Date(a.updatedDate || 0).getTime();
      const dateB = new Date(b.updatedDate || 0).getTime();
      return dateB - dateA;
    });
  const updateList = () => {
    setList([...list]);
  };
  return (
    <div className=" w-full lg:w-1/3 lg:min-w-[400px] lg:max-w-[500px] bg-white overflow-auto">
      <div className="flex w-full h-28 justify-start items-center pr-4 sticky top-0 bg-white z-10">
        <FiAlignLeft className="text-3xl md:hidden cursor-pointer" />
        <input
          type="text"
          onChange={handleSearch}
          className="border border-gray-300  p-2 h-12 w-full rounded-full mx-4 placeholder:text-gray-400 placeholder:text-sm"
          placeholder="Search notes"
        />
      </div>
      <div className="px-2 h-[calc(100vh-160px)] overflow-y-auto">
        <div className="group flex justify-between  mb-10 items-center">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center space-x-4">
            <Spinner open={isLoading} />
            {/* <FiTrash onClick={() => setDeleteMode(!deleteMode)} className="text-xl cursor-pointer text-gray-500 hover:text-black" /> */}
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
            {list && !deleteMode && list.length > 0 && (
              <p
                onClick={() => setDeleteMode(true)}
                className="text-sm text-gray-400 hidden group-hover:block  hover:text-black cursor-pointer"
              >
                Delete
              </p>
            )}
            <FiPlusCircle onClick={() => handleSave()} className="text-2xl cursor-pointer text-gray-500 hover:text-black" />
          </div>
        </div>
        <div className="mb-4 space-y-4">
          {loading && <NoteSkeleton size={3} />}
          {filteredList.map((item, index) => (
            <MotionDiv delayOffset={0.2 * index}>
              <div key={item.id} className="flex ">
                {deleteMode && <input type="checkbox" className="checkbox-noteItem mr-4" value={item.id} id={`checkbox-${item.id}`} />}
                <NotesCard item={item} selectedId={selectedId || 0} ItemSelect={ItemSelect} updateList={updateList} />
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
      {/* <AddNotes isOpen={isPopupOpen} WorkplaceId={WorkplaceId} onClose={() => setIsPopupOpen(false)} onSave={handleSave} /> */}
    </div>
  );
};

export default Notes;
