import { updateProfile } from "../../../../api/servers/adminApi";
import ProfileForm from "../../../../components/servers/manage_profile_page/ProfileForm";
import { useServerAuthContext } from "../../../../hooks/servers/useServerAuthContext";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";
import { useEffect } from "react";
import { logError } from "../../../../utils/LogError";

const Profile = () => {
  const { setHeader } = useHeaderContext();

  useEffect(() => {
    setHeader({
      title: "Manage Profile",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Profile" },
      ],
    });
  }, []);

  const { authUser, setAuthUser } = useServerAuthContext();

  const handleUpdate = async (data) => {
    try {
      const updated = await updateProfile(data);
      setAuthUser(updated);
    } catch (error) {
      logError(error);
    }
  };

  return <ProfileForm userData={authUser} onUpdate={handleUpdate} />;
};

export default Profile;
