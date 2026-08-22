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
    id: "insider-buying",
    name: "Insider Buying",
    desc: "Open-market insider purchases (Form 4) across all companies",
    url: null,
    link: (q: string) =>
      `https://openinsider.com/search?q=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://openinsider.com/search?q=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "fda-pipeline",
    name: "FDA Pipeline",
    desc: "Drug approvals, applications & review status (Drugs@FDA)",
    url: null,
    link: (q: string) =>
      `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&SearchTerm=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process&SearchTerm=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "defense-contracts",
    name: "Defense Contracts",
    desc: "Federal contract awards & opportunities (SAM.gov / USAspending)",
    url: null,
    link: (q: string) =>
      `https://www.usaspending.gov/search/?keyword=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.usaspending.gov/search/?keyword=${encodeURIComponent(q)}`,
    color: "var(--neutral-dim)",
    live: false,
  },
  {
    id: "sec13d-activists",
    name: "SEC 13D Activists",
    desc: "Beneficial ownership filings signaling activist intent",
    url: null,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=SC+13D`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=SC+13D`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "8k-material-events",
    name: "8-K Material Events",
    desc: "Current reports on material corporate events",
    url: null,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=8-K`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=8-K`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "s1-ipo-pipeline",
    name: "S-1 IPO Pipeline",
    desc: "Registration statements for upcoming public offerings",
    url: null,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=S-1`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=S-1`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "schedule-to-buyouts",
    name: "Schedule TO Buyouts",
    desc: "Tender offer filings for acquisitions & buyouts",
    url: null,
    link: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=SC+TO-T`,
    viewUrl: (q: string) =>
      `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(q)}&forms=SC+TO-T`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "trademark-intelligence",
    name: "Trademark Intelligence",
    desc: "USPTO trademark applications & registrations",
    url: null,
    link: (q: string) =>
      `https://tmsearch.uspto.gov/search/search-information?query=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://tmsearch.uspto.gov/search/search-information?query=${encodeURIComponent(q)}`,
    color: "var(--accent)",
    live: false,
  },
  {
    id: "patent-signals",
    name: "Patent Signals",
    desc: "New patent filings & grants (Google Patents)",
    url: null,
    link: (q: string) =>
      `https://patents.google.com/?q=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://patents.google.com/?q=${encodeURIComponent(q)}`,
    color: "var(--accent)",
    live: false,
  },
  {
    id: "patent-litigation",
    name: "Patent Litigation",
    desc: "Federal patent lawsuits & dockets (CourtListener/RECAP)",
    url: null,
    link: (q: string) =>
      `https://www.courtlistener.com/?q=${encodeURIComponent(q)}&type=r&nature_of_suit=830`,
    viewUrl: (q: string) =>
      `https://www.courtlistener.com/?q=${encodeURIComponent(q)}&type=r&nature_of_suit=830`,
    color: "var(--accent)",
    live: false,
  },
  {
    id: "ftc-antitrust",
    name: "FTC Antitrust",
    desc: "Antitrust actions, merger reviews & enforcement",
    url: null,
    link: (q: string) =>
      `https://www.ftc.gov/search?query=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.ftc.gov/search?query=${encodeURIComponent(q)}`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "fcc-spectrum",
    name: "FCC Spectrum",
    desc: "Spectrum licenses & Universal Licensing System filings",
    url: null,
    link: (_q: string) => `https://www.fcc.gov/uls/`,
    viewUrl: (_q: string) => `https://www.fcc.gov/uls/`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "ferc-energy",
    name: "FERC Energy",
    desc: "Energy regulatory filings & dockets (eLibrary)",
    url: null,
    link: (_q: string) => `https://elibrary.ferc.gov/eLibrary/search`,
    viewUrl: (_q: string) => `https://elibrary.ferc.gov/eLibrary/search`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "ofac-sanctions",
    name: "OFAC Sanctions",
    desc: "Specially Designated Nationals & sanctions list search",
    url: null,
    link: (_q: string) => `https://sanctionssearch.ofac.treas.gov/`,
    viewUrl: (_q: string) => `https://sanctionssearch.ofac.treas.gov/`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "cfius-reviews",
    name: "CFIUS Reviews",
    desc: "Foreign investment national security reviews",
    url: null,
    link: (_q: string) =>
      `https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius`,
    viewUrl: (_q: string) =>
      `https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "doe-grants",
    name: "DOE Grants",
    desc: "Department of Energy funding opportunities & awards",
    url: null,
    link: (q: string) =>
      `https://www.grants.gov/search-grants?keywords=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://www.grants.gov/search-grants?keywords=${encodeURIComponent(q)}`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "dot-faa-certs",
    name: "DOT/FAA Certs",
    desc: "Aircraft & transportation certifications, registry lookups",
    url: null,
    link: (_q: string) => `https://amsrvs.registry.faa.gov/airmeninquiry/`,
    viewUrl: (_q: string) => `https://amsrvs.registry.faa.gov/airmeninquiry/`,
    color: "var(--neutral-dim)",
    live: false,
  },
  {
    id: "epa-actions",
    name: "EPA Actions",
    desc: "Enforcement & compliance history (ECHO facility search)",
    url: null,
    link: (q: string) =>
      `https://echo.epa.gov/facilities/facility-search?fac_search=${encodeURIComponent(q)}`,
    viewUrl: (q: string) =>
      `https://echo.epa.gov/facilities/facility-search?fac_search=${encodeURIComponent(q)}`,
    color: "var(--t1-color)",
    live: false,
  },
  {
    id: "cftc-positions",
    name: "CFTC Positions",
    desc: "Commitments of Traders reports & futures positioning",
    url: null,
    link: (_q: string) =>
      `https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm`,
    viewUrl: (_q: string) =>
      `https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "export-controls",
    name: "Export Controls",
    desc: "Denied persons, entity list & consolidated screening list",
    url: null,
    link: (_q: string) => `https://www.trade.gov/consolidated-screening-list`,
    viewUrl: (_q: string) =>
      `https://www.trade.gov/consolidated-screening-list`,
    color: "var(--t3-color)",
    live: false,
  },
  {
    id: "fed-balance-sheet",
    name: "Fed Balance Sheet",
    desc: "Federal Reserve weekly balance sheet (H.4.1 release)",
    url: null,
    link: (_q: string) => `https://www.federalreserve.gov/releases/h41/current/`,
    viewUrl: (_q: string) =>
      `https://www.federalreserve.gov/releases/h41/current/`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "treasury-tic",
    name: "Treasury TIC",
    desc: "Foreign holdings of U.S. securities (TIC data)",
    url: null,
    link: (_q: string) =>
      `https://home.treasury.gov/data/treasury-international-capital-tic-system-home`,
    viewUrl: (_q: string) =>
      `https://home.treasury.gov/data/treasury-international-capital-tic-system-home`,
    color: "var(--t2-color)",
    live: false,
  },
  {
    id: "bank-stress",
    name: "Bank Stress",
    desc: "Bank stress test results (DFAST / CCAR)",
    url: null,
    link: (_q: string) =>
      `https://www.federalreserve.gov/supervisionreg/dfast-archive.htm`,
    viewUrl: (_q: string) =>
      `https://www.federalreserve.gov/supervisionreg/dfast-archive.htm`,
    color: "var(--t2-color)",
    live: false,
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
