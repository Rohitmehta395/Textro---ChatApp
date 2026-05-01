import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <div className="flex flex-col">
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isSelected = selectedUser?._id === contact._id;

        return (
          <button
            key={contact._id}
            className={`w-full flex items-center gap-3 p-3 transition-all duration-200 border-b border-white/5 ${
              isSelected 
                ? "bg-[#2a3942]" 
                : "hover:bg-[#202c33]"
            }`}
            onClick={() => setSelectedUser(contact)}
          >
            {/* AVATAR */}
            <div className="relative flex-shrink-0">
              <div className="size-12 rounded-full overflow-hidden">
                <img 
                  src={contact.profilePic || "/avatar.png"} 
                  alt={contact.fullName} 
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 text-left min-w-0 flex flex-col gap-0.5">
              <h4 className="font-medium text-[16px] text-[#e9edef] truncate">
                {contact.fullName}
              </h4>
              <p className="text-[13px] text-[#8696a0] truncate">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
export default ContactList;
