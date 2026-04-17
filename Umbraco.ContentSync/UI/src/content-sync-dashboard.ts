import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_AUTH_CONTEXT, type UmbAuthContext } from '@umbraco-cms/backoffice/auth';

// ── API response types ──────────────────────────────────────────────────────
// Mirrors the C# models serialised with System.Text.Json default (camelCase).

interface SnapshotDto {
  id: string;
  environment: string;
  createdAt: string;
  createdBy: string;
}

/** Full snapshot — returned by GET /api/contentsync/snapshot/{id} */
interface SyncSnapshot extends SnapshotDto {
  data: string; // raw JSON payload produced by ISyncService.Export()
}

interface SyncDiff {
  itemId: string;
  itemName: string;
  propertyName: string;
  sourcePropertyValue: string | null;
  targetPropertyValue: string | null;
  changeType: 'Added' | 'Updated' | 'Deleted';
}

interface SyncConflict {
  itemId: string;
  itemName: string;
  propertyName: string;      // empty string for item-level conflicts
  sourceValue: string | null;
  targetValue: string | null;
  conflictType: string;      // ConflictTypes constants: ModifiedInBoth | DeletedInTarget | MissingInSource
}

interface SyncPreview {
  diffs: SyncDiff[];
  addedCount: number;
  updatedCount: number;
  deletedCount: number;
  totalChanges: number;
  conflicts: SyncConflict[];
  hasConflicts: boolean;
}

interface SyncValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface SyncImportResult {
  importedCount: number;
  status: string;
  processedAt: string;
  preview: SyncPreview | null;
  warnings: string[];
  forced: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────

@customElement('content-sync-dashboard')
export class ContentSyncDashboard extends UmbElementMixin(LitElement) {

  // ── Styles ────────────────────────────────────────────────────────────────
  // Uses Umbraco UI Library CSS custom properties so the component inherits
  // the active backoffice theme (light / dark) automatically.

