import { useState, useRef } from "react";
import { Trash2, Upload, FileText, Clock } from "lucide-react";
import Modal from "../Modal";

const UploadSrtFileModal = ({ isOpen, onClose, onUpload, onCreateBatch }) => {
  const [lines, setLines] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLines([]);

    const response = await onUpload(file);
    setLines(response || []);
  };

  const handleDeleteLine = (line_order) => {
    setLines((prev) => prev.filter((l) => l.line_order !== line_order));
  };

  const handleEditLine = (line_order, key, value) => {
    setLines((prev) =>
      prev.map((l) =>
        l.line_order === line_order ? { ...l, [key]: value } : l
      )
    );
  };

  const handleClearAll = () => {
    setLines([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (lines.length === 0) {
      alert("Không có dữ liệu để lưu.");
      return;
    }

    onCreateBatch(lines);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="sm:max-w-7xl w-full"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Upload SRT File
              </h2>
              <p className="text-sm text-gray-500">
                Preview and edit subtitle lines before saving
              </p>
            </div>
          </div>
          {lines.length > 0 && (
            <div className="text-sm font-medium ml-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              {lines.length} lines
            </div>
          )}
        </div>
      }
      footer={
        <div className="flex justify-between items-center w-full">
          <button
            onClick={handleClearAll}
            disabled={lines.length === 0}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Clear All
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={lines.length === 0}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      }
    >
      {/* Upload area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select SRT File
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <p className="mt-2 text-xs text-red-500">
          Only supported formats ".srt"
        </p>
      </div>

      {/* Table */}
      {lines.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[55vh]">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>Start (ms)</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>End (ms)</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    English Text
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vietnamese Text
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lines.map((line, index) => (
                  <tr
                    key={line.line_order}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {line.line_order}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={line.start_ms}
                        onChange={(e) =>
                          handleEditLine(
                            line.line_order,
                            "start_ms",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={line.end_ms}
                        onChange={(e) =>
                          handleEditLine(
                            line.line_order,
                            "end_ms",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={line.text_en}
                        onChange={(e) =>
                          handleEditLine(
                            line.line_order,
                            "text_en",
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={line.text_vi}
                        onChange={(e) =>
                          handleEditLine(
                            line.line_order,
                            "text_vi",
                            e.target.value
                          )
                        }
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteLine(line.line_order)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete line"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {lines.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="text-gray-400" size={28} />
          </div>
          <p className="text-gray-600 font-medium mb-1">No file uploaded yet</p>
          <p className="text-sm text-gray-500">
            Upload an SRT file to preview and edit subtitle lines
          </p>
        </div>
      )}
    </Modal>
  );
};

export default UploadSrtFileModal;
