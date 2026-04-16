using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Detects write conflicts between an incoming sync payload (source) and the
/// current state of the target environment, using the pre-computed diff as its
/// primary signal so that expensive comparisons are not repeated.
/// </summary>
public interface IConflictService
{
    /// <summary>
    /// Analyses the relationship between <paramref name="source"/>,
    /// <paramref name="target"/>, and the already-computed <paramref name="diffs"/>
    /// to produce a list of <see cref="SyncConflict"/> records.
    ///
    /// <para>Conflict types detected:</para>
    /// <list type="bullet">
    ///   <item>
    ///     <term><see cref="ConflictTypes.ModifiedInBoth"/></term>
    ///     <description>
    ///       A property appears as Updated in <paramref name="diffs"/> and the
    ///       target item's <see cref="SyncItem.LastUpdated"/> is more recent than
    ///       the source item's — the target has a newer local edit.
    ///     </description>
    ///   </item>
    ///   <item>
    ///     <term><see cref="ConflictTypes.DeletedInTarget"/></term>
    ///     <description>
    ///       Source has an item that target does not — import would (re)create
    ///       something the target may have intentionally removed.
    ///     </description>
    ///   </item>
    ///   <item>
    ///     <term><see cref="ConflictTypes.MissingInSource"/></term>
    ///     <description>
    ///       Target has an item that source does not — import would delete
    ///       something the target may have created independently.
    ///     </description>
    ///   </item>
    /// </list>
    ///
    /// Returns an empty list when no conflicts are detected.
    /// </summary>
    /// <param name="source">Items from the incoming payload.</param>
    /// <param name="target">Items from the current environment.</param>
    /// <param name="diffs">
    /// Property-level diffs already produced by <see cref="IDiffService.Compare"/>.
    /// Passing these in avoids recomputing the diff inside the conflict detector.
    /// </param>
    IReadOnlyList<SyncConflict> DetectConflicts(
        IReadOnlyList<SyncItem> source,
        IReadOnlyList<SyncItem> target,
        IReadOnlyList<SyncDiff> diffs);
}
