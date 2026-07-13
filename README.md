# ⚽ Estoril Praia Analytics Hub

> A full-stack analytics dashboard for Grupo Desportivo Estoril Praia — real standings, results and squad data synced from a football API, rendered with club-branded charts. Built for portfolio.

Estoril Praia Analytics Hub combines real data — synced from the football-data.org API and cached in its own database — with a clear "About the Data" page documenting every source, so nothing is ever presented as real when it isn't. Standings, results, upcoming fixtures and season charts are all rendered in Estoril Praia's own yellow and navy, with full English/European-Portuguese bilingual support and light/dark themes.

## 📦 What's Inside

- 🏆 **Live standings** for Liga Portugal, with Estoril's row highlighted
- 📅 **Recent results and upcoming fixtures**, with a live countdown to the next match
- 👥 **Squad page** — 23 current players: name, shirt number and position from the official club site, age/nationality/market value cross-checked against ZeroZero.pt (age is approximate; market value isn't available for every player — never guessed, left blank instead)
- 🕰️ **Club history timeline** — milestones, promotions/relegations and titles since 1939, a manually curated dataset cross-checked against Wikipedia
- 📰 **News page** — manually entered from the official club site, database-backed so new posts don't require a deploy
- 📈 **Points evolution by matchday**, **goals scored vs conceded**, and **home vs away performance** charts (Recharts, club-branded, accessible color palette)
- 📄 **"About the Data" page** — documents every data source, update frequency and known limitations
- 🇵🇹 🇬🇧 Full bilingual interface (European Portuguese / English) via `next-intl`, with a one-click language switcher
- 🌗 Light and dark themes, respecting the visitor's system preference with a manual override
- ⏱️ **Scheduled sync** — a Vercel Cron Job fetches football-data.org once a day and writes into the project's own Postgres database; the site itself never calls the external API on a visit
- 🗄️ A schema already modeling later phases (club history, market values, finance snapshots, simulated metrics) so the project can grow past its MVP without a rewrite

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat&logo=postgresql&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat)
![next-intl](https://img.shields.io/badge/next--intl-000000?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

## 🏗️ Architecture

Next.js App Router with locale-based routing for the bilingual UI, and Prisma + Neon Postgres as the single source of truth for anything fetched from football-data.org:

```
DashboardEstorilPraia/
├── prisma/
│   └── schema.prisma            # Full data model (teams, matches, stats, and later-phase tables)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # Root HTML shell, theme script, header/footer
│   │   │   ├── page.tsx         # Home — standings, fixtures, charts
│   │   │   ├── sobre-dados/     # "About the Data" page
│   │   │   └── globals.css      # Design tokens (club colors, light/dark)
│   │   ├── api/cron/sync/       # Vercel Cron endpoint — syncs football-data.org into Postgres
│   │   └── icon.tsx             # Generated club-colored favicon
│   ├── components/
│   │   ├── layout/              # Header, footer, language switcher, theme toggle
│   │   └── home/                # Standings table, match cards, countdown, charts
│   ├── lib/
│   │   ├── football-data/       # API client + sync logic
│   │   ├── data/                # Prisma query layer consumed by pages
│   │   └── prisma.ts            # Prisma Client, wired to Neon's serverless driver adapter
│   └── i18n/                    # next-intl routing/config
├── messages/                    # pt.json / en.json translation dictionaries
└── vercel.json                  # Cron schedule for the daily sync
```

### Why these choices

- **Next.js App Router**: one codebase for the UI and the API routes that do the syncing — no separate backend service needed for an MVP.
- **PostgreSQL on Neon**: relational data (standings, fixtures, player stats) benefits from real joins and constraints; Neon's free tier and serverless driver fit a project with no dedicated server.
- **Prisma**: schema-as-code keeps the data model, including tables reserved for later phases, in one reviewable file, and generates a fully-typed client.
- **Cron-based sync, not on-demand fetching**: football-data.org's free tier has strict rate limits. A scheduled job that writes into Postgres once a day means every visitor hits the project's own fast database, never the external API.

## 🌐 Language

Every page ships in European Portuguese and English via `next-intl`, with locale-prefixed routes (`/pt`, `/en`) and a segmented switcher in the header. The interface defaults to Portuguese, matching the club's home market.

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/VidiPT89/DashboardEstorilPraia.git
cd DashboardEstorilPraia

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# - DATABASE_URL: a free Postgres database from https://neon.tech
# - FOOTBALL_DATA_API_KEY: a free key from https://www.football-data.org/client/register
# - FOOTBALL_DATA_ESTORIL_TEAM_ID: numeric team ID (see comment in .env.example)

# 4. Create the database schema
npm run db:migrate

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Standings and fixtures will be empty until the sync has run at least once — trigger it manually in development with:

```bash
curl http://localhost:3000/api/cron/sync
```

In production, this same endpoint is called automatically once a day by the Vercel Cron Job defined in `vercel.json`.

To add a news post, open Prisma Studio (`npm run db:studio`) and add a row to `NewsPost` — no code change or deploy needed.

## 📊 Data Sources

All data sources, update frequency and known limitations are documented in full on the **"About the Data"** page (`/sobre-dados` / `/about the data`). In short:

- Standings, results and fixtures — [football-data.org](https://www.football-data.org/) (free tier), synced daily
- Squad — manual entries in the database: name/number/position from the [official club site](https://estorilpraia.pt/plantel/equipa-principal), age/nationality/market value cross-checked against [ZeroZero.pt](https://www.zerozero.pt/) (Sofascore's values are JS-rendered and FBref doesn't publish market values, so neither was usable in practice; Transfermarkt is never used, per its terms of use)
- Club history — manual dataset in `src/data/club-history.ts`, cross-checked against Wikipedia
- News — manual entries in the database, sourced from the official club site
- Financial snapshots — manual dataset from public sources, added as the project grows past its MVP
- Any future simulated metric (fatigue, GPS, wearables) will always carry a visible "Simulated data" badge and is never presented as real

## 📝 Notes

- This is a portfolio project — it favors a complete, working MVP (Fase 1 of the original spec: live standings, fixtures and squad) over an ambitious but unfinished feature set.
- The database schema already models Fase 2/3 tables (club history, market values, finance snapshots, simulated metrics) so those features can be added without a schema rewrite.
- No payment is required to run this project — Neon, Vercel and the football-data.org API key are all used on their free tiers.

## 📄 License

MIT — see [LICENSE](LICENSE).

---

Developed by **David Arsénio Martins**
🌐 [ividi.dev](https://ividi.dev/) · 💻 [github.com/VidiPT89](https://github.com/VidiPT89/)
