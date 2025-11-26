import { useState } from "react";
import { Tree } from "react-arborist";
import {
  Folder,
  FolderOpen,
  FileText,
  Edit2,
  Trash2,
  MoreVertical,
  Plus,
  FilePlus,
} from "lucide-react";

// --- NODE COMPONENT (Render từng dòng trong cây) ---
const Node = ({ node, style, dragHandle, tree }) => {
  if (!node?.data) return null;

  const isFolder = node.data.type?.toUpperCase() === "FOLDER";
  // Logic icon: Folder mở/đóng hoặc File note
  const Icon = isFolder ? (node.isOpen ? FolderOpen : Folder) : FileText;

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={() => node.toggle()}
      onContextMenu={(e) => tree.props.onContextMenu(e, node)}
      className={`
        group flex items-center cursor-pointer px-3 py-1.5 mx-1 rounded-lg transition-all border border-transparent
        ${
          node.isSelected
            ? "bg-neutral-200 border-neutral-300 text-neutral-900 font-semibold shadow-sm"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        }
      `}
    >
      {/* Icon */}
      <div className="mr-2.5 w-5 h-5 flex items-center justify-center shrink-0">
        <Icon
          size={18}
          className={
            isFolder
              ? node.isSelected
                ? "text-yellow-600"
                : "text-yellow-500 fill-yellow-500/20"
              : node.isSelected
              ? "text-neutral-700"
              : "text-neutral-400"
          }
        />
      </div>

      {/* Text / Edit Input */}
      <div className="flex-1 truncate select-none">
        {node.isEditing ? (
          <input
            type="text"
            defaultValue={node.data.name}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
              if (e.key === "Enter") node.submit(e.currentTarget.value);
              if (e.key === "Escape") node.reset();
            }}
            className="w-full px-1 py-0.5 text-sm bg-white border border-blue-500 rounded outline-none shadow-sm"
          />
        ) : (
          <span className="text-sm">{node.data.name}</span>
        )}
      </div>

      {/* Hover Menu Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          tree.props.onContextMenu(e, node);
        }}
        className={`
          p-1 rounded hover:bg-neutral-300 text-neutral-400 hover:text-neutral-700 transition-all
          ${
            node.isSelected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }
        `}
      >
        <MoreVertical size={14} />
      </div>
    </div>
  );
};

// --- MAIN TREE COMPONENT ---
export default function NotebookTree({
  data,
  onSelectNote,
  onRename,
  onDelete,
  onCreate,
}) {
  const [menu, setMenu] = useState(null);

  const handleContextMenu = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    // Tính toán vị trí để menu không bị tràn màn hình (cơ bản)
    setMenu({ x: e.clientX, y: e.clientY, node });
  };

  return (
    <div
      className="h-full relative"
      onClick={() => setMenu(null)} // Click ra ngoài đóng menu
      onScroll={() => setMenu(null)} // Scroll đóng menu
    >
      {data ? (
        <Tree
          data={data}
          idAccessor="id"
          childrenAccessor="children"
          width="100%"
          height={600} // Lưu ý: Arborist cần fixed height hoặc container flex đúng
          indent={20}
          rowHeight={36}
          paddingBottom={20}
          onActivate={(node) =>
            node.data.type?.toUpperCase() === "NOTE" && onSelectNote(node.data)
          }
          onRename={({ id, name }) => onRename(id, name)}
          onContextMenu={handleContextMenu}
        >
          {Node}
        </Tree>
      ) : (
        <div className="p-4 text-xs text-neutral-400 italic text-center">
          Đang tải dữ liệu...
        </div>
      )}

      {/* CUSTOM CONTEXT MENU */}
      {menu?.node && (
        <div
          className="fixed z-[9999] bg-white border border-neutral-200 shadow-xl rounded-xl py-1.5 w-52 text-sm text-neutral-700 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: menu.y, left: menu.x }}
        >
          {/* Header: Tên node đang chọn */}
          <div className="px-4 py-1.5 text-xs font-bold text-neutral-400 border-b border-neutral-100 mb-1 truncate bg-neutral-50/50">
            {menu.node.data.name}
          </div>

          {/* Folder Actions */}
          {menu.node.data.type?.toUpperCase() === "FOLDER" && (
            <>
              <MenuItem
                icon={Folder}
                label="Tạo thư mục con"
                onClick={() => onCreate(menu.node.id, "FOLDER")}
              />
              <MenuItem
                icon={FilePlus}
                label="Tạo bộ từ vựng"
                onClick={() => onCreate(menu.node.id, "NOTE")}
              />
              <div className="border-t my-1 border-neutral-100"></div>
            </>
          )}

          {/* Common Actions */}
          <MenuItem
            icon={Edit2}
            label="Đổi tên"
            onClick={() => menu.node.edit()}
          />
          <MenuItem
            icon={Trash2}
            label="Xóa"
            onClick={() => onDelete(menu.node)}
            isDanger
          />
        </div>
      )}
    </div>
  );
}

// Helper: Menu Item
const MenuItem = ({ icon: Icon, label, onClick, isDanger }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-2 flex gap-3 items-center transition-colors text-sm
      ${
        isDanger
          ? "hover:bg-red-50 text-red-600"
          : "hover:bg-neutral-50 text-neutral-700"
      }
    `}
  >
    <Icon size={16} strokeWidth={2} /> {label}
  </button>
);
