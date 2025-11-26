import { Folder, FolderOpen, FileText, MoreVertical } from "lucide-react";

const Node = ({ node, style, dragHandle, tree }) => {
  if (!node?.data) return null;

  const isFolder = node.data.type?.toUpperCase() === "FOLDER";
  const Icon = isFolder ? (node.isOpen ? FolderOpen : Folder) : FileText;

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={() => node.toggle()}
      onContextMenu={(e) => tree.props.onContextMenu(e, node)}
      className={`
        group flex items-center cursor-pointer px-3 py-1.5 mx-1 rounded-lg transition-all border border-transparent select-none
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
      <div className="flex-1 truncate">
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
            onClick={(e) => e.stopPropagation()}
            className="w-full px-1 py-0.5 text-sm bg-white border border-blue-500 rounded outline-none shadow-sm"
          />
        ) : (
          <span className="text-sm">{node.data.name}</span>
        )}
      </div>

      {/* Hover Menu Trigger (3 Dots) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          // Gọi hàm context menu của Tree, truyền event click để lấy tọa độ x,y
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

export default Node;
