import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, CameraIcon, MessageSquarePlusIcon, MoreVerticalIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-[60px] px-4 bg-[#202c33] flex items-center border-b border-black/10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="relative group">
            <button
              className="size-10 rounded-full overflow-hidden relative transition-all duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User profile"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <CameraIcon className="size-4 text-white" />
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            title="Toggle Sound"
            className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(() => {});
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          <button className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all">
            <MessageSquarePlusIcon className="size-5" />
          </button>

          <button
            title="Logout"
            className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all"
            onClick={logout}
          >
            <MoreVerticalIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
