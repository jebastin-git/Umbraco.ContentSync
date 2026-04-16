using System.Text.Json;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Core.Models;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// Serialises and deserialises <see cref="SyncItem"/> collections to/from a
/// JSON payload envelope, and records a <see cref="SyncSnapshot"/> after
/// every successful export so the history is always up to date.
/// </summary>
public sealed class SyncService : ISyncService
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };

    private readonly ISnapshotService _snapshotService;

    public SyncService(ISnapshotService snapshotService)
    {
        _snapshotService = snapshotService;
    }

    public string Export(IEnumerable<SyncItem> items)
    {
        var payload = new SyncPayload
        {
            Version = SyncPayload.CurrentVersion,
            ExportedAt = DateTime.UtcNow,
            Items = items.ToList()
        };

        var json = JsonSerializer.Serialize(payload, _jsonOptions);

        // Persist a snapshot so operators can list or restore this export later.
        // Environment and user are hardcoded for MVP; replace with values from
        // IHttpContextAccessor / configuration when multi-environment support lands.
        _snapshotService.CreateSnapshot(
            environment: "Dev",
            user: "system",
            data: json);

        return json;
    }

    public IReadOnlyList<SyncItem> Import(string json)
    {
        var payload = JsonSerializer.Deserialize<SyncPayload>(json, _jsonOptions)
            ?? throw new JsonException("Deserialised payload was null — not a valid sync export.");

        return payload.Items.AsReadOnly();
    }

    // -------------------------------------------------------------------------
    // Private envelope type
    // -------------------------------------------------------------------------

    private sealed class SyncPayload
    {
        public const int CurrentVersion = 1;

        public int Version { get; set; }
        public DateTime ExportedAt { get; set; }
        public List<SyncItem> Items { get; set; } = [];
    }
}
