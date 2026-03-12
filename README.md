# GroupMind — WhatsApp Intelligence Dashboard
### Built by Brandash Media

A personal AI-powered dashboard that generates fresh, tailored WhatsApp messages for each of your groups every day. Everything saves to Firebase — accessible from any device, anywhere.

---

## SETUP GUIDE (Read This First)

### STEP 1 — Set Up Firebase (Free)

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `groupmind` → click through the setup
3. On the project homepage, click the **Web icon `</>`** to add a web app
4. Give it a nickname (e.g. `groupmind-web`) → click **Register app**
5. You'll see a `firebaseConfig` object — **copy all the values**
6. Open the file `src/firebase.js` and paste your values in

7. Now set up Firestore:
   - Left sidebar → **Firestore Database** → **Create database**
   - Choose **"Start in test mode"** → select your region → Done

8. Now enable Authentication:
   - Left sidebar → **Authentication** → **Get started**
   - Click **Anonymous** → toggle to **Enable** → Save

---

### STEP 2 — Get Your Anthropic API Key (For AI Generation)

1. Go to **https://console.anthropic.com**
2. Sign up for a free account
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. You'll paste this into the app when you first open it — it's stored only in your browser

---

### STEP 3 — Deploy to Vercel (Free Hosting)

**Option A — Via GitHub (Recommended):**
1. Push this project to a GitHub repository
2. Go to **https://vercel.com** → Sign up with GitHub
3. Click **"Add New Project"** → Import your GitHub repo
4. Vercel will auto-detect it's a Vite/React app
5. Click **Deploy** — live in ~2 minutes
6. You get a free URL like `groupmind-abc123.vercel.app`

**Option B — Via Vercel CLI:**
```bash
npm install -g vercel
npm install
vercel
```

---

### STEP 4 — Run Locally (For Testing)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## FILE STRUCTURE

```
groupmind/
├── index.html              # Entry point
├── package.json            # Dependencies
├── vite.config.js          # Build config
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main dashboard
    ├── GroupForm.jsx       # Add/edit group form
    ├── HistoryView.jsx     # Message history per group
    ├── firebase.js         # Firebase config (YOU FILL THIS IN)
    ├── db.js               # All database operations
    ├── ai.js               # Claude AI generation + calendar intelligence
    └── styles.js           # All CSS styles
```

---

## HOW TO USE IT DAILY

1. Open your GroupMind URL
2. See today's date and any global observances at the top
3. Optionally add a special instruction for any group (e.g. "focus on the upcoming exam")
4. Click **"Generate All Group Messages"** — one click
5. Review each message, edit if needed
6. Click **Copy** and paste directly into WhatsApp
7. Done — under 5 minutes for all your groups

---

## WHAT GETS SAVED TO FIREBASE

| Data | Location |
|------|----------|
| Group profiles | `users/{uid}/groups` |
| Knowledge dumps | Inside group profiles |
| Conversation dumps | Inside group profiles |
| Message history | `users/{uid}/history/{groupId}/messages` |

**Your Anthropic API key is NEVER saved to Firebase — only in your browser's localStorage.**

---

## COST

- Firebase: **Free** (Spark plan — more than enough for personal use)
- Vercel hosting: **Free**
- Anthropic API: ~**$1-2/month** for daily use across 10 groups

---

Built with React + Vite + Firebase + Anthropic Claude API
