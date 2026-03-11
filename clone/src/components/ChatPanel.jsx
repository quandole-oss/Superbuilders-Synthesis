function ChatMessage({ from, text }) {
  const isTutor = from === "tutor";
  return (
    <div className={`flex ${isTutor ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
          isTutor
            ? "bg-slate-800 text-slate-200"
            : "bg-blue-600/30 text-blue-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-slate-800 rounded-xl px-4 py-2 flex gap-1 items-center">
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

export default function ChatPanel({ chatMessages, isTyping }) {
  return (
    <div className="flex-[3] border-l border-white/10 bg-slate-950 flex flex-col max-h-screen lg:max-h-none">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z" />
            <rect x="3" y="10" width="18" height="12" rx="2" />
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-semibold m-0">Tutor</p>
          <p className="text-green-400 text-xs m-0">Online</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chatMessages.map((msg, i) => (
          <ChatMessage key={i} from={msg.from} text={msg.text} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
}
