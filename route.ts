"use client";

import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, RefreshCw } from "lucide-react";

type Row = {
  week: string;
  demand: number;
  conversion: number;
  constraint: number;
  wfe: number;
  events: string;
};

const initialRows: Row[] = [
  { week: "-13", demand: 4, conversion: 4, constraint: 2, wfe: 3, events: "Early AI demand visible; hyperscaler capex firming" },
  { week: "-12", demand: 4, conversion: 4, constraint: 2, wfe: 3, events: "Data center spend expectations strengthening" },
  { week: "-11", demand: 4, conversion: 4, constraint: 3, wfe: 3, events: "GPU availability pressure emerging" },
  { week: "-10", demand: 4, conversion: 3, constraint: 3, wfe: 3, events: "Power and build constraints starting to show" },
  { week: "-9", demand: 4, conversion: 3, constraint: 4, wfe: 3, events: "Memory / HBM tightening begins" },
  { week: "-8", demand: 4, conversion: 3, constraint: 4, wfe: 3, events: "Constraint formation more visible" },
  { week: "-7", demand: 5, conversion: 3, constraint: 4, wfe: 3, events: "AI capex acceleration; data center build strong" },
  { week: "-6", demand: 5, conversion: 3, constraint: 5, wfe: 3, events: "GPU + memory constraints intensify" },
  { week: "-5", demand: 5, conversion: 3, constraint: 5, wfe: 3, events: "Foundry capex support; constraints remain high" },
  { week: "-4", demand: 5, conversion: 2, constraint: 5, wfe: 3, events: "Power constraints become material timing drag" },
  { week: "-3", demand: 5, conversion: 2, constraint: 5, wfe: 3, events: "Infrastructure delays broaden" },
  { week: "-2", demand: 5, conversion: 2, constraint: 5, wfe: 3, events: "Capex discipline / ROI scrutiny emerges" },
  { week: "Now", demand: 5, conversion: 2, constraint: 5, wfe: 3, events: "Demand intact; conversion constrained; WFE factor pending earnings language" },
];

const topics = ["All Signals", "Hyperscaler CapEx", "Power / Data Centers", "WFE / Front End", "Memory / HBM", "Nuclear / NLR"];

function calcIndex(row: Row) {
  return Math.round((0.35 * row.demand + 0.25 * row.conversion + 0.25 * row.constraint + 0.15 * row.wfe) * 20);
}

function regime(row: Row) {
  if (row.demand <= 2) return "Demand Risk";
  if (row.conversion <= 2 && row.wfe <= 2) return "Slowdown Risk";
  if (row.conversion <= 2 && row.wfe >= 4) return "Pre-Build Extension";
  if (row.conversion <= 2) return "Constraint + Friction";
  if (row.constraint >= 4) return "Constraint";
  return "Expansion";
}

