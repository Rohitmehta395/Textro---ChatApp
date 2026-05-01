import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { Trash2Icon } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10">
      <ChatHeader />
      
      <div className="flex-1 px-4 sm:px-12 overflow-y-auto py-6 custom-scrollbar bg-transparent">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-5xl mx-auto space-y-2">
            {messages.map((msg) => {
              const isMine = msg.senderId === authUser._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative group ${
                      isMine
                        ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none bubble-mine"
                        : "bg-[#202c33] text-[#e9edef] rounded-tl-none bubble-other"
                    }`}
                  >
                    {isMine && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="absolute -top-2 -left-2 size-6 bg-[#202c33] border border-white/5 text-[#8696a0] hover:text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-20"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    )}
                    {msg.image && (
                      <div className="mb-1.5 overflow-hidden rounded-md border border-white/5">
                        <img 
                          src={msg.image} 
                          alt="Shared" 
                          className="max-h-80 w-full object-cover" 
                        />
                      </div>
                    )}
                    {msg.audio && (
                      <div className="mb-1.5 min-w-[240px]">
                        <audio 
                          src={msg.audio} 
                          controls 
                          className="w-full h-8 custom-audio-player" 
                        />
                      </div>
                    )}
                    {msg.text && (
                      <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap pr-12">{msg.text}</p>
                    )}
                    <div className="absolute bottom-1 right-2 flex items-center gap-1">
                      <span className="text-[10px] text-[#8696a0]">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMine && (
                        <svg className="size-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17L4 12M15 6L9 12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <div className="p-3 bg-[#202c33] border-t border-white/5">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;
