import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

const FEEDS: Record<string, string> = {
  "All Signals": "https://news.google.com/rss/search?q=(AI%20data%20center%20capex%20OR%20hyperscaler%20capex%20OR%20semiconductor%20equipment%20OR%20HBM%20memory%20OR%20ASML%20AMAT%20Lam)&hl=en-US&gl=US&ceid=US:en",
  "Hyperscaler CapEx": "https://news.google.com/rss/search?q=(Microsoft%20OR%20Amazon%20OR%20Alphabet%20OR%20Meta)%20AI%20capex%20data%20center&hl=en-US&gl=US&ceid=US:en",
  "Power / Data Centers": "https://news.google.com/rss/search?q=AI%20data%20center%20power%20constraints%20grid%20interconnection%20delay&hl=en-US&gl=US&ceid=US:en",
  "WFE / Front End": "https://news.google.com/rss/search?q=(ASML%20OR%20Applied%20Materials%20OR%20Lam%20Research%20OR%20KLA)%20earnings%20wafer%20starts%20semiconductor%20equipment&hl=en-US&gl=US&ceid=US:en",
  "Memory / HBM": "https://news.google.com/rss/search?q=HBM%20DRAM%20memory%20prices%20AI%20demand%20SK%20Hynix%20Micron%20Samsung&hl=en-US&gl=US&ceid=US:en",
  "Nuclear / NLR": "https://news.google.com/rss/search?q=(nuclear%20power%20OR%20uranium%20OR%20Constellation%20Energy)%20AI%20data%20center&hl=en-US&gl=US&ceid=US:en"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || "All Signals";
  const feedUrl = FEEDS[topic] || FEEDS["All Signals"];

  try {
    const feed = await parser.parseURL(feedUrl);
    const items = (feed.items || []).slice(0, 25).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      source: item.creator || item["source"] || "Google News",
      snippet: (item.contentSnippet || item.content || "").replace(/<[^>]+>/g, "").slice(0, 280)
    }));

    return NextResponse.json({ topic, items, refreshedAt: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unable to load news" }, { status: 500 });
  }
}