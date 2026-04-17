using System.Text.Json.Nodes;
using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Infrastructure.Manifest;

namespace Umbraco.ContentSync.Infrastructure.Manifest;

/// <summary>
/// Registers the Content Sync backoffice dashboard extension with Umbraco's manifest system.
///
/// Umbraco resolves all <see cref="IPackageManifestReader"/> implementations and merges
/// their results into the backoffice extension registry.  By registering here we avoid
/// placing any files under <c>App_Plugins/</c>; the JS bundle is served as a static web
/// asset at <c>/ContentSync/content-sync-dashboard.js</c>.
/// </summary>
internal sealed class ContentSyncPackageManifestReader : IPackageManifestReader
{
    public Task<IEnumerable<PackageManifest>> ReadPackageManifestsAsync()
    {
        var dashboard = new JsonObject
        {
            ["type"]    = "dashboard",
            ["alias"]   = "Umbraco.ContentSync.Dashboard",
            ["name"]    = "Content Sync",
            ["element"] = "/ContentSync/content-sync-dashboard.js",
            ["weight"]  = 10,
            ["meta"]    = new JsonObject
            {
                ["label"]    = "Content Sync",
                ["pathname"] = "content-sync"
            },
            ["conditions"] = new JsonArray
            {
                new JsonObject
                {
                    ["alias"] = "Umb.Condition.SectionAlias",
                    ["match"] = "Umb.Section.Content"
                }
            }
        };

        var manifest = new PackageManifest
        {
            Name             = "Content Sync Dashboard",
            AllowPublicAccess = false,
            Extensions       = new object[] { dashboard }
        };

        return Task.FromResult<IEnumerable<PackageManifest>>(new[] { manifest });
    }
}
