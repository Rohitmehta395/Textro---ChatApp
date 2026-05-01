import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="flex flex-col">
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isSelected = selectedUser?._id === chat._id;
        
        return (
          <button
            key={chat._id}
            className={`w-full flex items-center gap-3 p-3 transition-all duration-200 border-b border-white/5 ${
              isSelected 
                ? "bg-[#2a3942]" 
                : "hover:bg-[#202c33]"
            }`}
            onClick={() => setSelectedUser(chat)}
          >
            {/* AVATAR */}
            <div className="relative flex-shrink-0">
              <div className="size-12 rounded-full overflow-hidden">
                <img 
                  src={chat.profilePic || "/avatar.png"} 
                  alt={chat.fullName} 
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 text-left min-w-0 flex flex-col gap-0.5">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-[16px] text-[#e9edef] truncate">
                  {chat.fullName}
                </h4>
                <span className="text-[11px] text-[#8696a0]">
                  Yesterday
                </span>
              </div>
              <p className="text-[13px] text-[#8696a0] truncate">
                {isOnline ? "Online" : "Away"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
export default ChatsList;
