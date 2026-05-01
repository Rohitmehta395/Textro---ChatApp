import { XIcon, MoreVerticalIcon, SearchIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-[#202c33] py-2 px-4 h-[60px] border-b border-black/10">
      <div className="flex items-center gap-3">
        {/* AVATAR */}
        <div className="size-10 rounded-full overflow-hidden">
          <img 
            src={selectedUser.profilePic || "/avatar.png"} 
            alt={selectedUser.fullName} 
            className="size-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col">
          <h3 className="text-[#e9edef] font-medium text-[16px] leading-tight">
            {selectedUser.fullName}
          </h3>
          <p className="text-[#8696a0] text-[13px]">
            {isOnline ? "Online" : "Away"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all outline-none">
          <SearchIcon className="size-5" />
        </button>
        <button className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all outline-none">
          <MoreVerticalIcon className="size-5" />
        </button>
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all md:hidden outline-none"
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
