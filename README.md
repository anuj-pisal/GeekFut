<div align="center">
  <img src="public/newLogo.png" alt="GFGFUT Logo" width="200" />
  
  <h1>GFGFUT (GeeksforGeeks Ultimate Team)</h1>
  <p><strong>Turn your GeeksforGeeks profile into an EA Sports FC / Ultimate Team style player card!</strong></p>

  <p>
    <a href="https://geek-fut-theta.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-geek--fut.vercel.app-10b981?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma" alt="Prisma" />
  </p>

  <p>
    <a href="#what-it-does">What it does</a> •
    <a href="#how-the-ratings-work">How Ratings Work</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#local-development">Local Development</a>
  </p>
</div>

---

> **Disclaimer:** GFGFUT is a fan-made, unofficial open-source project. It is not affiliated with GeeksforGeeks, EA Sports, or FIFA. Card ratings are a fun, heuristic calculation derived from public profile stats and do not represent an official skill assessment.

## 🚀 What it does

Enter any valid GeeksforGeeks username into GFGFUT, and the app will instantly scrape and fetch that user's public coding statistics. The app maps these programming metrics into a FIFA-style rating system, assigning:
- An **Overall Rating (OVR)** out of 99.
- Individual attributes: **Pace**, **Shooting**, **Passing**, **Dribbling**, **Defending**, and **Physical**.
- An **Ultimate Team Card Tier** (Bronze, Silver, Gold, or Icon).
- A specialized **Position** on the pitch (ST, CAM, CB, etc.) based on your coding playstyle.

The final result is a beautiful, downloadable, 3D-interactive player card featuring the user's avatar, institution, and statistics.

<div align="center">
  <img src="public/cards/gold.png" alt="Card Preview" width="300" />
</div>

## ⚽ How the Ratings Work

We use a carefully balanced mathematical algorithm to convert code into football attributes:

- **Pace (PAC):** Built for the sprinters. Driven heavily by your **Current & Max Streaks**.
- **Shooting (SHO):** For the big scorers. Scales purely on your raw **Coding Score**.
- **Passing (PAS) & Dribbling (DRI):** For the playmakers. Scales on the total volume of **Problems Solved**.
- **Defending (DEF):** For the anchors. Derived via a logarithmic scale from your **Institution Rank**. The closer you are to #1 in your college, the better your defending.
- **Physical (PHY):** An all-around endurance stat blending both coding score and problems solved.

**Positions** are assigned based on a weighted formula. If your Shooting dominates, you'll be a Striker (ST). If you have elite Streaks, you'll be placed on the Wing (LW/RW). Massive Institution Ranks breed elite Center Backs (CB).

## 🛠 Tech Stack

Built for speed, beautiful aesthetics, and seamless 3D interactions.

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS & Custom Vanilla CSS (for complex 3D perspective/glassmorphism)
- **Database:** Supabase (PostgreSQL) + Prisma ORM (for caching scouted profiles)
- **Data Fetching:** Custom Node-based HTML scraper chain with intelligent fallbacks
- **Deployment:** Vercel

## 📚 Project Documentation

If you're a developer or agent looking to contribute, please refer to the following specs (read `AGENTS.md` first):

| Document | Purpose |
|---|---|
| `PRD.md` | Scope, Goals/Non-goals, Product requirements |
| `ARCHITECTURE.md` | System design, Provider fallback chain logic |
| `API_SPEC.md` | Internal API contracts and normalized data shapes |
| `DESIGN_SYSTEM.md` | Design tokens, animations, and component contracts |
| `TASKS.md` | The ordered build plan and current phase status |

## 💻 Local Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/gfgfut.git
cd gfgfut
npm install
```

Set up your `.env` file with your database URL, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Scripts

```bash
npm run dev         # local dev server
npm run build       # production build
npm run lint        # run ESLint
npm run typecheck   # run TypeScript compiler check
```
