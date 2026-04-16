# Umbraco Content Sync

[![NuGet](https://img.shields.io/nuget/v/ContentSync.Umbraco.svg)](https://www.nuget.org/packages/ContentSync.Umbraco)
[![Umbraco](https://img.shields.io/badge/Umbraco-17-blue)](https://umbraco.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Sync Umbraco content across environments — with snapshots, property-level diffs, and conflict detection — all from the backoffice.**

---

## The Problem

Moving content between Umbraco environments (development → staging → production) is error-prone. There is no built-in mechanism to see *what changed*, resolve *conflicts*, or *preview* an import before committing to it. Teams resort to manual copy-paste, database backups, or custom scripts — each carrying its own risk.

## The Solution

Umbraco Content Sync adds a first-class sync workflow to the Umbraco backoffice:

- **Snapshot** the current content tree at any point in time
- **Diff** two environments at the property level — see exactly which fields changed
- **Detect conflicts** before they become problems (modified in both, deleted in target, missing in source)
- **Preview** every import as a dry-run before a single node is written
- **Restore** any previous snapshot with full conflict awareness

---

## Features

- Property-level diff engine with value normalisation (null ≡ empty, trimmed, ordinal comparison)
- In-memory snapshot store with environment tagging and timestamp ordering
- Three conflict types: `ModifiedInBoth`, `DeletedInTarget`, `MissingInSource`
- `?force=true` override to proceed past conflicts with full audit trail
- REST API at `/api/contentsync/*` — usable independently of the UI
- Backoffice dashboard in the **Content** section — built with Lit 3 and UUI, no AngularJS
- Distributed as a single NuGet package — no App_Plugins, no file copying

---

## Requirements

| Dependency  | Supported versions          |
|-------------|----------------------------|
| Umbraco CMS | 14.3.4 – 14.x  or  17.x   |
| .NET        | 8  or  10                  |

> **Umbraco version → .NET pairing**  
> Umbraco 14.x runs on .NET 8. Umbraco 17.x runs on .NET 10.  
> Umbraco 13.x is intentionally unsupported — it uses the legacy AngularJS backoffice which is incompatible with the Lit 3 dashboard shipped by this package.

---

## Installation

```bash
dotnet add package ContentSync.Umbraco
```

Or via the NuGet Package Manager:

```
Install-Package ContentSync.Umbraco
```

---

## Configuration

Register the package in your `Program.cs`:

```csharp
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .AddContentSync()   // ← add this line
    .Build();
```

That's it. No additional configuration files are required.

---

## Usage

### Backoffice Dashboard

1. Log into the Umbraco backoffice
2. Navigate to the **Content** section
3. Click the **Content Sync** tab in the top navigation

From there you can:

- View all snapshots for the current environment
- Select a snapshot and run a preview (dry-run diff)
- Review property-level changes and detected conflicts
- Sync (restore) the snapshot — with or without the force override

### REST API

All operations are also available via the REST API at `/api/contentsync`:

| Method | Endpoint                        | Description                                      |
|--------|---------------------------------|--------------------------------------------------|
| GET    | `/export`                       | Export current content + auto-create a snapshot  |
| GET    | `/diff?targetPayload=<json>`    | Property-level diff against a supplied payload   |
| POST   | `/preview`                      | Dry-run: validate + preview without importing    |
| POST   | `/sync[?force=true]`            | Validate → conflict check → import               |
| GET    | `/snapshots?env=Dev`            | List snapshots for an environment (newest first) |
| GET    | `/snapshot/{id}`                | Fetch a single snapshot with full data payload   |
| POST   | `/restore/{id}[?force=true]`    | Validate → conflict check → restore snapshot     |

#### Example: export and preview

```bash
# Export current environment content
curl -X GET https://your-site/api/contentsync/export

# Preview what applying a payload would change
curl -X POST https://your-site/api/contentsync/preview \
  -H "Content-Type: application/json" \
  -d '{ "payload": "<json from export>" }'
```

---

## Health Check

After installation, verify the package is wired up correctly by calling the built-in health endpoint:

```bash
GET /api/contentsync/health
```

A healthy installation returns:

```json
{
  "status": "healthy",
  "message": "All checks passed.",
  "checks": [
    { "name": "StaticAsset",    "passed": true, "detail": null },
    { "name": "ManifestReader", "passed": true, "detail": null }
  ]
}
```

**What is checked:**

| Check | What it verifies |
|---|---|
| `StaticAsset` | `/ContentSync/content-sync-dashboard.js` is resolvable via the web root file provider — confirms static web assets are active |
| `ManifestReader` | The backoffice extension manifest is registered — confirms `AddContentSync()` was called |

The endpoint always returns **HTTP 200**. Inspect the `status` field in the response body to determine health.

---

## Screenshots

> Screenshots will be added in a future release.

| Dashboard | Snapshot List | Diff View | Conflict Detection |
|-----------|--------------|-----------|-------------------|
| *(coming soon)* | *(coming soon)* | *(coming soon)* | *(coming soon)* |

---

## Architecture

The package is structured in three clean layers:

```
Core/           — models, interfaces, no external dependencies
Infrastructure/ — Umbraco adapter (IContentService), service implementations
API/            — ASP.NET Core controllers and DTOs
UI/             — Lit 3 TypeScript web component (built to wwwroot/ContentSync/)
```

The backoffice JS bundle is shipped as a **static web asset** inside the NuGet package and served automatically by `app.UseStaticFiles()` — no manual file deployment needed.

---

## Roadmap

- [ ] Environment-to-environment sync over HTTP (push/pull between live sites)
- [ ] Remote API sync — configure target environments in `appsettings.json`
- [ ] Media node support (file assets alongside content)
- [ ] Scheduled / automatic snapshot capture
- [ ] Webhook notifications on sync events
- [ ] Full UI overhaul — multi-step wizard, environment selector, progress tracking
- [ ] Persist snapshots to disk / database (replace in-memory store)
- [ ] Umbraco Cloud support

---

## Troubleshooting

### Dashboard not visible in the Content section

- Ensure `AddContentSync()` is present in the Umbraco builder chain in `Program.cs`
- Check the application log at startup — a successful registration prints:  
  `Umbraco.ContentSync v{version} initialized (TFM: net10.0)`  
  If this line is absent, `AddContentSync()` was not called
- If running Umbraco 14.x, the log TFM will read `net8.0`

### Dashboard tab appears but UI fails to load

- Ensure `app.UseStaticFiles()` is called in `Program.cs` (Umbraco sets this up automatically; verify it has not been removed)
- Confirm the package installed correctly by checking for the static asset at `/ContentSync/content-sync-dashboard.js` in your browser
- Run `GET /api/contentsync/health` and inspect the `StaticAsset` check result

### Health endpoint returns `unhealthy`

| Failing check | Likely cause | Fix |
|---|---|---|
| `StaticAsset` | Static web assets not served | Confirm `UseStaticFiles()` is in the middleware pipeline |
| `ManifestReader` | `AddContentSync()` not called | Add `.AddContentSync()` to the Umbraco builder in `Program.cs` |

### Package installed but no `Umbraco.ContentSync` log line at startup

The startup message is emitted by `IStartupFilter`, which runs after the DI container is built but before the first request. If the line is missing entirely, the package DLL may not have been loaded. Run `GET /api/contentsync/health` — a 404 response indicates the assembly is not part of the application.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a pull request

### Building locally

```bash
# Build the package
cd Umbraco.ContentSync
dotnet build

# Build the UI (requires Node.js 20+)
cd UI
npm install
npm run build

# Run the demo site
cd ../../Umbraco.ContentSync.Demo
dotnet run
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
