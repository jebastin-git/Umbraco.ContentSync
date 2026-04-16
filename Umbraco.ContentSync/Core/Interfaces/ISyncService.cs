using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Handles serialisation / deserialisation of <see cref="SyncItem"/> collections
/// so they can be transported between environments (file, HTTP, message queue, …).
/// </summary>
public interface ISyncService
{
    /// <summary>
    /// Serialises <paramref name="items"/> to a self-contained JSON payload
    /// suitable for storage or transmission.
    /// </summary>
    string Export(IEnumerable<SyncItem> items);

    /// <summary>
    /// Deserialises a JSON payload produced by <see cref="Export"/> back into
    /// a list of <see cref="SyncItem"/> objects ready for import / diffing.
    /// </summary>
    /// <exception cref="System.Text.Json.JsonException">
    /// Thrown when <paramref name="json"/> is not valid sync payload JSON.
    /// </exception>
    IReadOnlyList<SyncItem> Import(string json);
}
