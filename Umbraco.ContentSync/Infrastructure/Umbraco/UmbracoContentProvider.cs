using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Umbraco;

/// <summary>
/// Retrieves all published content nodes from Umbraco and maps them to
/// <see cref="SyncItem"/> objects that can be diffed and transported.
///
/// The traversal is depth-first starting from the content tree roots.
/// </summary>
public sealed class UmbracoContentProvider : IContentProvider
{
    private readonly IContentService _contentService;

    public UmbracoContentProvider(IContentService contentService)
    {
        _contentService = contentService;
    }

    public IReadOnlyList<SyncItem> GetAll()
    {
        var items = new List<SyncItem>();

        foreach (var root in _contentService.GetRootContent())
        {
            TraverseContent(root, items);
        }

        return items.AsReadOnly();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void TraverseContent(IContent content, List<SyncItem> items)
    {
        items.Add(Map(content));

        // Pass explicit nulls so the compiler selects the fully-specified overload,
        // avoiding the obsolete short-hand variant.
#pragma warning disable CS0618
        var children = _contentService.GetPagedChildren(
            content.Id,
            0L,
            int.MaxValue,
            out _,
            filter: null,
            ordering: null);
#pragma warning restore CS0618

        foreach (var child in children)
        {
            TraverseContent(child, items);
        }
    }

    private static SyncItem Map(IContent content) => new()
    {
        Id = content.Key,
        Name = content.Name ?? string.Empty,
        Type = SyncItemType.Content,
        LastUpdated = content.UpdateDate,
        Properties = content.Properties
            .ToDictionary(
                p => p.Alias,
                p => p.GetValue()?.ToString())
    };
}