export default function App() {
  const [tab, setTab] = useState<"tracker" | "news">("tracker");
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [topic, setTopic] = useState("All Signals");
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState("");

  const chartData = useMemo(() => rows.map((r) => ({ week: r.week, index: calcIndex(r) })), [rows]);
  const latest = rows[rows.length - 1];
  const latestIndex = calcIndex(latest);

  const updateCell = (i: number, field: keyof Row, value: string) => {
    setRows((prev) => prev.map((row, idx) => {
      if (idx !== i) return row;
      if (field === "week" || field === "events") return { ...row, [field]: value };
      return { ...row, [field]: Math.max(1, Math.min(5, Number(value) || 1)) };
    }));
  };

  const addWeek = () => {
    const last = rows[rows.length - 1];
    setRows([...rows, { ...last, week: `W${rows.length + 1}`, events: "Add key events / earnings language here" }]);
  };

  const loadNews = async (selected = topic) => {
    setLoadingNews(true);
    try {
      const res = await fetch(`/api/news?topic=${encodeURIComponent(selected)}`);
      const data = await res.json();
      setNews(data.items || []);
      setRefreshedAt(data.refreshedAt || "");
    } finally {
      setLoadingNews(false);
    }
  };

  React.useEffect(() => { loadNews(topic); }, []);

  return (
    <main className="container">
      <section className="hero">
        <div className="kicker">Semiconductor Super Cycle</div>
        <h1>Weekly Index Tracker</h1>
        <div className="grid2">
          <div className="metric">
            <div className="metricLabel">Current Index</div>
            <div className="metricValue">{latestIndex}</div>
          </div>
          <div className="metric">
            <div className="metricLabel">Regime</div>
            <div style={{fontSize: 20, fontWeight: 800, marginTop: 8}}>{regime(latest)}</div>
          </div>
        </div>
      </section>

      <div className="tabs">
        <button className={`tab ${tab === "tracker" ? "active" : ""}`} onClick={() => setTab("tracker")}>Index</button>
        <button className={`tab ${tab === "news" ? "active" : ""}`} onClick={() => setTab("news")}>News Feeds</button>
      </div>

      {tab === "tracker" && (
        <>
          <section className="card">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap: 10}}>
              <h2 style={{margin:0}}>Trend</h2>
              <button className="btn" onClick={addWeek}><Plus size={16}/> Add Week</button>
            </div>
            <div style={{height: 220, marginTop: 8}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="index" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card">
            <h2 style={{marginTop:0}}>Definitions</h2>
            <div className="def"><strong>Demand (D)</strong>Hyperscaler AI capex, data center demand, and silicon demand intent. 1 = declining, 5 = accelerating.</div>
            <div className="def"><strong>Conversion (C)</strong>Ability to convert demand into deployed infrastructure. Includes power, grid access, construction, permitting, and cooling. 1 = severe delays, 5 = fast conversion.</div>
            <div className="def"><strong>Constraint (K)</strong>GPU, HBM/memory, front-end component, and supply bottleneck pressure. 1 = loose, 5 = severe constraints.</div>
            <div className="def"><strong>WFE Factor</strong>Whether wafer fab equipment customers are pre-building or deferring. 1 = deferral, 3 = neutral, 5 = strong pre-build.</div>
            <div className="def"><strong>Index Formula</strong>Index = (0.35×D + 0.25×C + 0.25×K + 0.15×WFE) × 20</div>
          </section>

          {rows.map((row, i) => (
            <section className="rowCard" key={`${row.week}-${i}`}>
              <div className="rowHead">
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <input style={{width: 76, fontWeight: 800}} value={row.week} onChange={(e) => updateCell(i, "week", e.target.value)} />
                  <span className="badge">Index {calcIndex(row)}</span>
                </div>
                <button className="btn danger" onClick={() => setRows(rows.filter((_, idx) => idx !== i))}><Trash2 size={16}/></button>
              </div>

              <div className="inputs">
                {[
                  ["Demand", "demand"],
                  ["Conversion", "conversion"],
                  ["Constraint", "constraint"],
                  ["WFE", "wfe"],
                ].map(([label, field]) => (
                  <div className="inputBox" key={field}>
                    <label>{label}</label>
                    <input type="number" min="1" max="5" value={(row as any)[field]} onChange={(e) => updateCell(i, field as keyof Row, e.target.value)} />
                  </div>
                ))}
              </div>

              <div className="inputBox" style={{marginTop: 10}}>
                <label>Key events driving score change</label>
                <textarea value={row.events} onChange={(e) => updateCell(i, "events", e.target.value)} />
              </div>
              <div style={{marginTop: 10, fontSize: 14}}><strong>Regime:</strong> {regime(row)}</div>
            </section>
          ))}
        </>
      )}

      {tab === "news" && (
        <section className="card">
          <h2 style={{marginTop:0}}>News Feed Aggregator</h2>
          <p style={{color:"#475569", marginTop: 0}}>Use this to monitor hyperscaler capex, power constraints, WFE language, memory/HBM, and nuclear/NLR read-through.</p>

          <div className="newsControls">
            <select value={topic} onChange={(e) => { setTopic(e.target.value); loadNews(e.target.value); }}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button className="btn" onClick={() => loadNews(topic)}>
              <RefreshCw size={16}/> {loadingNews ? "Refreshing..." : "Refresh News"}
            </button>
          </div>

          {refreshedAt && <div className="newsMeta">Last refreshed: {new Date(refreshedAt).toLocaleString()}</div>}

          <div style={{marginTop: 10}}>
            {news.map((item, i) => (
              <div className="newsItem" key={i}>
                <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
                <div className="newsMeta">{item.pubDate ? new Date(item.pubDate).toLocaleString() : ""}</div>
                <div className="newsSnippet">{item.snippet}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}