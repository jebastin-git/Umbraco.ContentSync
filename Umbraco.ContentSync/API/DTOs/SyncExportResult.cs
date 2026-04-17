namespace Umbraco.ContentSync.API.DTOs;

/// <summary>
/// Response body for the <c>GET /api/contentsync/export</c> endpoint.
/// </summary>
public sealed class SyncExportResult
{
    /// <summary>Number of content items included in the payload.</summary>
    public int Count { get; init; }

    /// <summary>Self-contained JSON payload ready to be pushed to a target environment.</summary>
    public string Payload { get; init; } = string.Empty;

    /// <summary>ID of the snapshot automatically created during this export.</summary>
    public Guid SnapshotId { get; init; }
}