  static override styles = css`
    :host {
      display: block;
      padding: var(--uui-size-layout-1, 24px);
      font-family: var(--uui-font-family, sans-serif);
      font-size: var(--uui-type-small-size, 14px);
      color: var(--uui-color-text, #1a1a1a);
    }

    /* ── Layout ────────────────────────────────────────────────────── */
    section {
      margin-bottom: var(--uui-size-layout-1, 24px);
    }
    h2 {
      margin: 0 0 var(--uui-size-space-4, 12px);
      font-size: var(--uui-type-h4-size, 1rem);
      font-weight: 600;
    }
    h3 {
      margin: 0 0 var(--uui-size-space-3, 8px);
      font-size: var(--uui-type-small-size, 14px);
      font-weight: 600;
      color: var(--uui-color-text-alt, #555);
    }

    /* ── Controls ──────────────────────────────────────────────────── */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
    }
    select {
      padding: 6px 10px;
      min-width: 340px;
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      background: var(--uui-color-surface, #fff);
      color: var(--uui-color-text, #1a1a1a);
      font-size: inherit;
      cursor: pointer;
    }
    select:disabled { opacity: 0.5; cursor: not-allowed; }
    select:focus-visible { outline: 2px solid var(--uui-color-focus, #3544b1); outline-offset: 1px; }

    /* ── Summary counts ────────────────────────────────────────────── */
    .summary-bar {
      display: flex;
      gap: var(--uui-size-space-4, 12px);
      margin-bottom: var(--uui-size-space-4, 12px);
    }
    .count-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--uui-size-space-3, 8px) var(--uui-size-space-5, 16px);
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      min-width: 72px;
    }
    .count-card .count { font-size: 1.6rem; font-weight: 700; line-height: 1; }
    .count-card .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--uui-color-text-alt, #666);
      margin-top: 4px;
    }
    .count-card.added   .count { color: var(--uui-color-positive-standalone, #1c8140); }
    .count-card.updated .count { color: var(--uui-color-warning-standalone, #9a6010); }
    .count-card.deleted .count { color: var(--uui-color-danger-standalone, #b01c2e); }

    /* ── Conflict list ─────────────────────────────────────────────── */
    .conflict-header,
    .conflict-row {
      display: grid;
      grid-template-columns: 2fr 2fr 160px;
      gap: var(--uui-size-space-3, 8px);
      padding: 6px var(--uui-size-space-3, 8px);
      border-bottom: 1px solid var(--uui-color-border-standalone, #e5e5e5);
      font-size: 0.8125rem;
    }
    .conflict-header {
      font-weight: 600;
      color: var(--uui-color-text-alt, #666);
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    .conflict-row:last-child { border-bottom: none; }
    .conflict-type {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 3px;
      font-size: 0.7rem;
      font-weight: 600;
      background: #fff3cd;
      color: #7a4f00;
      white-space: nowrap;
    }
    .conflict-type.ModifiedInBoth  { background: #fff3cd; color: #7a4f00; }
    .conflict-type.DeletedInTarget { background: #f8d7da; color: #7d1a24; }
    .conflict-type.MissingInSource { background: #cce5ff; color: #004085; }

    /* ── Diff table ────────────────────────────────────────────────── */
    details { margin: var(--uui-size-space-3, 8px) 0; }
    details > summary {
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--uui-color-interactive, #3544b1);
      user-select: none;
    }
    .diff-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--uui-size-space-3, 8px);
      font-size: 0.8125rem;
    }
    .diff-table th {
      text-align: left;
      padding: 5px 8px;
      background: var(--uui-color-surface-alt, #f5f5f5);
      border-bottom: 2px solid var(--uui-color-border, #c4c4c4);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--uui-color-text-alt, #555);
    }
    .diff-table td {
      padding: 5px 8px;
      border-bottom: 1px solid var(--uui-color-border-standalone, #e5e5e5);
      vertical-align: top;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .change-Added   { color: var(--uui-color-positive-standalone, #1c8140); font-weight: 600; }
    .change-Updated { color: var(--uui-color-warning-standalone, #9a6010); font-weight: 600; }
    .change-Deleted { color: var(--uui-color-danger-standalone, #b01c2e); font-weight: 600; }
    .null-value { color: var(--uui-color-text-alt, #aaa); font-style: italic; }

    /* ── Result block ──────────────────────────────────────────────── */
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; }
    dt { font-weight: 600; color: var(--uui-color-text-alt, #555); }
    dd { margin: 0; }

    /* ── Status messages ───────────────────────────────────────────── */
    .message {
      margin-top: var(--uui-size-space-3, 8px);
      padding: 8px 12px;
      border-radius: var(--uui-border-radius, 3px);
      font-size: 0.875rem;
      border: none;
      color: #fff;
    }
    .message.error   { background: var(--uui-color-danger-standalone, #b01c2e); }
    .message.success { background: var(--uui-color-positive-standalone, #1c8140); }
    .empty-hint {
      color: var(--uui-color-text-alt, #888);
      font-style: italic;
      font-size: 0.875rem;
    }
    .no-conflict { color: var(--uui-color-positive-standalone, #1c8140); font-size: 0.875rem; }

    /* ── Environment input ─────────────────────────────────────────── */
    .env-row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
      margin-bottom: var(--uui-size-space-4, 12px);
    }
    .env-row label {
      font-weight: 600;
      font-size: 0.8125rem;
      color: var(--uui-color-text-alt, #555);
      white-space: nowrap;
    }
    .env-row input {
      padding: 5px 10px;
      width: 160px;
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      background: var(--uui-color-surface, #fff);
      color: var(--uui-color-text, #1a1a1a);
      font-size: inherit;
    }
    .env-row input:focus-visible { outline: 2px solid var(--uui-color-focus, #3544b1); outline-offset: 1px; }

    /* ── Sync actions ──────────────────────────────────────────────── */
    .actions {
      display: flex;
      gap: var(--uui-size-space-3, 8px);
      margin-top: var(--uui-size-space-4, 12px);
      align-items: center;
      flex-wrap: wrap;
    }
    .sync-hint {
      font-size: 0.8125rem;
      color: var(--uui-color-text-alt, #777);
      font-style: italic;
    }
    .force-sync-wrap {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
      padding-left: var(--uui-size-space-4, 12px);
      border-left: 2px solid var(--uui-color-danger-standalone, #b01c2e);
      margin-left: var(--uui-size-space-3, 8px);
    }
    .force-sync-label {
      font-size: 0.75rem;
      color: var(--uui-color-danger-standalone, #b01c2e);
      font-weight: 600;
    }

    /* ── Utility ───────────────────────────────────────────────────── */
    uui-button + uui-button, uui-button + select { margin-left: 0; }
  `;

