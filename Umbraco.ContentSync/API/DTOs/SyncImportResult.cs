using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.API.DTOs;

/// <summary>
/// Response body for <c>POST /api/contentsync/sync</c> and
/// <c>POST /api/contentsync/restore/{id}</c>.
///
/// Always includes a <see cref="Preview"/> of what changed, any
/// <see cref="Warnings"/> raised during validation, and a
/// <see cref="Forced"/> flag indicating whether the import bypassed conflicts.
/// </summary>
public sealed class SyncImportResult
{
    /// <summary>Number of items successfully deserialised from the payload.</summary>
    public int ImportedCount { get; init; }

    /// <summary>
    /// Human-readable status.
    /// <list type="bullet">
    ///   <item><c>"simulated"</c> — MVP mode; no writes performed.</item>
    ///   <item><c>"restored"</c> — replayed from a stored snapshot.</item>
    /// </list>
    /// </summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>UTC timestamp of when the import was processed.</summary>
    public DateTime ProcessedAt { get; init; }

    /// <summary>
    /// Property-level preview of what this import changed (or would change)
    /// on the target environment, including any detected conflicts.
    /// </summary>
    public SyncPreview? Preview { get; init; }

    /// <summary>
    /// Non-blocking warnings raised during validation.
    /// The import was still processed; these are surfaced for operator review.
    /// </summary>
    public IReadOnlyList<string> Warnings { get; init; } = [];

    /// <summary>
    /// <c>true</c> when the import was executed despite one or more detected
    /// conflicts because the caller passed <c>?force=true</c>.
    /// Use this flag in audit logs to distinguish forced imports from clean ones.
    /// </summary>
    public bool Forced { get; init; }
}
