namespace Umbraco.ContentSync.Core.Interfaces;

/// <summary>
/// Lightweight post-install validation for the Content Sync package.
///
/// Checks that the static JS bundle is reachable and that the backoffice
/// extension manifest was registered — the two most common failure points
/// after a NuGet install or a misconfigured hosting environment.
///
/// The check is intentionally read-only and dependency-free: no database,
/// no external HTTP calls, no Umbraco content access.
/// </summary>
public interface IContentSyncHealthCheck
{
    /// <summary>
    /// Runs all validation steps and returns an aggregated result.
    /// Never throws — individual failures are captured as <see cref="ContentSyncHealthResult.Message"/>.
    /// </summary>
    Task<ContentSyncHealthResult> CheckAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// The outcome of a <see cref="IContentSyncHealthCheck"/> run.
/// </summary>
public sealed class ContentSyncHealthResult
{
    /// <summary><c>true</c> when all checks passed.</summary>
    public bool IsHealthy { get; init; }

    /// <summary>
    /// Human-readable summary.
    /// On success: a single confirmation line.
    /// On failure: a description of the first failing check with remediation hints.
    /// </summary>
    public string Message { get; init; } = string.Empty;

    /// <summary>Individual check outcomes, one per validation step.</summary>
    public IReadOnlyList<ContentSyncCheckItem> Checks { get; init; } = [];

    // -------------------------------------------------------------------------
    // Factory helpers
    // -------------------------------------------------------------------------

    internal static ContentSyncHealthResult Healthy(IReadOnlyList<ContentSyncCheckItem> checks) =>
        new() { IsHealthy = true, Message = "All checks passed.", Checks = checks };

    internal static ContentSyncHealthResult Unhealthy(
        string message,
        IReadOnlyList<ContentSyncCheckItem> checks) =>
        new() { IsHealthy = false, Message = message, Checks = checks };
}

/// <summary>
/// The result of one named validation step.
/// </summary>
public sealed class ContentSyncCheckItem
{
    /// <summary>Short name identifying the check (e.g. <c>"StaticAsset"</c>).</summary>
    public string Name { get; init; } = string.Empty;

    /// <summary><c>true</c> when the check passed.</summary>
    public bool Passed { get; init; }

    /// <summary>Optional detail — populated on failure with a remediation hint.</summary>
    public string? Detail { get; init; }
}
