using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// Property-level diff engine.
///
/// Algorithm overview:
/// <list type="number">
///   <item>Build <c>Dictionary&lt;Guid, SyncItem&gt;</c> for source and target.</item>
///   <item>
///     Items in source only → emit one <see cref="SyncDiff"/> per property
///     with <see cref="ChangeType.Added"/>.
///   </item>
///   <item>
///     Items in target only → emit one <see cref="SyncDiff"/> per property
///     with <see cref="ChangeType.Deleted"/>.
///   </item>
///   <item>
///     Items in both → compare property dictionaries:
///     <list type="bullet">
///       <item>Property in source only → <see cref="ChangeType.Added"/></item>
///       <item>Property in target only → <see cref="ChangeType.Deleted"/></item>
///       <item>Property in both, values differ → <see cref="ChangeType.Updated"/></item>
///       <item>Property in both, values equal → omitted</item>
///     </list>
///   </item>
///   <item>
///     Normalise values before comparison: trim whitespace and treat
///     <c>null</c> / empty string as equivalent (both mean "no value").
///   </item>
///   <item>Final sort: Deleted → Updated → Added, then by item name, then by property name.</item>
/// </list>
/// </summary>
public sealed class DiffService : IDiffService
{
    public IReadOnlyList<SyncDiff> Compare(
        IEnumerable<SyncItem> source,
        IEnumerable<SyncItem> target)
    {
        var sourceMap = source.ToDictionary(x => x.Id);
        var targetMap = target.ToDictionary(x => x.Id);

        var diffs = new List<SyncDiff>();

        foreach (var (id, sourceItem) in sourceMap)
        {
            if (!targetMap.TryGetValue(id, out var targetItem))
                diffs.AddRange(ItemAddedDiffs(sourceItem));
            else
                diffs.AddRange(PropertyDiffs(sourceItem, targetItem));
        }

        foreach (var (id, targetItem) in targetMap)
        {
            if (!sourceMap.ContainsKey(id))
                diffs.AddRange(ItemDeletedDiffs(targetItem));
        }

        return diffs
            .OrderBy(d => d.ChangeType)          // Deleted(0) → Updated(1) → Added(2)
            .ThenBy(d => d.ItemName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(d => d.PropertyName, StringComparer.OrdinalIgnoreCase)
            .ToList()
            .AsReadOnly();
    }

    // -------------------------------------------------------------------------
    // Item-level helpers
    // -------------------------------------------------------------------------

    /// <summary>
    /// Item exists only on source — every property is new from the target's perspective.
    /// </summary>
    private static IEnumerable<SyncDiff> ItemAddedDiffs(SyncItem source) =>
        source.Properties.Select(kv => BuildDiff(
            source,
            propertyName: kv.Key,
            changeType: ChangeType.Added,
            sourceValue: kv.Value,
            targetValue: null));

    /// <summary>
    /// Item exists only on target — every property needs to be removed from the target.
    /// </summary>
    private static IEnumerable<SyncDiff> ItemDeletedDiffs(SyncItem target) =>
        target.Properties.Select(kv => BuildDiff(
            target,
            propertyName: kv.Key,
            changeType: ChangeType.Deleted,
            sourceValue: null,
            targetValue: kv.Value));

    // -------------------------------------------------------------------------
    // Property-level diff for matched items
    // -------------------------------------------------------------------------

    /// <summary>
    /// Compares the <see cref="SyncItem.Properties"/> dictionaries of two items
    /// that share the same <see cref="SyncItem.Id"/> and yields one
    /// <see cref="SyncDiff"/> per differing property.
    /// </summary>
    private static IEnumerable<SyncDiff> PropertyDiffs(SyncItem source, SyncItem target)
    {
        var sourceProps = source.Properties;
        var targetProps = target.Properties;

        // Properties that exist in source
        foreach (var (key, sourceValue) in sourceProps)
        {
            if (!targetProps.TryGetValue(key, out var targetValue))
            {
                // Present on source, absent on target → Added
                yield return BuildDiff(source, key, ChangeType.Added, sourceValue, null);
            }
            else if (!ValuesAreEqual(sourceValue, targetValue))
            {
                // Present on both but values differ → Updated
                yield return BuildDiff(source, key, ChangeType.Updated, sourceValue, targetValue);
            }
            // Equal → omit
        }

        // Properties that exist only on target → Deleted
        foreach (var (key, targetValue) in targetProps)
        {
            if (!sourceProps.ContainsKey(key))
                yield return BuildDiff(source, key, ChangeType.Deleted, null, targetValue);
        }
    }

    // -------------------------------------------------------------------------
    // Value normalisation
    // -------------------------------------------------------------------------

    /// <summary>
    /// Returns <c>true</c> when <paramref name="a"/> and <paramref name="b"/>
    /// are considered equal after normalisation.
    ///
    /// Rules:
    /// <list type="bullet">
    ///   <item><c>null</c> and empty string are treated as equivalent.</item>
    ///   <item>Leading/trailing whitespace is ignored.</item>
    ///   <item>Comparison is case-sensitive (property values are data, not identifiers).</item>
    /// </list>
    /// </summary>
    private static bool ValuesAreEqual(string? a, string? b) =>
        string.Equals(Normalize(a), Normalize(b), StringComparison.Ordinal);

    /// <summary>
    /// Collapses <c>null</c> to <see cref="string.Empty"/> and trims whitespace.
    /// </summary>
    private static string Normalize(string? value) => value?.Trim() ?? string.Empty;

    // -------------------------------------------------------------------------
    // Factory
    // -------------------------------------------------------------------------

    private static SyncDiff BuildDiff(
        SyncItem item,
        string propertyName,
        ChangeType changeType,
        string? sourceValue,
        string? targetValue) => new()
    {
        ItemId = item.Id,
        ItemName = item.Name,
        PropertyName = propertyName,
        SourcePropertyValue = sourceValue,
        TargetPropertyValue = targetValue,
        ChangeType = changeType
    };
}
