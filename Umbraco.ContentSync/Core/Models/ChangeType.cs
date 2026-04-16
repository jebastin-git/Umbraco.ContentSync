namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Describes the kind of change detected between source and target environments.
/// </summary>
public enum ChangeType
{
    /// <summary>Item exists in source but not in target — needs to be created on target.</summary>
    Added,

    /// <summary>Item exists in both but with different property values — target is stale.</summary>
    Updated,

    /// <summary>Item exists in target but not in source — has been removed from source.</summary>
    Deleted
}
