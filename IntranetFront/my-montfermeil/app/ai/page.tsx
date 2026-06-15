"use client";

import { useEffect, useRef, useState } from "react";
import { getSessionItemOrEmpty } from "@/app/utils/sessionStorage";
import "./page.css";
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    const token = getSessionItemOrEmpty("token");

    try {
      const res = await fetch("/api/Montfermeil/ai", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          prompt: prompt,
        }),
      });

      const text = await res.text();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Erreur lors de l'appel à l'IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      {/* HEADER */}
      <div className="ai-header">
        <h1>Assistant IA Montfermeil</h1>
        <p>Pose tes questions à l’IA interne</p>
      </div>

      {/* CHAT */}
      <div className="ai-chat">
        {messages.length === 0 && (
          <div className="ai-empty">
            Commence une discussion avec l’IA 👇
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ai-bubble ${
              msg.role === "user" ? "user" : "assistant"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="ai-bubble assistant typing">
            L’IA réfléchit...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="ai-input-bar">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écris ton message..."
        />

        <button onClick={sendMessage} disabled={loading}>
          Envoyer
        </button>
      </div>
    </div>
  );
}