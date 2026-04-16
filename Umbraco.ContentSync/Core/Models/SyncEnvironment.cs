namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Represents a named target environment that content can be synced to or from.
/// Stored as configuration; used for routing API calls and labelling snapshots.
/// </summary>
public sealed class SyncEnvironment
{
    /// <summary>
    /// Short, human-readable identifier used throughout the API
    /// (e.g. "Dev", "Staging", "Production").
    /// Must be unique across all configured environments.
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Base URL of the target Umbraco instance
    /// (e.g. "https://staging.example.com").
    /// Used by transport implementations to push/pull payloads.
    /// </summary>
    public string BaseUrl { get; init; } = string.Empty;
}
