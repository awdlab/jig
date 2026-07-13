import tablerAlertTriangle from '@iconify/icons-tabler/alert-triangle';
import tablerCircleCheck from '@iconify/icons-tabler/circle-check';
import tablerCoin from '@iconify/icons-tabler/coin';
import tablerUsers from '@iconify/icons-tabler/users';

import type { NgnItem } from '@ngneers/controls/api';
import type { IconType } from '@ngneers/controls-custom-types';

/**
 * Semantic color vocabulary this demo authors against (the nova palette). Kept independent of
 * the active theme's `CustomColor` so the module compiles under any theme. Under a theme that
 * lacks a given slot (e.g. shade has no `success`) the control falls back to its default color.
 */
export type PaletteColorName =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'surface'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export type OpportunityStatus = 'Closed Won' | 'Negotiation' | 'Discovery' | 'Proposal';

export type Opportunity = {
  id: number;
  company: string;
  initials: string;
  /** Theme CSS variable string, e.g. `var(--ngn-color-primary-500)`. */
  bgColor: string;
  value: number;
  status: OpportunityStatus;
  /** Semantic color name passed to `ngn-tag [color]`. */
  statusColor: PaletteColorName;
  owner: string;
  ownerInitials: string;
  ownerColor: string;
};

export type Kpi = {
  label: string;
  value: string;
  icon: IconType;
  /** Palette color name for the icon accent (used to build a `--ngn-color-*` CSS variable). */
  iconColor: PaletteColorName;
  trend: string;
  /** Palette color name for the trend text (used to build a `--ngn-color-*` CSS variable). */
  trendColor: PaletteColorName;
  /** Tooltip description shown on hover. */
  tooltip: string;
};

/** Filter applied to the opportunities table via the footer chips. */
export type OpportunityFilter = 'all' | 'highValue' | 'closingSoon';

const HIGH_VALUE_THRESHOLD = 500_000;
const CLOSING_SOON: ReadonlySet<OpportunityStatus> = new Set(['Negotiation', 'Proposal']);

export function matchesFilter(opp: Opportunity, filter: OpportunityFilter): boolean {
  switch (filter) {
    case 'highValue':
      return opp.value >= HIGH_VALUE_THRESHOLD;
    case 'closingSoon':
      return CLOSING_SOON.has(opp.status);
    case 'all':
    default:
      return true;
  }
}

export const KPIS: readonly Kpi[] = [
  {
    label: 'Revenue',
    value: '$124,500',
    icon: tablerCoin,
    iconColor: 'success',
    trend: '+12.5% vs last month',
    trendColor: 'success',
    tooltip: 'Total revenue closed this period',
  },
  {
    label: 'Active Leads',
    value: '842',
    icon: tablerUsers,
    iconColor: 'info',
    trend: '+45 new this week',
    trendColor: 'info',
    tooltip: 'Leads currently in the pipeline',
  },
  {
    label: 'Open Tasks',
    value: '36',
    icon: tablerCircleCheck,
    iconColor: 'primary',
    trend: '12 due today',
    trendColor: 'surface',
    tooltip: 'Tasks assigned to your team',
  },
  {
    label: 'Alerts',
    value: '3',
    icon: tablerAlertTriangle,
    iconColor: 'warning',
    trend: 'Requires attention',
    trendColor: 'warning',
    tooltip: 'Issues requiring immediate action',
  },
];

export const DATE_RANGE_OPTIONS: readonly NgnItem<unknown, string>[] = [
  { label: 'Oct 1 - Oct 31, 2024', value: 'oct-2024' },
  { label: 'Sep 1 - Sep 30, 2024', value: 'sep-2024' },
  { label: 'Q3 2024', value: 'q3-2024' },
];

// Soft pastel (200) shades — avatar initials use dark text (--ngn-color-text),
// so light backgrounds keep them readable and look consistent across people.
export const OWNERS = [
  { owner: 'Jane Cooper', ownerInitials: 'JC', ownerColor: 'var(--ngn-color-primary-200)' },
  { owner: 'Bruce W.', ownerInitials: 'BW', ownerColor: 'var(--ngn-color-info-200)' },
  { owner: 'Alice S.', ownerInitials: 'AS', ownerColor: 'var(--ngn-color-success-200)' },
  { owner: 'Mark R.', ownerInitials: 'MR', ownerColor: 'var(--ngn-color-accent-200)' },
] as const;

