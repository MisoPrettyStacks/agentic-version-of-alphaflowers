import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";

/* SEC EDGAR full-text search (efts.sec.gov) does not send CORS headers, so
   browsers block direct fetches. Requests go through a public relay that
   adds them, falling back to a direct call (in case SEC enables CORS).
   Fields below match the real API response: _source.display_names[],
   _source.form, _source.ciks[], _source.adsh; _id is "adsh:filename". */

interface EdgarHit {
  _id: string;
  _source: {
    display_names?: string[];
    form?: string;
    file_date?: string;
    ciks?: string[];
    adsh?: string;
  };
}

interface EdgarResult {
  total: number;
  hits: EdgarHit[];
}

interface LiveSource {
  id: string;
  name: string;
  forms: string | null; // null = respect the form dropdown
}

const LIVE_SOURCES: LiveSource[] = [
  { id: "edgar", name: "SEC EDGAR", forms: null },
  { id: "sec13d", name: "SEC 13D Activists", forms: "SC 13D" },
  { id: "8k", name: "8-K Material Events", forms: "8-K" },
  { id: "s1", name: "S-1 IPO Pipeline", forms: "S-1" },
  { id: "schedule-to", name: "Schedule TO Buyouts", forms: "SC TO-T" },
  { id: "edgar-forms", name: "EDGAR Full-Text Search", forms: "" },
];

