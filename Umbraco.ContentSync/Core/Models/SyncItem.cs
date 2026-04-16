namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// A portable, environment-agnostic representation of a single Umbraco entity
/// (content node, media item, or settings value) that can be serialised and
/// transported between environments.
/// </summary>
public sealed class SyncItem
{
    /// <summary>Stable identity — maps to <c>IContent.Key</c> (GUID).</summary>
    public Guid Id { get; init; }

    /// <summary>Human-readable node name.</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>What kind of Umbraco entity this represents.</summary>
    public SyncItemType Type { get; init; }

    /// <summary>UTC timestamp of the last modification on the originating environment.</summary>
    public DateTime LastUpdated { get; init; }

    /// <summary>
    /// Property alias → raw string value map.
    /// Values are stored as strings so the model stays serialisation-format-agnostic.
    /// </summary>
    public Dictionary<string, string?> Properties { get; init; } = [];
}
