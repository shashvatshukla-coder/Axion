import { Badge } from '@/components/common/Badge';
import type { BadgeTone } from '@/components/common/Badge';

const tones: Record<string, BadgeTone> = {
  // validation
  Validated: 'ok',
  'In review': 'warn',
  Pending: 'neutral',
  Rejected: 'bad',
  // projects
  Active: 'ok',
  Completed: 'neutral',
  Paused: 'warn',
  // QA
  Passed: 'ok',
  'In QA': 'warn',
  Blocked: 'bad',
  // money
  Paid: 'ok',
  Overdue: 'bad',
  Scheduled: 'agency',
  Processing: 'warn',
  // members
  'On leave': 'warn',
  Alumni: 'neutral',
  // collaborations
  Proposed: 'agency',
  // priority
  High: 'bad',
  Medium: 'warn',
  Low: 'neutral',
};

/** Maps a status word to a colored badge so every table reads the same way. */
export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={tones[status] ?? 'neutral'}>{status}</Badge>;
}