const DATABASES = [
  {
    id: "insider-buying",
    name: "Insider Buying",
    desc: "Open-market insider purchases (Form 4) across all companies",
    link: (q: string) =>
      `https://openinsider.com/search?q=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
  },
  {
    id: "fda-pipeline",
    name: "FDA Pipeline",
    desc: "Drug approvals, applications & review status (Drugs@FDA)",
    link: (q: string) =>
      `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&SearchTerm=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
  },
  {
    id: "defense-contracts",
    name: "Defense Contracts",
    desc: "Federal contract awards & opportunities (SAM.gov / USAspending)",
    link: (q: string) =>
      `https://www.usaspending.gov/search/?keyword=${encodeURIComponent(q)}`,
    color: "var(--neutral-dim)",
  },
  {
    id: "trademark-intelligence",
    name: "Trademark Intelligence",
    desc: "USPTO trademark applications & registrations",
    link: (q: string) =>
      `https://tmsearch.uspto.gov/search/search-information?query=${encodeURIComponent(q)}`,
    color: "var(--accent)",
  },
  {
    id: "patent-signals",
    name: "Patent Signals",
    desc: "New patent filings & grants (Google Patents)",
    link: (q: string) =>
      `https://patents.google.com/?q=${encodeURIComponent(q)}`,
    color: "var(--accent)",
  },
  {
    id: "patent-litigation",
    name: "Patent Litigation",
    desc: "Federal patent lawsuits & dockets (CourtListener/RECAP)",
    link: (q: string) =>
      `https://www.courtlistener.com/?q=${encodeURIComponent(q)}&type=r&nature_of_suit=830`,
    color: "var(--accent)",
  },
  {
    id: "ftc-antitrust",
    name: "FTC Antitrust",
    desc: "Antitrust actions, merger reviews & enforcement",
    link: (q: string) => `https://www.ftc.gov/search?query=${encodeURIComponent(q)}`,
    color: "var(--t3-color)",
  },
  {
    id: "fcc-spectrum",
    name: "FCC Spectrum",
    desc: "Spectrum licenses & Universal Licensing System filings",
    link: (_q: string) => `https://www.fcc.gov/uls/`,
    color: "var(--t3-color)",
  },
  {
    id: "ferc-energy",
    name: "FERC Energy",
    desc: "Energy regulatory filings & dockets (eLibrary)",
    link: (_q: string) => `https://elibrary.ferc.gov/eLibrary/search`,
    color: "var(--t3-color)",
  },
  {
    id: "ofac-sanctions",
    name: "OFAC Sanctions",
    desc: "Specially Designated Nationals & sanctions list search",
    link: (_q: string) => `https://sanctionssearch.ofac.treas.gov/`,
    color: "var(--t3-color)",
  },
  {
    id: "cfius-reviews",
    name: "CFIUS Reviews",
    desc: "Foreign investment national security reviews",
    link: (_q: string) =>
      `https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius`,
    color: "var(--t3-color)",
  },
  {
    id: "doe-grants",
    name: "DOE Grants",
    desc: "Department of Energy funding opportunities & awards",
    link: (q: string) =>
      `https://www.grants.gov/search-grants?keywords=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
  },
  {
    id: "dot-faa-certs",
    name: "DOT/FAA Certs",
    desc: "Aircraft & transportation certifications, registry lookups",
    link: (_q: string) => `https://amsrvs.registry.faa.gov/airmeninquiry/`,
    color: "var(--neutral-dim)",
  },
  {
    id: "epa-actions",
    name: "EPA Actions",
    desc: "Enforcement & compliance history (ECHO facility search)",
    link: (q: string) =>
      `https://echo.epa.gov/facilities/facility-search?fac_search=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
  },
  {
    id: "cftc-positions",
    name: "CFTC Positions",
    desc: "Commitments of Traders reports & futures positioning",
    link: (_q: string) =>
      `https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm`,
    color: "var(--t2-color)",
  },
  {
    id: "export-controls",
    name: "Export Controls",
    desc: "Denied persons, entity list & consolidated screening list",
    link: (_q: string) => `https://www.trade.gov/consolidated-screening-list`,
    color: "var(--t3-color)",
  },
  {
    id: "fed-balance-sheet",
    name: "Fed Balance Sheet",
    desc: "Federal Reserve weekly balance sheet (H.4.1 release)",
    link: (_q: string) => `https://www.federalreserve.gov/releases/h41/current/`,
    color: "var(--t2-color)",
  },
  {
    id: "treasury-tic",
    name: "Treasury TIC",
    desc: "Foreign holdings of U.S. securities (TIC data)",
    link: (_q: string) =>
      `https://home.treasury.gov/data/treasury-international-capital-tic-system-home`,
    color: "var(--t2-color)",
  },
  {
    id: "bank-stress",
    name: "Bank Stress",
    desc: "Bank stress test results (DFAST / CCAR)",
    link: (_q: string) =>
      `https://www.federalreserve.gov/supervisionreg/dfast-archive.htm`,
    color: "var(--t2-color)",
  },
  {
    id: "fec",
    name: "FEC EFTS",
    desc: "Federal Election Commission electronic filing search",
    link: (q: string) => `https://www.fec.gov/data/search/?query=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
  },
  {
    id: "capitol",
    name: "Capitol Trades",
    desc: "Congressional STOCK Act disclosures",
    link: (q: string) =>
      `https://www.capitoltrades.com/trades?politician=all&assetType=stock&searchValue=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
  },
  {
    id: "housestock",
    name: "House Stock Watcher",
    desc: "Congressional House member trading disclosures",
    link: (q: string) =>
      `https://housestockwatcher.com/summary_by_ticker/${encodeURIComponent(q.toUpperCase())}`,
    color: "var(--t2-color)",
  },
  {
    id: "senatestock",
    name: "Senate Stock Watcher",
    desc: "Congressional Senate member trading disclosures",
    link: (q: string) =>
      `https://senatestockwatcher.com/ticker/${encodeURIComponent(q.toUpperCase())}`,
    color: "var(--accent)",
  },
  {
    id: "pacer",
    name: "PACER (Federal Courts)",
    desc: "Federal court case filings and dockets",
    link: (_q: string) => `https://pacer.uscourts.gov/`,
    color: "var(--neutral-dim)",
  },
];

function ftsUrl(q: string, forms: string | null) {
  let url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&dateRange=custom&startdt=2020-01-01`;
  if (forms) url += `&forms=${encodeURIComponent(forms)}`;
  return url;
}

function edgarUiUrl(q: string, forms: string | null) {
  let url = `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(q)}`;
  if (forms) url += `&forms=${encodeURIComponent(forms)}`;
  url += `&dateRange=custom&startdt=2020-01-01`;
  return url;
}

function filingUrl(hit: EdgarHit) {
  const cik = hit._source.ciks && hit._source.ciks[0];
  const adsh = hit._source.adsh || hit._id.split(":")[0];
  const filename = hit._id.includes(":") ? hit._id.split(":")[1] : "";
  if (cik && filename) {
    return `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${adsh.replace(/-/g, "")}/${filename}`;
  }
  return `https://www.sec.gov/Archives/edgar/data/${adsh.replace(/-/g, "")}`;
}

