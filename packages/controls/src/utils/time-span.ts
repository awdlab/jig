const timeSpanRegex = /^(?:(.+)d)?(?:(.+)h)?(?:(.+)m)?(?:([^m]+)s)?(?:(.+)ms)?$/;

export type TimeSpan =
  | number
  | `${`${number}d` | ''}${`${number}h` | ''}${`${number}m` | ''}${`${number}s` | ''}${`${number}ms` | ''}`
  | {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
      milliseconds?: number;
    };

export function isTimeSpan(value: unknown): value is TimeSpan {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    const match = value.match(timeSpanRegex);
    return !!match && !match.slice(1).some(part => part !== undefined && isNaN(Number(part)));
  }
  if (typeof value === 'object' && value !== null) {
    return (
      'days' in value ||
      'hours' in value ||
      'minutes' in value ||
      'seconds' in value ||
      'milliseconds' in value
    );
  }
  return false;
}

export function getTimeSpanMilliseconds(timeSpan: TimeSpan): number {
  if (typeof timeSpan === 'number') return timeSpan;

  if (typeof timeSpan === 'string') {
    const parts = parseTimeSpanString(timeSpan);
    return parts ? toMilliseconds(...parts) : 0;
  }

  const { days, hours, minutes, seconds, milliseconds } = timeSpan;
  return toMilliseconds(days, hours, minutes, seconds, milliseconds);
}

export function getTimeSpanString(timeSpan: TimeSpan): string {
  if (typeof timeSpan === 'number') return `${timeSpan}ms`;
  if (typeof timeSpan === 'string') return timeSpan;

  const { days, hours, minutes, seconds, milliseconds } = timeSpan;
  return (
    (days ? `${days}d` : '') +
    (hours ? `${hours}h` : '') +
    (minutes ? `${minutes}m` : '') +
    (seconds ? `${seconds}s` : '') +
    (milliseconds ? `${milliseconds}ms` : '')
  );
}

export function getTimeSpan(timeSpan: TimeSpan): TimeSpan & object {
  if (typeof timeSpan === 'number') {
    return { milliseconds: timeSpan };
  }

  if (typeof timeSpan === 'string') {
    const parts = parseTimeSpanString(timeSpan);
    if (!parts) return {};
    const [days, hours, minutes, seconds, milliseconds] = parts;
    return { days, hours, minutes, seconds, milliseconds };
  }

  return timeSpan;
}

function parseTimeSpanString(timeSpan: string): number[] | undefined {
  const match = timeSpan.match(timeSpanRegex);
  if (!match) return undefined;
  return match.slice(1).map(part => Number(part) || 0);
}

function toMilliseconds(
  days?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
  milliseconds?: number
): number {
  return (
    (days || 0) * 86400000 + // 24 * 60 * 60 * 1000
    (hours || 0) * 3600000 + // 60 * 60 * 1000
    (minutes || 0) * 60000 + // 60 * 1000
    (seconds || 0) * 1000 +
    (milliseconds || 0)
  );
}
