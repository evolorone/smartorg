# SmartOrg

Public marketing + funnel site for **SmartOrg** (smartorg.tools). Caleb Allen's
nonprofit AI build practice, program name *The Six Week Build Plan*.

Static HTML. Page copy is edited in one place (`COPY.md`) and built into the
pages. Deployed on Vercel.

## Editing copy

All editable copy for every funnel page lives in **`COPY.md`**, organized by page
and section. To change wording:

1. Edit the text under the relevant `### key` heading in `COPY.md`. You can use
   `**bold**` and `[link text](https://url)`; everything else is plain text.
   Do not rename or remove the `### key` lines.
2. Run `npm run build` (or `node build-copy.mjs`). This injects your copy into the
   HTML pages.
3. Commit and push. Vercel also runs the build on deploy, so a pushed `COPY.md`
   change flows to the live site on its own.

`npm run check` validates that `COPY.md` and the pages are in sync without writing
anything. Under the hood, each editable element carries a `data-copy="page.section.field"`
attribute that matches a key in `COPY.md`.

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

Connect the repo to Vercel; no framework preset. Build command is
`node build-copy.mjs` and the output directory is the repo root (both set in
`vercel.json`), so the copy is compiled from `COPY.md` on every deploy.
`cleanUrls` serves pages without the `.html` extension.

## Not in this repo (intentionally)

Per-client Blueprint/pitch pages (e.g. HCI-branded, simulated figures), archived
page versions, and the sales/delivery kit live in the working project at
`~/Claude/Projects/AI Tools Business/`, not in the public deploy.

## Canonical source of truth

Business strategy, offers, pricing, and assets are governed by the AI Brain
(`/AI Brain` in Dropbox). This repo is a downstream deploy artifact.
