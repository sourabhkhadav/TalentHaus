# Strict Constraint: No Automatic Browser Launching or Navigation

CRITICAL & PERMANENT RULE:
- NEVER automatically launch Chrome, open website URLs, create browser tabs, or navigate using browser automation (`browser_subagent`, `open_browser_url`, `start chrome`, `chrome.exe`, `window.open()`, etc.) during development, preview, testing, or server startup.
- ONLY open Chrome or a URL when the user explicitly instructs to do so in their prompt.
- Never use flags like `--open` or scripts that trigger automatic browser launch.
- Keep the dev server running normally without opening a browser window.
