/** Component contract schema version introduced as the Phase 0 seed. */
export const componentContractSchemaVersionV0_1 = "0.1" as const;

/** Component contract schema version frozen for Phase 8 (canonical keys + mandatory dataAi). */
export const componentContractSchemaVersion = "0.2" as const;

/** Archived v0.1 identifier; kept resolvable for the published breaking-change policy. */
export const componentContractSchemaIdV0_1 =
  "https://chameleon-ui.dev/schemas/component-contract/v0.1.json" as const;

export const componentContractSchemaId =
  "https://chameleon-ui.dev/schemas/component-contract/v0.2.json" as const;

/** Design rules schema version frozen for Phase 3. */
export const designRulesSchemaVersion = "1.0" as const;

export const designRulesSchemaId =
  "https://chameleon-ui.dev/schemas/design-rules/v1.0.json" as const;
