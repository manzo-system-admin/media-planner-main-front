"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import styles from "./page.module.css";

type Message = {
  id: string;
  from: "user" | "agent" | "bot";
  text: string;
  createdAt?: Timestamp;
};

export default function ChatThreadPage() {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [botEnabled, setBotEnabled] = useState(true);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [reply, setReply] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firebaseDb = getFirebaseDb();
    const unsubMessages = onSnapshot(
      query(collection(firebaseDb, "chatConversations", params.id, "messages"), orderBy("createdAt", "asc")),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) }))
        );
      }
    );
    const unsubConversation = onSnapshot(doc(firebaseDb, "chatConversations", params.id), (snap) => {
      setBotEnabled(snap.data()?.botEnabled !== false);
      setVisitorName(snap.data()?.visitorName ?? "");
      setVisitorEmail(snap.data()?.visitorEmail ?? "");
    });
    return () => {
      unsubMessages();
      unsubConversation();
    };
  }, [params.id]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  const sendReply = async () => {
    const text = reply.trim();
    if (!text) return;
    setReply("");
    await addDoc(collection(getFirebaseDb(), "chatConversations", params.id, "messages"), {
      from: "agent",
      text,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(getFirebaseDb(), "chatConversations", params.id), {
      lastMessageAt: serverTimestamp(),
    });
  };

  const toggleBot = async () => {
    await updateDoc(doc(getFirebaseDb(), "chatConversations", params.id), { botEnabled: !botEnabled });
  };

  return (
    <div>
      <h1 className={styles.title}>
        {visitorName || "ผู้เข้าชม"}
        {visitorEmail && ` · ${visitorEmail}`}
      </h1>
      <div className={styles.toggleRow}>
        <input type="checkbox" checked={botEnabled} onChange={toggleBot} id="botEnabled" />
        <label htmlFor="botEnabled">เปิดให้บอทตอบอัตโนมัติ (ปิดเมื่อรับเรื่องด้วยตนเอง)</label>
      </div>

      <div className={styles.thread} ref={threadRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.row} ${message.from !== "user" ? styles.rowAgent : ""}`}
          >
            <div
              className={`${styles.bubble} ${
                message.from === "user"
                  ? styles.bubbleUser
                  : message.from === "bot"
                    ? styles.bubbleBot
                    : styles.bubbleAgent
              }`}
            >
              {message.text}
            </div>
            <span className={styles.meta}>
              {message.from === "user" ? "ผู้เข้าชม" : message.from === "bot" ? "บอท" : "แอดมิน"}
            </span>
          </div>
        ))}
      </div>

      <form
        className={styles.replyRow}
        onSubmit={(e) => {
          e.preventDefault();
          sendReply();
        }}
      >
        <input
          className={styles.input}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="ตอบกลับผู้เข้าชม..."
        />
        <button type="submit" className={styles.sendButton}>
          ส่ง
        </button>
      </form>
    </div>
  );
}
