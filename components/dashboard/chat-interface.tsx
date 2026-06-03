"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Contact { id: string; name: string; initials: string; role: string; lastMessage: string | null; unread: number; conversationId: string | null; }
interface Message { id: string; content: string; senderId: string; createdAt: string; }

interface Props { userId: string; userRole: "student" | "counsellor" | "school_admin"; schoolId: string; }

export function ChatInterface({ userId, userRole, schoolId }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadContacts(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadContacts() {
    const supabase = createClient() as any;
    const targetRole = userRole === "student" ? ["counsellor", "school_admin"] : ["student"];
    const { data: profiles } = await supabase.from("profiles").select("id, first_name, last_name, role").eq("school_id", schoolId).in("role", targetRole);

    // Load conversations
    const { data: conversations } = await supabase.from("chat_conversations").select("id, participant_1, participant_2, last_message_at").or(`participant_1.eq.${userId},participant_2.eq.${userId}`);

    const convMap = new Map<string, string>();
    for (const c of (conversations ?? [])) {
      const otherId = c.participant_1 === userId ? c.participant_2 : c.participant_1;
      convMap.set(otherId, c.id);
    }

    setContacts((profiles ?? []).filter((p: any) => p.id !== userId).map((p: any) => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase(),
      role: p.role,
      lastMessage: null,
      unread: 0,
      conversationId: convMap.get(p.id) ?? null,
    })));
  }

  async function selectContact(contact: Contact) {
    setSelected(contact);
    if (contact.conversationId) {
      await loadMessages(contact.conversationId);
    } else {
      setMessages([]);
    }
  }

  async function loadMessages(convId: string) {
    const supabase = createClient() as any;
    const { data } = await supabase.from("chat_messages").select("id, content, sender_id, created_at").eq("conversation_id", convId).order("created_at");
    setMessages((data ?? []).map((m: any) => ({ id: m.id, content: m.content, senderId: m.sender_id, createdAt: m.created_at })));
  }

  async function handleSend() {
    if (!input.trim() || !selected) return;
    setSending(true);
    const supabase = createClient() as any;

    let convId = selected.conversationId;
    if (!convId) {
      const { data: conv } = await supabase.from("chat_conversations").insert({
        school_id: schoolId, participant_1: userId, participant_2: selected.id,
      }).select("id").single();
      convId = conv?.id;
      if (convId) {
        setSelected({ ...selected, conversationId: convId });
        setContacts(contacts.map(c => c.id === selected.id ? { ...c, conversationId: convId! } : c));
      }
    }

    if (convId) {
      await supabase.from("chat_messages").insert({ conversation_id: convId, sender_id: userId, content: input });
      await supabase.from("chat_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convId);
      setInput("");
      await loadMessages(convId);
    }
    setSending(false);
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Contact list */}
      <div className="w-[260px] flex-shrink-0 border-r border-cream-mid bg-white overflow-y-auto">
        <div className="p-3 border-b border-cream-mid">
          <div className="text-[0.65rem] font-semibold tracking-widest uppercase text-slate-400">Messages</div>
        </div>
        {contacts.map(c => (
          <div key={c.id} onClick={() => selectContact(c)} className={`flex items-center gap-2.5 px-3 py-3 border-b border-cream-mid cursor-pointer transition-colors ${selected?.id === c.id ? "bg-cream" : "hover:bg-cream/50"}`}>
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[0.65rem] font-semibold text-white flex-shrink-0">{c.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-navy truncate">{c.name}</div>
              <div className="text-[0.65rem] text-slate-400 capitalize">{c.role === "school_admin" ? "School Admin" : c.role}</div>
            </div>
            {c.conversationId && <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />}
          </div>
        ))}
        {contacts.length === 0 && <div className="text-center text-sm text-slate-300 py-8">No contacts</div>}
      </div>

      {/* Chat area */}
      {selected ? (
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b border-cream-mid bg-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[0.65rem] font-semibold text-white">{selected.initials}</div>
            <div><div className="text-sm font-medium text-navy">{selected.name}</div><div className="text-[0.62rem] text-slate-400 capitalize">{selected.role}</div></div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-cream">
            {messages.map(m => {
              const isMine = m.senderId === userId;
              return (
                <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-3.5 py-2 rounded-xl text-sm ${isMine ? "bg-navy text-white rounded-br-sm" : "bg-white text-navy border border-cream-mid rounded-bl-sm"}`}>
                    {m.content}
                    <div className={`text-[0.6rem] mt-1 ${isMine ? "text-white/40" : "text-slate-400"}`}>
                      {new Date(m.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && <div className="text-center text-sm text-slate-300 py-12">Start a conversation</div>}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-cream-mid bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1 px-3 py-2 border border-cream-mid rounded-lg text-sm text-navy outline-none focus:border-navy"
              placeholder="Type a message…"
            />
            <button onClick={handleSend} disabled={sending || !input.trim()} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium disabled:opacity-50">Send</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center"><div className="text-sm text-slate-300">Select a contact to start chatting</div></div>
      )}
    </div>
  );
}
