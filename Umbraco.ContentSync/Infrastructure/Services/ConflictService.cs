using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// Default implementation of <see cref="IConflictService"/>.
///
/// Detection strategy:
/// <list type="number">
///   <item>Build <c>Id → SyncItem</c> lookup maps for source and target.</item>
///   <item>
///     Group the pre-computed diffs by <see cref="SyncDiff.ItemId"/> so each
///     item's changes are examined once.
///   </item>
///   <item>
///     For each item group, determine which conflict scenario applies and
///     emit the appropriate <see cref="SyncConflict"/> records.
///   </item>
/// </list>
///
/// All three conflict types are evaluated independently — an item can only
/// trigger one type per execution (the categories are mutually exclusive by
/// construction: item-in-source-only, item-in-target-only, item-in-both).
/// </summary>
public sealed class ConflictService : IConflictService
{
    public IReadOnlyList<SyncConflict> DetectConflicts(
        IReadOnlyList<SyncItem> source,
        IReadOnlyList<SyncItem> target,
        IReadOnlyList<SyncDiff> diffs)
    {
        var sourceMap = source.ToDictionary(x => x.Id);
        var targetMap = target.ToDictionary(x => x.Id);

        var conflicts = new List<SyncConflict>();

        // Process every item that appears in at least one diff record.
        // Grouping by ItemId lets us examine all property changes for one
        // item at once without iterating the full diff list multiple times.
        foreach (var group in diffs.GroupBy(d => d.ItemId))
        {
            var itemId = group.Key;
            sourceMap.TryGetValue(itemId, out var sourceItem);
            targetMap.TryGetValue(itemId, out var targetItem);

            if (sourceItem is not null && targetItem is null)
            {
                // ── DeletedInTarget ──────────────────────────────────────────
                // Source has this item; target does not. The import would
                // (re)create it, but the target may have intentionally deleted
                // it. One conflict record represents the whole item.
                conflicts.Add(BuildItemConflict(
                    sourceItem.Id,
                    sourceItem.Name,
                    ConflictTypes.DeletedInTarget));
            }
            else if (sourceItem is null && targetItem is not null)
            {
                // ── MissingInSource ──────────────────────────────────────────
                // Target has this item; source does not. The import would
                // remove it from target, but target may have created it
                // independently. One conflict record represents the whole item.
                conflicts.Add(BuildItemConflict(
                    targetItem.Id,
                    targetItem.Name,
                    ConflictTypes.MissingInSource));
            }
            else if (sourceItem is not null && targetItem is not null
                     && targetItem.LastUpdated > sourceItem.LastUpdated)
            {
                // ── ModifiedInBoth ───────────────────────────────────────────
                // Both environments have the item, but target was modified
                // more recently than the source snapshot. Only emit a conflict
                // for properties that are actually different (Updated), not for
                // Added/Deleted properties which represent schema changes.
                foreach (var diff in group.Where(d => d.ChangeType == ChangeType.Updated))
                {
                    conflicts.Add(new SyncConflict
                    {
                        ItemId = itemId,
                        ItemName = sourceItem.Name,
                        PropertyName = diff.PropertyName,
                        SourceValue = diff.SourcePropertyValue,
                        TargetValue = diff.TargetPropertyValue,
                        ConflictType = ConflictTypes.ModifiedInBoth
                    });
                }
            }
            // If both have the item and target is NOT newer, there is no
            // conflict — the diffs describe safe changes to apply.
        }

        return conflicts
            .OrderBy(c => c.ConflictType, StringComparer.Ordinal)
            .ThenBy(c => c.ItemName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(c => c.PropertyName, StringComparer.OrdinalIgnoreCase)
            .ToList()
            .AsReadOnly();
    }

    // -------------------------------------------------------------------------
    // Factory helpers
    // -------------------------------------------------------------------------

    /// <summary>
    /// Builds an item-level conflict (no specific property).
    /// Used for <see cref="ConflictTypes.DeletedInTarget"/> and
    /// <see cref="ConflictTypes.MissingInSource"/>.
    /// </summary>
    private static SyncConflict BuildItemConflict(
        Guid itemId,
        string itemName,
        string conflictType) => new()
    {
        ItemId = itemId,
        ItemName = itemName,
        PropertyName = string.Empty,
        SourceValue = null,
        TargetValue = null,
        ConflictType = conflictType
    };
}
