# 🧠 SyncMind — AI Silent Teammate

> Your invisible AI companion for meetings. Captures context, surfaces insights, and tracks action items — so you can stay focused on the conversation.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ What is SyncMind?

SyncMind is an **AI-powered meeting assistant** that works silently in the background. While you focus on the conversation, SyncMind captures key moments, detects action items, flags risks, and delivers real-time insights — all through a sleek, non-intrusive floating UI.

> **🚧 This is the frontend web dashboard.** A standalone desktop application is currently under development and will integrate with this platform for a complete end-to-end experience.

---

## 🎯 Features

### 🖥️ Dashboard
- **Meeting Library** — Browse, search, and review past meetings with transcripts
- **AI Insights** — Automatically generated summaries, recommendations, and action items
- **Profile & Settings** — User management with Light/Dark theme toggle



### 🎨 Design
- Glassmorphism dark UI with backdrop blur
- Smooth animations (pulse, slide-up, fade-in)
- Full Dark/Light mode support
- Responsive layout with Inter typography
- 3D floating lines background on landing page

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| 3D Effects | Three.js |
| Font | Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TejasSharma356/SyncMind.git

# Navigate to the project
cd SyncMind/syncmind

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available after deploying shortly.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
syncmind/
├── public/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx        # Hero + features landing page
│   │   ├── Sidebar.jsx            # Navigation + Start Capture
│   │   ├── MeetingList.jsx        # Searchable meeting list
│   │   ├── MeetingDetails.jsx     # Transcript + AI insights view
│   │   ├── AIInsightCard.jsx      # Inline AI insight component
│   │   ├── Insights.jsx           # Insights & recommendations page
│   │   ├── Settings.jsx           # Settings + theme toggle
│   │   ├── Profile.jsx            # User profile page

│   │   ├── FloatingLines.jsx      # Three.js background effect
│   │   └── FloatingLines.css      # Background styles
│   ├── data/
│   │   └── mockData.js            # Sample meetings & transcripts
│   ├── App.jsx                    # Root component + routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🗺️ Roadmap

- [x] Landing page with 3D background
- [x] Dashboard with meeting management
- [x] Dark/Light theme toggle

- [ ] 🔜 Desktop application (standalone software)
- [ ] 🔜 Real-time audio capture & transcription
- [ ] 🔜 AI-powered insight generation (LLM integration)
- [ ] 🔜 Desktop ↔ Web dashboard sync
- [ ] 🔜 Team collaboration features
- [ ] 🔜 Meeting analytics & reporting

---

## 🤝 Contributing

This project is currently in active development. Contributions, ideas, and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Tejas Sharma**
- GitHub: [@TejasSharma356](https://github.com/TejasSharma356)

---

<p align="center">
  Built with ❤️ by Tejas Sharma
</p>
