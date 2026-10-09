# 0mod Platform & Brand Design Style Guide

**Version:** 1.0.0  
**Effective Date:** 2026-10-09  
**Status:** Canonical Reference Standard  
**System Scope:** Brand Platform, Entity Hierarchy, Split-Repository Architecture, Design Tokens, Tool Component Contracts, and Internal Ecosystem Surfaces for 0mod (`0mod.com`, `api.0mod.com`).

---

## 1. Corporate & Brand Hierarchy

0mod operates under a three-tier organizational structure:

```
┌─────────────────────────────────────────────────────────────┐
│                        Topazly LLC                          │
│               Parent Legal Entity & Holding                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        Zero Modern                          │
│            Software Studio & Consulting Engine              │
│       (Author of PublicArk, 0mod, crypto engine, etc.)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                           0mod                              │
│         Flagship Zero-Trust Computing & API Brand           │
│           (0mod.com · api.0mod.com · melon.0mod.com)        │
└─────────────────────────────────────────────────────────────┘
```

- **Topazly LLC:** Legal copyright holder, publisher, and account administrator (Cloudflare, domain registrar, banking).
- **Zero Modern (`zeromodern.com`):** The overarching software engineering and consulting studio. 0mod is an engineered product of Zero Modern.
- **0mod (`0mod.com`):** The primary brand and domain. Short, memorable, and the central namespace for all personal, infrastructure, and agent systems.

---

## 2. Brand Platform & Dual-Pillar Architecture

### 2.1 The Core Mission
> **Democratize zero-trust computation.** No user files uploaded to clouds; no developers or AI agents locked into recurring subscription walls.

### 2.2 The Dual Pillars

```
                               0mod (Zero Modern)
               "Zero-Trust Infrastructure for Humans & AI Agents"
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
   0mod Studio                                                 0mod Gateway
   (Human-Facing · 0mod.com)                                   (Machine-Facing · api.0mod.com)
   ─────────────────────────                                   ───────────────────────────────
   • 100% In-Browser / Client-Side                             • Machine-native HTTP 402 endpoints
   • Zero cloud uploads, zero data leaks                       • EIP-712 cryptographic micro-settlements
   • Private PDF, image, document & data tools                 • Real-time crypto telemetry & L2 arbitrage
   • Target: Privacy pros, creators, enterprise workers        • Target: Autonomous AI agents, bot devs, MCP users
```

### 2.3 Edge Doctrine: The Contrarian Stance
The brand stands against two predatory industry standards:

1. **Anti-Cloud Extraction (For Humans):** Traditional online converters (`iLovePDF`, `TinyWow`, `Convertio`) force users to upload sensitive files (contracts, medical records, tax documents) to cloud servers where data is logged, retained, or mined. 0mod executes 100% of operations client-side via WebAssembly and browser APIs.
2. **Anti-Subscription Walls (For AI Agents & Developers):** Traditional SaaS APIs force monthly subscriptions, credit card KYC, API key provisioning, and arbitrary rate limits. 0mod Gateway lets AI agents pay per request with cryptographic USDC on Base via HTTP 402.

---

## 3. Split-Repository Architecture (`0mod-core` vs `0mod-platform`)

The system separates open-source tool logic from proprietary platform distribution across two distinct Git repositories:

```
┌────────────────────────────────────┐       ┌────────────────────────────────────┐
│      zeromodern/0mod-core          │       │     zeromodern/0mod-platform       │
│      (Public Open Source)          │       │        (Private Platform)          │
├────────────────────────────────────┤       ├────────────────────────────────────┤
│ • Standalone tools in /apps        │       │ • Cloudflare Workers Assets host   │
│ • Local preview runner (dev.sh)    │──────>│ • Static site builder (build.js)   │
│ • Zero build step required         │ sync  │ • Router, landing page & blog      │
│ • Pure client-side WebAssembly     │       │ • PWA service worker generator     │
│ • Apache-2.0 / MIT license         │       │ • Counterscale analytics & SEO     │
└────────────────────────────────────┘       └────────────────────────────────────┘
```

### 3.1 Strict Separation Invariants
1. **Zero Platform Leaks in Core:** Tool files in `0mod-core/apps/<tool-name>` must run **100% standalone** when served directly via `npx serve .`. They must NEVER rely on platform-only globals (`window.PLATFORM_STATE`) or assume wrapper-injected DOM nodes.
2. **Self-Contained Shared Assets:** Shared CSS and UI components in `shared/` must be identical between both repositories. When modified in `0mod-platform`, changes must be synced back to `0mod-core`.
3. **No String-Interpolated Event Handlers:** Components must bind standard DOM events (`addEventListener`) or export clean element factories. Never pass raw string function names (`onClick: "handleConvert()"`) that pollute the global `window` scope and break when tools are embedded in isolated platform wrappers.

---

## 4. Voice & Tone

