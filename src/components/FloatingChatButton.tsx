"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";
import styles from "./FloatingChatButton.module.css";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

type ChatMessage = {
  id: string;
  from: "user" | "agent" | "bot";
  text: string;
  time: string;
};

type ContactInfo = { name: string; email: string };

const CONVERSATION_KEY = "mp_chat_conversation_id";
const CONTACT_KEY = "mp_chat_contact_info";

function getOrCreateConversationId(): string {
  const existing = window.localStorage.getItem(CONVERSATION_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(CONVERSATION_KEY, id);
  return id;
}

function getSavedContactInfo(): ContactInfo | null {
  const raw = window.localStorage.getItem(CONTACT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContactInfo;
  } catch {
    return null;
  }
}

export default function FloatingChatButton({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { chat } = dict;
  const [open, setOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(() =>
    typeof window === "undefined" ? null : getSavedContactInfo()
  );
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [visitorUid, setVisitorUid] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = (ts?: Timestamp) =>
    (ts?.toDate() ?? new Date()).toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (!open || !contactInfo || visitorUid) return;
    conversationIdRef.current = getOrCreateConversationId();
    signInAnonymously(getFirebaseAuth())
      .then((cred) => setVisitorUid(cred.user.uid))
      .catch(() => {});
  }, [open, contactInfo, visitorUid]);

  useEffect(() => {
    const conversationId = conversationIdRef.current;
    if (!conversationId || !visitorUid) return;
    const messagesRef = collection(getFirebaseDb(), "chatConversations", conversationId, "messages");
    const unsubscribe = onSnapshot(query(messagesRef, orderBy("createdAt", "asc")), (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data() as { from: ChatMessage["from"]; text: string; createdAt?: Timestamp };
          return { id: doc.id, from: data.from, text: data.text, time: formatTime(data.createdAt) };
        })
      );
    });
    return unsubscribe;
    // formatTime only depends on `locale`, which doesn't change at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorUid]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, open]);

  useEffect(() => {
    if (open && contactInfo) inputRef.current?.focus();
  }, [open, contactInfo]);

  const submitContactInfo = (event: FormEvent) => {
    event.preventDefault();
    const name = nameDraft.trim();
    const email = emailDraft.trim();
    if (!name || !email) return;
    const info: ContactInfo = { name, email };
    window.localStorage.setItem(CONTACT_KEY, JSON.stringify(info));
    setContactInfo(info);
  };

  const send = async () => {
    const text = draft.trim();
    const conversationId = conversationIdRef.current;
    if (!text || sending || !conversationId || !visitorUid || !contactInfo) return;
    setDraft("");
    setSending(true);
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          visitorUid,
          message: text,
          locale,
          visitorName: contactInfo.name,
          visitorEmail: contactInfo.email,
        }),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <div className={styles.panel} role="dialog" aria-label={chat.title}>
          <div className={styles.header}>
            <span className={styles.avatar}>MP</span>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>{chat.title}</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} />
                {chat.status}
              </span>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label={chat.closeLabel}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {!contactInfo ? (
            <form className={styles.preChat} onSubmit={submitContactInfo}>
              <p className={styles.preChatTitle}>{chat.preChatTitle}</p>
              <p className={styles.preChatDescription}>{chat.preChatDescription}</p>
              <div className={styles.preChatField}>
                <label className={styles.preChatLabel} htmlFor="chat-name">
                  {chat.nameLabel}
                </label>
                <input
                  id="chat-name"
                  type="text"
                  className={styles.preChatInput}
                  placeholder={chat.namePlaceholder}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  required
                />
              </div>
              <div className={styles.preChatField}>
                <label className={styles.preChatLabel} htmlFor="chat-email">
                  {chat.emailLabel}
                </label>
                <input
                  id="chat-email"
                  type="email"
                  className={styles.preChatInput}
                  placeholder={chat.emailPlaceholder}
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.preChatSubmit}>
                {chat.startButton}
              </button>
            </form>
          ) : (
            <>
              <div className={styles.messages} ref={scrollRef} role="log" aria-live="polite">
                {messages.length === 0 && (
                  <div className={styles.messageRow}>
                    <div className={`${styles.bubble} ${styles.bubbleAgent}`}>{chat.welcome}</div>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.messageRow} ${
                      message.from === "user" ? styles.messageRowUser : ""
                    }`}
                  >
                    <div
                      className={`${styles.bubble} ${
                        message.from === "user" ? styles.bubbleUser : styles.bubbleAgent
                      }`}
                    >
                      {message.text}
                    </div>
                    <span className={styles.time}>{message.time}</span>
                  </div>
                ))}
                {sending && (
                  <div className={styles.messageRow}>
                    <div className={`${styles.bubble} ${styles.bubbleAgent} ${styles.typingBubble}`}>
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                    </div>
                  </div>
                )}
              </div>

              <form
                className={styles.inputRow}
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.input}
                  placeholder={chat.placeholder}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles.sendButton}
                  aria-label={chat.sendLabel}
                  disabled={!draft.trim() || sending}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.button}
        aria-label={open ? chat.closeLabel : chat.openLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.4 5.1 3.6 6.7-.1 1-.6 2.3-1.5 3.6 1.9-.3 3.5-1 4.6-1.7 1 .3 2.1.4 3.3.4 5.5 0 10-3.9 10-8.7S17.5 3 12 3z" />
            <circle cx="8.5" cy="11.7" r="1.15" fill="#fff" />
            <circle cx="12" cy="11.7" r="1.15" fill="#fff" />
            <circle cx="15.5" cy="11.7" r="1.15" fill="#fff" />
          </svg>
        )}
      </button>
    </>
  );
}
