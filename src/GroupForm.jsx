import { useState } from "react";
import { newGroup } from "./App.jsx";

const TONES = ["Casual & Warm","Energetic & Motivational","Formal & Professional","Spiritual & Devotional","Educational & Informative","Humorous & Light","Inspirational & Uplifting","Technical & Precise","Pastoral & Nurturing","Street Smart & Relatable"];
const FREQS = ["Every day","Weekdays only","3× per week","Twice a week","Weekly"];
const EMOJIS = ["💬","📚","⛪","💻","🎯","🔥","💡","🌟","🏆","🤝","📣","🎓","💪","🙏","⚡","🧠","🌍","🎉","🕊️","👥","🇳🇬","🎨","🏫","💼","🧑‍💻"];

export default function GroupForm({ data: initial, isEdit, onSave, onCancel }) {
  const [d, setD] = useState({ ...initial });
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const valid = d.name.trim() && d.description.trim();

  return (
    <div className="page">
      <div className="form-hdr">
        <div style={{ fontSize: 40 }}>{d.emoji}</div>
        <div>
          <div className="form-title">{isEdit ? "Edit Group" : "Add New Group"}</div>
          <div style={{ fontSize: 13, color: "var(--muted2)" }}>
            {isEdit ? "Update this group's knowledge and settings" : "Train the AI about this community — saves to Firebase"}
          </div>
        </div>
      </div>

      {/* EMOJI */}
      <div className="k-card">
        <div className="k-title">Choose Group Emoji</div>
        <div className="emoji-row">
          {EMOJIS.map(e => (
            <div key={e} className={`emo ${d.emoji === e ? "on" : ""}`} onClick={() => set("emoji", e)}>{e}</div>
          ))}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="k-card">
        <div className="k-title">📋 Basic Setup</div>
        <div className="grid2">
          <div className="field full">
            <label className="lbl">Group Name *</label>
            <input className="inp" placeholder="e.g. ICT Students Forum, Light Assembly Prayer Warriors..." value={d.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="field full">
            <label className="lbl">Who Are They? *</label>
            <input className="inp" placeholder="e.g. Final year ICT students, mostly 20-24, job-focused, tech-curious..." value={d.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">Tone & Style</label>
            <select className="sel" value={d.tone} onChange={e => set("tone", e.target.value)}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="lbl">Posting Frequency</label>
            <select className="sel" value={d.frequency} onChange={e => set("frequency", e.target.value)}>
              {FREQS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="lbl">Topics They Love</label>
            <input className="inp" placeholder="e.g. Tech tips, job openings, motivational quotes, Bible verses..." value={d.topics} onChange={e => set("topics", e.target.value)} />
          </div>
          <div className="field">
            <label className="lbl">Always Avoid</label>
            <input className="inp" placeholder="e.g. Long messages, political topics, off-topic content..." value={d.avoid} onChange={e => set("avoid", e.target.value)} />
          </div>
        </div>
      </div>

      {/* KNOWLEDGE DUMP */}
      <div className="k-card">
        <div className="k-title">🧠 Deep Knowledge Injection</div>
        <div className="k-desc">
          Free-form brain dump — no rules, no format. Write everything the AI needs to truly understand this group.
          Their culture, history, inside language, what makes them respond, who the key people are, what season they're
          currently in, struggles they face, wins they celebrate. The more detail here, the smarter every message becomes.
        </div>
        <textarea
          className="ta ta-xl"
          placeholder="e.g. This group was started in 2022 by the department president... They love short punchy messages — anything over 5 lines gets ignored... They respond really well to questions that spark debate... Currently stressed about final exams and job hunting... There's a running joke about CGPA that always gets laughs... Group is quiet on Mondays but very active Thursday evenings... Key influencers are Emeka (tech enthusiast) and Grace (always encouraging others)..."
          value={d.knowledgeDump}
          onChange={e => set("knowledgeDump", e.target.value)}
        />
        <div className="char">{d.knowledgeDump.length} characters of knowledge stored</div>
      </div>

      {/* CONVERSATION DUMP */}
      <div className="k-card">
        <div className="k-title">💬 Live Conversation Dump</div>
        <div className="k-desc">
          Paste actual recent conversations, comments, and reactions from this WhatsApp group. The AI reads what members
          are currently discussing, what's buzzing, what questions they're asking — and uses it to make your message feel
          like it came from someone who was right there in the conversation. Update this regularly for the freshest results.
        </div>
        <textarea
          className="ta ta-xl"
          placeholder="Paste actual WhatsApp messages here...&#10;&#10;Example:&#10;Emeka: Who's going for the NIIT certification next month?&#10;Grace: I just finished mine, very worth it 🔥&#10;Peter: How much does it cost?&#10;James: Anyone seen the new AI tools for developers? Crazy stuff&#10;Admin: Poll — how many have started job applications? (23 reacted 🙋)&#10;Mary: Economy not smiling but we move..."
          value={d.conversationDump}
          onChange={e => set("conversationDump", e.target.value)}
        />
        <div className="char">{d.conversationDump.length} characters of conversation context</div>
      </div>

      <div className="form-actions">
        <button
          className="btn btn-gold"
          style={{ flex: 1, justifyContent: "center", padding: "13px" }}
          onClick={() => onSave(d)}
          disabled={!valid}
        >
          {isEdit ? "Save Changes to Firebase" : "Add Group & Save to Firebase"}
        </button>
        <button className="btn btn-sec" style={{ padding: "13px 20px" }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
