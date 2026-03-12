import { useState, useEffect, useCallback } from "react";
import { initAuth } from "./firebase.js";
import {
  subscribeToGroups, createGroup, saveGroup, deleteGroup as dbDeleteGroup,
  saveToHistory, getAllHistory
} from "./db.js";
import { getTodayContext, generateForGroup } from "./ai.js";
import GroupForm from "./GroupForm.jsx";
import HistoryView from "./HistoryView.jsx";
import { CSS } from "./styles.js";

// ─── ICONS ────────────────────────────────────────────────────────────────────
export const I = {
  Plus:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Refresh:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Copy:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Zap:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Key:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Back:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Globe:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Chat:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Db:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
};

export const newGroup = () => ({
  id: Date.now().toString(),
  emoji: "💬", name: "", description: "",
  tone: "Casual & Warm", topics: "", avoid: "",
  frequency: "Every day", knowledgeDump: "", conversationDump: "",
});

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [userId, setUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [generated, setGenerated] = useState({});
  const [generating, setGenerating] = useState({});
  const [genAll, setGenAll] = useState(false);
  const [copied, setCopied] = useState({});
  const [special, setSpecial] = useState({});
  const [view, setView] = useState("dash");
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [histTarget, setHistTarget] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gm_apikey") || "");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = getTodayContext();

  // ── Init Firebase Auth ─────────────────────────────────────────────────────
  useEffect(() => {
    initAuth().then(uid => {
      setUserId(uid);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Subscribe to groups from Firestore ────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToGroups(userId, setGroups);
    return () => unsub();
  }, [userId]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Generate single group message ─────────────────────────────────────────
  const generate = async (group) => {
    if (!apiKey) { setShowKeyModal(true); return; }
    setGenerating(p => ({ ...p, [group.id]: true }));
    try {
      const history = await getAllHistory(userId, group.id);
      const text = await generateForGroup(group, history, today, apiKey, special[group.id] || "");
      setGenerated(p => ({ ...p, [group.id]: text }));
      await saveToHistory(userId, group.id, text);
    } catch (e) { notify("❌ " + e.message); }
    setGenerating(p => ({ ...p, [group.id]: false }));
  };

  // ── Generate all groups ────────────────────────────────────────────────────
  const generateAll = async () => {
    if (!apiKey) { setShowKeyModal(true); return; }
    if (!groups.length) return;
    setGenAll(true);
    for (const g of groups) {
      setGenerating(p => ({ ...p, [g.id]: true }));
      try {
        const history = await getAllHistory(userId, g.id);
        const text = await generateForGroup(g, history, today, apiKey, special[g.id] || "");
        setGenerated(p => ({ ...p, [g.id]: text }));
        await saveToHistory(userId, g.id, text);
      } catch (e) {}
      setGenerating(p => ({ ...p, [g.id]: false }));
      await new Promise(r => setTimeout(r, 800));
    }
    setGenAll(false);
    notify("✅ All messages generated!");
  };

  const copy = (gid, text) => {
    navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [gid]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [gid]: false })), 2000);
    notify("📋 Copied!");
  };

  const handleSaveGroup = async (data) => {
    if (editId) {
      await saveGroup(userId, data);
      notify("✅ Group updated!");
    } else {
      await createGroup(userId, data);
      notify("✅ Group added!");
    }
    setView("dash"); setEditId(null); setFormData(null);
  };

  const handleDeleteGroup = async (id) => {
    if (!confirm("Delete this group? This cannot be undone.")) return;
    await dbDeleteGroup(userId, id);
    const g2 = { ...generated }; delete g2[id]; setGenerated(g2);
    notify("Group deleted.");
  };

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    setApiKey(k);
    localStorage.setItem("gm_apikey", k);
    setShowKeyModal(false);
    notify("✅ API key saved!");
  };

  const genCount = Object.values(generated).filter(Boolean).length;
  const total = groups.length;

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
        <div className="spin" style={{ fontSize: 40 }}>💬</div>
        <div style={{ color: "var(--muted2)", fontSize: 14 }}>Connecting to database...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-l">
            <div className="logo">💬</div>
            <div>
              <div className="app-title">GroupMind</div>
              <div className="app-sub">WhatsApp Intelligence Dashboard · Brandash Media</div>
            </div>
          </div>
          <div className="hdr-r">
            {view !== "dash" && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setView("dash"); setEditId(null); setFormData(null); }}>
                <I.Back /> Back
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--green)", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", padding: "5px 10px", borderRadius: 20 }}>
              <I.Db /> <span>Firebase Live</span>
            </div>
            <button className="btn btn-sec btn-sm" onClick={() => { setKeyInput(apiKey); setShowKeyModal(true); }}>
              <I.Key /> <span>{apiKey ? "API ✓" : "Set API Key"}</span>
            </button>
          </div>
        </div>

        {/* ── DASHBOARD ── */}
        {view === "dash" && <>

          {/* TODAY BANNER */}
          <div className="today">
            <div className="today-date">
              📅 {today.fullDate}
              {today.isMonday && <span className="badge badge-blue">New Week 🌅</span>}
              {today.isFriday && <span className="badge badge-green">Friday 🎉</span>}
              {today.isSunday && <span className="badge badge-purple">Sunday 🙏</span>}
              {today.isWeekend && !today.isSunday && <span className="badge badge-gold">Weekend ✨</span>}
            </div>
            {today.event && (
              <div className="today-event"><I.Globe /> {today.event}</div>
            )}
          </div>

          {/* GENERATE ALL */}
          {groups.length > 0 && <>
            <button className="gen-all" onClick={generateAll} disabled={genAll || !groups.length}>
              {genAll
                ? <><span className="spin"><I.Zap /></span> Generating for all groups...</>
                : <><I.Zap /> Generate All {groups.length} Group Messages</>
              }
            </button>
            {genCount > 0 && (
              <div className="prog-wrap">
                <div className="prog-meta">
                  <span>{genCount} of {total} ready to send</span>
                  <span>{Math.round((genCount / total) * 100)}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(genCount / total) * 100}%` }} />
                </div>
              </div>
            )}
          </>}

          {/* SECTION HEADER */}
          <div className="sec-hdr">
            <div className="sec-label"><I.Chat /> Your Groups ({groups.length})</div>
            <button className="btn btn-gold btn-sm" onClick={() => { setEditId(null); setFormData(newGroup()); setView("form"); }}>
              <I.Plus /> Add Group
            </button>
          </div>

          {/* EMPTY STATE */}
          {groups.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📱</div>
              <div className="empty-title">No groups yet</div>
              <div className="empty-sub">Add your first WhatsApp group and train it with deep knowledge about your community. Everything saves automatically to Firebase.</div>
              <button className="btn btn-gold" onClick={() => { setEditId(null); setFormData(newGroup()); setView("form"); }}>
                <I.Plus /> Add Your First Group
              </button>
            </div>
          )}

          {/* GROUP CARDS */}
          <div className="groups">
            {groups.map(g => (
              <div className="card" key={g.id}>
                <div className="card-top">
                  <div className="g-emoji">{g.emoji}</div>
                  <div className="g-info">
                    <div className="g-name">{g.name}</div>
                    <div className="g-meta">
                      <span className="badge badge-gold">{g.tone}</span>
                      <span style={{ fontSize: 11, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 4 }}>
                        <I.Clock />{g.frequency}
                      </span>
                    </div>
                  </div>
                  <div className="g-actions">
                    <button className="btn btn-ghost btn-xs" title="Message History" onClick={() => { setHistTarget(g); setView("history"); }}>
                      <I.Clock />
                    </button>
                    <button className="btn btn-ghost btn-xs" title="Edit Group" onClick={() => { setEditId(g.id); setFormData({ ...g }); setView("form"); }}>
                      <I.Edit />
                    </button>
                    <button className="btn btn-ghost btn-xs" style={{ color: "var(--red)" }} title="Delete" onClick={() => handleDeleteGroup(g.id)}>
                      <I.Trash />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <textarea
                    className="special-input"
                    placeholder="💡 Special instruction for today (e.g. 'focus on upcoming exam', 'reference last Sunday's sermon', 'something about the holiday')..."
                    value={special[g.id] || ""}
                    onChange={e => setSpecial(p => ({ ...p, [g.id]: e.target.value }))}
                  />
                  {generated[g.id] ? <>
                    <div className="content-box">{generated[g.id]}</div>
                    <div className="content-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => generate(g)} disabled={generating[g.id]}>
                        {generating[g.id] ? <span className="spin"><I.Refresh /></span> : <I.Refresh />} Regenerate
                      </button>
                      <button className={`btn btn-sm ${copied[g.id] ? "btn-green" : "btn-sec"}`} onClick={() => copy(g.id, generated[g.id])}>
                        {copied[g.id] ? <><I.Check /> Copied!</> : <><I.Copy /> Copy</>}
                      </button>
                    </div>
                  </> : (
                    <button className="btn btn-sec btn-full" style={{ marginTop: 10 }} onClick={() => generate(g)} disabled={generating[g.id]}>
                      {generating[g.id]
                        ? <><span className="spin"><I.Zap /></span> Generating...</>
                        : <><I.Zap /> Generate Message</>
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ── FORM ── */}
        {view === "form" && formData && (
          <GroupForm
            data={formData}
            isEdit={!!editId}
            onSave={handleSaveGroup}
            onCancel={() => { setView("dash"); setEditId(null); setFormData(null); }}
          />
        )}

        {/* ── HISTORY ── */}
        {view === "history" && histTarget && (
          <HistoryView
            group={histTarget}
            userId={userId}
          />
        )}
      </div>

      {/* API KEY MODAL */}
      {showKeyModal && (
        <div className="overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔑 Anthropic API Key</div>
            <div className="modal-desc">
              Your API key is stored only in your browser — never in Firebase or any server.
              Get yours free at <strong style={{ color: "var(--gold)" }}>console.anthropic.com</strong>
            </div>
            <input
              className="inp" type="password" placeholder="sk-ant-api03-..."
              value={keyInput} onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveKey()}
              autoFocus
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }} onClick={saveKey}>
                Save Key
              </button>
              <button className="btn btn-sec" onClick={() => setShowKeyModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast"><I.Check /> {toast}</div>}
    </>
  );
}
