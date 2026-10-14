---
name: browser-bridge
description: "Inspect, control, and automate tasks in your real Microsoft Edge or Google Chrome browser via Chrome DevTools Protocol (CDP) with bilingual UI, native tab grouping, and self-healing daemon."
category: automation
risk: safe
source: community
source_repo: AshenJyy/antigravity-browser-bridge
source_type: community
date_added: "2026-10-14"
author: AshenJyy
tags: [browser, automation, cdp, edge, chrome, antigravity, gemini, i18n]
tools: [gemini, cursor, claude]
license: "Apache-2.0"
license_source: "https://github.com/AshenJyy/antigravity-browser-bridge/blob/main/LICENSE"
---

# Browser Bridge Automation

## Overview

The **Browser Bridge** skill allows AI coding assistants (including Google Antigravity, Gemini CLI, Cursor, and Claude) to interact with and automate the user's *real* Microsoft Edge or Google Chrome browser.

Unlike headless browsers that lose existing logins and trigger bot-detection barriers, Browser Bridge connects to the user's daily browser sessions via a lightweight extension and a local Python loopback daemon (`127.0.0.1`), preserving logins, cookies, and user preferences.

## When to Use This Skill

- Use when you need to inspect active browser tabs or open web pages.
- Use when extracting rendered DOM content or taking webpage screenshots.
- Use when navigating, clicking buttons, filling out web forms, or executing interactive workflows in a real browser session.
- Use when executing raw Chrome DevTools Protocol (CDP) commands (`Page`, `Runtime`, `DOM`, `Input`, `Network`, `Storage`).

## Key Capabilities

1. **Bilingual Adaptive UI**: Automatic browser language detection (English & Chinese) with an instant one-click toggle button (`[English / 中文]`) in the popup.
2. **Concurrent Multi-Browser Routing**: Simultaneous connection support for both Microsoft Edge and Google Chrome with smart automatic routing to target tabs.
3. **Native Tab Grouping**: Automatically isolates AI-controlled tabs into a distinct purple `[Gemini]` tab group for complete visual clarity.
4. **Interactive Snapshot & Control**: Provides numbered element snapshots (`#1`, `#2`) to click or fill inputs without manual coordinate guessing.
5. **Self-Healing Background Daemon**: Automatically launches the local bridge service in the background if it is not currently active.
6. **Privacy-First Architecture**: Binds strictly to `127.0.0.1`; no telemetry, no cloud relays, zero credential exposure.

## Quick Usage Reference

### 1. Connection Status & Tab Query
```bash
py server/cli.py status
py server/cli.py tabs
```

### 2. Navigation & Page Interaction
```bash
# Open URL
py server/cli.py open "https://github.com"

# Snapshot interactive elements
py server/cli.py snap <tabId>

# Click element (#index, text, or selector)
py server/cli.py click <tabId> "#1"
py server/cli.py click <tabId> "Sign in"

# Input text into form field
py server/cli.py type <tabId> "#search" "machine learning"
```

### 3. Page Extraction, Evaluation & Raw CDP
```bash
# Extract structured content
py server/cli.py text <tabId>

# Take page screenshot
py server/cli.py screenshot <tabId> page.png

# Execute JavaScript expression
py server/cli.py eval <tabId> "document.title"

# Execute raw Chrome DevTools Protocol (CDP) method
py server/cli.py cdp <tabId> Page.captureScreenshot '{"format": "png"}'
```

## Source & Repository

- **Repository**: [https://github.com/AshenJyy/antigravity-browser-bridge](https://github.com/AshenJyy/antigravity-browser-bridge)
- **Latest Release**: v1.4.0 ([Releases](https://github.com/AshenJyy/antigravity-browser-bridge/releases/tag/v1.4.0))
- **License**: Apache-2.0
