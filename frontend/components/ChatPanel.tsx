"use client";

import { FormEvent, useState } from "react";
import { sendChat } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Ask me about jobs, prices, invoices, or scheduling." }]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || isSending) return;
    const text = message.trim();
    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setMessage("");
    setIsSending(true);
    try {
      const res = await sendChat(text, nextMessages.slice(1));
      setMessages([...nextMessages, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "The assistant is unavailable. Please check the backend connection." }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="rounded-lg border border-line bg-white">
      <div className="border-b border-line px-4 py-3"><h2 className="font-semibold text-ink">AI Assistant</h2></div>
      <div className="flex h-80 flex-col">
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {messages.map((item, index) => (
            <div key={item.role + index} className={(item.role === "user" ? "ml-auto bg-brand text-white" : "bg-slate-100 text-ink") + " max-w-[85%] rounded-lg px-3 py-2 text-sm"}>{item.content}</div>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3">
          <input className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message TradeMate AI" />
          <button className="h-10 rounded-md bg-brand px-4 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60" disabled={isSending} type="submit">Send</button>
        </form>
      </div>
    </section>
  );
}
