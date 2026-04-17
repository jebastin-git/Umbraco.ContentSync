// Minimal type stubs for Umbraco backoffice modules.
// The real implementations are provided at runtime by the Umbraco backoffice
// module system — these declarations are never bundled (externalized in vite.config.ts).

declare module '@umbraco-cms/backoffice/element-api' {
  // Returns the same constructor — mixin methods are declared directly on the
  // consuming class (see `declare consumeContext` in content-sync-dashboard.ts).
  export function UmbElementMixin<T extends new (...args: unknown[]) => HTMLElement>(
    Base: T
  ): T;
}

declare module '@umbraco-cms/backoffice/auth' {
  export interface UmbAuthContext {
    getLatestToken(): Promise<string | undefined>;
  }
  export const UMB_AUTH_CONTEXT: unknown;
}
