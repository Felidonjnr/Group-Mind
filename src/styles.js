export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080d1a;--s1:#0e1628;--s2:#131d32;--s3:#1a2540;
  --border:#1e2e4a;--border2:#243555;
  --gold:#f0b429;--gold2:#ffd166;--gold3:rgba(240,180,41,0.08);
  --wa:#25D366;--wa2:#128C7E;
  --blue:#3b82f6;--green:#10b981;--red:#ef4444;--purple:#8b5cf6;
  --text:#dde4f0;--muted:#4e637a;--muted2:#6b84a0;
  --r:12px;--r2:8px;
}
body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
.app{max-width:860px;margin:0 auto;padding:24px 16px 100px}

.hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.hdr-l{display:flex;align-items:center;gap:12px}
.logo{width:44px;height:44px;background:linear-gradient(135deg,var(--wa),var(--wa2));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 20px rgba(37,211,102,0.2)}
.app-title{font-family:'Syne',sans-serif;font-size:21px;font-weight:800;letter-spacing:-0.3px}
.app-sub{font-size:11px;color:var(--muted2);margin-top:2px}
.hdr-r{display:flex;gap:8px;align-items:center}

.btn{display:inline-flex;align-items:center;gap:7px;padding:8px 15px;border-radius:var(--r2);font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;border:none;cursor:pointer;transition:all .18s;letter-spacing:.1px}
.btn-gold{background:var(--gold);color:#0a0f1e}.btn-gold:hover{background:var(--gold2);transform:translateY(-1px)}
.btn-wa{background:linear-gradient(135deg,var(--wa),var(--wa2));color:#fff}
.btn-sec{background:var(--s2);color:var(--text);border:1px solid var(--border2)}.btn-sec:hover{background:var(--s3)}
.btn-ghost{background:transparent;color:var(--muted2)}.btn-ghost:hover{color:var(--text);background:var(--s2)}
.btn-green{background:var(--green);color:#fff}
.btn-sm{padding:6px 11px;font-size:12px;border-radius:6px;gap:5px}
.btn-xs{padding:4px 9px;font-size:11px;border-radius:5px;gap:4px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.btn-full{width:100%;justify-content:center;padding:13px}

.today{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.today-date{font-family:'Syne',sans-serif;font-size:14px;font-weight:800;color:var(--gold);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.today-event{display:flex;align-items:center;gap:7px;background:rgba(240,180,41,.1);border:1px solid rgba(240,180,41,.2);border-radius:20px;padding:5px 13px;font-size:12px;color:var(--gold2);font-weight:600}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px}
.badge-blue{background:rgba(59,130,246,.12);color:var(--blue);border:1px solid rgba(59,130,246,.2)}
.badge-green{background:rgba(16,185,129,.12);color:var(--green);border:1px solid rgba(16,185,129,.2)}
.badge-gold{background:rgba(240,180,41,.1);color:var(--gold);border:1px solid rgba(240,180,41,.2)}
.badge-purple{background:rgba(139,92,246,.12);color:var(--purple);border:1px solid rgba(139,92,246,.2)}

.gen-all{width:100%;padding:15px;font-size:15px;font-weight:800;font-family:'Syne',sans-serif;border-radius:var(--r);margin-bottom:8px;background:linear-gradient(135deg,var(--wa) 0%,var(--wa2) 100%);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;letter-spacing:.2px}
.gen-all:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 30px rgba(37,211,102,.25)}
.gen-all:disabled{opacity:.5;cursor:not-allowed;transform:none}

.prog-wrap{margin-bottom:20px}
.prog-meta{display:flex;justify-content:space-between;font-size:11px;color:var(--muted2);margin-bottom:6px}
.prog-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--wa),var(--wa2));border-radius:2px;transition:width .4s ease}

.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sec-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:6px}

.groups{display:grid;gap:12px}
.card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:border-color .2s}
.card:hover{border-color:var(--border2)}
.card-top{padding:16px 18px;display:flex;align-items:center;gap:12px}
.g-emoji{width:44px;height:44px;background:var(--s2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.g-info{flex:1;min-width:0}
.g-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g-meta{display:flex;align-items:center;gap:7px;margin-top:4px;flex-wrap:wrap}
.g-actions{display:flex;align-items:center;gap:5px}
.card-body{padding:0 18px 18px}

.special-input{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:10px 13px;font-size:12.5px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .2s;resize:none;height:40px;line-height:1.5}
.special-input::placeholder{color:var(--muted)}
.special-input:focus{border-color:var(--gold);height:76px}

.content-box{background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:14px;font-size:13.5px;line-height:1.75;color:var(--text);white-space:pre-wrap;margin-top:10px}
.content-actions{display:flex;align-items:center;gap:7px;margin-top:8px;justify-content:flex-end}

.empty{text-align:center;padding:56px 20px;color:var(--muted2)}
.empty-icon{font-size:52px;margin-bottom:16px}
.empty-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);margin-bottom:8px}
.empty-sub{font-size:13px;margin-bottom:24px;line-height:1.6;max-width:400px;margin-left:auto;margin-right:auto}

.page{animation:fadeUp .22s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.form-hdr{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.form-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.full{grid-column:1/-1}
.field{display:flex;flex-direction:column;gap:6px}
.lbl{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.7px}
.inp,.sel,.ta{background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:11px 14px;font-size:13.5px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border-color .2s;width:100%}
.inp:focus,.sel:focus,.ta:focus{border-color:var(--gold)}
.ta{resize:vertical;min-height:120px;line-height:1.65}
.ta-xl{min-height:180px}
.sel option{background:var(--s2)}
.emoji-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px}
.emo{width:38px;height:38px;background:var(--s2);border:2px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:19px;cursor:pointer;transition:all .15s}
.emo:hover,.emo.on{border-color:var(--gold);background:var(--gold3)}
.char{font-size:10px;color:var(--muted);text-align:right;margin-top:3px}
.form-actions{display:flex;gap:10px;margin-top:24px}

.k-card{background:var(--s1);border:1px solid var(--border);border-radius:var(--r);padding:18px;margin-bottom:14px}
.k-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:var(--gold);margin-bottom:5px}
.k-desc{font-size:12px;color:var(--muted2);margin-bottom:12px;line-height:1.6}

.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;backdrop-filter:blur(6px)}
.modal{background:var(--s1);border:1px solid var(--border2);border-radius:16px;padding:30px;max-width:460px;width:100%}
.modal-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;margin-bottom:8px}
.modal-desc{font-size:13px;color:var(--muted2);line-height:1.65;margin-bottom:18px}

.h-item{background:var(--s2);border:1px solid var(--border);border-radius:var(--r2);padding:14px;margin-bottom:9px}
.h-date{font-size:10px;color:var(--muted2);margin-bottom:7px}
.h-text{font-size:13.5px;line-height:1.75;white-space:pre-wrap}

.toast{position:fixed;bottom:24px;right:24px;background:var(--s1);border:1px solid var(--green);color:var(--green);padding:11px 16px;border-radius:10px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:999;animation:slideIn .3s ease}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
.spin{animation:rotate 1s linear infinite;display:inline-block}
@keyframes rotate{to{transform:rotate(360deg)}}

@media(max-width:600px){
  .grid2{grid-template-columns:1fr}
  .today{flex-direction:column}
  .hdr-r .btn span{display:none}
  .hdr-r > div span{display:none}
}
`;
