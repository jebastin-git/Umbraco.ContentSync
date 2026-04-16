using System.Collections.Concurrent;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// In-memory implementation of <see cref="ISnapshotService"/> backed by a
/// <see cref="ConcurrentDictionary{TKey,TValue}"/>.
///
/// The dictionary is <c>static</c> so snapshot history survives DI container
/// rebuilds (e.g. during integration tests) and is shared across all instances,
/// consistent with the Singleton registration lifetime.
///
/// Replace this implementation with a database-backed one when persistence
/// beyond process lifetime is required.
/// </summary>
public sealed class SnapshotService : ISnapshotService
{
    // Static backing store — survives container rebuilds, shared across all
    // resolved instances (safe because this is registered as Singleton).
    private static readonly ConcurrentDictionary<Guid, SyncSnapshot> _store = new();

    /// <inheritdoc />
    public SyncSnapshot CreateSnapshot(string environment, string user, string data)
    {
        var snapshot = new SyncSnapshot
        {
            Id = Guid.NewGuid(),
            Environment = environment,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user,
            Data = data
        };

        _store[snapshot.Id] = snapshot;

        return snapshot;
    }

    /// <inheritdoc />
    public IReadOnlyList<SyncSnapshot> GetSnapshots(string environment) =>
        _store.Values
            .Where(s => string.Equals(s.Environment, environment, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(s => s.CreatedAt)
            .ToList()
            .AsReadOnly();

    /// <inheritdoc />
    public SyncSnapshot? GetSnapshot(Guid id) =>
        _store.TryGetValue(id, out var snapshot) ? snapshot : null;
}