const STATUS_COLORS: Record<OpportunityStatus, PaletteColorName> = {
  'Closed Won': 'success',
  Negotiation: 'info',
  Discovery: 'warning',
  Proposal: 'primary',
};

function makeOpportunity(
  id: number,
  company: string,
  initials: string,
  bgColor: string,
  value: number,
  status: OpportunityStatus,
  ownerIndex: number
): Opportunity {
  const owner = OWNERS[ownerIndex % OWNERS.length]!;
  return {
    id,
    company,
    initials,
    bgColor,
    value,
    status,
    statusColor: STATUS_COLORS[status],
    owner: owner.owner,
    ownerInitials: owner.ownerInitials,
    ownerColor: owner.ownerColor,
  };
}

const SEED: ReadonlyArray<[string, string, string, number, OpportunityStatus, number]> = [
  ['Stark Tech', 'ST', 'var(--ngn-color-primary-500)', 1_250_000, 'Closed Won', 0],
  ['Wayne Corp', 'WC', 'var(--ngn-color-secondary-500)', 840_000, 'Negotiation', 1],
  ['TechFlow Inc', 'TF', 'var(--ngn-color-accent-500)', 12_400, 'Discovery', 2],
  ['Globex', 'GX', 'var(--ngn-color-info-500)', 96_000, 'Proposal', 3],
  ['Initech', 'IN', 'var(--ngn-color-success-500)', 38_500, 'Discovery', 0],
  ['Umbrella Co', 'UC', 'var(--ngn-color-error-500)', 612_000, 'Negotiation', 1],
  ['Soylent', 'SY', 'var(--ngn-color-warning-500)', 220_000, 'Proposal', 2],
  ['Hooli', 'HO', 'var(--ngn-color-primary-400)', 1_010_000, 'Closed Won', 3],
];

/** 24 opportunities — the first three match the reference screenshot exactly. */
export const OPPORTUNITIES: readonly Opportunity[] = Array.from({ length: 24 }, (_, i) => {
  const [company, initials, bgColor, value, status, ownerIndex] = SEED[i % SEED.length]!;
  const round = Math.floor(i / SEED.length);
  return makeOpportunity(
    i + 1,
    round === 0 ? company : `${company} ${round + 1}`,
    initials,
    bgColor,
    value,
    status,
    ownerIndex + round
  );
});

/* ── Quick Add Deal form ─────────────────────────────────────────────── */

export type DealPriority = 'low' | 'medium' | 'high';

const STAGES: readonly OpportunityStatus[] = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

export const STAGE_OPTIONS: readonly NgnItem<unknown, OpportunityStatus>[] = STAGES.map(stage => ({
  label: stage,
  value: stage,
}));

export const OWNER_OPTIONS: readonly NgnItem<unknown, string>[] = OWNERS.map(owner => ({
  label: owner.owner,
  value: owner.owner,
}));

export const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
] as const satisfies readonly { label: string; value: DealPriority }[];

/** Raw values captured by the Quick Add Deal form. */
export type DealDraft = {
  account: string;
  value: number;
  stage: OpportunityStatus;
  owner: string;
  closeDate: Date | null;
  priority: DealPriority;
};

/** Avatar background colors cycled for newly added deals. */
const NEW_DEAL_COLORS: readonly string[] = [
  'var(--ngn-color-primary-500)',
  'var(--ngn-color-accent-500)',
  'var(--ngn-color-info-500)',
  'var(--ngn-color-success-500)',
  'var(--ngn-color-secondary-500)',
];

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  return (initials || name.trim().slice(0, 2)).toUpperCase();
}

/** Build a full Opportunity row from a form draft + a new id. */
export function createOpportunity(id: number, draft: DealDraft): Opportunity {
  const owner = OWNERS.find(o => o.owner === draft.owner) ?? OWNERS[0];
  return {
    id,
    company: draft.account.trim(),
    initials: initialsFrom(draft.account),
    bgColor: NEW_DEAL_COLORS[id % NEW_DEAL_COLORS.length]!,
    value: draft.value,
    status: draft.stage,
    statusColor: STATUS_COLORS[draft.stage],
    owner: owner.owner,
    ownerInitials: owner.ownerInitials,
    ownerColor: owner.ownerColor,
  };
}
