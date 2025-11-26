import { useState, useEffect, useCallback } from "react";
import { FolderPlus, FilePlus, Loader2, Sidebar } from "lucide-react";
import NotebookTree from "../../../components/clients/notebook_page/NotebookTree";
import NoteEditor from "../../../components/clients/notebook_page/NoteEditor";
import {
  getAllNotebooks,
  createNotebook,
  renameNotebook,
  deleteNotebook,
} from "../../../api/clients/notebookApi";
import { logError } from "../../../utils/LogError";
import { motion, AnimatePresence } from "framer-motion";

const ActionButton = ({ icon: Icon, onClick, title }) => (
  <button
    onClick={onClick}
    className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
    title={title}
  >
    <Icon size={18} />
  </button>
);

// đệ quy chuẩn hóa dữ liệu, react-arborist nhận id là string
const normalizeTreeData = (nodes) => {
  if (!Array.isArray(nodes)) return [];
  // nếu node có children thì cho đệ quy, nếu ko, FOLDER cho [], NOTE cho null
  return nodes.map((node) => ({
    ...node,
    id: String(node.id),
    children:
      node.children?.length > 0
        ? normalizeTreeData(node.children)
        : node.type === "FOLDER"
        ? []
        : null,
  }));
};

const Notebook = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Responsive Toggle

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const rawData = await getAllNotebooks();
      setTreeData(normalizeTreeData(rawData));
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (parentId, type) => {
    const defaultName = type === "FOLDER" ? "Thư mục mới" : "Bộ từ vựng mới";
    try {
      await createNotebook({ name: defaultName, type, parentId });
      await fetchTree();
    } catch {
      logError(error);
    }
  };

  const handleRename = async (id, newName) => {
    try {
      await renameNotebook(id, newName);
    } catch {
      logError(error);
    } finally {
      await fetchTree();
    }
  };

  const handleDelete = async (node) => {
    try {
      await deleteNotebook(node.id);
    } catch {
      logError(error);
    } finally {
      await fetchTree();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="flex h-[calc(100vh-64px)] w-full max-w-[1920px] mx-auto mt-24 bg-white border-t border-neutral-200 overflow-hidden font-sans text-sm"
      >
        {/* LEFT SIDEBAR: TREE */}
        <div
          className={`
          flex-shrink-0 bg-neutral-50 border-r border-neutral-200 flex flex-col h-full transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "w-80 translate-x-0"
              : "w-0 -translate-x-full opacity-0 overflow-hidden border-none"
          }
        `}
        >
          {/* Sidebar Header - tạo thư mục, file gốc */}
          <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 bg-white shrink-0">
            <span className="font-bold text-neutral-800 text-base">
              Thư viện
            </span>
            <div className="flex gap-1">
              <ActionButton
                icon={FolderPlus}
                onClick={() => handleCreate(null, "FOLDER")}
                title="Tạo Thư mục gốc"
              />
              <ActionButton
                icon={FilePlus}
                onClick={() => handleCreate(null, "NOTE")}
                title="Tạo Bộ từ vựng gốc"
              />
            </div>
          </div>

          {/* Tree Content */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-neutral-400" />
              </div>
            ) : (
              <NotebookTree
                data={treeData}
                onSelectNote={setSelectedNote}
                onCreate={handleCreate}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {/* RIGHT CONTENT: EDITOR */}
        <div className="flex-1 h-full bg-white relative flex flex-col min-w-0">
          {/* Mobile Toggle Button (Overlay) */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-20 p-2 bg-white border border-neutral-200 rounded-lg shadow-sm text-neutral-500 hover:text-neutral-900"
            >
              <Sidebar size={18} />
            </button>
          )}

          {/* Editor Component */}
          <NoteEditor
            note={selectedNote}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notebook;
