namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// A read-only preview of what a sync import would change on the current
/// environment, including any conflicts that would prevent a safe apply.
///
/// Produced <em>before</em> any writes are made. The UI can render diffs as a
/// side-by-side field comparison and surface conflicts as blocking warnings.
/// </summary>
public sealed class SyncPreview
{
    /// <summary>
    /// Property-level diffs ordered Deleted → Updated → Added.
    /// Each entry identifies the item, the property alias, and the before/after values.
    /// </summary>
    public IReadOnlyList<SyncDiff> Diffs { get; init; } = [];

    /// <summary>Number of property entries that would be <em>added</em> to the target.</summary>
    public int AddedCount { get; init; }

    /// <summary>Number of property entries that would be <em>updated</em> on the target.</summary>
    public int UpdatedCount { get; init; }

    /// <summary>Number of property entries that would be <em>deleted</em> from the target.</summary>
    public int DeletedCount { get; init; }

    /// <summary>
    /// Convenience total — the sum of <see cref="AddedCount"/>,
    /// <see cref="UpdatedCount"/>, and <see cref="DeletedCount"/>.
    /// </summary>
    public int TotalChanges => AddedCount + UpdatedCount + DeletedCount;

    /// <summary>
    /// Conflicts detected between the incoming payload and the current environment.
    /// An import should be blocked (or force-acknowledged) when this list is non-empty.
    /// </summary>
    public IReadOnlyList<SyncConflict> Conflicts { get; init; } = [];

    /// <summary>
    /// <c>true</c> when at least one <see cref="SyncConflict"/> was detected.
    /// Use this as the gate condition in the controller before allowing an import.
    /// </summary>
    public bool HasConflicts => Conflicts.Count > 0;
}
