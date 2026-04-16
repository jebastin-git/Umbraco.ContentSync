using System.Text.Json;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// Default implementation of <see cref="ISyncValidator"/>.
///
/// Reuses <see cref="ISyncService"/>, <see cref="IContentProvider"/>,
/// <see cref="IDiffService"/>, and <see cref="IConflictService"/> so all logic
/// stays in its canonical home — this class only orchestrates the steps.
/// </summary>
public sealed class SyncValidator : ISyncValidator
{
    private readonly ISyncService _syncService;
    private readonly IContentProvider _contentProvider;
    private readonly IDiffService _diffService;
    private readonly IConflictService _conflictService;

    public SyncValidator(
        ISyncService syncService,
        IContentProvider contentProvider,
        IDiffService diffService,
        IConflictService conflictService)
    {
        _syncService = syncService;
        _contentProvider = contentProvider;
        _diffService = diffService;
        _conflictService = conflictService;
    }

    // -------------------------------------------------------------------------
    // Validate
    // -------------------------------------------------------------------------

    public SyncValidationResult Validate(string json)
    {
        var errors = new List<string>();
        var warnings = new List<string>();

        // 1. Null / empty guard
        if (string.IsNullOrWhiteSpace(json))
        {
            errors.Add("Payload is empty or null.");
            return new SyncValidationResult { Errors = errors, Warnings = warnings };
        }

        // 2. Structural — attempt to deserialise; collect the items if successful
        IReadOnlyList<SyncItem> items;
        try
        {
            items = _syncService.Import(json);
        }
        catch (JsonException ex)
        {
            errors.Add($"Invalid JSON: {ex.Message}");
            return new SyncValidationResult { Errors = errors, Warnings = warnings };
        }

        // 3. Duplicate IDs
        var duplicateIds = items
            .GroupBy(x => x.Id)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        foreach (var id in duplicateIds)
            errors.Add($"Duplicate item ID detected: '{id}'.");

        // 4. Required field — Id must not be the zero GUID
        foreach (var item in items.Where(x => x.Id == Guid.Empty))
            errors.Add($"Item '{item.Name}' has an empty (zero) ID.");

        // 5. Required field — Name must be present
        foreach (var item in items.Where(x => string.IsNullOrWhiteSpace(x.Name)))
            errors.Add($"Item with ID '{item.Id}' has no name.");

        // 6. Warning — items with no properties may indicate a mapping gap
        foreach (var item in items.Where(x => x.Properties.Count == 0))
            warnings.Add($"Item '{item.Name}' ({item.Id}) has no properties — it may not have been mapped correctly.");

        // 7. Warning — unrecognised SyncItemType values
        foreach (var item in items.Where(x => !Enum.IsDefined(x.Type)))
            warnings.Add($"Item '{item.Name}' has an unrecognised type value '{(int)item.Type}'.");

        return new SyncValidationResult { Errors = errors, Warnings = warnings };
    }

    // -------------------------------------------------------------------------
    // Preview
    // -------------------------------------------------------------------------

    public SyncPreview Preview(string json)
    {
        // Incoming payload = SOURCE (what we want to push in)
        // Current environment = TARGET (what will be changed)
        var incoming = _syncService.Import(json);
        var current = _contentProvider.GetAll();

        var diffs = _diffService.Compare(
            source: incoming,
            target: current);

        var conflicts = _conflictService.DetectConflicts(
            source: incoming,
            target: current,
            diffs: diffs);

        return new SyncPreview
        {
            Diffs = diffs,
            AddedCount = diffs.Count(d => d.ChangeType == ChangeType.Added),
            UpdatedCount = diffs.Count(d => d.ChangeType == ChangeType.Updated),
            DeletedCount = diffs.Count(d => d.ChangeType == ChangeType.Deleted),
            Conflicts = conflicts
        };
    }
}
