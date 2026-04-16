using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Manages in-memory snapshots of content exports.
/// Snapshots allow an operator to review historical exports and restore any
/// previous state without re-running a live content export.
/// </summary>
public interface ISnapshotService
{
    /// <summary>
    /// Persists a new snapshot and returns the created record.
    /// </summary>
    /// <param name="environment">
    /// The logical environment the content was exported from (e.g. "Dev").
    /// </param>
    /// <param name="user">
    /// The actor that triggered the export — "system" for automated calls,
    /// or a back-office username for manual ones.
    /// </param>
    /// <param name="data">
    /// The raw JSON payload produced by <c>ISyncService.Export()</c>.
    /// </param>
    SyncSnapshot CreateSnapshot(string environment, string user, string data);

    /// <summary>
    /// Returns all snapshots for the given environment, ordered newest first.
    /// Returns an empty list when no snapshots exist for that environment.
    /// </summary>
    IReadOnlyList<SyncSnapshot> GetSnapshots(string environment);

    /// <summary>
    /// Returns the snapshot with the specified <paramref name="id"/>,
    /// or <c>null</c> if no such snapshot exists.
    /// </summary>
    SyncSnapshot? GetSnapshot(Guid id);
}
