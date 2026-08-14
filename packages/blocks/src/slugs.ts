/** Vision §7.3 twelve scenario blocks. */
export const PHASE7_BLOCK_SLUGS = [
  'login',
  'register',
  'crud-page',
  'kanban',
  'gantt',
  'ticket-flow',
  'approval-flow',
  'im-chat',
  'data-screen',
  'trading-terminal',
  'iot-panel',
  'marketing-site',
] as const

export type Phase7BlockSlug = (typeof PHASE7_BLOCK_SLUGS)[number]

/** Implemented as composable React blocks in this package. */
export const REAL_BLOCK_SLUGS = [
  'login',
  'register',
  'crud-page',
  'kanban',
  'gantt',
  'ticket-flow',
  'approval-flow',
  'im-chat',
  'data-screen',
  'trading-terminal',
  'iot-panel',
  'marketing-site',
] as const

export type RealBlockSlug = (typeof REAL_BLOCK_SLUGS)[number]

export const REMAINING_BLOCK_SLUGS = PHASE7_BLOCK_SLUGS.filter(
  (slug) => !(REAL_BLOCK_SLUGS as readonly string[]).includes(slug),
) as Exclude<Phase7BlockSlug, RealBlockSlug>[]
