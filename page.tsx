* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f3f4f6; color: #0f172a; }
button, input, textarea, select { font: inherit; }
.container { max-width: 980px; margin: 0 auto; padding: 14px; }
.hero { background: #0f172a; color: white; border-radius: 26px; padding: 22px; box-shadow: 0 10px 30px rgba(15,23,42,.25); }
.kicker { color: #cbd5e1; text-transform: uppercase; font-size: 12px; letter-spacing: .08em; }
h1 { margin: 6px 0 0; font-size: 28px; line-height: 1.1; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.metric { background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.12); border-radius: 20px; padding: 16px; }
.metricLabel { color: #cbd5e1; font-size: 12px; }
.metricValue { font-size: 36px; font-weight: 800; margin-top: 4px; }
.card { background: white; border-radius: 24px; padding: 16px; margin-top: 14px; box-shadow: 0 1px 6px rgba(15,23,42,.08); }
.tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
.tab { border: 0; border-radius: 16px; padding: 12px; background: #e5e7eb; font-weight: 700; }
.tab.active { background: #0f172a; color: white; }
.rowCard { background: white; border-radius: 24px; padding: 16px; margin-top: 12px; box-shadow: 0 1px 6px rgba(15,23,42,.08); }
.rowHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.badge { display:inline-flex; align-items:center; border-radius: 999px; padding: 6px 10px; background: #0f172a; color: white; font-size: 12px; font-weight: 700; }
.inputs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.inputBox { background: #f1f5f9; border-radius: 16px; padding: 10px; }
.inputBox label { display:block; font-size: 11px; color:#475569; margin-bottom: 6px; font-weight:700; }
input, textarea, select { width:100%; border:1px solid #cbd5e1; border-radius: 12px; padding: 10px; background:white; }
textarea { min-height: 82px; resize: vertical; }
.btn { border:0; border-radius: 14px; padding: 10px 12px; background:#0f172a; color:white; font-weight:700; }
.btn.secondary { background:#e5e7eb; color:#0f172a; }
.btn.danger { background:#fee2e2; color:#991b1b; }
.def { background:#f1f5f9; border-radius: 16px; padding: 12px; margin-top:8px; }
.def strong { display:block; margin-bottom:4px; }
.newsControls { display:grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px; }
.newsItem { border-top:1px solid #e5e7eb; padding: 12px 0; }
.newsItem a { color:#0f172a; font-weight:800; text-decoration:none; }
.newsMeta { font-size:12px; color:#64748b; margin-top:4px; }
.newsSnippet { font-size:14px; color:#334155; margin-top:6px; }
@media (max-width: 700px) {
  .inputs { grid-template-columns: repeat(2, 1fr); }
  .grid2 { grid-template-columns: 1fr 1fr; }
  h1 { font-size: 24px; }
}