import { useChatStore } from "../store/useChatStore";

import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden">
      {/* LEFT SIDE - SIDEBAR */}
      <div className="w-full md:w-96 border-r border-black/20 flex flex-col bg-[#111b21]">
        <ProfileHeader />
        
        <div className="p-3">
          <ActiveTabSwitch />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE - CHAT AREA */}
      <div className={`flex-1 flex flex-col bg-[#0b141a] relative ${!selectedUser ? "hidden md:flex" : "flex"}`}>
        {/* Subtle WhatsApp-like doodle background (using CSS or a simple div) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />
        
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div className="flex-1 flex items-center justify-center relative z-10">
            <NoConversationPlaceholder />
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatPage;
