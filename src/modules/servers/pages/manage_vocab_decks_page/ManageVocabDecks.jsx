import { useEffect, useState } from "react";
import Pagination from "../../../../components/servers/Pagination";
import { fetchVocabDecks } from "../../../../api/servers/vocabDeckApi";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import VocabDecksTable from "../../../../components/servers/manage_vocab_decks_page/VocabDecksTable";
import { useNavigate } from "react-router-dom";
import RedirectToolbar from "../../../../components/servers/RedirectToolbar";

const ManageVocabDecks = () => {
  const REDIRECT_URL = "/server/vocab-deck/create";

  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
    { key: "name", label: "Deck Name", sortField: "name" },
    { key: "description", label: "Description", sortField: "description" },
    { key: "cefr_level", label: "CEFR Level", sortField: "cefrLevel" },
    { key: "updated_at", label: "Updated At", sortField: "updatedAt" },
    { key: "vocabulary", label: "Vocabularies" },
    { key: "enabled", label: "Enabled", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  const reloadDecks = async () => {
    try {
      setLoading(true);

      const data = await fetchVocabDecks(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setDecks(data.content || []);

      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
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
    reloadDecks();
  }, [query]);

  const updateQuery = (values) => {
    setQuery((prev) => ({ ...prev, ...values }));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Manage Vocabulary Decks
          </h2>

          <RedirectToolbar
            updateQuery={updateQuery}
            handleRedirect={() => navigate(REDIRECT_URL)}
          />

          <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Vocab Decks Table
          </h4>
        </div>

        {/* Table Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
        >
          <VocabDecksTable
            columns={columns}
            decks={decks}
            reloadDecks={reloadDecks}
            query={query}
            updateQuery={updateQuery}
          />
        </motion.div>

        {/* Pagination */}
        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={updateQuery}
            pagination={pagination}
          />
        </div>
      </div>
    </>
  );
};

export default ManageVocabDecks;
