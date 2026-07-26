// app/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Message {
  sender: "bot" | "user";
  text: string;
  suggestions?: string[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  // Hàm đóng chat dùng chung: đóng khung + xóa input đang gõ dở
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setInputValue("");
  }, []);

  // Lắng nghe phím Esc để đóng chat khi đang mở
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeChat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Cảm ơn bạn. AI đang phân tích dữ liệu để đưa ra phân loại mức độ...",
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex flex-col items-end pointer-events-none">
      {/* 1. KHUNG CHAT BOX (Mở ra khi isOpen === true) */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col h-[480px]">
          {/* Header Widget */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white select-none">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-bold">AI Health Assistant</h4>
                <p className="text-[10px] text-blue-100">Online • AI Triage Bot</p>
              </div>
            </div>

            {/* Nút X ĐÓNG khung chat */}
            <button
              type="button"
              onClick={closeChat}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đóng chat (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Nội dung Tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
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

                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setInputValue(sug)}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Form Nhập tin nhắn */}
          <form
            onSubmit={handleSend}
            className="border-t border-gray-100 p-2.5 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập triệu chứng của bạn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* 2. NÚT TRÒN BONG BÓNG (NẮM QUYỀN MỞ/TẮT) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer select-none"
        title={isOpen ? "Đóng chat" : "Mở chat AI Triage"}
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>
    </div>
  );
}