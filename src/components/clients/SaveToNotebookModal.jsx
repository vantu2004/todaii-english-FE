import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Loader2,
  BookOpen,
  ChevronRight,
  Check,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllNotebooks,
  createNotebook,
  renameNotebook,
  deleteNotebook,
} from "@/api/clients/notebookApi";
import { addWordToNotebook } from "@/api/clients/noteDictApi";
import toast from "react-hot-toast";
import { searchByTodaiiDictionary } from "@/api/clients/dictionaryApi";

// Helper recursive flattening of nodes of type "NOTE"
const getNotesOnly = (nodes) => {
  let list = [];
  if (!Array.isArray(nodes)) return list;
  for (const node of nodes) {
    if (node.type === "NOTE") {
      list.push(node);
    }
    if (node.children && node.children.length > 0) {
      list = [...list, ...getNotesOnly(node.children)];
    }
  }
  return list;
};

const SaveToNotebookModal = ({ word, isOpen, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchNotebooks();
      setIsCreatingNew(false);
      setNewDeckName("");
      setEditingNoteId(null);
      setEditName("");
    }
  }, [isOpen]);

  const fetchNotebooks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllNotebooks();
      const noteDecks = getNotesOnly(data);
      setNotes(noteDecks);
    } catch (err) {
      console.error("Error fetching notebooks for save:", err);
      toast.error("Không thể tải danh sách sổ tay.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNote = async (note) => {
    if (isSaving || editingNoteId) return;

    if (!word?.trim()) {
      toast.error("Không tìm thấy từ vựng để lưu.");
      return;
    }

    setIsSaving(true);

    try {
      let wordToSave = word.trim();

      // 1. Chuẩn hóa từ vựng: Lấy base word (headword) từ API giống như bên NoteEditor
      try {
        const apiResult = await searchByTodaiiDictionary(wordToSave, 1, 1);
        if (apiResult?.result?.length > 0) {
          const entry = apiResult.result[0];
          // Ưu tiên lấy từ gốc do API trả về, nếu không có thì giữ nguyên từ ban đầu
          wordToSave = entry.word || entry.headword || wordToSave;
        }
      } catch (apiErr) {
        console.warn("Lỗi khi tìm từ nguyên mẫu, sẽ lưu từ gốc:", apiErr);
        // Fallback: Vẫn tiếp tục chạy để lưu từ gốc nếu API lỗi
      }

      // 2. Lưu từ đã được chuẩn hóa vào sổ tay
      await addWordToNotebook(note.id, wordToSave);

      toast.success(`Đã thêm từ "${wordToSave}" vào bộ từ vựng "${note.name}"`);
      onClose();
    } catch (err) {
      console.error("Error saving word to notebook:", err);
      toast.error("Không thể lưu từ vựng vào sổ tay.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) {
      toast.error("Vui lòng nhập tên bộ từ vựng.");
      return;
    }

    try {
      await createNotebook({
        name: newDeckName.trim(),
        type: "NOTE",
        parentId: null,
      });

      toast.success(`Đã tạo bộ từ vựng "${newDeckName}"`);
      setNewDeckName("");
      setIsCreatingNew(false);
      fetchNotebooks();
    } catch (err) {
      console.error("Error creating notebook:", err);
      toast.error("Không thể tạo bộ từ vựng mới.");
    }
  };

  const handleRenameDeck = async (id) => {
    if (!editName.trim()) {
      toast.error("Tên bộ từ vựng không được để trống.");
      return;
    }

    try {
      await renameNotebook(id, editName.trim());

      toast.success("Đã đổi tên bộ từ vựng.");
      setEditingNoteId(null);
      setEditName("");
      fetchNotebooks();
    } catch (err) {
      console.error("Error renaming notebook:", err);
      toast.error("Không thể đổi tên bộ từ vựng.");
    }
  };

  const handleDeleteDeck = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa bộ từ vựng này không? Tất cả từ vựng bên trong sẽ bị xóa.",
      )
    ) {
      return;
    }

    try {
      await deleteNotebook(id);
      toast.success("Đã xóa bộ từ vựng.");
      fetchNotebooks();
    } catch (err) {
      console.error("Error deleting notebook:", err);
      toast.error("Không thể xóa bộ từ vựng.");
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-md max-h-[80vh] flex flex-col bg-white dark:bg-neutral-900 
              border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl z-10 m-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" />
                <span>Lưu từ vựng vào Sổ tay</span>
              </h3>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100/50 dark:border-brand-900/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  Từ vựng đang chọn:
                </p>

                <p className="text-base font-bold text-brand-600 dark:text-brand-400 font-serif mt-0.5 select-all">
                  {word}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Search className="w-4 h-4" />
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bộ từ vựng..."
                  className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl
                    bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              {isCreatingNew ? (
                <div className="flex gap-2 p-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-2xl animate-in slide-in-from-top-1 duration-200">
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateDeck();
                    }}
                    placeholder="Nhập tên bộ từ vựng mới..."
                    className="flex-1 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none"
                    autoFocus
                  />

                  <button
                    onClick={handleCreateDeck}
                    className="px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    Tạo
                  </button>

                  <button
                    onClick={() => setIsCreatingNew(false)}
                    className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-all border border-neutral-100/50 dark:border-neutral-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo bộ từ vựng mới</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 -mr-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400 dark:text-neutral-500" />
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                    Đang tải danh sách...
                  </p>
                </div>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className="group w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-100/80 dark:border-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all text-left cursor-pointer"
                  >
                    {editingNoteId === note.id ? (
                      <div
                        className="flex-1 flex gap-2 items-center min-w-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameDeck(note.id);
                          }}
                          className="flex-1 px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none"
                          autoFocus
                        />

                        <button
                          onClick={() => handleRenameDeck(note.id)}
                          className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-full"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-neutral-880 dark:text-neutral-200 truncate">
                            {note.name}
                          </p>

                          <p className="text-[10px] text-neutral-500 dark:text-neutral-500 mt-0.5">
                            Nhấp để thêm từ vựng
                          </p>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <div
                            className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditName(note.name);
                              }}
                              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteDeck(note.id)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/25 rounded text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-neutral-500 dark:text-neutral-500 flex-shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-400 dark:text-neutral-500">
                  <p className="text-xs">Không tìm thấy bộ từ vựng nào.</p>
                  <p className="text-[10px] mt-1">
                    Hãy tạo một bộ từ vựng mới bằng nút phía trên.
                  </p>
                </div>
              )}
            </div>

            {isSaving && (
              <div className="absolute inset-0 bg-white/70 dark:bg-neutral-900/70 z-20 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                    Đang thêm vào sổ tay...
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SaveToNotebookModal;
