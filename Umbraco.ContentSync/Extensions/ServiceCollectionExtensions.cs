using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Infrastructure.Manifest;
using Umbraco.ContentSync.API.Controllers;
using Umbraco.ContentSync.Core.Interfaces;
using Umbraco.ContentSync.Infrastructure.Manifest;
using Umbraco.ContentSync.Infrastructure.Services;
using Umbraco.ContentSync.Infrastructure.Umbraco;

namespace Umbraco.ContentSync.Extensions;

/// <summary>
/// Extension methods for registering the Content Sync Engine with the Umbraco DI container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all Content Sync services (diff engine, sync engine, Umbraco content provider)
    /// and exposes the <see cref="SyncController"/> to ASP.NET Core's MVC pipeline.
    ///
    /// Usage in <c>Program.cs</c>:
    /// <code>
    /// builder.CreateUmbracoBuilder()
    ///     .AddBackOffice()
    ///     .AddWebsite()
    ///     .AddComposers()
    ///     .AddContentSync()   // ← add this
    ///     .Build();
    /// </code>
    /// </summary>
    public static IUmbracoBuilder AddContentSync(this IUmbracoBuilder builder)
    {
        // Core services
        builder.Services.AddScoped<IDiffService, DiffService>();
        builder.Services.AddScoped<ISyncService, SyncService>();
        builder.Services.AddScoped<IContentProvider, UmbracoContentProvider>();

        // Singleton — snapshot store must outlive individual HTTP requests so that
        // history accumulates across the lifetime of the process.
        builder.Services.AddSingleton<ISnapshotService, SnapshotService>();

        // Conflict detection — Scoped; stateless per-request, depends on Scoped services.
        builder.Services.AddScoped<IConflictService, ConflictService>();

        // Validation + preview gate — Scoped so it shares the request's DiffService,
        // SyncService, ContentProvider, and ConflictService without re-resolving.
        builder.Services.AddScoped<ISyncValidator, SyncValidator>();

        // Startup log — deferred to IStartupFilter so the container is fully built
        // before we resolve ILogger. Using BuildServiceProvider() here would create
        // a second root container (ASP0000 anti-pattern) and miss late registrations.
        builder.Services.AddTransient<IStartupFilter, ContentSyncStartupFilter>();

        // Health check — Scoped (uses IWebHostEnvironment which is Singleton-safe,
        // and IEnumerable<IPackageManifestReader> which are Transient).
        builder.Services.AddScoped<IContentSyncHealthCheck, ContentSyncHealthCheck>();

        // Register backoffice extension manifest without App_Plugins.
        // Umbraco resolves IEnumerable<IPackageManifestReader> and merges results;
        // our reader contributes the dashboard definition so the JS bundle served at
        // /ContentSync/content-sync-dashboard.js is registered with the backoffice.
        builder.Services.AddTransient<IPackageManifestReader, ContentSyncPackageManifestReader>();

        // Ensure the controller assembly is discovered by ASP.NET Core's MVC engine.
        // Calling AddControllers() on an already-configured MVC builder is idempotent;
        // AddApplicationPart() accumulates — safe to call multiple times.
        builder.Services
            .AddControllers()
            .AddApplicationPart(typeof(SyncController).Assembly);

        return builder;
    }
}

/// <summary>
/// Emits the "initialized successfully" log entry after the DI container is
/// fully built, avoiding the <c>BuildServiceProvider()</c> anti-pattern.
///
/// <see cref="IStartupFilter"/> runs once per process start, before the first
/// request is handled, making it the correct hook for startup diagnostics.
/// </summary>
internal sealed class ContentSyncStartupFilter : IStartupFilter
{
    // Resolved once per process from the assembly attribute so the value is always
    // consistent with the published NuGet version. Any git-hash suffix (e.g. "0.1.0+abc123")
    // is stripped at the '+' to keep the log line concise.
    private static readonly string Version =
        (typeof(ContentSyncStartupFilter).Assembly
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()
            ?.InformationalVersion ?? "unknown")
        .Split('+')[0];

    // Determined at compile time via the TFM-specific preprocessor symbol injected by the
    // .NET SDK. RuntimeInformation.FrameworkDescription returns prose (".NET 10.0.0") which
    // does not match the MSBuild TFM moniker used in project files and NuGet metadata.
#if NET10_0_OR_GREATER
    private const string Tfm = "net10.0";
#else
    private const string Tfm = "net8.0";
#endif

    private readonly ILogger<ContentSyncStartupFilter> _logger;

    public ContentSyncStartupFilter(ILogger<ContentSyncStartupFilter> logger)
        => _logger = logger;

    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        _logger.LogInformation(
            "Umbraco.ContentSync v{Version} initialized (TFM: {Tfm}).",
            Version, Tfm);
        return next;
    }
}
