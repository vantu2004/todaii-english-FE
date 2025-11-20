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
import { set } from "date-fns";

const YoutubeSetting = () => {
  const { setHeader } = useHeaderContext();

  useEffect(() => {
    setHeader({
      title: "Manage Settings",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Youtube Settings" },
      ],
    });
  }, []);

  const [youtubeSettings, setYoutubeSettings] = useState([]);

  const fetchYoutubeSettings = async () => {
    try {
      const response = await fetchSettings("YOUTUBE");
      setYoutubeSettings(response);
    } catch (error) {
      logError(error);
    }
  };

  const updateYoutubeSettings = async (key, value) => {
    try {
      await updateSetting(key, value);
      await fetchYoutubeSettings();

      toast.success("Youtube settings updated successfully!");
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchYoutubeSettings();
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
          settings={youtubeSettings}
          onUpdate={updateYoutubeSettings}
        />
      </motion.div>
    </div>
  );
};

export default YoutubeSetting;
