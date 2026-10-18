import React, { useEffect, useState } from 'react';
import { FiX, FiFileText, FiCheck, FiLayers, FiArrowRight } from 'react-icons/fi';
import { TEMPLATES, TemplateItem } from '../../data/templates';
import { workspace } from '../../interface/workspace';
import { ImportNote } from '../../services/NoteService';
import Spinner from '../Spinner';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: workspace[];
  currentWorkspaceId: number | null;
  onTemplateApplied: (newNote: any) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  currentWorkspaceId,
  onTemplateApplied
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(TEMPLATES[0]);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

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

  const categories = [
    { key: 'all', label: 'Tümü' },
    { key: 'work', label: 'İş & Toplantı' },
    { key: 'planning', label: 'Planlama' },
    { key: 'dev', label: 'Yazılım' },
    { key: 'personal', label: 'Kişisel' }
  ];

  const filteredTemplates = TEMPLATES.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  const handleApplyTemplate = async () => {
    const finalWorkspaceId =
      targetWorkspaceId ||
      (currentWorkspaceId && workspaces.some((w) => w.id === currentWorkspaceId) ? currentWorkspaceId : 0) ||
      (workspaces.length > 0 && workspaces[0].id ? Number(workspaces[0].id) : 0);

    if (!finalWorkspaceId) {
      alert('Lütfen geçerli bir çalışma alanı seçiniz.');
      return;
    }

    try {
      setIsLoading(true);
      const newNote = await ImportNote({
        workplaceId: targetWorkspaceId,
        note: {
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          tags: selectedTemplate.tags,
          contents: selectedTemplate.contents
        }
      });

      setSuccessMsg('Şablon başarıyla notlarınıza eklendi!');
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg('');
        onTemplateApplied(newNote);
        onClose();
      }, 700);
    } catch (error) {
      setIsLoading(false);
      alert('Şablon eklenirken bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FDB460]">
              <FiLayers className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Şablon Galerisi</h2>
              <p className="text-xs text-gray-500">Hazır şablonlardan birini seçerek anında zengin içerikli not oluşturun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 px-8 pt-4 pb-2 border-b border-gray-100 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === c.key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Content Body: Left Cards, Right Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Template Cards List */}
          <div className="w-1/2 p-6 overflow-y-auto space-y-3 border-r border-gray-100">
            {filteredTemplates.map((t) => {
              const isSelected = selectedTemplate.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-[#FDB460] bg-orange-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FiFileText className={`text-lg ${isSelected ? 'text-[#FDB460]' : 'text-gray-400'}`} />
                      <h4 className="font-semibold text-sm text-gray-800">{t.title}</h4>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {t.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.description}</p>
                  <div className="flex items-center space-x-1 mt-3">
                    {t.tags.split(',').map((tag) => (
                      <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Live Preview Panel */}
          <div className="w-1/2 p-6 flex flex-col justify-between bg-gray-50/30 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Canlı Önizleme</span>
                <span className="text-xs text-orange-600 bg-orange-100 font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedTemplate.contents.length} İçerik Bloğu
                </span>
              </div>

              <div className="mt-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm max-h-[380px] overflow-y-auto space-y-3">
                <h3 className="text-lg font-bold text-gray-900">{selectedTemplate.title}</h3>
                <p className="text-xs text-gray-500 italic">{selectedTemplate.description}</p>
                <hr className="border-gray-100 my-2" />

                <div className="space-y-2">
                  {selectedTemplate.contents.map((item, idx) => {
                    if (item.contentType === 0) {
                      return <h4 key={idx} className="text-base font-bold text-gray-800 pt-1">{item.contentValue}</h4>;
                    }
                    if (item.contentType === 1) {
                      return <h5 key={idx} className="text-sm font-semibold text-gray-700 pt-1">{item.contentValue}</h5>;
                    }
                    if (item.contentType === 13) {
                      const todos = item.contentValue.split(',');
                      return (
                        <div key={idx} className="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {todos.map((todo, tIdx) => (
                            <div key={tIdx} className="flex items-center space-x-2 text-xs text-gray-700">
                              <span className="w-3.5 h-3.5 rounded border border-gray-300 flex items-center justify-center text-[10px] text-gray-400">✓</span>
                              <span>{todo}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (item.contentType === 12) {
                      return (
                        <pre key={idx} className="text-[11px] bg-gray-900 text-gray-200 p-2.5 rounded-lg overflow-x-auto font-mono">
                          {item.contentValue}
                        </pre>
                      );
                    }
                    if (item.contentType === 14) {
                      return (
                        <div key={idx} className="text-xs text-blue-600 underline">
                          🔗 {item.contentValue}
                        </div>
                      );
                    }
                    if (item.contentType === 11) {
                      return (
                        <div key={idx} className="text-xs text-orange-500 font-medium">
                          {item.contentValue}
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                        {item.contentValue}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Target Selection & Apply Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-gray-700">Eklenecek Çalışma Alanı:</label>
                <select
                  value={targetWorkspaceId || (workspaces.length > 0 && workspaces[0].id ? Number(workspaces[0].id) : '')}
                  onChange={(e) => setTargetWorkspaceId(Number(e.target.value))}
                  className="text-xs border border-gray-300 rounded-lg p-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#FDB460]"
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
                <div className="flex items-center space-x-2 text-green-600 text-xs font-semibold mb-2">
                  <FiCheck />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                disabled={isLoading}
                onClick={handleApplyTemplate}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#FDB460] hover:bg-[#f7a600] text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50"
              >
                <Spinner open={isLoading} />
                <span>Bu Şablonu Notlarıma Ekle</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;

