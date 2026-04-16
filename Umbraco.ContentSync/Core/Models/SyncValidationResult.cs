namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Result of running <c>ISyncValidator.Validate()</c> against a sync payload.
///
/// A result is considered valid only when <see cref="Errors"/> is empty.
/// <see cref="Warnings"/> are informational — they do not block import but
/// should be surfaced to the operator before proceeding.
/// </summary>
public sealed class SyncValidationResult
{
    /// <summary>
    /// <c>true</c> when the payload can safely be imported;
    /// <c>false</c> when at least one <see cref="Errors">error</see> was found.
    /// </summary>
    public bool IsValid => Errors.Count == 0;

    /// <summary>
    /// Blocking issues that prevent the import from proceeding
    /// (malformed JSON, duplicate IDs, missing required fields, …).
    /// </summary>
    public List<string> Errors { get; init; } = [];

    /// <summary>
    /// Non-blocking observations that the operator should be aware of
    /// (empty property bags, unrecognised item types, …).
    /// </summary>
    public List<string> Warnings { get; init; } = [];
}
