/**
 * @phase-1 @telemetry:hook
 * Phase 0 type-only reservation. There is intentionally no hook instance,
 * dispatcher, event implementation, network access, or file-system behavior.
 */
export type TelemetryHook = (
  event: string,
  payload: Readonly<Record<string, unknown>>,
) => void;
