using System.ComponentModel.DataAnnotations;

namespace Umbraco.ContentSync.API.DTOs;

/// <summary>
/// Request body for the <c>POST /api/contentsync/sync</c> endpoint.
/// Contains a JSON payload produced by <c>GET /api/contentsync/export</c>.
/// </summary>
public sealed class SyncRequest
{
    /// <summary>
    /// A valid sync export JSON string as returned by the <c>/export</c> endpoint.
    /// </summary>
    [Required]
    public string Payload { get; init; } = string.Empty;
}
