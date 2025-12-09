import React, { useEffect, useState, useReducer, useTransition } from 'react';
import { GetUserWorkSpace } from '../services/WorkSpaceService';
import { Side, Notes, NoteContent } from '../components';
import { useNavigate } from 'react-router-dom';
import { steps } from 'framer-motion';

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

  type User = {
    id: number;
    name: string;
  };

  type State = {
    loading: boolean;
    data: User[] | null;
    error: string | null;
  };

  const initialState: State = {
    loading: false,
    data: null,
    error: null
  };

  type Action = { type: 'FETCH_START' } | { type: 'FETCH_SUCCESS'; payload: User[] } | { type: 'FETCH_ERROR'; payload: string };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'FETCH_START':
        return { loading: true, data: null, error: null };
      case 'FETCH_SUCCESS':
        return { loading: false, data: action.payload, error: null };
      case 'FETCH_ERROR':
        return { loading: false, data: null, error: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  const deneme = () => {
    startTransition(() => {
      dispatch({ type: 'FETCH_ERROR', payload: 'dqwmfkoqfkopwef' });
    });
  };
  return (
    <div className="justify-center mx-auto px-4  xl:px-12  ">
      <div className="flex h-screen">
        <h1>{isPending ? 'true' : 'false'}</h1>
        <button onClick={deneme}>asd</button>
        <Side items={workSpace} setItem={setWorkSpace} onItemSelect={handleWorkSpaceSelected} />
        <Notes WorkplaceId={selectedWorkSpaceId} onItemSelect={handleNoteSelected} />
        <NoteContent noteId={selectedNoteId} />
      </div>
    </div>
  );
}

export default Home;
