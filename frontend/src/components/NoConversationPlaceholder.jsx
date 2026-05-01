import { MessageCircleIcon, LaptopIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="max-w-md flex flex-col items-center">
        <div className="mb-10 relative">
          <div className="size-32 bg-[#202c33] rounded-full flex items-center justify-center">
            <MessageCircleIcon className="size-16 text-[#8696a0]" />
          </div>
        </div>
        
        <h3 className="text-[32px] font-light text-[#e9edef] mb-4">
          Textro Web
        </h3>
        
        <p className="text-[#8696a0] text-[14px] leading-relaxed mb-10">
          Send and receive messages with style and speed.<br/>
          Use Textro on all your devices at the same time.
        </p>
        
        <div className="flex items-center gap-2 text-[#8696a0] text-[14px]">
          <LaptopIcon className="size-4" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
