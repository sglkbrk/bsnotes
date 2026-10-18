import React, { useEffect, useState } from 'react';
import { FiX, FiTrash2, FiRotateCcw, FiAlertCircle, FiFolder, FiFileText } from 'react-icons/fi';
import { GetTrash, RestoreTrash, PermanentDeleteTrash, EmptyTrash, TrashResponse } from '../../services/TrashService';
import { workspace } from '../../interface/workspace';
import Spinner from '../Spinner';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: workspace[];
  onItemRestored: () => void;
}

const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  onItemRestored
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'workplaces'>('notes');
  const [trashData, setTrashData] = useState<TrashResponse>({ workplaces: [], notes: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [confirmEmpty, setConfirmEmpty] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTrash();
      setMessage(null);
      setConfirmEmpty(false);
    }
  }, [isOpen]);

  const loadTrash = async () => {
    setLoading(true);
    const data = await GetTrash();
    setTrashData(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRestore = async (type: 'note' | 'workplace', id: number) => {
    try {
      setActionLoading(true);
      // For note, if its parent workspace is deleted, pass the first active workspace id
      const targetWorkspaceId = type === 'note' && workspaces.length > 0 ? (workspaces[0].id as number) : undefined;
      await RestoreTrash(type, id, targetWorkspaceId);

      showMsg(type === 'note' ? 'Not başarıyla geri yüklendi!' : 'Çalışma alanı başarıyla geri yüklendi!');
      await loadTrash();
      onItemRestored();
    } catch (err) {
      showMsg('Geri yükleme sırasında hata oluştu.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async (type: 'note' | 'workplace', id: number) => {
    if (!window.confirm('Bu öge kalıcı olarak silinecek. Bu işlem geri alınamaz! Emin misiniz?')) {
      return;
    }

    try {
      setActionLoading(true);
      await PermanentDeleteTrash(type, id);
      showMsg('Öge kalıcı olarak silindi.');
      await loadTrash();
    } catch (err) {
      showMsg('Silme sırasında hata oluştu.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setActionLoading(true);
      await EmptyTrash();
      showMsg('Çöp kutusu tamamen boşaltıldı.');
      setConfirmEmpty(false);
      await loadTrash();
    } catch (err) {
      showMsg('Çöp kutusu boşaltılırken hata oluştu.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const totalCount = (trashData.notes?.length || 0) + (trashData.workplaces?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
              <FiTrash2 className="text-xl" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-gray-800">Çöp Kutusu (Trash)</h2>
                <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                  {totalCount}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Silinen ögeler 15 gün boyunca saklanır, ardından kalıcı olarak otomatik silinir.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {totalCount > 0 && (
              <button
                onClick={() => setConfirmEmpty(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
              >
                <FiTrash2 />
                <span>Çöpü Boşalt</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Confirmation Banner for Emptying Trash */}
        {confirmEmpty && (
          <div className="bg-red-50 border-b border-red-100 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-700 text-xs font-semibold">
              <FiAlertCircle className="text-base" />
              <span>Çöp kutusundaki TÜM ögeler kalıcı olarak silinecek. Bu işlem geri alınamaz!</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConfirmEmpty(false)}
                className="text-xs text-gray-600 hover:text-gray-800 px-3 py-1 bg-white border border-gray-300 rounded-lg"
              >
                Vazgeç
              </button>
              <button
                onClick={handleEmptyTrash}
                className="text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg font-semibold"
              >
                Evet, Hepsini Sil
              </button>
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {message && (
          <div
            className={`p-3 text-xs font-semibold flex items-center space-x-2 border-b ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-100'
                : 'bg-red-50 text-red-700 border-red-100'
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 px-6 pt-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'notes'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiFileText />
            <span>Silinen Notlar ({trashData.notes?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('workplaces')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'workplaces'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiFolder />
            <span>Silinen Çalışma Alanları ({trashData.workplaces?.length || 0})</span>
          </button>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <Spinner open={true} />
            </div>
          ) : activeTab === 'notes' ? (
            trashData.notes?.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                Çöp kutusunda silinmiş not bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {trashData.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        <FiFileText />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{note.title || 'Başlıksız Not'}</h4>
                        <div className="flex items-center space-x-3 text-[11px] text-gray-400 mt-1">
                          <span>Çalışma Alanı: {note.workplaceName}</span>
                          <span>•</span>
                          <span>Silinme: {note.deletedDate ? new Date(note.deletedDate).toLocaleDateString('tr-TR') : '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          note.daysLeft <= 3
                            ? 'bg-red-100 text-red-600 font-bold'
                            : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {note.daysLeft} gün kaldı
                      </span>

                      <button
                        disabled={actionLoading}
                        onClick={() => handleRestore('note', note.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center space-x-1"
                        title="Geri Yükle"
                      >
                        <FiRotateCcw />
                        <span>Geri Yükle</span>
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => handlePermanentDelete('note', note.id)}
                        className="p-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Kalıcı Olarak Sil"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : trashData.workplaces?.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Çöp kutusunda silinmiş çalışma alanı bulunmuyor.
            </div>
          ) : (
            <div className="space-y-3">
              {trashData.workplaces.map((wp) => (
                <div
                  key={wp.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <FiFolder />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{wp.name}</h4>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Silinme: {wp.deletedDate ? new Date(wp.deletedDate).toLocaleDateString('tr-TR') : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        wp.daysLeft <= 3
                          ? 'bg-red-100 text-red-600 font-bold'
                          : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {wp.daysLeft} gün kaldı
                    </span>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleRestore('workplace', wp.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center space-x-1"
                      title="Geri Yükle"
                    >
                      <FiRotateCcw />
                      <span>Geri Yükle</span>
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handlePermanentDelete('workplace', wp.id)}
                      className="p-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Kalıcı Olarak Sil"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashModal;

