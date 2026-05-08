import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../../components/servers/ToolBar";
import Pagination from "../../../../components/servers/Pagination";
import {
  fetchToeicCollections,
  createToeicCollection,
  updateToeicCollection,
} from "../../../../api/servers/toeicCollectionApi";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import ToeicCollectionsTable from "../../../../components/servers/manage_toeic_page/ToeicCollectionsTable";
import ToeicCollectionFormModal from "../../../../components/servers/manage_toeic_page/ToeicCollectionFormModal";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const ManageToeicCollections = () => {
  const { setHeader } = useHeaderContext();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "name", label: "Collection Name", sortField: "name" },
    { key: "alias", label: "Alias", sortField: "alias" },
    { key: "updated_at", label: "Updated At", sortField: "updatedAt" },
    { key: "enable", label: "Enable" },
    { key: "actions", label: "Actions" },
  ];

  const reloadCollections = async () => {
    try {
      setLoading(true);
      const data = await fetchToeicCollections(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setCollections(data.content || []);
      setPagination({
        totalElements: data.totalElements || data.total_elements,
        totalPages: data.totalPages || data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Manage TOEIC Collections",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Collections" },
      ],
    });
  }, []);

  useEffect(() => {
    reloadCollections();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleOpenModal = (collection = null) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingCollection) {
        await updateToeicCollection(editingCollection.id, data);
        toast.success("Collection updated successfully");
      } else {
        await createToeicCollection(data);
        toast.success("Collection created successfully");
      }
      await reloadCollections();
      handleCloseModal();
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <ToolBar
          updateQuery={updateQuery}
          setIsModalOpen={() => handleOpenModal()}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
        >
          <ToeicCollectionsTable
            columns={columns}
            collections={collections}
            reloadCollections={reloadCollections}
            query={query}
            updateQuery={updateQuery}
            onEdit={handleOpenModal}
          />
        </motion.div>

        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={updateQuery}
            pagination={pagination}
          />
        </div>
      </div>

      {isModalOpen && (
        <ToeicCollectionFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingCollection}
        />
      )}
    </>
  );
};

export default ManageToeicCollections;
