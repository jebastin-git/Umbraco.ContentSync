namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Describes a single conflict detected between the incoming payload and the
/// current state of the target environment.
///
/// Conflicts are categorised by <see cref="ConflictType"/>:
/// <list type="bullet">
///   <item>
///     <term>ModifiedInBoth</term>
///     <description>
///       The property exists in both environments and the target was modified
///       <em>more recently</em> than the source snapshot. Applying the import
///       would silently overwrite a newer local edit.
///     </description>
///   </item>
///   <item>
///     <term>DeletedInTarget</term>
///     <description>
///       The source has an item that does not exist on the target. The import
///       would create it, but the target may have intentionally deleted it.
///     </description>
///   </item>
///   <item>
///     <term>MissingInSource</term>
///     <description>
///       The target has an item that the source does not. The import would
///       delete it, but the target may have created it independently.
///     </description>
///   </item>
/// </list>
/// </summary>
public sealed class SyncConflict
{
    /// <summary>Identifies which <see cref="SyncItem"/> is in conflict.</summary>
    public Guid ItemId { get; init; }

    /// <summary>Human-readable node name — carried for display purposes.</summary>
    public string ItemName { get; init; } = string.Empty;

    /// <summary>
    /// The property alias involved in the conflict.
    /// <see cref="string.Empty"/> for item-level conflicts
    /// (<see cref="ConflictTypes.DeletedInTarget"/>, <see cref="ConflictTypes.MissingInSource"/>)
    /// where no specific property can be identified.
    /// </summary>
    public string PropertyName { get; init; } = string.Empty;

    /// <summary>
    /// The value of this property on the <em>source</em> (incoming payload).
    /// <c>null</c> for item-level conflicts.
    /// </summary>
    public string? SourceValue { get; init; }

    /// <summary>
    /// The value of this property on the <em>target</em> (current environment).
    /// <c>null</c> for item-level conflicts.
    /// </summary>
    public string? TargetValue { get; init; }

    /// <summary>
    /// One of the well-known strings defined in <see cref="ConflictTypes"/>:
    /// <c>"ModifiedInBoth"</c>, <c>"DeletedInTarget"</c>, <c>"MissingInSource"</c>.
    /// </summary>
    public string ConflictType { get; init; } = string.Empty;
}

/// <summary>
/// Well-known <see cref="SyncConflict.ConflictType"/> string constants.
/// Using constants instead of an enum keeps the model serialisation-friendly
/// and extensible without breaking existing consumers.
/// </summary>
public static class ConflictTypes
{
    /// <summary>Both environments modified the same property; target is newer.</summary>
    public const string ModifiedInBoth = "ModifiedInBoth";

    /// <summary>Source has the item; target does not — target may have deleted it.</summary>
    public const string DeletedInTarget = "DeletedInTarget";

    /// <summary>Target has the item; source does not — sync would delete it from target.</summary>
    public const string MissingInSource = "MissingInSource";
}