  // ── Reactive state ────────────────────────────────────────────────────────

  @state() private _snapshots: SnapshotDto[] = [];
  @state() private _selectedId = '';
  @state() private _preview: SyncPreview | null = null;
  @state() private _syncResult: SyncImportResult | null = null;
  @state() private _busy = false;
  @state() private _error = '';
  @state() private _success = '';
  @state() private _environment = 'Dev';

  #authContext?: UmbAuthContext;

  // Injected at runtime by UmbElementMixin — declared here for TypeScript.
  declare consumeContext: <T>(token: unknown, callback: (context: T) => void) => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.consumeContext(UMB_AUTH_CONTEXT, (auth: UmbAuthContext) => {
      this.#authContext = auth;
      this._loadSnapshots();
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    return html`
      <uui-box headline="Content Sync">

        ${this._busy ? html`<uui-loader-bar></uui-loader-bar>` : nothing}

        ${this._renderSnapshotSection()}

        ${this._preview !== null ? this._renderPreviewSection() : nothing}

        ${this._syncResult !== null ? this._renderResultSection() : nothing}

        ${this._error
          ? html`<p class="message error" role="alert">${this._error}</p>`
          : nothing}

        ${this._success
          ? html`<p class="message success">${this._success}</p>`
          : nothing}

      </uui-box>
    `;
  }

  // ── Section renderers ─────────────────────────────────────────────────────

  private _renderSnapshotSection(): TemplateResult {
    return html`
      <section aria-label="Snapshot selector">
        <h2>Snapshots</h2>

        <!-- Environment label -->
        <div class="env-row">
          <label for="env-input">Environment</label>
          <input
            id="env-input"
            type="text"
            .value=${this._environment}
            ?disabled=${this._busy}
            @input=${(e: Event) => { this._environment = (e.target as HTMLInputElement).value.trim() || 'Dev'; }}
            placeholder="e.g. Dev, Staging, Production" />
        </div>

        <!-- Toolbar: Export + Refresh + snapshot picker -->
        <div class="toolbar">
          <uui-button
            look="primary"
            label="Export current content and create a snapshot"
            .state=${this._busy ? 'loading' : undefined}
            ?disabled=${this._busy}
            @click=${this._exportAndRefresh}>
            Export &amp; Snapshot
          </uui-button>

          <uui-button
            look="secondary"
            label="Reload snapshot list"
            .state=${this._busy ? 'loading' : undefined}
            ?disabled=${this._busy}
            @click=${this._loadSnapshots}>
            Refresh
          </uui-button>

          ${this._snapshots.length > 0 ? html`
            <select
              aria-label="Choose a snapshot to preview or restore"
              .value=${this._selectedId}
              ?disabled=${this._busy}
              @change=${this._onSnapshotChange}>
              <option value="">— Select a snapshot —</option>
              ${this._snapshots.map(s => html`
                <option value=${s.id}>
                  [${s.environment}]
                  ${new Date(s.createdAt).toLocaleString()}
                  — by ${s.createdBy}
                </option>
              `)}
            </select>

            ${this._selectedId ? html`
              <uui-button
                look="secondary"
                label="Preview the selected snapshot"
                .state=${this._busy ? 'loading' : undefined}
                ?disabled=${this._busy}
                @click=${this._runPreview}>
                Preview
              </uui-button>
            ` : nothing}

          ` : html`
            <span class="empty-hint">No snapshots yet — click "Export &amp; Snapshot" to create one.</span>
          `}
        </div>
      </section>
    `;
  }

  private _renderPreviewSection(): TemplateResult {
    const p = this._preview!;

    return html`
      <section aria-label="Preview results">
        <h2>Preview</h2>

        <!-- Summary counts -->
        <div class="summary-bar">
          <div class="count-card added">
            <span class="count">${p.addedCount}</span>
            <span class="label">Added</span>
          </div>
          <div class="count-card updated">
            <span class="count">${p.updatedCount}</span>
            <span class="label">Updated</span>
          </div>
          <div class="count-card deleted">
            <span class="count">${p.deletedCount}</span>
            <span class="label">Deleted</span>
          </div>
        </div>

        <!-- Conflict list -->
        ${p.hasConflicts
          ? this._renderConflicts(p.conflicts)
          : html`<p class="no-conflict">✓ No conflicts detected — safe to sync.</p>`
        }

        <!-- Diff detail (collapsible to keep the page uncluttered) -->
        ${p.totalChanges > 0 ? this._renderDiffDetail(p.diffs) : nothing}

        <!-- Action buttons -->
        <div class="actions">
          <uui-button
            look="positive"
            label="Apply this snapshot to the current environment"
            .state=${this._busy ? 'loading' : undefined}
            ?disabled=${this._busy || p.hasConflicts}
            @click=${() => this._runSync(false)}>
            Sync
          </uui-button>

          ${p.hasConflicts ? html`
            <span class="sync-hint">Resolve conflicts to sync, or —</span>
            <div class="force-sync-wrap">
              <span class="force-sync-label">Danger zone</span>
              <uui-button
                look="danger"
                label="Force sync — override all conflicts and apply"
                .state=${this._busy ? 'loading' : undefined}
                ?disabled=${this._busy}
                @click=${() => this._runSync(true)}>
                Force Sync
              </uui-button>
            </div>
          ` : nothing}
        </div>
      </section>
    `;
  }

  private _renderConflicts(conflicts: SyncConflict[]): TemplateResult {
    return html`
      <h3>⚠ Conflicts (${conflicts.length})</h3>
      <div role="table" aria-label="Conflict list">
        <div class="conflict-header" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Property</span>
          <span role="columnheader">Type</span>
        </div>
        ${conflicts.map(c => html`
          <div class="conflict-row" role="row" title="Item ID: ${c.itemId}">
            <span role="cell">${c.itemName}</span>
            <span role="cell">${c.propertyName || '(item level)'}</span>
            <span role="cell">
              <span class="conflict-type ${c.conflictType}">${c.conflictType}</span>
            </span>
          </div>
        `)}
      </div>
    `;
  }

  private _renderDiffDetail(diffs: SyncDiff[]): TemplateResult {
    const MAX_ROWS = 100;
    const shown = diffs.slice(0, MAX_ROWS);
    const overflow = diffs.length - MAX_ROWS;

    return html`
      <details>
        <summary>View property changes (${diffs.length})</summary>
        <table class="diff-table" aria-label="Property-level diff">
          <thead>
            <tr>
              <th>Item</th>
              <th>Property</th>
              <th>Change</th>
              <th>Source value</th>
              <th>Target value</th>
            </tr>
          </thead>
          <tbody>
            ${shown.map(d => html`
              <tr>
                <td title=${d.itemId}>${d.itemName}</td>
                <td>${d.propertyName}</td>
                <td class="change-${d.changeType}">${d.changeType}</td>
                <td>${d.sourcePropertyValue
                  ?? html`<span class="null-value">—</span>`}</td>
                <td>${d.targetPropertyValue
                  ?? html`<span class="null-value">—</span>`}</td>
              </tr>
            `)}
            ${overflow > 0 ? html`
              <tr>
                <td colspan="5" style="text-align:center;color:#888;padding:8px">
                  …and ${overflow} more changes not shown
                </td>
              </tr>
            ` : nothing}
          </tbody>
        </table>
      </details>
    `;
  }

  private _renderResultSection(): TemplateResult {
    const r = this._syncResult!;
    return html`
      <section aria-label="Sync result">
        <h2>Result</h2>
        <dl>
          <dt>Status</dt>
          <dd>${r.status}</dd>

          <dt>Items processed</dt>
          <dd>${r.importedCount}</dd>

          <dt>Completed at</dt>
          <dd>${new Date(r.processedAt).toLocaleString()}</dd>

          ${r.forced ? html`
            <dt>Forced</dt>
            <dd>Yes — conflicts were overridden</dd>
          ` : nothing}

          ${r.warnings.length > 0 ? html`
            <dt>Warnings</dt>
            <dd>
              <ul style="margin:0;padding-left:1.2em">
                ${r.warnings.map(w => html`<li>${w}</li>`)}
              </ul>
            </dd>
          ` : nothing}
        </dl>
      </section>
    `;
  }

  // ── API helpers ───────────────────────────────────────────────────────────

  // Wraps fetch with the backoffice bearer token so requests satisfy the
  // BackOfficeAccess auth policy. Token is retrieved from UMB_AUTH_CONTEXT.
  private async _fetch(url: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.#authContext?.getLatestToken();
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...init, headers });
  }

