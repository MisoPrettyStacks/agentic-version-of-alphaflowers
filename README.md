# agentic-version-of-alphaflowers
agentic version of alphaflowers

# GOV FILING ALPHA — Market Inefficiency Intelligence System

An autonomous, serverless market scanning agent and analytical dashboard running 
100% free on GitHub infrastructure. This project leverages **GitHub Actions** as
a backend automation cron-engine and **GitHub Pages** for data delivery and 
visualization.

---

## 📊 System Architecture

[ Frontend: GitHub Pages ]  ◄─── (Free Hosting Serverless Client)
│▼ (Asynchronously Fetches Live State Matrix Data)
[ data.json ]
▲│ (Automated Git Commit Pushes Update Every Hour)
[ Backend: GitHub Actions Cron Trigger ] ───► Runs scanner.py (Linux VM)



- **Frontend Client UI (`index.html`)**: A responsive terminal dashboard built with Tailwind CSS and Chart.js. It runs completely client-side, dynamically pulling analytics from the repository's state files without relying on continuous web-server parsing.
- **Agent Intelligence Backend (`scanner.py`)**: A native Python worker that pulls asset metrics from public endpoints, evaluates standard deviation thresholds for structural anomalies, and structures real-time data payloads.
- **Automation Pipeline (`.github/workflows/scan.yml`)**: An automated orchestration engine that initializes a headless cloud VM environment on an hourly cron schedule, spins up the data agent, logs variances, and pushes delta updates back to the project branch.

---

## 🛠️ Step-by-Step Installation & Deployment

Follow these parameters to launch this autonomous system under your own profile:

### 1. Create a Repository
1. Log into your **GitHub Account** and create a new **Public** repository.
2. Select **Public** (required to access free GitHub Pages tiers for standard code accounts).

### 2. Populate Files
Upload the core project tracking modules exactly as structured into your main directory tier:
* `index.html` (Frontend UI Engine)
* `scanner.py` (Autonomous Python Parsing Script)
* `.github/workflows/scan.yml` (Serverless Orchestration Script Workflow)

### 3. Initialize GitHub Pages Hosting
1. Navigate to your new repository’s **Settings** tab.
2. Select **Pages** from the left navigation sub-panel (under *Code and automation*).
3. Under the **Build and deployment** settings, change the **Branch** selection dropdown from *None* to **main** (or *master*).
4. Click **Save**.

### 4. Boot the Automation Agent (First-Time Initialization)
Because the frontend dashboard maps data straight from `data.json`, you must activate the scanning script to generate the first payload:
1. Click the **Actions** tab at the top panel of your repository.
2. Under the left workflow sidebar menu, click on **Autonomous Data Scanning Agent**.
3. Locate the **Run workflow** dropdown button on the right-hand side, and select **Run workflow**.
4. Allow 60–90 seconds for the free Linux VM to provision, query the market APIs, write `data.json`, and commit it back to your source tree.

Your live tracking matrix will now update automatically every single hour and remain accessible globally at:
`https://<your-username>.github.io/<your-repository-name>/`

---

## ⚙️ Modifying Analytics Parameters

To alter tracking behaviors or track alternate assets, update the mapping structures 
directly inside your `scanner.py` script:

* **Update Targets**: Modify the public URL API endpoint array parameters to match
* other market index feeds.
* **Adjust Sensitivity Thresholds**: Update the internal conditional operators
* (`abs(change_24h) > 1.5`) to loosen or tighten how frequently the agent declares
*  an active market anomaly event log.

---

## ⚖️ License & Disclaimers
This framework is built exclusively for informational, personal portfolio architecture prototyping, and educational resource tracking. It does not provide real financial advice. All API calls, runtime scripts, and deployments operate natively on public infrastructure layers without active database maintenance costs.
