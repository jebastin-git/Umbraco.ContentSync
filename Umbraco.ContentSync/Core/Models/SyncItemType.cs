namespace Umbraco.ContentSync.Core.Models;

/// <summary>
/// Discriminates what kind of Umbraco entity a <see cref="SyncItem"/> represents.
/// </summary>
public enum SyncItemType
{
    Content,
    Media,
    Settings
}
