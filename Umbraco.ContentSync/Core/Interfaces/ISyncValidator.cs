using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Validates and previews a sync payload <em>before</em> any write occurs,
/// providing a safe gate between receiving a payload and committing it.
///
/// Callers should always call <see cref="Validate"/> first; only proceed to
/// <see cref="Preview"/> or import when <see cref="SyncValidationResult.IsValid"/>
/// is <c>true</c>.
/// </summary>
public interface ISyncValidator
{
    /// <summary>
    /// Performs structural and business-rule validation on a raw JSON payload.
    ///
    /// <para>Checks performed:</para>
    /// <list type="bullet">
    ///   <item>Payload is not null or empty.</item>
    ///   <item>JSON can be deserialised into the expected sync envelope.</item>
    ///   <item>No duplicate item IDs.</item>
    ///   <item>All items have a non-empty ID and a non-blank name.</item>
    /// </list>
    ///
    /// <para>Warnings (non-blocking) are raised for:</para>
    /// <list type="bullet">
    ///   <item>Items with no properties.</item>
    ///   <item>Items with an unrecognised <see cref="SyncItemType"/> value.</item>
    /// </list>
    /// </summary>
    /// <param name="json">Raw JSON payload as produced by <c>ISyncService.Export()</c>.</param>
    SyncValidationResult Validate(string json);

    /// <summary>
    /// Deserialises <paramref name="json"/>, fetches the current environment's
    /// content, runs a property-level diff, and returns a structured preview
    /// of what the import would change.
    ///
    /// This method assumes the payload has already been validated; calling it
    /// with an invalid payload will throw.
    /// </summary>
    /// <param name="json">A payload that has passed <see cref="Validate"/>.</param>
    SyncPreview Preview(string json);
}
