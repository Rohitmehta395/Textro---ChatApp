import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, SmileIcon, PlusIcon, MicIcon } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result;
          sendMessage({
            audio: base64Audio,
          });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error("Microphone access denied or not available");
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
      return;
    }
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { sendMessage, isSoundEnabled } = useChatStore();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full relative z-20">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-16 left-0 shadow-2xl border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <EmojiPicker 
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            lazyLoadEmojis={true}
            searchPlaceholder="Search emojis..."
            width={350}
            height={400}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {imagePreview && (
        <div className="mb-4 flex items-center bg-[#202c33] p-4 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-32 object-cover rounded-lg border border-white/10"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-[#111b21] flex items-center justify-center text-white hover:text-rose-500 transition-all shadow-lg"
              type="button"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {!isRecording && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-all outline-none ${showEmojiPicker ? 'text-[#00a884] bg-white/5' : 'text-[#aebac1] hover:bg-white/5'}`}
            >
              <SmileIcon className="size-6" />
            </button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all outline-none"
            >
              <PlusIcon className="size-6" />
            </button>
          </div>
        )}

        <div className={`flex-1 bg-[#2a3942] rounded-lg px-4 flex items-center ${isRecording ? 'animate-pulse' : ''}`}>
          {isRecording ? (
            <div className="flex items-center gap-3 w-full py-2.5">
              <div className="size-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-500 font-medium text-[15px]">Recording... {formatDuration(recordingDuration)}</span>
              <button 
                type="button"
                onClick={() => {
                  if (mediaRecorderRef.current) {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                    clearInterval(timerRef.current);
                  }
                }}
                className="ml-auto text-rose-500 hover:text-rose-400 font-semibold px-2"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  isSoundEnabled && playRandomKeyStrokeSound();
                }}
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-[#d1d7db] placeholder-[#8696a0] text-[15px] py-2.5"
                placeholder="Type a message"
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={isRecording ? stopRecording : (text.trim() || imagePreview ? handleSendMessage : startRecording)}
          className="p-2 text-[#aebac1] hover:bg-white/5 rounded-full transition-all outline-none"
        >
          {isRecording ? (
            <SendIcon className="size-6 text-[#00a884]" />
          ) : (text.trim() || imagePreview ? (
            <SendIcon className="size-6 text-[#00a884]" />
          ) : (
            <MicIcon className="size-6" />
          ))}
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
