import { useState, useEffect } from "react";
import { subscribeToHistory } from "./db.js";
import { I } from "./App.jsx";

export default function HistoryView({ group, userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const unsub = subscribeToHistory(userId, group.id, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsub();
  }, [userId, group.id]);

  const copy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="page">
      <div className="form-hdr">
        <div style={{ fontSize: 40 }}>{group.emoji}</div>
        <div>
          <div className="form-title">{group.name}</div>
          <div style={{ fontSize: 13, color: "var(--muted2)" }}>
            Message History — {messages.length} saved in Firebase
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted2)" }}>
          Loading history from Firebase...
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="empty" style={{ padding: "40px 0" }}>
          <div className="empty-icon">📭</div>
          <div className="empty-title">No history yet</div>
          <div className="empty-sub">Generated messages will be saved here automatically to Firebase — accessible from any device.</div>
        </div>
      )}

      {messages.map((item) => (
        <div className="h-item" key={item.id}>
          <div className="h-date" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <I.Clock />
              {item.date ? new Date(item.date).toLocaleString("en-NG", {
                weekday: "long", year: "numeric", month: "long",
                day: "numeric", hour: "2-digit", minute: "2-digit"
              }) : "Date unavailable"}
            </span>
            <button
              className={`btn btn-xs ${copied === item.id ? "btn-green" : "btn-sec"}`}
              onClick={() => copy(item.id, item.content)}
            >
              {copied === item.id ? <><I.Check /> Copied</> : <><I.Copy /> Copy</>}
            </button>
          </div>
          <div className="h-text">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
