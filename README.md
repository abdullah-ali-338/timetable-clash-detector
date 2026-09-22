# Timetable Clash Detector

A responsive client-side web application designed to help university students detect and prevent overlapping class schedules during course registration.

Live Demo: https://timetable-clash-detector.vercel.app/

---

## How to Run the Project

The application runs purely on static web standards (HTML5, Vanilla CSS, and JavaScript) without third-party runtime dependencies or build steps.

### Method 1: Direct Browser Launch
1. Clone the repository:
   git clone https://github.com/abdullah-ali-338/timetable-clash-detector.git
2. Open the directory on your local machine.
3. Double-click `index.html` or open it directly in any modern browser.

### Method 2: Local Static Server (Recommended)
If using VS Code:
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Click **Go Live** in the bottom status bar, or run:
   npx serve .

---

## Architectural Decision Records (ADRs)

### Decision 1: Pure Client-Side State and In-Memory Clash Validation
* **Context & Decision:** Validate lecture time slots and detect timetable conflicts directly in the browser's JavaScript memory and persist sessions using browser `localStorage`.
* **Alternatives Considered:** Building a lightweight Node.js/Express backend API or using a Serverless Firebase/Supabase backend to store courses and compute overlaps server-side.
* **Why this option:** Eliminates infrastructure setup, reduces hosting complexity to zero-cost static hosting (Vercel/GitHub Pages), and provides instant feedback without network latency.
* **What it costs (The Tradeoff):** 
  * Schedules are tied directly to an isolated browser profile. A student cannot switch from their laptop to their mobile device without manually re-entering their courses.
  * Clearing browser cache purges all saved schedules unless explicit manual export/import tools are built.

---

### Decision 2: Vanilla JavaScript and Native Web Standards vs. UI Component Frameworks
* **Context & Decision:** Built entirely with plain HTML5, CSS3, and vanilla JavaScript (ES6+) without bundlers (Vite, Webpack) or frameworks (React, Vue).
* **Alternatives Considered:** React with Tailwind CSS or Next.js.
* **Why this option:** Zero configuration, zero build time, and immediate deployment portability. Any team member or reviewer can inspect and run the code without running `npm install`.
* **What it costs (The Tradeoff):** 
  * Scalability of DOM manipulation. As soon as dynamic visual timetable grids, drag-and-drop slots, and complex UI states expand, manual DOM operations become tedious and prone to synchronization bugs compared to a declarative virtual DOM.

---

### Decision 3: Simple String Time Intervals (`HH:MM`) Instead of Standardized Unix Epoch / UTC Timestamps
*(Decision that proved awkward during implementation)*
* **Context & Decision:** Course start and end times were stored and compared as raw 24-hour string values (e.g., `"08:30"`, `"10:00"`) paired with an explicit day string (e.g., `"Monday"`).
* **Alternatives Considered:** Parsing all inputs into normalized JavaScript `Date` objects or converting lecture bounds into total minutes from midnight (`hours * 60 + minutes`) as a standard numeric value.
* **Why this option:** Kept the payload intuitive and directly compatible with standard HTML `<input type="time">` elements without upfront parsing overhead.
* **What it costs & Why it proved awkward:** 
  * Overlap math (`startA < endB && endA > startB`) directly on string comparisons required strict string zero-padding and broke down whenever handling flexible time boundaries or overnight edge cases.
  * Comparing durations, rendering dynamic multi-hour blocks visually on a schedule grid, and formatting 12-hour/24-hour conversions later required frequent on-the-fly conversion logic scattered across UI functions, making the time calculation logic far messier than if stored as integer minute offsets from midnight from day one.
<!-- input validation updated -->
