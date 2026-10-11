# 📅 Timetable Clash Detector

![License](https://img.shields.io/badge/License-Personal_Use-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5_%7C_CSS3_%7C_JS-orange?style=for-the-badge)

A responsive client-side web application designed to help university students detect and prevent overlapping class schedules during course registration.

---

## ✨ Features

- **In-Memory Clash Detection:** Instant time-slot conflict validation directly in the browser with zero network latency.
- **Client-Side Persistence:** LocalStorage session persistence keeping course schedules saved across page reloads without requiring account creation.
- **Zero-Build Lightweight Setup:** Pure static web standards architecture requiring no bundlers, frameworks, or server-side setup.
- **Intuitive Time Validation:** Parses and compares course bounds to detect overlapping lectures across week days.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** Web Storage API (LocalStorage)

---

## 📁 Repository Structure

```text
TimetableClashDetector/
├── index.html          # Core single-file application interface
├── script.js           # Clash validation logic and DOM state handler
├── style.css           # Custom layout and styling rules
└── README.md           # Project documentation
