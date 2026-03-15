import { useState, useEffect } from "react";
import { auth, registerUser, loginUser, logOut, initAuth } from "./firebase.js";
import {
  subscribeToGroups, createGroup, saveGroup, deleteGroup as dbDeleteGroup,
  saveToHistory, getAllHistory
} from "./db.js";
import { getTodayContext, generateForGroup } from "./ai.js";
import GroupForm from "./GroupForm.jsx";
import HistoryView from "./HistoryView.jsx";
import { CSS } from "./styles.js";

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
  Mail:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

export const newGroup = () => ({
  id: Date.now().toString(),
  emoji: "💬", name: "", description: "",
  tone: "Casual & Warm", topics: "", avoid: "",
  frequency: "Every day", knowledgeDump: "", conversationDump: "",
});

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authWorking, setAuthWorking] = useState(false);
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
  const today = getTodayContext();

  useEffect(() => {
    initAuth().then(u => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToGroups(user.uid, setGroups);
    return () => unsub();
  }, [user]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleAuth = async () => {
    setAuthError("");
    setAuthWorking(true);
    try {
      if (authMode === "register") {
        const result = await registerUser(email, password);
        setUser(result.user);
        notify("✅ Account created!");
      } else {
        const result = await loginUser(email, password);
        setUser(result.user);
        notify("✅ Welcome back!");
      }
    } catch (e) {
      const msg = e.code === "auth/user-not-found" ? "No account found with this email." :
                  e.code === "auth/wrong-password" ? "Incorrect password." :
                  e.code === "auth/email-already-in-use" ? "Email already registered. Please sign in." :
                  e.code === "auth/weak-password" ? "Password must be at least 6 characters." :
                  e.code === "auth/invalid-email" ? "Please enter a valid email address." :
                  e.code === "auth/invalid-credential" ? "Incorrect email or password." :
                  "Something went wrong. Try again.";
      setAuthError(msg);
    }
    setAuthWorking(false);
  };

  const handleSignOut = async () => {
    await logOut();
    setUser(null);
    setGroups([]);
    setGenerated({});
  };

  const generate = async (group) => {
    if (!apiKey) { setShowKeyModal(true); return; }
    setGenerating(p => ({ ...p, [group.id]: true }));
    try {
      const history = await getAllHistory(user.uid, group.id);
      const text = await generateForGroup(group, history, today, apiKey, special[group.id] || "");
      setGenerated(p => ({ ...p, [group.id]: text }));
      await saveToHistory(user.uid, group.id, text);
    } catch (e) { notify("❌ " + e.message); }
    setGenerating(p => ({ ...p, [group.id]: false }));
  };

  const generateAll = async () => {
    if (!apiKey) { setShowKeyModal(true); return; }
    if (!groups.length) return;
    setGenAll(true);
    for (const g of groups) {
      setGenerating(p => ({ ...p, [g.id]: true }));
      try {
        const history = await getAllHistory(user.uid, g.id);
        const text = await generateForGroup(g, history, today, apiKey, special[g.id] || "");
        setGenerated(p => ({ ...p, [g.id]: text }));
        await saveToHistory(user.uid, g.id, text);
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
    if (editId) { await saveGroup(user.uid, data); notify("✅ Group updated!"); }
    else { await createGroup(user.uid, data); notify("✅ Group added!"); }
    setView("dash"); setEditId(null); setFormData(null);
  };

  const handleDeleteGroup = async (id) => {
    if (!confirm("Delete this group? This cannot be undone.")) return;
    await dbDeleteGroup(user.uid, id);
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

  if (authLoading) return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:16 }}>
        <div style={{ fontSize:40 }}>💬</div>
        <div style={{ color:"var(--muted2)", fontSize:14 }}>Loading GroupMind...</div>
      </div>
    </>
  );

  if (!user) return (
    <>
      <style>{CSS}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:24 }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg,#25D366,#128C7E)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px", boxShadow:"0 0 30px rgba(37,211,102,0.3)" }}>💬</div>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, marginBottom:6 }}>GroupMind</div>
            <div style={{ fontSize:13, color:"var(--muted2)", marginBottom:4 }}>WhatsApp Intelligence Dashboard</div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>by Brandash Media</div>
          </div>

          <div style={{ background:"var(--s1)", border:"1px solid var(--border)", borderRadius:16, padding:24 }}>
            <div style={{ display:"flex", marginBottom:20, background:"var(--s2)", borderRadius:8, padding:4 }}>
              <button
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                style={{ flex:1, padding:"8px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"Plus Jakarta Sans,sans-serif", fontWeight:700, fontSize:13, background: authMode==="login" ? "var(--gold)" : "transparent", color: authMode==="login" ? "#0a0f1e" : "var(--muted2)", transition:"all .2s" }}
              >Sign In</button>
              <button
                onClick={() => { setAuthMode("register"); setAuthError(""); }}
                style={{ flex:1, padding:"8px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"Plus Jakarta Sans,sans-serif", fontWeight:700, fontSize:13, background: authMode==="register" ? "var(--gold)" : "transparent", color: authMode==="register" ? "#0a0f1e" : "var(--muted2)", transition:"all .2s" }}
              >Create Account</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="field">
                <label className="lbl">Email Address</label>
                <input
                  className="inp"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                />
              </div>
              <div className="field">
                <label className="lbl">Password</label>
                <input
                  className="inp"
                  type="password"
                  placeholder={authMode === "register" ? "Min. 6 characters" : "Your password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                />
              </div>

              {authError && (
                <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--red)" }}>
                  {authError}
                </div>
              )}

              <button
                className="btn btn-gold btn-full"
                style={{ marginTop:4, justifyContent:"center" }}
                onClick={handleAuth}
                disabled={authWorking || !email || !password}
              >
                {authWorking ? "Please wait..." : authMode === "register" ? "Create Account" : "Sign In"}
              </button>
            </div>
          </div>

          <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:"var(--muted)" }}>
            Your data is permanently saved and accessible from any device
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-l">
            <div className="logo">💬</div>
            <div>
              <div className="app-title">GroupMind</div>
              <div className="app-sub">WhatsApp Intelligence · Brandash Media</div>
            </div>
          </div>
          <div className="hdr-r">
            {view !== "dash" && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setView("dash"); setEditId(null); setFormData(null); }}>
                <I.Back /> Back
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleSignOut} style={{ fontSize:11, color:"var(--muted2)" }}>
              Sign Out
            </button>
            <button className="btn btn-sec btn-sm" onClick={() => { setKeyInput(apiKey); setShowKeyModal(true); }}>
              <I.Key /> <span>{apiKey ? "API ✓" : "Set API Key"}</span>
            </button>
          </div>
        </div>

        {view === "dash" && <>
          <div className="today">
            <div className="today-date">
              📅 {today.fullDate}
              {today.isMonday && <span className="badge badge-blue">New Week 🌅</span>}
              {today.isFriday && <span className="badge badge-green">Friday 🎉</span>}
              {today.isSunday && <span className="badge badge-purple">Sunday 🙏</span>}
              {today.isWeekend && !today.isSunday && <span className="badge badge-gold">Weekend ✨</span>}
            </div>
            {today.event && <div className="today-event"><I.Globe /> {today.event}</div>}
          </div>

          {groups.length > 0 && <>
            <button className="gen-all" onClick={generateAll} disabled={genAll}>
              {genAll ? <><span className="spin"><I.Zap /></span> Generating...</> : <><I.Zap /> Generate All {groups.length} Group Messages</>}
            </button>
            {genCount > 0 && (
              <div className="prog-wrap">
                <div className="prog-meta"><span>{genCount} of {total} ready</span><span>{Math.round((genCount/total)*100)}%</span></div>
                <div className="prog-bar"><div className="prog-fill" style={{ width:`${(genCount/total)*100}%` }} /></div>
              </div>
            )}
          </>}

          <div className="sec-hdr">
            <div className="sec-label"><I.Chat /> Your Groups ({groups.length})</div>
            <button className="btn btn-gold btn-sm" onClick={() => { setEditId(null); setFormData(newGroup()); setView("form"); }}>
              <I.Plus /> Add Group
            </button>
          </div>

          {groups.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📱</div>
              <div className="empty-title">No groups yet</div>
              <div className="empty-sub">Add your first WhatsApp group and train it with deep knowledge. Everything saves to Firebase — permanent and secure.</div>
              <button className="btn btn-gold" onClick={() => { setEditId(null); setFormData(newGroup()); setView("form"); }}>
                <I.Plus /> Add Your First Group
              </button>
            </div>
          )}

          <div className="groups">
            {groups.map(g => (
              <div className="card" key={g.id}>
                <div className="card-top">
                  <div className="g-emoji">{g.emoji}</div>
                  <div className="g-info">
                    <div className="g-name">{g.name}</div>
                    <div className="g-meta">
                      <span className="badge badge-gold">{g.tone}</span>
                      <span style={{ fontSize:11, color:"var(--muted2)", display:"flex", alignItems:"center", gap:4 }}><I.Clock />{g.frequency}</span>
                    </div>
                  </div>
                  <div className="g-actions">
                    <button className="btn btn-ghost btn-xs" onClick={() => { setHistTarget(g); setView("history"); }}><I.Clock /></button>
                    <button className="btn btn-ghost btn-xs" onClick={() => { setEditId(g.id); setFormData({...g}); setView("form"); }}><I.Edit /></button>
                    <button className="btn btn-ghost btn-xs" style={{ color:"var(--red)" }} onClick={() => handleDeleteGroup(g.id)}><I.Trash /></button>
                  </div>
                </div>
                <div className="card-body">
                  <textarea
                    className="special-input"
                    placeholder="💡 Special instruction for today (optional)..."
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
                    <button className="btn btn-sec btn-full" style={{ marginTop:10 }} onClick={() => generate(g)} disabled={generating[g.id]}>
                      {generating[g.id] ? <><span className="spin"><I.Zap /></span> Generating...</> : <><I.Zap /> Generate Message</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>}

        {view === "form" && formData && (
          <GroupForm data={formData} isEdit={!!editId} onSave={handleSaveGroup} onCancel={() => { setView("dash"); setEditId(null); setFormData(null); }} />
        )}

        {view === "history" && histTarget && (
          <HistoryView group={histTarget} userId={user.uid} />
        )}
      </div>

      {showKeyModal && (
        <div className="overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔑 Anthropic API Key</div>
            <div className="modal-desc">Stored only in your browser. Get yours at <strong style={{ color:"var(--gold)" }}>console.anthropic.com</strong></div>
            <input className="inp" type="password" placeholder="sk-ant-api03-..." value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key==="Enter" && saveKey()} autoFocus />
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button className="btn btn-gold" style={{ flex:1, justifyContent:"center" }} onClick={saveKey}>Save Key</button>
              <button className="btn btn-sec" onClick={() => setShowKeyModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><I.Check /> {toast}</div>}
    </>
  );
}