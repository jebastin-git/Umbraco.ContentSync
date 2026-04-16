namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// A point-in-time snapshot of a content export, stored in memory so that
/// previous states can be listed and restored without re-running an export.
/// </summary>
public sealed class SyncSnapshot
{
    /// <summary>Unique identity for this snapshot.</summary>
    public Guid Id { get; init; }

    /// <summary>
    /// The logical environment this snapshot was captured from
    /// (e.g. "Dev", "Staging", "Production").
    /// </summary>
    public string Environment { get; init; } = string.Empty;

    /// <summary>UTC timestamp when the snapshot was created.</summary>
    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// The actor that triggered the export — "system" for automated exports,
    /// or a back-office username for manual ones.
    /// </summary>
    public string CreatedBy { get; init; } = string.Empty;

    /// <summary>
    /// The raw JSON payload produced by <c>ISyncService.Export()</c>.
    /// This is the data that will be replayed on a restore.
    /// </summary>
    public string Data { get; init; } = string.Empty;
}
