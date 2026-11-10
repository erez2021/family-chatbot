
"use client";

import { useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Language = "he" | "en";


const suggestedQuestions = {
  he: [
    "מה הכינויים של איתם? 🧸",
    "איפה טיילנו בעולם? ✈️",
  ],
  en: [
    "What are Itam's nicknames? 🧸",
    "Which countries have we visited? ✈️",
  ],
};


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


async function sendMessage(text: string) {
  if (!text.trim() || loading) return;

  const updatedMessages: Message[] = [
    ...messages,
    { role: "user", content: text.trim() },
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



  return (
    <main className="chat-container" dir={isHebrew ? "rtl" : "ltr"}>

<div className="language-bar">
  <button
    type="button"
    className={`language-button ${isHebrew ? "active" : ""}`}
    onClick={() => setLanguage("he")}
    aria-pressed={isHebrew}
  >
    עברית
  </button>

  <button
    type="button"
    className={`language-button ${!isHebrew ? "active" : ""}`}
    onClick={() => setLanguage("en")}
    aria-pressed={!isHebrew}
  >
    English
  </button>
</div>


      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
          >
           {index === 0 && messages.length === 1
  ? isHebrew
    ? "שלום! מה תרצו לדעת על המשפחה שלנו? 😊"
    : "Hi! What would you like to know about our family? 😊"
  : message.content}
          </div>
        ))}

{messages.length === 1 && (
  <div className="suggestions">
    <p className="suggestions-title">
      {isHebrew
        ? "אפשר להתחיל עם אחת מהשאלות:"
        : "Try one of these questions:"}
    </p>

    <div className="suggestions-grid">
      {suggestedQuestions[language].map((question) => (
        <button
          key={question}
          type="button"
          className="suggestion-button"
          onClick={() => sendMessage(question)}
          disabled={loading}
        >
          {question}
        </button>
      ))}
    </div>
  </div>
)}

        {loading && (
          <div className="message assistant">
            {isHebrew ? "חושב..." : "Thinking..."}
          </div>
        )}
      </div>

      <form
  className="input-area"
  onSubmit={(e) => {
    e.preventDefault();
    sendMessage(input);
  }}
>
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
