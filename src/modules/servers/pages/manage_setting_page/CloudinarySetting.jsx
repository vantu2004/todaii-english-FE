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

const CloudinarySetting = () => {
  const { setHeader } = useHeaderContext();

  useEffect(() => {
    setHeader({
      title: "Manage Settings",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Cloudinary Settings" },
      ],
    });
  }, []);

  const [cloudinarySettings, setCloudinarySettings] = useState([]);

  const fetchCloudinarySettings = async () => {
    try {
      const response = await fetchSettings("CLOUDINARY");
      setCloudinarySettings(response);
    } catch (error) {
      logError(error);
    }
  };

  const updateCloudinarySettings = async (key, value) => {
    try {
      await updateSetting(key, value);
      await fetchCloudinarySettings();

      toast.success("Cloudinary settings updated successfully!");
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchCloudinarySettings();
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
          settings={cloudinarySettings}
          onUpdate={updateCloudinarySettings}
        />
      </motion.div>
    </div>
  );
};

export default CloudinarySetting;
