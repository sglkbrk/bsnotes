import React, { useEffect, useState } from 'react';
import { GetUserWorkSpace } from '../services/WorkSpaceService';
import { Side, Notes, NoteContent } from '../components';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [workSpace, setWorkSpace] = useState<any>([]);
  const [selectedWorkSpaceId, setSelectedWorkSpaceId] = useState<number | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number>(0); // State for selected note, setLoading] = useState<boolean>(false);
  useEffect(() => {
    var token = localStorage.getItem('token');
    if (!token) navigate('/login');
    GetWorkSpace();
  }, []);
  const GetWorkSpace = async () => {
    var items = await GetUserWorkSpace();
    const id = items?.length ? items[0].id : 0;
    if (id) setSelectedWorkSpaceId(id);
    setWorkSpace(items);
  };
  const handleWorkSpaceSelected = (id: number) => {
    setSelectedWorkSpaceId(id);
    console.log('Selected Item:', id);
  };
  const handleNoteSelected = (id: number) => {
    setSelectedNoteId(id);
    console.log('Selected Item:', id);
  };
  return (
    <div className="justify-center mx-auto px-4  xl:px-12  ">
      <div className="flex h-screen">
        <Side items={workSpace} setItem={setWorkSpace} onItemSelect={handleWorkSpaceSelected} />
        <Notes WorkplaceId={selectedWorkSpaceId} onItemSelect={handleNoteSelected} />
        <NoteContent noteId={selectedNoteId} />
      </div>
    </div>
  );
}

export default Home;
