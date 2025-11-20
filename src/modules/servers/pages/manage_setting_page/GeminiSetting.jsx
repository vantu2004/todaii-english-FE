import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";
import { useEffect, useState } from "react";
import {
  fetchSettings,
  updateSetting,
} from "../../../../api/servers/settingApi";
import { logError } from "../../../../utils/LogError";
import { motion } from "framer-motion";
import SettingsTable from "../../../../components/servers/SettingsTable";
import { toast } from "react-hot-toast";

const GeminiSetting = () => {
  const { setHeader } = useHeaderContext();

  useEffect(() => {
    setHeader({
      title: "Manage Settings",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Gemini Settings" },
      ],
    });
  }, []);

  const [geminiSettings, setGeminiSettings] = useState([]);

  const fetchGeminiSettings = async () => {
    try {
      const response = await fetchSettings("GEMINI");
      setGeminiSettings(response);
    } catch (error) {
      logError(error);
    }
  };

  const updateGeminiSettings = async (key, value) => {
    try {
      await updateSetting(key, value);
      await fetchGeminiSettings();

      toast.success("Gemini settings updated successfully!");
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchGeminiSettings();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <SettingsTable
          settings={geminiSettings}
          onUpdate={updateGeminiSettings}
        />
      </motion.div>
    </div>
  );
};

export default GeminiSetting;
