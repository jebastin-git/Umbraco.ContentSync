using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.ContentSync.API.DTOs;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.API.Controllers;

/// <summary>
/// REST API for the Content Sync Engine.
///
/// Base route: <c>/api/contentsync</c>
///
/// Health endpoint:
/// <list type="bullet">
///   <item><c>GET  /health</c>                  — Post-install validation: static asset + manifest checks.</item>
/// </list>
///
/// Content endpoints:
/// <list type="bullet">
///   <item><c>GET  /export</c>                  — Export current environment's content; auto-creates a snapshot.</item>
///   <item><c>GET  /diff</c>                    — Diff local content against an externally supplied payload.</item>
///   <item><c>POST /preview</c>                 — Dry-run: validate + preview changes without importing.</item>
///   <item><c>POST /sync[?force=true]</c>        — Validate, preview, detect conflicts, then simulate import.</item>
/// </list>
///
/// Snapshot endpoints:
/// <list type="bullet">
///   <item><c>GET  /snapshots?env=Dev</c>        — List snapshots for an environment, newest first.</item>
///   <item><c>GET  /snapshot/{id}</c>            — Fetch a single snapshot including its full data payload.</item>
///   <item><c>POST /restore/{id}[?force=true]</c> — Validate, preview, detect conflicts, then simulate restore.</item>
/// </list>
///
/// In production add <c>[Authorize]</c> or Umbraco back-office authorisation before shipping.
/// </summary>
[ApiController]
[Route("api/contentsync")]
[Produces("application/json")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
public sealed class SyncController : ControllerBase
{
    private readonly IDiffService _diffService;
    private readonly ISyncService _syncService;
    private readonly IContentProvider _contentProvider;
    private readonly ISnapshotService _snapshotService;
    private readonly ISyncValidator _validator;
    private readonly IContentSyncHealthCheck _healthCheck;

    public SyncController(
        IDiffService diffService,
        ISyncService syncService,
        IContentProvider contentProvider,
        ISnapshotService snapshotService,
        ISyncValidator validator,
        IContentSyncHealthCheck healthCheck)
    {
        _diffService = diffService;
        _syncService = syncService;
        _contentProvider = contentProvider;
        _snapshotService = snapshotService;
        _validator = validator;
        _healthCheck = healthCheck;
    }

    // =========================================================================
    // Health endpoint
    // =========================================================================

    // -------------------------------------------------------------------------
    // GET /api/contentsync/health
    // -------------------------------------------------------------------------

    /// <summary>
    /// Runs a lightweight post-install validation and returns the result.
    ///
    /// Checks performed:
    /// <list type="bullet">
    ///   <item><b>StaticAsset</b> — <c>/ContentSync/content-sync-dashboard.js</c> is resolvable.</item>
    ///   <item><b>ManifestReader</b> — the backoffice extension manifest is registered.</item>
    /// </list>
    ///
    /// Always returns <c>200 OK</c> — inspect <c>status</c> in the body to determine health.
    /// Returning 200 unconditionally prevents monitoring tools from raising false alerts
    /// for a non-critical diagnostic endpoint.
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Health()
    {
        var result = await _healthCheck.CheckAsync(HttpContext.RequestAborted);

        return Ok(new
        {
            status  = result.IsHealthy ? "healthy" : "unhealthy",
            message = result.Message,
            checks  = result.Checks.Select(c => new
            {
                name   = c.Name,
                passed = c.Passed,
                detail = c.Detail
            })
        });
    }

    // =========================================================================
    // Content endpoints
    // =========================================================================

    // -------------------------------------------------------------------------
    // GET /api/contentsync/export
    // -------------------------------------------------------------------------

    /// <summary>
    /// Exports all content nodes on the current environment as a portable JSON payload
    /// and automatically persists a snapshot for later review or restore.
    /// </summary>
    /// <param name="env">
    /// Logical environment label (e.g. <c>Dev</c>, <c>Staging</c>, <c>Production</c>).
    /// Stored as metadata on the snapshot so the dropdown on the importing side can
    /// show where the snapshot came from.
    /// </param>
    [HttpGet("export")]
    [ProducesResponseType(typeof(SyncExportResult), StatusCodes.Status200OK)]
    public IActionResult Export([FromQuery] string env = "Dev")
    {
        var items    = _contentProvider.GetAll();
        var payload  = _syncService.Export(items);
        var username = User.Identity?.Name ?? "system";
        var snapshot = _snapshotService.CreateSnapshot(env, username, payload);

        return Ok(new SyncExportResult
        {
            Count      = items.Count,
            Payload    = payload,
            SnapshotId = snapshot.Id
        });
    }

    // -------------------------------------------------------------------------
    // GET /api/contentsync/diff?targetPayload=<json>
    // -------------------------------------------------------------------------

    /// <summary>
    /// Returns a property-level diff between the current environment (source)
    /// and the supplied <paramref name="targetPayload"/>.
    /// When omitted, the target is treated as empty so every local property appears as Added.
    /// </summary>
    [HttpGet("diff")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult Diff([FromQuery] string? targetPayload = null)
    {
        var source = _contentProvider.GetAll();

        var target = string.IsNullOrWhiteSpace(targetPayload)
            ? []
            : _syncService.Import(targetPayload);

        var diffs = _diffService.Compare(source, target);

        return Ok(new
        {
            totalDiffs = diffs.Count,
            added = diffs.Count(d => d.ChangeType == ChangeType.Added),
            updated = diffs.Count(d => d.ChangeType == ChangeType.Updated),
            deleted = diffs.Count(d => d.ChangeType == ChangeType.Deleted),
            items = diffs
        });
    }

    // -------------------------------------------------------------------------
    // POST /api/contentsync/preview
    // -------------------------------------------------------------------------

    /// <summary>
    /// Validates <paramref name="request"/> and returns a property-level preview
    /// of what the import would change on the current environment.
    /// No data is written; this is a pure read operation.
    /// </summary>
    [HttpPost("preview")]
    [ProducesResponseType(typeof(SyncPreview), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SyncValidationResult), StatusCodes.Status400BadRequest)]
    public IActionResult Preview([FromBody] SyncRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var validation = _validator.Validate(request.Payload);
        if (!validation.IsValid)
            return BadRequest(validation);

        var preview = _validator.Preview(request.Payload);
        return Ok(preview);
    }

    // -------------------------------------------------------------------------
    // POST /api/contentsync/sync
    // -------------------------------------------------------------------------

    /// <summary>
    /// Validates the payload, computes a conflict-aware preview, then simulates the import.
    ///
    /// <para>Flow:</para>
    /// <list type="number">
    ///   <item>Structural validation → <c>400</c> with <see cref="SyncValidationResult"/> if invalid.</item>
    ///   <item>Conflict detection → <c>409</c> with <see cref="SyncPreview"/> if conflicts found (unless <paramref name="force"/> is <c>true</c>).</item>
    ///   <item>Import (simulated) → <c>200</c> with <see cref="SyncImportResult"/>.</item>
    /// </list>
    /// </summary>
    /// <param name="force">
    /// When <c>true</c> the import proceeds even if conflicts are detected.
    /// Conflicts are still reported in <see cref="SyncImportResult.Preview"/> and
    /// <see cref="SyncImportResult.Forced"/> is set to <c>true</c> for audit purposes.
    /// </param>
    [HttpPost("sync")]
    [ProducesResponseType(typeof(SyncImportResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SyncValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SyncPreview), StatusCodes.Status409Conflict)]
    public IActionResult Sync([FromBody] SyncRequest request, [FromQuery] bool force = false)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var validation = _validator.Validate(request.Payload);
        if (!validation.IsValid)
            return BadRequest(validation);

        var preview = _validator.Preview(request.Payload);

        if (preview.HasConflicts && !force)
            return Conflict(preview);

        var items = _syncService.Import(request.Payload);

        // TODO: Replace simulation with real IContentService.Save() calls
        // foreach (var item in items) { _contentService.Save(Map(item), userId); }

        return Ok(new SyncImportResult
        {
            ImportedCount = items.Count,
            Status = "simulated",
            ProcessedAt = DateTime.UtcNow,
            Preview = preview,
            Warnings = validation.Warnings,
            Forced = force && preview.HasConflicts
        });
    }

    // =========================================================================
    // Snapshot endpoints
    // =========================================================================

    // -------------------------------------------------------------------------
    // GET /api/contentsync/snapshots?env=Dev
    // -------------------------------------------------------------------------

    /// <summary>
    /// Returns a list of snapshots for the given environment, ordered newest first.
    /// The response uses <see cref="SnapshotDto"/> which intentionally omits the
    /// large data payload — use <c>GET /snapshot/{id}</c> to retrieve a full snapshot.
    /// </summary>
    [HttpGet("snapshots")]
    [ProducesResponseType(typeof(IReadOnlyList<SnapshotDto>), StatusCodes.Status200OK)]
    public IActionResult GetSnapshots([FromQuery] string env = "Dev")
    {
        var snapshots = _snapshotService.GetSnapshots(env);

        var dtos = snapshots
            .Select(s => new SnapshotDto
            {
                Id = s.Id,
                Environment = s.Environment,
                CreatedAt = s.CreatedAt,
                CreatedBy = s.CreatedBy
            })
            .ToList();

        return Ok(dtos);
    }

    // -------------------------------------------------------------------------
    // GET /api/contentsync/snapshot/{id}
    // -------------------------------------------------------------------------

    /// <summary>
    /// Returns the full snapshot record including its <c>Data</c> payload.
    /// Use this before a restore to inspect what will be applied.
    /// </summary>
    [HttpGet("snapshot/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public IActionResult GetSnapshot(Guid id)
    {
        var snapshot = _snapshotService.GetSnapshot(id);

        if (snapshot is null)
            return NotFound(new { message = $"Snapshot '{id}' was not found." });

        return Ok(snapshot);
    }

    // -------------------------------------------------------------------------
    // POST /api/contentsync/restore/{id}
    // -------------------------------------------------------------------------

    /// <summary>
    /// Validates the stored snapshot, computes a conflict-aware preview, then
    /// simulates restoring it to the current environment.
    ///
    /// <para>Flow:</para>
    /// <list type="number">
    ///   <item><c>404</c> when the snapshot does not exist.</item>
    ///   <item>Structural validation → <c>400</c> with <see cref="SyncValidationResult"/> if invalid (e.g. schema drift).</item>
    ///   <item>Conflict detection → <c>409</c> with <see cref="SyncPreview"/> if conflicts found (unless <paramref name="force"/> is <c>true</c>).</item>
    ///   <item>Restore (simulated) → <c>200</c> with <see cref="SyncImportResult"/>.</item>
    /// </list>
    /// </summary>
    /// <param name="force">
    /// When <c>true</c> the restore proceeds even if conflicts are detected.
    /// Conflicts are still reported in <see cref="SyncImportResult.Preview"/> and
    /// <see cref="SyncImportResult.Forced"/> is set to <c>true</c> for audit purposes.
    /// </param>
    [HttpPost("restore/{id:guid}")]
    [ProducesResponseType(typeof(SyncImportResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(SyncValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(SyncPreview), StatusCodes.Status409Conflict)]
    public IActionResult Restore(Guid id, [FromQuery] bool force = false)
    {
        var snapshot = _snapshotService.GetSnapshot(id);

        if (snapshot is null)
            return NotFound(new { message = $"Snapshot '{id}' was not found." });

        var validation = _validator.Validate(snapshot.Data);
        if (!validation.IsValid)
            return BadRequest(validation);

        var preview = _validator.Preview(snapshot.Data);

        if (preview.HasConflicts && !force)
            return Conflict(preview);

        var items = _syncService.Import(snapshot.Data);

        // TODO: Replace simulation with real IContentService.Save() calls
        // foreach (var item in items) { _contentService.Save(Map(item), userId); }

        return Ok(new SyncImportResult
        {
            ImportedCount = items.Count,
            Status = "restored",
            ProcessedAt = DateTime.UtcNow,
            Preview = preview,
            Warnings = validation.Warnings,
            Forced = force && preview.HasConflicts
        });
    }
}
