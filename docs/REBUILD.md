# Rebuild assessment — 2026-11-25

## Evidence and limits

Google Drive folder AiGenVDO (`1idnsM6Uo4PZhueN_JoOOQetAStqgruQu`) contains:
- AI-Cut-Studio-Trial-Setup-0.4.2.exe — 159,275,258 bytes
- คู่มือใช้งาน AI Cut Studio 0.4.2.pdf — 11,717,041 bytes
- สอนใช้ AI Cut Studio 0.4.2 เสียงพากย์.mp4 — 28,112,582 bytes

Read extracted manual text (partial/truncated). Did not execute/disassemble EXE, watch instructional video, retrieve original source, copy assets, or modify Drive originals. EXE exceeds connector download limit of 100 MiB. This is an independent workflow reconstruction based on documentation, not verified binary reverse engineering. Repository initially contained README only.

Manual describes Windows 10/11, Gemini setup, footage/images, product details, recipes, voice/persona, subtitles/music/branding, AI queue, review, batch price changes, ad versions, export and advertising-claim checks. Exact implementations are unknown.

## Delivered slice and checks

- Thai responsive web brief, platform and duration validation.
- Explicit template demo vs real compatible chat API adapter with server-only secrets.
- Rule review and mandatory human approval; input edits invalidate prior approval.
- JSON export/import with schema/size validation; never restores prior approval.
- Local media metadata only; manual Drive handoff.
- Automated unit tests for validation, review, demo, configuration and mocked provider responses.
- Native macOS/Safari, real provider calls and Drive OAuth are NOT verified in this Linux sandbox.

## Incremental delivery / acceptance gates

1. Provider registry: native adapters for Gemini, Anthropic, etc.; capability discovery (text, vision, TTS), opt-in fallbacks, contract tests and cost estimates. No promise of unlimited provider quotas.
2. Project storage: SQLite locally, versioned manifests and resumable jobs; migrations, crash/restart and concurrent-write tests.
3. Drive MNG (interpreted as management): OAuth with minimal scopes, folder picker, private uploads, conflict/version detection and retry-safe IDs; test cancel, expiry, offline, duplicate uploads, no sharing changes by default.
4. Media: local FFmpeg worker; probe formats, source-rights acknowledgement, image/video timelines, voice and subtitle adapters; verify audio duration, Thai glyph rendering, A/V sync, safe subprocess args and temporary-file cleanup.
5. Review loop per stage: input schema → provider output schema → factual/claims warnings → editable preview → explicit human approval → export validation. Never report unimplemented stages as passed. Keep artifact versions and audit events without secrets.
6. Production gates: login, secure sessions, authorization, budgets, cancellation, queue limits, privacy retention controls, end-to-end tests on macOS Safari/Chrome and render golden tests. A CI/unit pass alone is not release approval.

Next user decisions: priority AI providers and models; local Mac vs hosted deployment; ownership/license permission for any future binary analysis; Drive sync direction and destination. Source code, if available, would enable a more accurate migration.
