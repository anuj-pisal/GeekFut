<div align="center">

<img src="public/newLogo.png" width="360" alt="GFGFUT">

# GFGFUT

**your GeeksforGeeks profile, rated out of 99** ⚽

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2600&pause=800&color=00FF66&center=true&vCenter=true&width=750&height=42&lines=Turn+any+GeeksforGeeks+profile+into+an+Ultimate+Team+card;Scored+live+from+coding+scores%2C+streaks+%26+institute+ranks;Beautiful%2C+interactive%2C+and+downloadable" alt="Turn any GeeksforGeeks profile into a player card, scored live">

<br/>

<a href="https://geek-fut-theta.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-geek--fut.vercel.app-10b981?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

<br/>

> **Disclaimer:** GFGFUT is a fan-made, unofficial open-source project. It is not affiliated with GeeksforGeeks, EA Sports, or FIFA. Ratings are a heuristic calculation derived from public profile stats.

## ⚽ &nbsp;What it does

Drop in any valid GeeksforGeeks username and GFGFUT scouts the public profile, reads six real coding signals, and prints a **FIFA-Ultimate-Team-style player card** rated out of 99. Position, tier, stats and all. No manual input, no self-reporting. Just pure coding stats mapped to the pitch.

| | |
|:--|:--|
| 🃏 **Player card** | Your GeeksforGeeks profile transforms into a sleek, rated-out-of-99 3D interactive card. |
| 📈 **Live scouting** | Stats are fetched live from public GFG data — including your coding score, streaks, problems solved, and institute rank. |
| 🥇 **Tiers** | Bronze → Silver → Gold → Icon. Your tier is dictated by your overall consistency and mastery. |
| ⚔️ **Positions** | Whether you're a Striker, Winger, Playmaker, or Defender, the algorithm automatically determines your optimal position based on your stat distribution. |
| 🖼️ **Downloadable** | Export your player card as a high-quality PNG to share with your friends or your college crew. |

<br/>

## ⚙️ &nbsp;How the scouting works

Your overall rating isn't just an average—it is a carefully weighted formula depending on your playstyle. We extract six signals from your GeeksforGeeks data and map them directly into classic FIFA attributes:

| Stat | Name | Scouted from |
|:--:|:--|:--|
| **PAC** | Pace | Current & Max Streak (Built for the consistent sprinters) |
| **SHO** | Shooting | Raw Coding Score (For the big volume scorers) |
| **PAS** | Passing | Total Problems Solved (Delivering high-volume solutions) |
| **DRI** | Dribbling | Total Problems Solved (Navigating through complex logic) |
| **DEF** | Defending | Institute Rank (The anchor of your college leaderboards) |
| **PHY** | Physical | A blend of Coding Score + Problems Solved |

Your **position** is read directly from your stat shape. A massive Institute Rank will breed an elite Center Back (CB). Huge raw Coding Scores produce Strikers (ST). The ultimate balanced profile builds modern Fullbacks and Central Midfielders.

Every card walks out with a unique Tier:

<div align="center">

![Bronze](https://img.shields.io/badge/BRONZE-%E2%89%A464-CD7F32?style=flat-square&labelColor=2A1A0C)
![Silver](https://img.shields.io/badge/SILVER-65--74-AAB2BD?style=flat-square&labelColor=262B33)
![Gold](https://img.shields.io/badge/GOLD-75--89-E6B422?style=flat-square&labelColor=3A2806)
![Icon](https://img.shields.io/badge/ICON-90%2B-F3D688?style=flat-square&labelColor=2A1A45)

</div>

<br/>

## 🚀 &nbsp;Run it locally

You can run GFGFUT locally in minutes. The project uses a custom Node-based scraping chain to fetch GeeksforGeeks data and caches it in a Supabase PostgreSQL database via Prisma to prevent rate-limiting.

```bash
git clone https://github.com/anuj-pisal/GeekFut.git
cd GeekFut
npm install
```

Set up your `.env` file with your Supabase PostgreSQL connection string and an optional rate limit:

```bash
# .env
DATABASE_URL=postgresql://postgres.xxx:password@aws.supabase.com:5432/postgres?pgbouncer=true
RATE_LIMIT_PER_MINUTE=20
```

Fire up the development server:

```bash
npm run dev            # http://localhost:3000
```

<br/>

## 🧱 &nbsp;Built with

**Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS 4** · **Supabase (PostgreSQL)** · **Prisma ORM** · Custom Vanilla CSS 3D Glassmorphism

<br/>

<div align="center">

**built by [@anuj-pisal](https://github.com/anuj-pisal)** 

<img src="https://capsule-render.vercel.app/api?type=waving&height=90&color=0:00FF66,100:008F39&section=footer" alt="" width="100%">

</div>
