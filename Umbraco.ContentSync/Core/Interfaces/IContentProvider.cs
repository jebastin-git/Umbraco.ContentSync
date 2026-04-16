using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Abstracts the source of content to be synced.
/// The default implementation queries Umbraco's <c>IContentService</c>;
/// alternative implementations could read from a file or a remote endpoint.
/// </summary>
public interface IContentProvider
{
    /// <summary>
    /// Returns a flat list of all <see cref="SyncItem"/> instances available
    /// on the current environment, regardless of their position in the tree.
    /// </summary>
    IReadOnlyList<SyncItem> GetAll();
}
