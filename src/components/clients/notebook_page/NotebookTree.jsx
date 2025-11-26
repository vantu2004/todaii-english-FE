import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // IMPORT QUAN TRỌNG
import { Tree } from "react-arborist";
import { Folder, Edit2, Trash2, FilePlus } from "lucide-react";
import Node from "./Node";

const NotebookTree = ({ data, onSelectNote, onRename, onDelete, onCreate }) => {
  const [menu, setMenu] = useState(null);

  // Xử lý chuột phải (Context Menu)
  const handleContextMenu = (e, node) => {
    e.preventDefault();
    e.stopPropagation();

    // Lưu tọa độ chuột so với màn hình
    setMenu({ x: e.clientX, y: e.clientY, node });
  };

  // Xử lý đóng menu
  const closeMenu = () => setMenu(null);

  return (
    <div className="h-full relative">
      {data ? (
        <Tree
          data={data}
          idAccessor="id"
          childrenAccessor="children"
          width="100%"
          height={600}
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

      {/* PORTAL: Đưa Menu ra ngoài root div, gắn vào body 
        giúp thoát khỏi overflow:hidden của sidebar 
      */}
      {menu?.node &&
        createPortal(
          <>
            {/* Overlay trong suốt để click ra ngoài thì đóng menu */}
            <div
              className="fixed inset-0 z-[9998] bg-transparent"
              onClick={closeMenu}
              onContextMenu={(e) => {
                e.preventDefault();
                closeMenu();
              }}
            />

            {/* Menu Box */}
            <div
              className="fixed z-[9999] bg-white border border-neutral-200 shadow-xl rounded-xl py-1.5 w-52 text-sm text-neutral-700 animate-in fade-in zoom-in-95 duration-100"
              style={{ top: menu.y, left: menu.x }}
              onClick={(e) => e.stopPropagation()} // Chặn click xuyên qua menu
            >
              <div className="px-4 py-1.5 text-xs font-bold text-neutral-400 border-b border-neutral-100 mb-1 truncate bg-neutral-50/50 select-none">
                {menu.node.data.name}
              </div>

              {menu.node.data.type?.toUpperCase() === "FOLDER" && (
                <>
                  <MenuItem
                    icon={Folder}
                    label="Tạo thư mục con"
                    onClick={() => {
                      onCreate(menu.node.id, "FOLDER");
                      closeMenu();
                    }}
                  />
                  <MenuItem
                    icon={FilePlus}
                    label="Tạo bộ từ vựng"
                    onClick={() => {
                      onCreate(menu.node.id, "NOTE");
                      closeMenu();
                    }}
                  />
                  <div className="border-t my-1 border-neutral-100"></div>
                </>
              )}

              {/* Common Actions */}
              <MenuItem
                icon={Edit2}
                label="Đổi tên"
                onClick={() => {
                  menu.node.edit();
                  closeMenu();
                }}
              />
              <MenuItem
                icon={Trash2}
                label="Xóa"
                onClick={() => {
                  onDelete(menu.node);
                  closeMenu();
                }}
                isDanger
              />
            </div>
          </>,
          document.body // Render trực tiếp vào body
        )}
    </div>
  );
};

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

export default NotebookTree;