  private async _exportAndRefresh(): Promise<void> {
    this._startRequest();
    try {
      const res = await this._fetch('/api/contentsync/export');
      if (!res.ok) throw new Error(`Export failed: HTTP ${res.status}`);
      const data = await res.json() as { count: number };
      this._success = `Exported ${data.count} items — snapshot saved.`;
      await this._fetchSnapshots();
    } catch (err) {
      this._setError(`Export failed: ${errorMessage(err)}`);
    } finally {
      this._busy = false;
    }
  }

  private async _loadSnapshots(): Promise<void> {
    this._startRequest();
    try {
      await this._fetchSnapshots();
    } catch (err) {
      this._setError(`Failed to load snapshots: ${errorMessage(err)}`);
    } finally {
      this._busy = false;
    }
  }

  private async _fetchSnapshots(): Promise<void> {
    const env = encodeURIComponent(this._environment);
    const res = await this._fetch(`/api/contentsync/snapshots?env=${env}`);
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    this._snapshots = await res.json() as SnapshotDto[];
    this._selectedId = '';
    this._preview = null;
    this._syncResult = null;
  }

  private _onSnapshotChange(e: Event): void {
    this._selectedId = (e.target as HTMLSelectElement).value;
    this._preview = null;
    this._syncResult = null;
    this._error = '';
    this._success = '';
  }

