import React, { useEffect, useState } from 'react';
import { GetUserWorkSpace } from '../services/WorkSpaceService';
import { Side, Notes, NoteContent } from '../components';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [workSpace, setWorkSpace] = useState<any>([]);
  const [selectedWorkSpaceId, setSelectedWorkSpaceId] = useState<number | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    GetWorkSpace();
  }, []);

  const GetWorkSpace = async () => {
    const items = await GetUserWorkSpace();
    const id = items?.length ? items[0].id : 0;
    if (id && !selectedWorkSpaceId) setSelectedWorkSpaceId(id);
    setWorkSpace(items);
  };

  const handleWorkSpaceSelected = (id: number) => {
    setSelectedWorkSpaceId(id);
  };

  const handleNoteSelected = (id: number) => {
    setSelectedNoteId(id);
  };

  const handleNoteCreated = (newNote: any) => {
    if (newNote) {
      if (newNote.workplaceId) {
        setSelectedWorkSpaceId(newNote.workplaceId);
      }
      setSelectedNoteId(newNote.id);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleRefreshWorkspaces = async () => {
    await GetWorkSpace();
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="justify-center mx-auto px-4 xl:px-12">
      <div className="flex h-screen">
        <Side
          items={workSpace}
          setItem={setWorkSpace}
          onItemSelect={handleWorkSpaceSelected}
          onNoteCreated={handleNoteCreated}
          onRefreshWorkspaces={handleRefreshWorkspaces}
        />
        <Notes
          key={`${selectedWorkSpaceId}-${refreshTrigger}`}
          WorkplaceId={selectedWorkSpaceId}
          onItemSelect={handleNoteSelected}
        />
        <NoteContent noteId={selectedNoteId} />
      </div>
    </div>
  );
}

export default Home;
