# ManeeFlow Desktop — macOS / Windows

Version 0.2 is an Electron desktop shell around the script-planning workflow, not a finished video editor. Supported build targets: macOS Apple Silicon + Intel, Windows x64. Windows ARM64 and Linux installers are not configured.

## Develop locally

Install Node.js 22+ and Git. From this repository:

```sh
npm ci
npm test
npm run desktop
```

`npm ci` downloads Electron for your OS. The packaged application includes its runtime; end users do not need Node.js.

## Configure AI

In the desktop menu choose **File → AI settings…**. Edit `AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY`, save and restart the app. Choose live AI in the form. This uses OpenAI-compatible chat completions only. Native APIs need additional adapters.

Settings are in Electron's userData directory under `ManeeFlow` or the package name `maneeflow` (depending on dev/package launch):
- macOS: `~/Library/Application Support/<app-name>/ai.env`
- Windows: `%APPDATA%\<app-name>\ai.env`

The file is plaintext and must not be shared or synced to Drive. macOS creation uses owner-only permissions; Windows inherits the profile folder ACL. Secure OS keychain integration is not implemented. No credentials are embedded into installers. If `.env` has no associated editor, open this file in a text editor manually.

## Build installers

On macOS:

```sh
npm ci
npm run build:mac -- --publish never
```

On Windows:

```powershell
npm ci
npm run build:win -- --publish never
```

Output: `release/` (ignored by Git). macOS produces `.dmg` / `.zip` for arm64 and x64; Windows produces an NSIS `.exe` installer for x64. Default Electron icon is used until product artwork is supplied.

Alternatively push this current branch and manually run **Desktop builds** in GitHub Actions, selecting this branch. Download `ManeeFlow-mac-unsigned` / `ManeeFlow-win-unsigned` artifacts after both jobs succeed. The workflow is provided but has not been dispatched by this implementation. Artifacts are not releases, and no installers have been generated in this Linux workspace.

## Security / distribution status

Desktop server binds to random loopback port, requires a random per-launch header and exact Host on every request. Electron injects the header only for its origin. Renderer has no Node access, is sandboxed, and has context isolation enabled. Permission requests and arbitrary new windows/navigation are denied. Only the known Drive folder opens in the system browser.

Builds are unsigned development artifacts. macOS notarization and Windows code signing are not configured; OS security warnings may occur. Do not disable system protections for distribution. Configure signing/notarization and test installer provenance before public release. No automatic update service is configured.

## Native acceptance checklist (not yet executed)

- Launch, close, relaunch and second-instance focus on Mac Intel/Apple Silicon and Windows x64.
- Run template flow, edit brief, confirm approval is invalidated.
- Download JSON via native save dialog; cancel safely; import saved JSON.
- Confirm file picker works for local media; only names are used.
- Configure a real compatible provider; test valid result, bad credentials, quota and timeout.
- Open Drive in external browser; verify no navigation to untrusted sites inside app.
- Confirm a request without desktop session token receives HTTP 403.
- Check clean install, uninstall and settings retention.

Drive remains a manual JSON handoff, not OAuth sync. Rendering MP4, TTS and subtitles remain unimplemented. UI data is not auto-saved; export before quitting.
