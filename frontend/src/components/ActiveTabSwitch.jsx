import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex bg-transparent border-b border-white/5">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-3 text-sm font-medium transition-all relative ${
          activeTab === "chats" ? "text-[#00a884]" : "text-[#8696a0] hover:bg-white/5"
        }`}
      >
        Chats
        {activeTab === "chats" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a884]" />
        )}
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-3 text-sm font-medium transition-all relative ${
          activeTab === "contacts" ? "text-[#00a884]" : "text-[#8696a0] hover:bg-white/5"
        }`}
      >
        Contacts
        {activeTab === "contacts" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a884]" />
        )}
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
