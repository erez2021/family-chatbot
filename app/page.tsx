
"use client";

import { useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Language = "he" | "en";

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "שלום! מה תרצו לדעת על המשפחה שלנו? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isHebrew = language === "he";

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          language,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isHebrew
            ? "מצטער, משהו השתבש."
            : "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function changeLanguage() {
    setLanguage((prev) => (prev === "he" ? "en" : "he"));
  }

  return (
    <main className="chat-container" dir={isHebrew ? "rtl" : "ltr"}>
      <div className="language-bar">
        <button
          className="language-button"
          onClick={changeLanguage}
          type="button"
        >
          {isHebrew ? "English" : "עברית"}
        </button>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            {isHebrew ? "חושב..." : "Thinking..."}
          </div>
        )}
      </div>

      <form className="input-area" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isHebrew
              ? "שאלו כל דבר על המשפחה..."
              : "Ask anything about our family..."
          }
          dir={isHebrew ? "rtl" : "ltr"}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label={isHebrew ? "שליחה" : "Send"}
        >
          ➤
        </button>
      </form>
    </main>
  );
}
