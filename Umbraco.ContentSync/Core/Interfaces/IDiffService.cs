using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Compares two snapshots of content at property level and returns the set of
/// differences that would need to be applied to bring the target in sync with
/// the source.
/// </summary>
public interface IDiffService
{
    /// <summary>
    /// Compares <paramref name="source"/> (e.g. staging) against
    /// <paramref name="target"/> (e.g. production) and returns one
    /// <see cref="SyncDiff"/> per <em>property</em> that differs.
    ///
    /// <para>
    /// Items matched by <see cref="SyncItem.Id"/>. For each matched pair the
    /// individual property values are compared; mismatches each produce their
    /// own <see cref="SyncDiff"/> record so a UI can render a field-by-field
    /// side-by-side view without further parsing.
    /// </para>
    ///
    /// <para>
    /// Items that exist only on one side have all their properties emitted as
    /// <see cref="ChangeType.Added"/> or <see cref="ChangeType.Deleted"/>
    /// respectively.
    /// </para>
    /// </summary>
    /// <param name="source">The authoritative snapshot — the environment you are pushing from.</param>
    /// <param name="target">The snapshot that will receive changes.</param>
    /// <returns>
    /// Ordered list of property-level differences (Deleted → Updated → Added);
    /// empty when environments are in sync.
    /// </returns>
    IReadOnlyList<SyncDiff> Compare(
        IEnumerable<SyncItem> source,
        IEnumerable<SyncItem> target);
}
