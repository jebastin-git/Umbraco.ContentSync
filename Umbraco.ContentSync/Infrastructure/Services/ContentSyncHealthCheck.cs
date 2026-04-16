using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Infrastructure.Manifest;
using Umbraco.ContentSync.Core.Interfaces;

namespace Umbraco.ContentSync.Infrastructure.Services;

/// <summary>
/// Default implementation of <see cref="IContentSyncHealthCheck"/>.
///
/// Two checks are performed in order:
/// <list type="number">
///   <item>
///     <b>StaticAsset</b> — the JS bundle
///     (<c>/ContentSync/content-sync-dashboard.js</c>) must be resolvable via
///     <see cref="IWebHostEnvironment.WebRootFileProvider"/>. If it isn't, the
///     backoffice will silently fail to load the dashboard tab.
///   </item>
///   <item>
///     <b>ManifestReader</b> — at least one <see cref="IPackageManifestReader"/>
///     that reports itself as the Content Sync reader must be registered. This
///     confirms that <c>AddContentSync()</c> was called in <c>Program.cs</c>.
///   </item>
/// </list>
///
/// Failures are logged at <c>Warning</c> level and returned in the result —
/// the method never throws.
/// </summary>
internal sealed class ContentSyncHealthCheck : IContentSyncHealthCheck
{
    private const string JsBundlePath = "ContentSync/content-sync-dashboard.js";

    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IEnumerable<IPackageManifestReader> _manifestReaders;
    private readonly ILogger<ContentSyncHealthCheck> _logger;

    public ContentSyncHealthCheck(
        IWebHostEnvironment webHostEnvironment,
        IEnumerable<IPackageManifestReader> manifestReaders,
        ILogger<ContentSyncHealthCheck> logger)
    {
        _webHostEnvironment = webHostEnvironment;
        _manifestReaders = manifestReaders;
        _logger = logger;
    }

    public async Task<ContentSyncHealthResult> CheckAsync(CancellationToken cancellationToken = default)
    {
        var checks = new List<ContentSyncCheckItem>();

        // ── Check 1: static JS asset ──────────────────────────────────────────
        checks.Add(await CheckStaticAssetAsync());

        // ── Check 2: manifest reader registered ──────────────────────────────
        checks.Add(await CheckManifestReaderAsync());

        var failed = checks.Where(c => !c.Passed).ToList();

        if (failed.Count == 0)
            return ContentSyncHealthResult.Healthy(checks);

        var firstMessage = failed[0].Detail ?? "Unknown failure.";
        return ContentSyncHealthResult.Unhealthy(firstMessage, checks);
    }

    // -------------------------------------------------------------------------
    // Individual checks
    // -------------------------------------------------------------------------

    private Task<ContentSyncCheckItem> CheckStaticAssetAsync()
    {
        const string name = "StaticAsset";

        try
        {
            var fileInfo = _webHostEnvironment.WebRootFileProvider.GetFileInfo(JsBundlePath);

            if (fileInfo.Exists)
                return Task.FromResult(Pass(name));

            var detail =
                $"Static asset '{JsBundlePath}' was not found via IWebRootFileProvider. " +
                "Ensure the Umbraco.ContentSync NuGet package is correctly installed and " +
                "that app.UseStaticFiles() is called in Program.cs.";

            _logger.LogWarning(
                "Umbraco.ContentSync health check: {Check} FAILED — {Detail}",
                name, detail);

            return Task.FromResult(Fail(name, detail));
        }
        catch (Exception ex)
        {
            var detail = $"Exception while checking static asset: {ex.Message}";
            _logger.LogWarning(ex,
                "Umbraco.ContentSync health check: {Check} threw an exception.", name);
            return Task.FromResult(Fail(name, detail));
        }
    }

    private async Task<ContentSyncCheckItem> CheckManifestReaderAsync()
    {
        const string name = "ManifestReader";

        try
        {
            foreach (var reader in _manifestReaders)
            {
                var manifests = await reader.ReadPackageManifestsAsync();

                if (manifests.Any(m => string.Equals(
                        m.Name,
                        "Content Sync Dashboard",
                        StringComparison.Ordinal)))
                {
                    return Pass(name);
                }
            }

            const string detail =
                "No IPackageManifestReader returned a 'Content Sync Dashboard' manifest. " +
                "Verify that AddContentSync() is called in the Umbraco builder chain.";

            _logger.LogWarning(
                "Umbraco.ContentSync health check: {Check} FAILED — {Detail}",
                name, detail);

            return Fail(name, detail);
        }
        catch (Exception ex)
        {
            var detail = $"Exception while reading package manifests: {ex.Message}";
            _logger.LogWarning(ex,
                "Umbraco.ContentSync health check: {Check} threw an exception.", name);
            return Fail(name, detail);
        }
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static ContentSyncCheckItem Pass(string name) =>
        new() { Name = name, Passed = true };

    private static ContentSyncCheckItem Fail(string name, string detail) =>
        new() { Name = name, Passed = false, Detail = detail };
}
