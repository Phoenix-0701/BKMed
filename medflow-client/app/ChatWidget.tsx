// app/ChatWidget.tsx
"use client";

import { useState } from "react";

interface Message {
  sender: "bot" | "user";
  text: string;
  suggestions?: string[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi là Trợ lý AI Y tế. Bạn đang gặp phải triệu chứng gì hôm nay?",
    },
    {
      sender: "user",
      text: "Tôi bị đau đầu và sốt nhẹ từ chiều qua.",
    },
    {
      sender: "bot",
      text: "Để tôi giúp bạn đánh giá sơ bộ. Bạn có kèm theo các triệu chứng nào dưới đây không?",
      suggestions: ["Ho / Khó thở", "Buồn nôn", "Đau họng"],
    },
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setInputValue("");
    
    // Giả lập bot phản hồi
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Cảm ơn bạn. AI đang phân tích dữ liệu để đưa ra phân loại mức độ..." },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Khung Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col h-[480px]">
          {/* Header Widget */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-bold">AI Health Assistant</h4>
                <p className="text-[10px] text-blue-100">Online • AI Triage Bot</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>

          {/* Nội dung Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Các nút bấm chọn nhanh gợi ý */}
                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          setInputValue(sug);
                        }}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Khung Nhập tin nhắn */}
          <div className="border-t border-gray-100 p-2.5 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập triệu chứng của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              onClick={handleSend}
              className="rounded-xl bg-blue-600 p-2 text-white hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Nút Toggle Bật/Tắt Chat Widget */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all"
      >
        💬
      </button>
    </div>
  );
}