function entityLabel(hit: EdgarHit) {
  const raw = (hit._source.display_names && hit._source.display_names[0]) || "—";
  return raw.replace(/\s*\(CIK \d+\)\s*$/, "");
}

async function fetchEdgarJson(url: string, signal: AbortSignal) {
  const routes = [`https://api.cors.lol/?url=${encodeURIComponent(url)}`, url];
  let lastErr: unknown = null;
  for (const route of routes) {
    try {
      const res = await fetch(route, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

function formatDate(dateStr?: string) {
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
  const [activeLive, setActiveLive] = useState<LiveSource>(LIVE_SOURCES[0]);
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

  const effectiveForms =
    activeLive.forms !== null
      ? activeLive.forms || null
      : formFilter !== "all"
        ? formFilter
        : null;

  const fetchEdgar = useCallback(
    async (q: string, forms: string | null) => {
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
        const json = await fetchEdgarJson(
          ftsUrl(q, forms),
          abortRef.current.signal,
        );
        setResults({
          total: json.hits?.total?.value ?? 0,
          hits: json.hits?.hits ?? [],
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          "Could not reach EDGAR right now. The SEC feed (or its relay) may be busy — try again, or open EDGAR directly below.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
    fetchEdgar(debouncedQuery, effectiveForms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, activeLive, formFilter, fetchEdgar]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="search-section">
      <div className="search-header">
        <h2 className="search-title">GOVERNMENT DOCUMENT SEARCH</h2>
        <span className="label">LIVE // SEC EDGAR FAMILY + EXTERNAL DATABASES</span>
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
          disabled={activeLive.forms !== null}
          title={
            activeLive.forms !== null
              ? "This source has a fixed form type"
              : "Filter by form type"
          }
        >
          {FORM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* DATABASE PILLS: EDGAR family live in-page; the rest open externally */}
      <div className="db-links">
        {LIVE_SOURCES.map((src) => (
          <a
            key={src.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveLive(src);
            }}
            className={`db-pill ${activeLive.id === src.id ? "active" : ""}`}
            style={{ "--db-color": "var(--t1-color)" } as CSSProperties}
          >
            <span className="db-dot" />
            <span className="db-name">{src.name}</span>
            <span className="db-live-tag">LIVE</span>
          </a>
        ))}
        {DATABASES.map((db) => (
          <a
            key={db.id}
            href={db.link(query)}
            target="_blank"
            rel="noopener noreferrer"
            className={`db-pill ${hasQuery ? "active" : ""}`}
            style={{ "--db-color": db.color } as CSSProperties}
          >
            <span className="db-dot" />
            <span className="db-name">{db.name}</span>
          </a>
        ))}
      </div>

      {/* RESULTS */}
      {hasQuery && (
        <div className="search-results">
          <div className="results-block">
            <div className="results-block-header">
              <span className="results-source">
                {activeLive.name} <span className="results-live-badge">LIVE</span>
              </span>
              {loading && <span className="results-loading">Searching…</span>}
              {!loading && results && (
                <span className="results-count">
                  {results.total.toLocaleString()} result
                  {results.total !== 1 ? "s" : ""}
                </span>
              )}
              {!loading && (
                <a
                  className="results-view-all"
                  href={edgarUiUrl(query, effectiveForms)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on EDGAR ↗
                </a>
              )}
            </div>

            {error && (
              <div className="results-error">
                {error}{" "}
                <a href={edgarUiUrl(query, effectiveForms)} target="_blank" rel="noopener noreferrer">
                  Open EDGAR ↗
                </a>
              </div>
            )}

            {!loading && !error && results && results.hits.length === 0 && (
              <div className="results-empty">
                No filings found for "{query}"
                {effectiveForms ? ` in ${effectiveForms}` : ""}. Try a broader
                search or a different source above.
              </div>
            )}

            {!loading && results && results.hits.length > 0 && (
              <div className="results-list">
                {results.hits.map((hit) => (
                  <a
                    key={hit._id}
                    className="result-row"
                    href={filingUrl(hit)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="result-form" data-form={hit._source.form}>
                      {hit._source.form || "—"}
                    </span>
                    <span className="result-entity">{entityLabel(hit)}</span>
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
              {DATABASES.map((db) => (
                <a
                  key={db.id}
                  href={db.link(query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ext-db-card"
                  style={{ "--db-color": db.color } as CSSProperties}
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
