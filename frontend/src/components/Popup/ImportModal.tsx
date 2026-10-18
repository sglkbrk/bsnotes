import React, { useEffect, useState, useRef } from 'react';
import { FiX, FiUploadCloud, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { workspace } from '../../interface/workspace';
import { ImportNote } from '../../services/NoteService';
import Spinner from '../Spinner';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: workspace[];
  currentWorkspaceId: number | null;
  onNoteImported: (newNote: any) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  currentWorkspaceId,
  onNoteImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<number>(0);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (currentWorkspaceId && workspaces.some((w) => w.id === currentWorkspaceId)) {
        setTargetWorkspaceId(currentWorkspaceId);
      } else if (workspaces.length > 0 && workspaces[0].id) {
        setTargetWorkspaceId(Number(workspaces[0].id));
      }
    }
  }, [isOpen, currentWorkspaceId, workspaces]);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!file.name.endsWith('.json')) {
      setErrorMsg('Lütfen geçerli bir .json formatında not dosyası seçiniz.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);

        const note = json.note || json;
        if (!note || (!note.title && !note.contents)) {
          setErrorMsg('Geçersiz not dosyası formatı. Dosyada başlık veya içerik blokları bulunamadı.');
          setParsedData(null);
          return;
        }

        setParsedData(note);
        setFileName(file.name);
      } catch (err) {
        setErrorMsg('JSON dosyası okunamadı veya bozuk.');
        setParsedData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    const finalWorkspaceId =
      targetWorkspaceId ||
      (currentWorkspaceId && workspaces.some((w) => w.id === currentWorkspaceId) ? currentWorkspaceId : 0) ||
      (workspaces.length > 0 && workspaces[0].id ? Number(workspaces[0].id) : 0);

    if (!finalWorkspaceId) {
      setErrorMsg('Lütfen hedef çalışma alanı seçiniz.');
      return;
    }
    if (!parsedData) {
      setErrorMsg('Lütfen önce geçerli bir not dosyası yükleyiniz.');
      return;
    }

    try {
      setIsLoading(true);
      const newNote = await ImportNote({
        workplaceId: targetWorkspaceId,
        note: parsedData
      });

      setSuccessMsg('Not başarıyla içe aktarıldı!');
      setTimeout(() => {
        setIsLoading(false);
        setParsedData(null);
        setFileName('');
        onNoteImported(newNote);
        onClose();
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Not içe aktarılırken bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUploadCloud className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Not İçe Aktar (Import)</h2>
              <p className="text-xs text-gray-500">Dışa aktarılmış BSNote (.json) dosyasını çalışma alanınıza ekleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* File Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
              <FiUploadCloud className="text-2xl" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {fileName ? fileName : 'JSON Dosyasını Sürükleyip Bırakın'}
            </p>
            <p className="text-xs text-gray-400 mt-1">veya bilgisayarınızdan seçmek için tıklayın</p>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-lg text-xs">
              <FiAlertCircle />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Note Preview */}
          {parsedData && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gray-400">Yüklenecek Not Önizlemesi</span>
                <span className="text-xs text-green-700 bg-green-100 font-semibold px-2 py-0.5 rounded-full">
                  {parsedData.contents?.length || 0} Blok
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-800">{parsedData.title || 'Başlıksız Not'}</h4>
              {parsedData.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{parsedData.description}</p>
              )}
              {parsedData.tags && (
                <p className="text-xs text-orange-500">#{parsedData.tags.replace(/,/g, ' #')}</p>
              )}
            </div>
          )}

          {/* Target Workspace Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Hedef Çalışma Alanı</label>
            <select
              value={targetWorkspaceId || (workspaces.length > 0 && workspaces[0].id ? Number(workspaces[0].id) : '')}
              onChange={(e) => setTargetWorkspaceId(Number(e.target.value))}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {workspaces.length === 0 ? (
                <option value="">Çalışma Alanı Bulunamadı</option>
              ) : (
                workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg text-xs font-semibold">
              <FiCheck />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            disabled={!parsedData || isLoading}
            onClick={handleImport}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Spinner open={isLoading} />
            <span>Notu İçe Aktar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
