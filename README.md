# SmartOrg

Public marketing + funnel site for **SmartOrg** (smartorg.tools). Caleb Allen's
nonprofit AI build practice, program name *The Six Week Build Plan*.

Static HTML, zero build step. Deployed on Vercel.

## Pages (the funnel)

| Path | Purpose |
|---|---|
| `/` (`index.html`) | Landing page |
| `/instant-blueprint` | Quiz / friction gate that self-qualifies and books the Details Call |
| `/case-study-evolor` | Evolor build-story case study |
| `/donor-file-health-check` | Lead magnet |
| `/ai-readiness-scorecard` | Lead magnet |
| `/grantmakers` | Grantmaker test lane |
| `/demos/evolor`, `/demos/relay`, `/demos/echo` | Product demo case studies |
| `/demos/evolor-staging` | Entry point to the live Evolor demo tenant |

## Deploy

Zero-config static site. Connect the repo to Vercel; no framework preset, no
build command, output = repo root. `cleanUrls` serves pages without the `.html`
extension.

## Not in this repo (intentionally)

Per-client Blueprint/pitch pages (e.g. HCI-branded, simulated figures), archived
page versions, and the sales/delivery kit live in the working project at
`~/Claude/Projects/AI Tools Business/`, not in the public deploy.

## Canonical source of truth

Business strategy, offers, pricing, and assets are governed by the AI Brain
(`/AI Brain` in Dropbox). This repo is a downstream deploy artifact.