### 4.1 Canonical Rules
1. **Engineering-first, austere delivery:** State the technical mechanism before assigning significance. Use short, crisp declaratives.
2. **No AI/SaaS Hyperbole:** Banned terms: "revolutionary", "game-changing", "magical", "seamless", "disruptive".
3. **Verifiable claims only:** Never say "unhackable" or "100% private" without specifying the mechanism: *"Executed entirely in browser memory; no network requests dispatched during conversion."*
4. **Clean typography over visual noise:** The interface is a precision tool, not a marketing brochure.

---

## 5. Visual Design System

### 5.1 Color Palette
0mod is **Dark Mode native**, with a clean, high-contrast light mode fallback.

| Token | Light Mode | Dark Mode (Default) | Role |
| :--- | :--- | :--- | :--- |
| **Canvas** | `#f8fafc` (`slate-50`) | `#020617` (`slate-950`) | Page background |
| **Surface** | `#ffffff` (`white`) | `#0f172a` (`slate-900`) | Cards, panels, tool containers |
| **Surface Hover** | `#f1f5f9` (`slate-100`) | `#1e293b` (`slate-800`) | Hovered cards, inputs, dropzones |
| **Border** | `#e2e8f0` (`slate-200`) | `#1e293b` (`slate-800`) | Structural dividers & inputs |
| **Primary Text** | `#0f172a` (`slate-900`) | `#f8fafc` (`slate-50`) | Headers, titles |
| **Muted Text** | `#64748b` (`slate-500`) | `#94a3b8` (`slate-400`) | Secondary descriptions, file metadata |
| **Safe / Accent** | `#059669` (`emerald-600`)| `#10b981` (`emerald-500`)| Trust badge, primary action, download |
| **Code / Gateway** | `#0284c7` (`sky-600`)   | `#38bdf8` (`sky-400`)   | x402 endpoint paths, parameters, API tags |

### 5.2 Typography
- **Primary Interface:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- **Code & Numeric Data:** `JetBrains Mono`, `Fira Code`, monospace (for file sizes, hash SHAs, curl commands, JSON output).

### 5.3 Elevation & Shadows
- Use subtle, soft ambient shadows (`shadow-soft` = `0 4px 20px -2px rgba(0, 0, 0, 0.05)`).
- Never use heavy drop shadows or skeumorphic gradients.

---

## 6. The 4-Stage Tool UI Contract

Every utility inside 0mod Studio must conform to a standardized 4-stage vertical workflow:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Header Bar: Tool Title + Offline Trust Badge + Return Nav│
├─────────────────────────────────────────────────────────────┤
│ 2. Dropzone: Drag-and-drop target + File picker + Paste     │
├─────────────────────────────────────────────────────────────┤
│ 3. Config / Options: Minimal options (advanced in accordion)│
├─────────────────────────────────────────────────────────────┤
│ 4. Output / Action: Progress bar + Download CTA + House Ad  │
└─────────────────────────────────────────────────────────────┘
```

1. **Stage 1 (Header Bar):** Clean title, one-sentence plain English utility summary, green `Offline Ready` status indicator.
2. **Stage 2 (Primary Dropzone):** High-contrast dashed border, distinct hover and dragover highlights, clear supported format labels, and immediate file validation.
3. **Stage 3 (Configuration Panel):** Only display the controls strictly required for the action. Secondary settings (quality, DPI, page size) stay collapsed by default.
4. **Stage 4 (Action & Download):** A prominent primary download button, file size savings badge (e.g., `-42% smaller`), a clear "Convert Another" reset action, and automatic memory cleanup (`URL.revokeObjectURL`).

---

## 7. Internal Ecosystem Surfaces & House Ads

### 7.1 Philosophy: Zero External Ad Trackers
0mod will **NEVER** run programmatic advertising networks (AdSense, Outbrain, Google Ad Manager). External ad scripts destroy the brand's core value proposition by injecting tracking cookies, fingerprinting users, slowing down page loads, and degrading trust.

### 7.2 The Three Native House Ad Placements
Instead of third-party ad networks, utilities feature high-converting, native **House Ads** that funnel organic search traffic into the 0mod developer and consulting ecosystem:

#### Placement 1: Post-Download Automation Nudge
Displayed in Stage 4 directly below the file download button once a conversion completes:
> **Automating this in code or an AI agent?**  
> Run this transformation directly via the 0mod API gateway. Zero subscriptions, zero API keys, instant EIP-712 micro-settlements.  
> `POST https://api.0mod.com/api/v1/tools/...` → [View x402 API Specs →](https://api.0mod.com/)

#### Placement 2: Local AI Agent Tooling Callout
Displayed in the desktop sidebar or tool footer:
> **Add 0mod to Cursor, Claude & ElizaOS:**  
> Run zero-cloud privacy tools locally in your IDE or AI agents.  
> `npx @zeromodern/mcp-server-0mod` → [Inspect MCP Server on GitHub →](https://github.com/zeromodern/mcp-server-0mod)

#### Placement 3: Engineering Attribution
Displayed in the universal platform footer:
> **A product of [Zero Modern](https://www.zeromodern.com), by Topazly LLC.**  
> Custom zero-server web architecture & autonomous agent systems.
