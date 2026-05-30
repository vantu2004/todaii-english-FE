import { useState, useEffect, useCallback } from "react";
import { getStats } from "@/api/servers/dashboardApi";
import { logError } from "@/utils/LogError";
import toast from "react-hot-toast";

export const useRedisStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const res = await getStats();
      setData(res || null);
    } catch (err) {
      logError(err);
      setError(err);
      toast.error("Không thể lấy dữ liệu thống kê Redis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    return fetchStats(false);
  }, [fetchStats]);

  return { data, loading, error, refresh };
};
