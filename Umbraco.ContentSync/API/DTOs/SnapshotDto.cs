namespace Umbraco.ContentSync.API.DTOs;

/// <summary>
/// Lightweight projection of a <see cref="Core.Models.SyncSnapshot"/> safe for
/// returning in list responses — deliberately excludes the large <c>Data</c> payload.
/// To retrieve the full payload, call <c>GET /api/contentsync/snapshot/{id}</c>.
/// </summary>
public sealed class SnapshotDto
{
    public Guid Id { get; init; }
    public string Environment { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public string CreatedBy { get; init; } = string.Empty;
}
