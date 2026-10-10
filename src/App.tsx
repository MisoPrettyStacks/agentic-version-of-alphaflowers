import "./report.css";
import { SearchSection } from "./SearchSection";
import { useAutoRefresh } from "./useAutoRefresh";

function formatAnalysisDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function App() {
  const refresh = useAutoRefresh();
  const analysisDate = formatAnalysisDate(new Date());

  return (
    <div className="wrapper">
      {/* MASTHEAD */}
      <div className="masthead">
        <div className="masthead-top">
          <div className="live-dot"></div>
          <span className="ticker-badge">GOV ALPHA // EDGAR INTELLIGENCE</span>
          <div className="refresh-badge" title="Page auto-refreshes every 30 minutes">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6"/>
              <path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
              <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
            </svg>
            <span>REFRESH IN {refresh.label}</span>
            <span
              className="refresh-progress"
              style={{ width: `${refresh.pct}%` }}
            />
          </div>
        </div>
        <h1>
          PUBLIC FILING<br />
          <span>MARKET EDGE</span><br />
          FRAMEWORK
        </h1>
        <div className="masthead-meta">
          <span aria-live="polite">ANALYSIS DATE: {analysisDate}</span>
          <span>SOURCE: SEC EDGAR + PACER + FEC + STOCK ACT</span>
          <span>LEGAL STATUS: ALL STRATEGIES PUBLIC-INFORMATION ONLY</span>
        </div>
      </div>

      {/* LEGAL NOTICE */}
      <div className="legal-notice">
        <strong>LEGAL DISCLAIMER:</strong> All strategies herein are derived
        exclusively from publicly available government disclosures. This analysis
        constitutes <strong>public information arbitrage</strong>, not insider
        trading. Trading on legally disclosed, publicly filed information is
        permitted under U.S. securities law. No material non-public information
        (MNPI) is referenced. All backtested figures are approximations derived
        from academic literature; individual results will vary. This is not
        investment advice. Verify all trades with a licensed financial advisor
        and compliance counsel before execution.
      </div>

      <SearchSection />

      {/* CURRENT ENVIRONMENT */}
      <div className="section-header">
        <h2>REAL-WORLD ENVIRONMENT ASSESSMENT</h2>
        <span className="label">{analysisDate} // ADAPTIVE CONTEXT</span>
      </div>

      <div className="env-strip">
        <div className="env-cell">
          <div className="label">Rate Environment</div>
          <div className="value warn">HIGH</div>
          <div className="subtext">Fed Funds elevated → stress signals active</div>
        </div>
        <div className="env-cell">
          <div className="label">Volatility Regime</div>
          <div className="value warn">ELEVATED</div>
          <div className="subtext">Filing-sentiment edges amplified in vol</div>
        </div>
        <div className="env-cell">
          <div className="label">Market Cap Bias</div>
          <div className="value up">SMALL-MID</div>
          <div className="subtext">Low analyst coverage = max info asymmetry</div>
        </div>
        <div className="env-cell">
          <div className="label">Activist Climate</div>
          <div className="value up">ACTIVE</div>
          <div className="subtext">13D campaigns at multi-year high</div>
        </div>
        <div className="env-cell">
          <div className="label">Regulatory Mood</div>
          <div className="value warn">SHIFTING</div>
          <div className="subtext">SEC enforcement capacity reduced</div>
        </div>
        <div className="env-cell">
          <div className="label">Congressional Signal</div>
          <div className="value up">LIVE</div>
          <div className="subtext">STOCK Act disclosures flowing; no ban yet</div>
        </div>
      </div>

      {/* TIER I */}
      <div className="tier-block">
        <div className="tier-header t1">
          <div className="tier-num">I</div>
          <div className="tier-title-block">
            <div className="tier-designation">TIER 1 // HIGHEST PRIORITY</div>
            <div className="tier-name">
              Structural Alpha — High Signal / Legally Robust
            </div>
            <div className="tier-desc">
              Academically validated, legally unambiguous, current-environment
              optimal. Best-risk-adjusted returns under present macro and
              regulatory conditions. Execute first.
            </div>
          </div>
          <div className="tier-stats">
            <div className="stat-label">EST. EDGE RATIO</div>
            <div className="stat-val up">HIGH</div>
          </div>
        </div>

        <div className="strategy-grid t1">
          {/* CARD 1: Cluster Form 4 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM 4</div>
              <div>
                <div className="strat-name">
                  Insider Cluster Buy — Microcap Opportunistic Signal
                </div>
                <div className="strat-origin">
                  EDGAR → EDGAR Full-Text Search // SEC FORM 4 // Open-Market
                  Purchases
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                When ≥3 insiders at the same company make open-market purchases
                within a 30-day window — without relying on a 10b5-1 plan — this
                constitutes a statistically significant "cluster buy." Academic
                research on microcap stocks ($30M–$500M market cap) shows a
                gradient-boosting classifier achieves AUC 0.70 on out-of-sample
                data. Distance from 52-week high is the #1 feature (36% of
                signal weight): insiders buying after a dip of &gt;10% from 52-week
                highs show the highest 6-month cumulative abnormal returns.
              </p>
              <p>
                The key refinement vs. naive Form 4 copying: filter to{" "}
                <em>opportunistic</em> traders (irregular trading history), not{" "}
                <em>routine</em> traders (predictable, scheduled). The former
                outperform by a significant margin. Also critical:{" "}
                <strong>enter on the filing date</strong>, not transaction date.
                Most alpha has dissipated by filing, but residual signal in
                small-caps is preserved due to limited arbitrage.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Mean CAR (6mo)</div>
                  <div className="m-val up">+6.3%</div>
                </div>
                <div className="metric">
                  <div className="m-label">Best Win Rate</div>
                  <div className="m-val up">36.7%</div>
                </div>
                <div className="metric">
                  <div className="m-label">AUC Score</div>
                  <div className="m-val up">0.70</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Required Signal Conditions</div>
                <ul>
                  <li>
                    ≥3 distinct insiders (different roles — not just directors)
                    buy within 30 days
                  </li>
                  <li>
                    All purchases are open-market (Transaction Code "P"), not
                    options/awards
                  </li>
                  <li>No concurrent insider sales in same window</li>
                  <li>
                    Stock is ≥10% below its 52-week high at time of purchase
                  </li>
                  <li>
                    Company is NOT under an active 10b5-1 trading plan for the
                    insider
                  </li>
                  <li>
                    Microcap: $30M–$500M market cap for max signal strength
                  </li>
                  <li>
                    File your EDGAR alert for Form 4, filter by Transaction Code
                    P + cluster logic
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bear">BEAR MARKET</span>
                <span className="env-tag vol">HIGH VOL</span>
                <span className="env-tag any">RISING RATES</span>
              </div>

              <div className="caution-box">
                <strong>Alpha Decay Warning:</strong> 70–80% of Form 4 alpha is
                captured between transaction date and next trading day. The
                remaining edge is in small-cap stocks with low analyst coverage.
                Do NOT apply this to large-cap, heavily-covered names.
              </div>
            </div>
          </div>

          {/* CARD 2: NT 10-Q Short */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM 12b-25</div>
              <div>
                <div className="strat-name">
                  Non-Timely Filing (NT 10-Q) Distress Short
                </div>
                <div className="strat-origin">
                  EDGAR → Full-Text Search // NT 10-Q // Item: Accounting Delay
                  Reason
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                When a company files an NT 10-Q (notification that its quarterly
                report will be late), the market reacts negatively — and the
                reaction is significantly more severe when the stated reason is{" "}
                <em>accounting-related</em> (internal control failures,
                restatements) vs. operational delays. Research documents the
                average announcement-day abnormal return is –1.17%, with
                continued negative drift in the months following. The edge is
                that this drift is not fully priced in at announcement.
              </p>
              <p>
                The actionable signal: NT 10-Q + "accounting" reason language +
                company is already trading below its 200-day moving average + no
                previous NT filings in 3 years (i.e., this is an anomaly, not a
                habitual late filer). Companies that subsequently fail to file
                even within the grace period (30% of NT 10-Q filers) show the
                most severe long-term drift — and the market partially
                anticipates this.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Day-0 Abnormal Return</div>
                  <div className="m-val down">–1.17%</div>
                </div>
                <div className="metric">
                  <div className="m-label">Miss Grace Period Rate</div>
                  <div className="m-val warn">30%</div>
                </div>
                <div className="metric">
                  <div className="m-label">Continued Drift</div>
                  <div className="m-val down">Multi-mo.</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Execution Checklist</div>
                <ul>
                  <li>
                    Monitor EDGAR daily for NT 10-Q / NT 10-K filings (Form
                    type: 12b-25)
                  </li>
                  <li>
                    Extract Part III "reason for delay" text — flag for:
                    accounting, restatement, internal controls, auditor
                    disagreement
                  </li>
                  <li>
                    Cross-reference: does NT mention anticipated significant
                    change in results? (Check box on Form)
                  </li>
                  <li>
                    Companies with first NT in 3+ years are higher-signal than
                    serial late filers
                  </li>
                  <li>
                    Short after grace period expiry if 10-Q is still absent
                    (confirms deeper problem)
                  </li>
                  <li>
                    Cover if/when 8-K (Item 4.02) is filed — potential
                    capitulation catalyst
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bear">BEAR MARKET</span>
                <span className="env-tag any">CREDIT STRESS</span>
                <span className="env-tag vol">HIGH VOL</span>
              </div>
            </div>
          </div>

          {/* CARD 3: Schedule 13D Activist */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">SCH 13D</div>
              <div>
                <div className="strat-name">
                  Activist 13D Catalyst — Long Momentum Play
                </div>
                <div className="strat-origin">
                  EDGAR → Beneficial Ownership // Schedule 13D (active intent,
                  &gt;5%)
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                When a known activist investor (Elliott, Icahn, Starboard, etc.)
                files a Schedule 13D disclosing &gt;5% ownership with explicit
                intent to influence management, the initial stock price jump of
                5–10% is well-documented. But the <em>real edge</em> is the
                continued alpha: Harvard Business School research shows 10.3%
                excess return in the 18 months after a 13D filing. NYU research
                shows +10.2% around filing plus +11.4% in the subsequent year.
              </p>
              <p>
                The 2024 SEC rule change shortening the 13D disclosure window
                from 10 days to 5 days reduced the "accumulation premium" — but
                this is a partial effect. The post-filing drift remains
                significant, especially when the activist has a proven track
                record of forcing board changes, dividends, buybacks, or M&amp;A.
                Track the activist's "stated objectives" in Item 4 of the 13D —
                specific demands (board seats, CEO replacement, strategic
                review) outperform vague "value creation" language.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Initial Jump</div>
                  <div className="m-val up">+5–10%</div>
                </div>
                <div className="metric">
                  <div className="m-label">12-mo Alpha (HBS)</div>
                  <div className="m-val up">+10.3%</div>
                </div>
                <div className="metric">
                  <div className="m-label">Annualized (13D Mon.)</div>
                  <div className="m-val up">+22.2%</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Filer Quality Screening</div>
                <ul>
                  <li>
                    Tier A activists (Elliott, Starboard, Icahn, Third Point):
                    highest mean returns
                  </li>
                  <li>
                    Item 4 language: explicit mention of "board representation,"
                    "strategic alternatives," "return of capital" — outperforms
                    vague language
                  </li>
                  <li>
                    Target company trading at discount to book value or industry
                    peers is amplifier
                  </li>
                  <li>
                    13D/A (amendments) disclosing increased stake = strong
                    continuation signal
                  </li>
                  <li>
                    Watch for associated 13D filer communications: press
                    releases, letters to management — these extend the catalyst
                    window
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bull">BULL MARKET</span>
                <span className="env-tag any">NEUTRAL MARKET</span>
                <span className="env-tag any">ANY VOLATILITY</span>
              </div>
            </div>
          </div>

          {/* CARD 4: CONGRESSIONAL STOCK ACT */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">STOCK ACT</div>
              <div>
                <div className="strat-name">
                  Congressional Trade Disclosure — Sector Alignment Signal
                </div>
                <div className="strat-origin">
                  House/Senate Financial Disclosures // eFD System + Capitol
                  Trades // 45-day window
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Under the STOCK Act, members of Congress must disclose stock
                trades ≥$1,000 within 45 days. With a $200 penalty for
                violations and no criminal prosecutions to date, violations are
                common — yet the public data that <em>does</em> flow is
                exploitable. Academic research documents that congressional{" "}
                <em>short selling</em> (puts, short positions) is significantly
                associated with positive abnormal returns — an asymmetry
                suggesting access to policy information about downside risks.
                Long positions show weaker signals.
              </p>
              <p>
                The most durable strategy: track committee members trading in
                sectors they directly regulate. Defense committee members in
                defense stocks, health committee members in pharma/biotech, and
                tech committee members in semiconductor names have shown
                consistent patterns pre-legislation. Cluster trades (multiple
                members entering same sector within 30 days of each other) are
                the strongest signal.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Disclosure Lag (max)</div>
                  <div className="m-val warn">45 days</div>
                </div>
                <div className="metric">
                  <div className="m-label">Short Signal</div>
                  <div className="m-val up">Strong</div>
                </div>
                <div className="metric">
                  <div className="m-label">Long Signal</div>
                  <div className="m-val warn">Weaker</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Signal Filters</div>
                <ul>
                  <li>
                    Focus on committee members whose committee oversees the
                    target sector
                  </li>
                  <li>
                    Cluster: ≥3 members from same or related committees entering
                    same ticker/sector
                  </li>
                  <li>
                    Trade size ≥$50K increases conviction (many trades are the
                    minimum $1K–$15K disclosable)
                  </li>
                  <li>
                    Short/put positions show stronger predictive power than
                    longs (asymmetric information access)
                  </li>
                  <li>
                    Monitor: capitoltrades.com, quiverquant.com/congresstrading,
                    housestockwatcher.com
                  </li>
                  <li>
                    Use 60–90 day forward window from trade date (accounting for
                    45-day disclosure lag)
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag any">PRE-LEGISLATION</span>
                <span className="env-tag any">BUDGET CYCLE</span>
                <span className="env-tag bear">POLICY STRESS</span>
              </div>

              <div className="caution-box">
                <strong>Legal Clarity:</strong> Following publicly disclosed
                STOCK Act filings is entirely legal — you are trading on
                publicly available information. The member of Congress may have
                violated the STOCK Act; <em>you</em> are reading their public
                disclosures and trading independently.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIER II */}
      <div className="tier-block">
        <div className="tier-header t2">
          <div className="tier-num">II</div>
          <div className="tier-title-block">
            <div className="tier-designation">TIER 2 // SECONDARY PRIORITY</div>
            <div className="tier-name">
              Quantitative Pattern Edge — Requires Tooling / Analytics
            </div>
            <div className="tier-desc">
              Strong empirical evidence exists, but execution requires NLP
              parsing, semantic analysis, or programmatic EDGAR access. Higher
              setup cost; durable alpha. Best accessed via Python/EDGAR API
              pipelines.
            </div>
          </div>
          <div className="tier-stats">
            <div className="stat-label">EST. COMPLEXITY</div>
            <div className="stat-val warn">MEDIUM-HIGH</div>
          </div>
        </div>

        <div className="strategy-grid t2">
          {/* CARD 5 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">10-K / 10-Q</div>
              <div>
                <div className="strat-name">
                  MD&amp;A Linguistic Deterioration — Pre-Crash Signal
                </div>
                <div className="strat-origin">
                  EDGAR Full-Text // Loughran-McDonald Sentiment Dictionary //
                  MD&amp;A Section
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Research demonstrates that companies with declining textual
                readability in their MD&amp;A section — specifically increasing
                fog index, longer sentences, more negative Loughran-McDonald
                sentiment words, and heightened risk jargon — exhibit higher
                correlation with future stock price crashes. This is a genuine
                information gap: management buries bad news in complexity.
                Year-over-year changes matter more than absolute readability.
              </p>
              <p>
                The signal is compounded when: (1) risk factor section grows in
                length, (2) forward-looking hedging language ("may," "could,"
                "uncertain") increases, (3) specific word substitutions occur
                (e.g., "strong" replaced by "adequate"). AI/NLP models trained
                on 10-K changes now achieve meaningful predictive accuracy for
                subsequent volatility, corroborating earlier volatility
                forecasting research from the University of Utah.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Signal Type</div>
                  <div className="m-val warn">LEADING</div>
                </div>
                <div className="metric">
                  <div className="m-label">Horizon</div>
                  <div className="m-val">6–18mo</div>
                </div>
                <div className="metric">
                  <div className="m-label">Requires NLP</div>
                  <div className="m-val warn">YES</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Implementation Path</div>
                <ul>
                  <li>
                    Retrieve 10-K via EDGAR XBRL API or full-text search; parse
                    MD&amp;A section
                  </li>
                  <li>
                    Compute Fog Index year-over-year — rising fog = concern
                  </li>
                  <li>
                    Apply Loughran-McDonald negative word count; rising count =
                    bearish signal
                  </li>
                  <li>
                    Flag items: "going concern," "material weakness," "covenant,"
                    "restatement" appearing for first time
                  </li>
                  <li>
                    Combine with earnings volatility measure — firms disclosing
                    employee option forecasts that deviate from historical beat
                    rates are a strong short
                  </li>
                  <li>
                    Most powerful when stock has NOT yet declined (pre-crash
                    positioning)
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bull">LATE BULL</span>
                <span className="env-tag vol">VOL EXPANSION</span>
                <span className="env-tag any">EARNINGS SEASON</span>
              </div>
            </div>
          </div>

          {/* CARD 6 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM 13F</div>
              <div>
                <div className="strat-name">
                  13F Crowding Contrarian — Fade Institutional Herding
                </div>
                <div className="strat-origin">
                  EDGAR // Institutional Holdings // Quarterly 13F-HR // Oxford
                  Academic Research
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Counterintuitively, trading <em>against</em> 13F institutional
                imbalances generates alpha. Oxford research (Miori &amp;
                Cucuringu) shows that when institutions have high net-buying
                imbalances (crowded longs), prices are inflated by herding
                behavior. A contrarian strategy — fading the buy imbalances — is
                profitable at 1–2 month horizons (21–42 trading days after
                quarter end). The signal captures mean-reversion from crowding
                effects.
              </p>
              <p>
                This is distinct from the naive "follow smart money" approach.
                The real edge is identifying <em>high-conviction shift</em>{" "}
                names where the imbalance is extreme AND the position is
                clustered among similar funds (sector ETFs, growth-momentum
                funds) — indicating momentum-driven crowding rather than
                fundamental conviction.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Optimal Horizon</div>
                  <div className="m-val up">21–42 days</div>
                </div>
                <div className="metric">
                  <div className="m-label">Strategy Type</div>
                  <div className="m-val">CONTRARIAN</div>
                </div>
                <div className="metric">
                  <div className="m-label">Data Lag</div>
                  <div className="m-val warn">45 days</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Execution Notes</div>
                <ul>
                  <li>
                    13F is filed 45 days after quarter end — data is stale by
                    publication; net imbalances still carry signal
                  </li>
                  <li>
                    Compute buy/sell imbalances: (buyers – sellers) / total
                    institutions reporting position changes
                  </li>
                  <li>
                    High positive imbalance = crowded long = contrarian short
                    candidate (1–2mo horizon)
                  </li>
                  <li>
                    Filter to names where the same type of fund is crowded
                    (e.g., all growth funds, not diverse mix)
                  </li>
                  <li>
                    Avoid small positions — only trade imbalances in stocks with
                    sufficient liquidity (avg volume &gt;$5M/day)
                  </li>
                  <li>
                    Do NOT apply to high-conviction concentrated positions by
                    legendary PMs (different signal)
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bull">LATE BULL</span>
                <span className="env-tag vol">RISK-OFF EVENTS</span>
                <span className="env-tag bear">MARKET TOPS</span>
              </div>
            </div>
          </div>

          {/* CARD 7 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM 8-K</div>
              <div>
                <div className="strat-name">
                  8-K Item Classification — Sentiment-Weighted Event Reaction
                </div>
                <div className="strat-origin">
                  EDGAR Real-Time // 8-K Item Type Classification // LDA Topic
                  Modeling
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Not all 8-K filings are equal. Research using LDA topic modeling
                across 70,000+ 8-K filings found statistically significant
                abnormal returns vary dramatically by Item type. Items showing
                the strongest market reactions: earnings results (2.02), credit
                rating changes (not a separate item, but disclosed via 8.01),
                business strategy pivots, health sector events, and M&amp;A
                disclosures. The edge is being faster at parsing item
                classification than the market.
              </p>
              <p>
                Specific high-edge patterns: Item 4.02 (Non-Reliance on Prior
                Financials) — extremely bearish, often filed Friday after-hours.
                Item 2.03 (Credit Agreement Changes) filed under distress
                conditions. Item 1.05 (Material Cybersecurity Incident, new as
                of 2023) — companies show 15–18% negative abnormal returns over
                12 months post-breach. Item 5.02 (Director departure) combined
                with 8-K filed within 30 days of quarterly earnings = red flag
                for financial distress.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Item 4.02 Signal</div>
                  <div className="m-val down">VERY BEARISH</div>
                </div>
                <div className="metric">
                  <div className="m-label">Cyber Breach 12mo</div>
                  <div className="m-val down">–15–18%</div>
                </div>
                <div className="metric">
                  <div className="m-label">M&amp;A / Credit +AR</div>
                  <div className="m-val up">SIGNIFICANT</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Priority Items to Monitor</div>
                <ul>
                  <li>
                    <strong>Item 4.02</strong>: Non-reliance on prior financials
                    — immediate short signal
                  </li>
                  <li>
                    <strong>Item 2.03</strong>: Credit agreement material
                    changes → check if covenant modification = distress
                  </li>
                  <li>
                    <strong>Item 1.05</strong>: Cybersecurity material incident
                    → long-term negative drift (12-month horizon)
                  </li>
                  <li>
                    <strong>Item 5.02</strong>: Departure of CFO/Controller +
                    "personal reasons" language = strong short
                  </li>
                  <li>
                    <strong>Late Friday filings</strong> (after 4PM ET):
                    Statistically more likely to contain bad news (disclosure
                    timing bias)
                  </li>
                  <li>
                    Set EDGAR real-time alerts via EDGAR Next for specific
                    companies + Item codes
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag any">ALL ENVIRONMENTS</span>
                <span className="env-tag vol">HIGH VOL (amplifier)</span>
              </div>
            </div>
          </div>

          {/* CARD 8 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">DEF 14A + 4</div>
              <div>
                <div className="strat-name">
                  Opportunistic Option Award Timing — Governance Red Flag
                </div>
                <div className="strat-origin">
                  DEF 14A (Proxy) + Form 4 // Option Grant Dates vs. Earnings /
                  Price Dips
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Since late 2024, the SEC requires companies to disclose their
                insider trading policies and how they handle option award
                timing. Companies that consistently grant executive stock
                options just before positive announcements (or just after bad
                news, creating a low strike price) reveal governance risk.
                Cross-referencing DEF 14A executive compensation tables with
                Form 4 option grant dates allows identification of
                "spring-loading" (grants before good news) and "backdating risk"
                patterns.
              </p>
              <p>
                The signal: if a company repeatedly grants options within 5
                trading days before positive 8-K or earnings announcements — or
                within 5 days after sharp stock declines — this is a red flag
                for governance issues that often precede SEC enforcement,
                restatements, or activist intervention. Use as a long-term
                hold/short screen, not a short-term catalyst.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Signal Horizon</div>
                  <div className="m-val">12–24mo</div>
                </div>
                <div className="metric">
                  <div className="m-label">Data Source</div>
                  <div className="m-val">EDGAR</div>
                </div>
                <div className="metric">
                  <div className="m-label">Risk Type</div>
                  <div className="m-val warn">GOVERNANCE</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Detection Method</div>
                <ul>
                  <li>
                    Pull proxy DEF 14A: executive compensation table, option
                    grant dates
                  </li>
                  <li>
                    Cross-reference against 8-K filing dates and earnings
                    release dates from same filing history
                  </li>
                  <li>
                    Flag: option grants occurring 1–5 days before positive 8-Ks
                    or earnings beats (spring-loading)
                  </li>
                  <li>
                    Flag: option grants occurring 1–5 days after &gt;5% price
                    drops (backdating risk)
                  </li>
                  <li>
                    New 2025 requirement: companies must explicitly state
                    insider trading policies — weak/absent policies are
                    themselves a signal
                  </li>
                  <li>
                    Combine with: activist 13D activity (activists use this to
                    pressure boards)
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bull">ANY</span>
                <span className="env-tag any">PRE-REGULATORY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIER III */}
      <div className="tier-block">
        <div className="tier-header t3">
          <div className="tier-num">III</div>
          <div className="tier-title-block">
            <div className="tier-designation">
              TIER 3 // EMERGING / SPECULATIVE
            </div>
            <div className="tier-name">
              Novel Edges — Less Validated, Higher Risk, Longest Setup
            </div>
            <div className="tier-desc">
              Theoretically sound, empirically emerging, legally clear. Require
              significant data infrastructure or are subject to faster decay as
              more participants discover them. Monitor and test; do not deploy
              capital without your own backtesting.
            </div>
          </div>
          <div className="tier-stats">
            <div className="stat-label">EST. CONFIDENCE</div>
            <div className="stat-val down">EMERGING</div>
          </div>
        </div>

        <div className="strategy-grid t3">
          {/* CARD 9 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM N-PORT</div>
              <div>
                <div className="strat-name">
                  Fund Monthly Holdings — Anticipating Rebalance Pressure
                </div>
                <div className="strat-origin">
                  EDGAR // N-PORT (Monthly Fund Holdings, post-2024 rule change)
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Post-2024 SEC rule changes increased reporting frequency for
                many funds to monthly (vs. quarterly). N-PORT filings now reveal
                fund holdings, derivatives exposure, and liquidity
                categorization monthly. By modeling a fund's likely near-term
                rebalancing (due to index reconstitution, investor redemptions,
                or drift from target weights), you can anticipate large-block
                supply or demand before it hits the market.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Data Frequency</div>
                  <div className="m-val up">Monthly</div>
                </div>
                <div className="metric">
                  <div className="m-label">Edge Type</div>
                  <div className="m-val">FLOW</div>
                </div>
                <div className="metric">
                  <div className="m-label">Legal Risk</div>
                  <div className="m-val up">LOW</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Key Signals</div>
                <ul>
                  <li>
                    Identify funds with large position drifts from their stated
                    benchmark — likely forced sellers
                  </li>
                  <li>
                    Track liquidity categories: positions reclassified as
                    "illiquid" often see pressure selling
                  </li>
                  <li>
                    Derivatives (options, swaps) positions in N-PORT can signal
                    directional bets ahead of announcements
                  </li>
                  <li>
                    Combine with redemption pressure signals: declining AUM
                    funds with concentrated illiquid positions face fire-sale
                    risk
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag bear">FUND STRESS</span>
                <span className="env-tag vol">HIGH VOL</span>
              </div>
            </div>
          </div>

          {/* CARD 10 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM PF</div>
              <div>
                <div className="strat-name">
                  Private Fund Macro Positioning — Systemic Risk Gauge
                </div>
                <div className="strat-origin">
                  SEC // Form PF (Private Fund Reporting) // Aggregate Reports to
                  Congress
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Form PF data, aggregated and published in SEC's annual report to
                Congress (most recent: 2025), reveals private fund leverage
                levels, strategy concentration, counterparty exposures, and
                tail-risk positioning. While individual fund data is
                confidential, the aggregate creates macro signals: rising
                leverage at hedge funds + concentrated equity sector exposure =
                potential vol spike trigger. The 2025 PF report showed
                heightened geopolitical sensitivity in private fund
                positioning.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Data Lag</div>
                  <div className="m-val warn">Annual</div>
                </div>
                <div className="metric">
                  <div className="m-label">Use Case</div>
                  <div className="m-val">MACRO</div>
                </div>
                <div className="metric">
                  <div className="m-label">Direct Tradability</div>
                  <div className="m-val warn">INDIRECT</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Macro Applications</div>
                <ul>
                  <li>
                    Aggregate leverage ratios at elevated levels = increase VIX
                    exposure (long vol)
                  </li>
                  <li>
                    Concentration in specific sectors (tech, credit) signals
                    crowding risk — contrarian sector rotation
                  </li>
                  <li>
                    Liquidity mismatches in interval funds = redemption risk
                    signal for affected asset classes
                  </li>
                  <li>Use as regime context, not individual trade trigger</li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Use</div>
                <span className="env-tag any">MACRO REGIME ANALYSIS</span>
                <span className="env-tag vol">VOL POSITIONING</span>
              </div>
            </div>
          </div>

          {/* CARD 11 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FORM 4 + 8-K</div>
              <div>
                <div className="strat-name">
                  Delinquent Form 4 Filing — Information Delay Exploitation
                </div>
                <div className="strat-origin">
                  EDGAR // Form 4 Filing Dates vs. Transaction Dates //
                  Delinquency Analysis
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                Research documents that 8% of Form 4 filings post-SOX are
                delinquent (filed after the required 2-business-day window).
                These violations cluster in periods of high information
                asymmetry — suggesting insiders are deliberately delaying
                disclosure to extend their trading advantage. Identifying
                delinquent filings (transaction date vs. filing date gap &gt;2
                business days) in conjunction with subsequent insider trading
                activity reveals a pattern of information-advantage
                exploitation.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Delinquency Rate</div>
                  <div className="m-val warn">8%</div>
                </div>
                <div className="metric">
                  <div className="m-label">Abnormal Return</div>
                  <div className="m-val up">Higher</div>
                </div>
                <div className="metric">
                  <div className="m-label">Data Complexity</div>
                  <div className="m-val warn">HIGH</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Detection Logic</div>
                <ul>
                  <li>
                    For each Form 4: compare "Date of Earliest Transaction"
                    (field) vs. EDGAR filing date
                  </li>
                  <li>Flag any gap &gt;2 business days as delinquent</li>
                  <li>
                    Delinquent purchase + small-cap = elevated subsequent
                    abnormal return signal
                  </li>
                  <li>
                    Cluster of delinquencies at same company over time =
                    governance risk indicator
                  </li>
                  <li>
                    Combine with blockholder governance data: lower delinquency
                    in well-governed firms
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag any">ANY</span>
                <span className="env-tag vol">HIGH INFO ASYMMETRY</span>
              </div>
            </div>
          </div>

          {/* CARD 12 */}
          <div className="strat-card">
            <div className="strat-card-header">
              <div className="form-tag">FEC + 10-K</div>
              <div>
                <div className="strat-name">
                  Political Contribution → Regulatory Tailwind Mapping
                </div>
                <div className="strat-origin">
                  FEC.gov EFTS // Corporate PAC filings // Cross-referenced with
                  10-K Risk Factors
                </div>
              </div>
            </div>
            <div className="strat-body">
              <p>
                FEC filings show corporate PAC contributions in real-time.
                Companies or industries making large, clustered PAC
                contributions to members of a specific regulatory committee — in
                the 6–18 months before an expected regulatory decision — often
                reflect insider knowledge about upcoming favorable regulatory
                outcomes. Cross-referencing with 10-K risk factor language that
                anticipates regulatory relief ("we expect the regulatory
                environment to evolve favorably…") strengthens the signal.
              </p>

              <div className="metrics-row">
                <div className="metric">
                  <div className="m-label">Horizon</div>
                  <div className="m-val">12–18mo</div>
                </div>
                <div className="metric">
                  <div className="m-label">Edge Type</div>
                  <div className="m-val">POLITICAL</div>
                </div>
                <div className="metric">
                  <div className="m-label">Validation</div>
                  <div className="m-val warn">EMERGING</div>
                </div>
              </div>

              <div className="signal-list">
                <div className="sl-title">Research Methodology</div>
                <ul>
                  <li>
                    Pull FEC EFTS API for corporate PAC contributions by sector,
                    by committee membership
                  </li>
                  <li>
                    Map contributions to specific regulatory decision timelines
                    (FERC, FDA, FCC, etc.)
                  </li>
                  <li>
                    Cross-reference with 10-K risk factor language shifts —
                    optimistic regulatory language = positive signal
                  </li>
                  <li>
                    Strongest in sectors with binary regulatory outcomes: pharma
                    (FDA), energy (FERC), telecom (FCC), defense (NDAA)
                  </li>
                  <li>
                    This is legal public-information analysis, not lobbying
                    intelligence — data is all public record
                  </li>
                </ul>
              </div>

              <div className="env-tags-section">
                <div className="et-label">Optimal Environments</div>
                <span className="env-tag any">ELECTION CYCLE</span>
                <span className="env-tag any">REGULATORY CYCLE</span>
              </div>

              <div className="caution-box">
                <strong>Note:</strong> This is the least validated strategy
                here. Consider it a research framework, not a deployed edge,
                until you have personally backtested it with rigorous controls
                for confounding factors.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACKTESTING REFERENCE TABLE */}
      <div className="backtest-section">
        <div className="section-header">
          <h2>BACKTESTED RETURN REFERENCE</h2>
          <span className="label">ACADEMIC + EMPIRICAL SOURCES</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="backtest-table">
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Form(s)</th>
                <th>Signal Type</th>
                <th>Reported Alpha / Return</th>
                <th>Holding Period</th>
                <th>Universe</th>
                <th>Key Caveat</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="strat-col">
                  Insider Cluster Buy (Microcap)
                  <span className="tier-pill pill-t1">T1</span>
                </td>
                <td>Form 4</td>
                <td>Long</td>
                <td className="up">
                  +6.3% mean CAR (post-10% dip cohort); AUC 0.70
                </td>
                <td>6 months</td>
                <td>$30M–$500M mkt cap</td>
                <td>
                  70–80% alpha decays before filing date; residual only in
                  small-cap
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  NT 10-Q Distress Short
                  <span className="tier-pill pill-t1">T1</span>
                </td>
                <td>Form 12b-25</td>
                <td>Short</td>
                <td className="down">
                  –1.17% day-of; continued negative drift months following
                </td>
                <td>1–6 months</td>
                <td>All public co.</td>
                <td>
                  Accounting-reason NT 10-Qs &gt; operational delays in signal
                  strength
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  Activist 13D Catalyst
                  <span className="tier-pill pill-t1">T1</span>
                </td>
                <td>Sch. 13D</td>
                <td>Long</td>
                <td className="up">
                  +10.3% excess return 18mo (HBS); +22.2% annualized (13D
                  Monitor)
                </td>
                <td>12–24 months</td>
                <td>All public co.</td>
                <td>
                  5-day disclosure window (2024 rule) reduced pre-filing
                  accumulation edge
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  Congressional Trades
                  <span className="tier-pill pill-t1">T1</span>
                </td>
                <td>STOCK Act</td>
                <td>Long/Short</td>
                <td className="up">
                  Short positions: significant positive abnormal returns; Long:
                  weaker
                </td>
                <td>60–90 days</td>
                <td>US equities</td>
                <td>
                  45-day disclosure lag; signal best for committee-relevant
                  sector trades
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  MD&amp;A Linguistic Decay
                  <span className="tier-pill pill-t2">T2</span>
                </td>
                <td>10-K / 10-Q</td>
                <td>Short / Vol</td>
                <td className="down">
                  Statistically significant crash probability increase with
                  fog/sentiment shift
                </td>
                <td>6–18 months</td>
                <td>All public co.</td>
                <td>
                  Requires NLP pipeline; SarbOx-era filings more informative
                  than pre-SOX
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  13F Crowding Contrarian
                  <span className="tier-pill pill-t2">T2</span>
                </td>
                <td>Form 13F</td>
                <td>Short (contrarian)</td>
                <td className="up">
                  Profitable at 21–42 day horizon post-quarter-end (Oxford
                  study)
                </td>
                <td>1–2 months</td>
                <td>Liquid US equities</td>
                <td>
                  Data 45-day stale; net imbalance still carries signal vs.
                  crowded longs
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  8-K Item Type Classification
                  <span className="tier-pill pill-t2">T2</span>
                </td>
                <td>Form 8-K</td>
                <td>L/S event-driven</td>
                <td>
                  Item 4.02: immediate bearish; Cyber breach: –15–18% over 12mo
                </td>
                <td>Event-driven</td>
                <td>All public co.</td>
                <td>
                  Real-time parsing required; Friday after-market timing
                  critical
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  Option Award Spring-Loading
                  <span className="tier-pill pill-t2">T2</span>
                </td>
                <td>DEF 14A + 4</td>
                <td>Short (governance)</td>
                <td className="warn">
                  Long-horizon governance risk; often precedes restatements /
                  activist
                </td>
                <td>12–24 months</td>
                <td>All public co.</td>
                <td>
                  Signal is slow; combine with other catalysts for actionability
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  N-PORT Rebalance Anticipation
                  <span className="tier-pill pill-t3">T3</span>
                </td>
                <td>Form N-PORT</td>
                <td>Flow-based</td>
                <td className="warn">
                  Theoretical; empirical validation limited; 2024 rule change is
                  recent
                </td>
                <td>Days–weeks</td>
                <td>Fund-held equities</td>
                <td>
                  New data availability; alpha may decay quickly as more
                  participants access
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  Delinquent Form 4 Detection
                  <span className="tier-pill pill-t3">T3</span>
                </td>
                <td>Form 4</td>
                <td>Long</td>
                <td className="warn">
                  Higher abnormal returns than timely filings; 8% delinquency
                  rate
                </td>
                <td>1–6 months</td>
                <td>US equities</td>
                <td>
                  Requires date-field parsing; governance risk identification
                  secondary use
                </td>
              </tr>
              <tr>
                <td className="strat-col">
                  FEC PAC → Regulatory Mapping
                  <span className="tier-pill pill-t3">T3</span>
                </td>
                <td>FEC + 10-K</td>
                <td>Long (sector)</td>
                <td className="warn">
                  Theoretically sound; limited rigorous backtesting in
                  literature
                </td>
                <td>12–18 months</td>
                <td>Regulated sectors</td>
                <td>
                  Many confounders; treat as qualitative screen, not
                  quantitative signal
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EXECUTION GUIDE */}
      <div className="section-header">
        <h2>EXECUTION FRAMEWORK</h2>
        <span className="label">HOW TO DEPLOY</span>
      </div>

      <div className="exec-guide">
        <div className="exec-step">
          <div className="step-num">01</div>
          <h4>Set Up EDGAR Real-Time Alerts</h4>
          <p>
            Use <code>efts.sec.gov</code> (EDGAR Full-Text Search) and EDGAR
            Next alerting to monitor Form 4, 12b-25, 8-K, and Schedule 13D in
            real-time. Set company-specific and industry-wide alerts. RSS feeds
            are available for all form types at{" "}
            <code>sec.gov/cgi-bin/browse-edgar</code>. For programmatic access,
            use the EDGAR REST API (<code>data.sec.gov/submissions</code>).
          </p>
        </div>
        <div className="exec-step">
          <div className="step-num">02</div>
          <h4>Quantitative Signal Validation</h4>
          <p>
            Never trade a single filing in isolation. For each strategy,
            establish a minimum signal threshold: e.g., Form 4 cluster requires
            ≥3 insiders AND ≥10% below 52-week high. Build a simple scoring
            model (1–10) incorporating signal strength, company fundamentals,
            and market environment. Only deploy on signals scoring ≥7.
          </p>
        </div>
        <div className="exec-step">
          <div className="step-num">03</div>
          <h4>Environment-Adaptive Weighting</h4>
          <p>
            Current environment (Apr 2026): elevated rates + active vol. This
            favors <strong>Tier 1 short signals</strong> (NT 10-Q, late 8-K
            items) and <strong>activist 13D longs</strong> in beaten-down
            small/mid-cap names. Reduce exposure to 13F contrarian plays until
            vol normalizes. Weight Tier 1 at ~60% of capital allocated to this
            strategy set.
          </p>
        </div>
        <div className="exec-step">
          <div className="step-num">04</div>
          <h4>Position Sizing &amp; Risk Controls</h4>
          <p>
            For small-cap insider buys: position size should account for
            illiquidity. Use a maximum 2–5% of portfolio per position. For NT
            10-Q shorts: be aware of potential short squeezes if company files
            within grace period; use options (puts) where possible to cap
            downside. Set hard stops at 15–20% loss on any individual position.
          </p>
        </div>
        <div className="exec-step">
          <div className="step-num">05</div>
          <h4>Compliance Documentation</h4>
          <p>
            Maintain a trading log documenting: the specific EDGAR filing URL
            that triggered each trade, the date of public availability, and
            your trading date. This demonstrates you acted on <em>public</em>{" "}
            information. Consult a securities attorney if your firm has a
            compliance program — ensure this strategy is covered under your
            procedures. These are <strong>not</strong> insider trading
            strategies; they are public information arbitrage.
          </p>
        </div>
        <div className="exec-step">
          <div className="step-num">06</div>
          <h4>Continuous Monitoring &amp; Adaptation</h4>
          <p>
            Filing-based edges decay as more participants adopt them. Monitor
            alpha performance quarterly. If signal predictiveness drops, the
            edge may be arbitraged away. Continuously search for new form types
            (PCAOB audit reports, CFTC swap data, FTC HSR filings) as emerging
            sources of legal informational advantage. Tier 3 strategies of today
            are Tier 1 candidates tomorrow.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="report-footer">
        <span>GOV FILING ALPHA FRAMEWORK // {analysisDate}</span>
        <span>
          ALL DATA SOURCES: PUBLIC GOVERNMENT FILINGS // EDGAR · FEC · STOCK ACT
          · PACER
        </span>
        <span>
          LEGAL STATUS: PUBLIC INFORMATION ARBITRAGE — NOT INSIDER TRADING
        </span>
      </div>
    </div>
  );
}

export default App;
