namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Describes a single property-level difference detected between the source
/// and target snapshots of one <see cref="SyncItem"/>.
///
/// One <see cref="SyncDiff"/> is emitted per changed property, so a single
/// content node with five modified fields produces five records — each with
/// the same <see cref="ItemId"/> but a different <see cref="PropertyName"/>.
/// This granularity lets a UI render a field-by-field side-by-side comparison
/// without further parsing.
/// </summary>
public sealed class SyncDiff
{
    /// <summary>Identifies which <see cref="SyncItem"/> this diff belongs to.</summary>
    public Guid ItemId { get; init; }

    /// <summary>Human-readable node name — carried here so the UI can group by item.</summary>
    public string ItemName { get; init; } = string.Empty;

    /// <summary>
    /// The alias of the property that changed (e.g. <c>"bodyText"</c>, <c>"pageTitle"</c>).
    /// </summary>
    public string PropertyName { get; init; } = string.Empty;

    /// <summary>
    /// The raw string value of this property on the <em>source</em> environment.
    /// <c>null</c> when <see cref="ChangeType"/> is <see cref="ChangeType.Deleted"/>
    /// (property does not exist on source).
    /// </summary>
    public string? SourcePropertyValue { get; init; }

    /// <summary>
    /// The raw string value of this property on the <em>target</em> environment.
    /// <c>null</c> when <see cref="ChangeType"/> is <see cref="ChangeType.Added"/>
    /// (property does not exist on target).
    /// </summary>
    public string? TargetPropertyValue { get; init; }

    /// <summary>
    /// Backward-compatible alias for <see cref="SourcePropertyValue"/>.
    /// Kept so existing API consumers that read this field continue to receive
    /// the correct value without modification.
    /// </summary>
    public string? SourceValue => SourcePropertyValue;

    /// <summary>
    /// Backward-compatible alias for <see cref="TargetPropertyValue"/>.
    /// Kept so existing API consumers that read this field continue to receive
    /// the correct value without modification.
    /// </summary>
    public string? TargetValue => TargetPropertyValue;

    /// <summary>The kind of change detected for this property.</summary>
    public ChangeType ChangeType { get; init; }
}
