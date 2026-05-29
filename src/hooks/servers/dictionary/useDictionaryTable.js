import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { logError } from "@/utils/LogError";
import {
  searchInDb,
  createWord as createWordApi,
  updateWord as updateWordApi,
  deleteWord as deleteWordApi,
} from "@/api/servers/dictionaryApi";

export const useDictionaryTable = () => {
  const [data, setData] = useState([]);
  // Thêm first và last để Component Pagination của bạn hoạt động
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ page: 1, size: 20, keyword: "" });

  const fetchTableData = async () => {
    if (!query.keyword) {
      setData([]);
      setPagination({
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await searchInDb(query.keyword, query.page, query.size);
      setData(res.content || []);

      // Hứng cả camelCase lẫn snake_case để an toàn tuyệt đối
      setPagination({
        totalElements: res.totalElements ?? res.total_elements ?? 0,
        totalPages: res.totalPages ?? res.total_pages ?? 0,
        first: res.first ?? true,
        last: res.last ?? true,
      });
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (word) => {
    setLoading(true);
    try {
      await createWordApi(word);
      toast.success("Created successfully");
      fetchTableData();
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, word) => {
    setLoading(true);
    try {
      await updateWordApi(id, word);
      toast.success("Updated successfully");
      fetchTableData();
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteWordApi(id);
      toast.success("Deleted successfully");
      fetchTableData();
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [query.page, query.size, query.keyword]);

  return {
    data,
    pagination,
    loading,
    query,
    setQuery,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
