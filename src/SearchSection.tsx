import { useState, useEffect, useRef, useCallback } from "react";

interface EdgarHit {
  _id: string;
  _source: {
    file_date: string;
    period_of_report?: string;
    entity_name: string;
    file_num?: string;
    form_type: string;
    biz_location?: string;
  };
}

interface EdgarResult {
  total: number;
  hits: EdgarHit[];
}

const DATABASES = [
  {
    id: "edgar",
    name: "SEC EDGAR",
    desc: "All filings: Form 4, 8-K, 13D, 10-K, DEF 14A, 12b-25",
    url: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&dateRange=custom&startdt=2020-01-01`,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=4,8-K,13D,12b-25,10-K,DEF+14A`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
    live: true,
  },
  {
    id: "edgar-forms",
    name: "EDGAR Full-Text Search",
    desc: "Search all SEC filing text (EFTS portal)",
    url: null,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&dateRange=custom`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "fec",
    name: "FEC EFTS",
    desc: "Federal Election Commission electronic filing search",
    url: null,
    link: (q: string) =>
      `https://www.fec.gov/data/search/?query=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.fec.gov/data/search/?query=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "capitol",
    name: "Capitol Trades",
    desc: "Congressional STOCK Act disclosures",
    url: null,
    link: (q: string) =>
      `https://www.capitoltrades.com/trades?politician=all&assetType=stock&searchValue=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.capitoltrades.com/trades?politician=all&assetType=stock&searchValue=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "housestock",
    name: "House Stock Watcher",
    desc: "Congressional House member trading disclosures",
    url: null,
    link: (q: string) =>
      `https://housestockwatcher.com/summary_by_ticker/${encodeURIComponent(q.toUpperCase())}`,
    viewUrl: (q: string) =>
      `https://housestockwatcher.com/summary_by_ticker/${encodeURIComponent(q.toUpperCase())}`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "senatestock",
    name: "Senate Stock Watcher",
    desc: "Congressional Senate member trading disclosures",
    url: null,
    link: (q: string) =>
      `https://senatestockwatcher.com/ticker/${encodeURIComponent(q.toUpperCase())}`,
    viewUrl: (q: string) =>
      `https://senatestockwatcher.com/ticker/${encodeURIComponent(q.toUpperCase())}`,
    color: "var(--accent)",
    live: false,
  },
  {
    id: "pacer",
    name: "PACER (Federal Courts)",
    desc: "Federal court case filings and dockets",
    url: null,
    link: (_q: string) => `https://pacer.uscourts.gov/`,
    viewUrl: (_q: string) => `https://pacer.uscourts.gov/`,
    color: "var(--neutral-dim)",
    live: false,
  },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SearchSection() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<EdgarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formFilter, setFormFilter] = useState("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const FORM_OPTIONS = [
    { value: "all", label: "All Forms" },
    { value: "4", label: "Form 4 (Insider)" },
    { value: "13D", label: "Sch. 13D (Activist)" },
    { value: "8-K", label: "Form 8-K" },
    { value: "12b-25", label: "NT 10-Q/K" },
    { value: "10-K", label: "Form 10-K" },
    { value: "DEF 14A", label: "DEF 14A (Proxy)" },
    { value: "13F-HR", label: "Form 13F" },
    { value: "N-PORT", label: "Form N-PORT" },
  ];

  const fetchEdgar = useCallback(async (q: string, form: string) => {
    if (!q.trim()) {
      setResults(null);
      setError(null);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      let url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&dateRange=custom&startdt=2020-01-01&hits.hits.total.relation=eq`;
      if (form !== "all") url += `&forms=${encodeURIComponent(form)}`;
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`EDGAR returned ${res.status}`);
      const json = await res.json();
      setResults({
        total: json.hits?.total?.value ?? 0,
        hits: json.hits?.hits ?? [],
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Could not reach EDGAR. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    fetchEdgar(debouncedQuery, formFilter);
  }, [debouncedQuery, formFilter, fetchEdgar]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="search-section">
      <div className="search-header">
        <h2 className="search-title">GOVERNMENT DOCUMENT SEARCH</h2>
        <span className="label">LIVE // EDGAR + 6 GOV DATABASES</span>
      </div>

      <div className="search-bar-row">
        <div className="search-input-wrap">
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across government filings… e.g. insider cluster buy, NVDA, 13D Elliott, NT 10-Q"
            spellCheck={false}
          />
          {hasQuery && (
            <button className="search-clear" onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </div>

        <select
          className="form-filter"
          value={formFilter}
          onChange={(e) => setFormFilter(e.target.value)}
        >
          {FORM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* DATABASE LINKS */}
      <div className="db-links">
        {DATABASES.map((db) => (
          <a
            key={db.id}
            href={hasQuery ? db.link(query) : db.viewUrl("")}
            target="_blank"
            rel="noopener noreferrer"
            className={`db-pill ${hasQuery ? "active" : ""}`}
            style={{ "--db-color": db.color } as React.CSSProperties}
          >
            <span className="db-dot" />
            <span className="db-name">{db.name}</span>
            {db.live && <span className="db-live-tag">LIVE</span>}
          </a>
        ))}
      </div>

      {/* RESULTS */}
      {hasQuery && (
        <div className="search-results">
          {/* EDGAR live results */}
          <div className="results-block">
            <div className="results-block-header">
              <span className="results-source">
                SEC EDGAR <span className="results-live-badge">LIVE</span>
              </span>
              {loading && <span className="results-loading">Searching…</span>}
              {!loading && results && (
                <span className="results-count">
                  {results.total.toLocaleString()} result
                  {results.total !== 1 ? "s" : ""}
                </span>
              )}
              {!loading && results && results.total > 0 && (
                <a
                  className="results-view-all"
                  href={`https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(query)}${formFilter !== "all" ? `&forms=${encodeURIComponent(formFilter)}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View all on EDGAR ↗
                </a>
              )}
            </div>

            {error && <div className="results-error">{error}</div>}

            {!loading && !error && results && results.hits.length === 0 && (
              <div className="results-empty">
                No filings found for "{query}"
                {formFilter !== "all" ? ` in ${formFilter}` : ""}. Try a
                broader search or different form type.
              </div>
            )}

            {!loading && results && results.hits.length > 0 && (
              <div className="results-list">
                {results.hits.map((hit) => (
                  <a
                    key={hit._id}
                    className="result-row"
                    href={`https://www.sec.gov/Archives/edgar/data/${hit._source.file_num?.replace(/^0+/, "") ?? ""}/${hit._id.replace(/-/g, "")}.txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="result-form"
                      data-form={hit._source.form_type}
                    >
                      {hit._source.form_type}
                    </span>
                    <span className="result-entity">
                      {hit._source.entity_name || "—"}
                    </span>
                    <span className="result-date">
                      {formatDate(hit._source.file_date)}
                    </span>
                    <span className="result-arrow">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* External database links */}
          <div className="ext-databases">
            <div className="ext-db-title">Search same term in other databases</div>
            <div className="ext-db-grid">
              {DATABASES.filter((d) => !d.live).map((db) => (
                <a
                  key={db.id}
                  href={db.link(query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ext-db-card"
                  style={{ "--db-color": db.color } as React.CSSProperties}
                >
                  <div className="ext-db-name">{db.name}</div>
                  <div className="ext-db-desc">{db.desc}</div>
                  <div className="ext-db-arrow">Search "{query}" ↗</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
