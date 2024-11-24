import React, { useEffect, useState } from 'react';
import { FiPlus, FiDownload, FiPackage } from 'react-icons/fi';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import ContentSkeleton from './Skeletons/ContentSkeleton';
import { ContentType, Content } from '../interface/Content';
import {
  EditableHeading,
  MusicPlayer,
  NoteWithTags,
  NoteWithFiles,
  NoteWithToDo,
  NoteWithLink,
  CodeEditor,
  NoteWithImages,
  NoteWithVideo
} from './Contents';
import { ContentDelete } from '../services/ContentService';
import { useConfirmation } from '../Context/ConfirmationContext';
import { ContentAdd, GetContents, SortBy } from '../services/ContentService';
import { FloatingActionButtonGroup, FloatingActionText } from '../components/Contents';

const NoteContent = ({ noteId }: { noteId: number }) => {
  const { openModal } = useConfirmation();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [shortByMode, setShortByMode] = useState<boolean>(false);
  const [contents, setContents] = useState<Content[]>([]);
  const GetContets = async (id: number) => {
    setLoading(true);
    var items = await GetContents(id);
    setLoading(false);
    setContents(items);
  };
  useEffect(() => {
    if (noteId) GetContets(noteId);
    setDeleteMode(false);
    setShortByMode(false);
  }, [noteId]);
  const GetContentType = (id: number) => {
    return ContentType[id];
  };
  const onDelete = () => {
    setDeleteMode(!deleteMode);
  };
  const setDeleteDb = async () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox-item');
    const selectedCheckboxes = Array.from(checkboxes).filter((checkbox) => checkbox.checked);
    const selectedIds = selectedCheckboxes.map((checkbox) => parseInt(checkbox.value));
    openModal(`Are you sure you want to delete`, async () => {
      await ContentDelete(selectedIds);
      var newContents = contents.filter((item: Content) => !selectedIds.includes(item.id || 0));
      setContents(newContents);
      setDeleteMode(false);
    });
  };
  const setortByDb = async () => {
    const arr = contents.map((item: Content) => ({
      id: item.id || 0,
      order: item.order
    }));
    openModal(`Are you sure you want to sort`, async () => {
      var items = await SortBy(arr);
      console.log(items);
      setShortByMode(false);
    });
  };
  const setSelectedCheckboxes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox-item');
    Array.from(checkboxes).filter((checkbox) => (checkbox.checked = e.target.checked));
  };
  const floatingSelect = async (type: string) => {
    console.log('Selected Item:', type);
    const contentType: ContentType = ContentType[type as keyof typeof ContentType];

    var item = await ContentAdd({ contentType: contentType, contentValue: '', order: contents.length, noteId: noteId || 0 });
    if (item && item.id) setContents([...contents, item]);
  };
  const filteredList = contents.sort((a, b) => {
    const dateA = a.order || 0;
    const dateB = b.order || 0;
    return dateA - dateB;
  });
  const handleSortUp = (item: Content) => {
    if (item.order === 0) return;
    const updatedContents = [...contents];
    var aa = updatedContents.find((x) => x.order === item.order - 1);
    var bb = updatedContents.find((x) => x.order === item.order);
    if (aa) aa.order = aa?.order + 1;
    if (bb) bb.order = bb?.order - 1;
    setContents(updatedContents);
  };
  const handleSortDown = (item: Content) => {
    if (item.order === contents.length) return;
    const updatedContents = [...contents];
    var aa = updatedContents.find((x) => x.order === item.order + 1);
    var bb = updatedContents.find((x) => x.order === item.order);
    if (aa) aa.order = aa?.order - 1;
    if (bb) bb.order = bb?.order + 1;
    setContents(updatedContents);
  };
  return (
    <>
      <div className="hidden w-full lg:block flex-1 px-4 pl-8 pb-10 relative overflow-auto">
        <div className="flex w-full h-28 justify-start items-center pr-8 sticky top-0 bg-white z-10">
          <div className="flex gap-10 items-center ml-2">
            {/* <FiMapPin className="text-[20px] text-gray-400 hover:text-black" /> */}
            <FiDownload className="text-[20px] text-gray-400 hover:text-black" />
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            {deleteMode && (
              <p onClick={setDeleteDb} className="text-sm text-red-400 hover:text-black cursor-pointer">
                Save
              </p>
            )}
            {contents && contents.length > 0 && !shortByMode && (
              <p onClick={onDelete} className="text-sm text-gray-400 hover:text-black cursor-pointer">
                {deleteMode ? 'Cancel' : 'Delete'}
              </p>
            )}
            {shortByMode && (
              <p onClick={setortByDb} className="text-sm text-red-400 hover:text-black cursor-pointer">
                Save
              </p>
            )}
            {contents && contents.length > 0 && !deleteMode && (
              <p onClick={() => setShortByMode(!shortByMode)} className="text-sm text-gray-400 hover:text-black cursor-pointer">
                {shortByMode ? 'Cancel' : 'Sort by'}
              </p>
            )}
            {/* <p className="text-sm text-gray-400 hover:text-black cursor-pointer">Share</p> */}
          </div>
          <div className="flex justify-end  items-center ml-8">
            <div className="relative w-full h-8 flex justify-end">
              {/* İlk Etiket */}
              <div className="relative w-8 h-8 bg-blue-500 rounded-full ring-2 ring-white -ml-2">
                <img
                  alt=""
                  src="https://picsum.photos/id/237/200/300"
                  className="text-xs text-white flex justify-center items-center h-full w-full rounded-full"
                />
              </div>

              {/* İkinci Etiket */}
              <div className="relative w-8 h-8 bg-green-500 rounded-full ring-2 ring-white -ml-2">
                <img
                  alt=""
                  src="https://picsum.photos/id/237/200/300"
                  className="text-xs text-white flex justify-center items-center h-full w-full rounded-full"
                />
              </div>

              {/* Üçüncü Etiket */}
              <div className="relative w-8 h-8 bg-red-500 rounded-full ring-2 ring-white -ml-2">
                <img
                  alt=""
                  src="https://picsum.photos/id/237/200/300"
                  className="text-xs text-white flex justify-center items-center h-full w-full rounded-full"
                />
              </div>
            </div>
            <FiPackage className="text-2xl text-gray-400  ml-2" />
          </div>
        </div>
        {loading && <ContentSkeleton />}
        <div className="flex flex-1 flex-col pl-3 space-y-4">
          {deleteMode && (
            <div className="flex flex-row">
              <input type="checkbox" onChange={setSelectedCheckboxes} className="mr-4" />
              <p>Select all</p>
            </div>
          )}
          {filteredList?.map((item: any, index: number) => (
            <div className="flex flex-row" key={index}>
              {deleteMode && <input type="checkbox" className="checkbox-item mr-4" value={item.id} id={`checkbox-${item.id}`} />}
              <div className="flex-1">
                {item.contentType === 0 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 1 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 2 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 3 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 4 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 5 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 6 && (
                  <EditableHeading type={GetContentType(item.contentType)} item={item} editable={shortByMode || deleteMode} />
                )}
                {item.contentType === 7 && <NoteWithFiles item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 8 && <NoteWithImages item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 9 && <MusicPlayer item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 10 && <NoteWithVideo item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 11 && <NoteWithTags item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 12 && <CodeEditor item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 13 && <NoteWithToDo item={item} editable={shortByMode || deleteMode} />}
                {item.contentType === 14 && <NoteWithLink item={item} editable={shortByMode || deleteMode} />}
              </div>
              {shortByMode && (
                <div className="flex flex-row ml-2 items-center gap-0">
                  <FaAngleUp onClick={() => handleSortUp(item)} className="text-2xl  cursor-pointer   text-gray-300 hover:text-gray-500" />
                  <FaAngleDown
                    onClick={() => handleSortDown(item)}
                    className=" text-2xl cursor-pointer   text-gray-300  hover:text-gray-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {noteId && (
        <div className="absolute w-0 right-0 bottom-8 hidden px-10 lg:block">
          <div className="flex justify-end space-x-4 px-4 py-2  text-sm font-bold rounded-lg">
            <FloatingActionButtonGroup icon={<FiPlus className="text-xl" />} setSelectedItem={floatingSelect} />
            <FloatingActionText text="Aa" setSelectedItem={floatingSelect} />
          </div>
        </div>
      )}
    </>
  );
};

export default NoteContent;