  private async _runPreview(): Promise<void> {
    if (!this._selectedId) return;
    this._startRequest();
    this._preview = null;
    this._syncResult = null;

    try {
      // Step 1 — fetch the full snapshot (includes the data payload)
      const snapshotRes = await this._fetch(`/api/contentsync/snapshot/${this._selectedId}`);
      if (!snapshotRes.ok) throw new Error(`Could not load snapshot: HTTP ${snapshotRes.status}`);
      const snapshot = await snapshotRes.json() as SyncSnapshot;

      // Step 2 — run the preview against the current environment
      const previewRes = await this._fetch('/api/contentsync/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: snapshot.data }),
      });

      if (previewRes.status === 400) {
        const result = await previewRes.json() as SyncValidationResult;
        throw new Error(result.errors.join(' · '));
      }
      if (!previewRes.ok) throw new Error(`Preview failed: HTTP ${previewRes.status}`);

      this._preview = await previewRes.json() as SyncPreview;
    } catch (err) {
      this._setError(errorMessage(err));
    } finally {
      this._busy = false;
    }
  }

  private async _runSync(force: boolean): Promise<void> {
    if (!this._selectedId) return;
    this._startRequest();
    this._syncResult = null;

    try {
      const qs = force ? '?force=true' : '';
      const res = await this._fetch(`/api/contentsync/restore/${this._selectedId}${qs}`, {
        method: 'POST',
      });

      // 409 — conflicts found without force; update the preview so the UI
      // refreshes the conflict list (edge case: env changed between preview & sync)
      if (res.status === 409) {
        this._preview = await res.json() as SyncPreview;
        this._setError('Conflicts were detected. Review the list above or click "Force Sync" to override.');
        return;
      }

      if (res.status === 400) {
        const result = await res.json() as SyncValidationResult;
        throw new Error(result.errors.join(' · '));
      }
      if (!res.ok) throw new Error(`Sync failed: HTTP ${res.status}`);

      this._syncResult = await res.json() as SyncImportResult;
      this._success = force
        ? 'Force sync completed. Conflicts were overridden.'
        : 'Sync completed successfully.';
    } catch (err) {
      this._setError(errorMessage(err));
    } finally {
      this._busy = false;
    }
  }

  // ── State helpers ─────────────────────────────────────────────────────────

  private _startRequest(): void {
    this._busy = true;
    this._error = '';
    this._success = '';
  }

  private _setError(message: string): void {
    this._error = message;
    this._success = '';
  }
}

// ── Utility ──────────────────────────────────────────────────────────────────

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export default ContentSyncDashboard;
