"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { getCityProfile } from "@/lib/mockData";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  { label: "🍽️ Food & Drink", message: "What are the best restaurants and food?" },
  { label: "🏛️ Top Sights", message: "What sights and landmarks should I see?" },
  { label: "🎉 Activities", message: "What fun activities and things to do are there?" },
  { label: "🌙 Nightlife", message: "What's the nightlife like?" },
  { label: "👨‍👩‍👧 Family", message: "What are good family-friendly options with kids?" },
  { label: "🗝️ Hidden Gems", message: "What hidden gems do locals know about?" },
];

function formatMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-bold text-slate-900 text-base mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      return (
        <p key={i} className="text-slate-500 text-sm italic mb-2">
          {line.replace(/\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("• ")) {
      const text = line.slice(2);
      const formatted = text.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
      return (
        <div key={i} className="flex gap-2 mb-2">
          <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
          <span
            className="text-slate-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        </div>
      );
    }
    if (line === "") return <div key={i} className="h-1" />;
    const formatted = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    return (
      <p
        key={i}
        className="text-slate-700 text-sm leading-relaxed mb-1"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function ChatInterface({ citySlug }: { citySlug: string }) {
  const cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
  const profile = getCityProfile(cityName);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const send = async () => {
      setLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: cityName, message: "hello" }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.response }]);
      setLoading(false);
    };
    send();
  }, [cityName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setShowQuickReplies(false);
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: cityName, message: text }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    setLoading(false);
    inputRef.current?.focus();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
          aria-label="Back"
        >
          ←
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl">{profile.emoji}</span>
          <div className="min-w-0">
            <h1 className="font-bold text-slate-900 text-base leading-tight truncate">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-500 truncate">{profile.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-500">Concierge ready</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-sm mt-1">
                🗺️
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm">{msg.content}</p>
              ) : (
                <div className="space-y-0.5">{formatMessage(msg.content)}</div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm mt-1">
                ✈️
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm mt-1">
              🗺️
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Quick reply buttons (shown only before first user message) */}
        {showQuickReplies && messages.length > 0 && !loading && (
          <div className="pl-11">
            <p className="text-xs text-slate-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map(({ label, message }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(message)}
                  className="text-sm px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-full transition-colors shadow-sm"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${profile.name}...`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-400 focus:bg-white text-slate-800 placeholder-slate-400 text-sm transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium text-sm"
          >
            Send
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-2">
          Powered by City Bucket List Concierge
        </p>
      </div>
    </div>
  );
}
