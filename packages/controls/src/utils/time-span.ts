const timeSpanRegex = /^(?:(.+)d)?(?:(.+)h)?(?:(.+)m)?(?:([^m]+)s)?(?:(.+)ms)?$/;

/**
 * Represents a time span that can be expressed in various formats:
 * - As a number (milliseconds)
 * - As a string in the format "XdXhXmXsXms" where each part is optional (e.g., "1d2h30m45s500ms" or "2h15m")
 * - As an object with properties for days, hours, minutes, seconds, and milliseconds
 * @example
 * ```typescript
 * // As a number
 * const duration1: TimeSpan = 5000;
 * // As a string
 * const duration2: TimeSpan = "1d2h30m45s500ms";
 * // As an object
 * const duration3: TimeSpan = { days: 1, hours: 2, minutes: 30, seconds: 45, milliseconds: 500 };
 * ```
 */
export type TimeSpan =
  | number
  | `${`${number}d` | ''}${`${number}h` | ''}${`${number}m` | ''}${`${number}s` | ''}${`${number}ms` | ''}`
  | {
      /**
       * Number of days in the time span.
       */
      days?: number;
      /**
       * Number of hours in the time span.
       */
      hours?: number;
      /**
       * Number of minutes in the time span.
       */
      minutes?: number;
      /**
       * Number of seconds in the time span.
       */
      seconds?: number;
      /**
       * Number of milliseconds in the time span.
       */
      milliseconds?: number;
    };

/**
 * Checks if the provided value is a valid TimeSpan.
 * @param value The value to check.
 * @returns `true` if the value is a valid TimeSpan, otherwise `false`.
 */
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

/**
 * Converts a TimeSpan to milliseconds.
 * @param timeSpan The TimeSpan to convert.
 * @returns The equivalent time span in milliseconds.
 */
export function getTimeSpanMilliseconds(timeSpan: TimeSpan): number {
  if (typeof timeSpan === 'number') return timeSpan;

  if (typeof timeSpan === 'string') {
    const parts = parseTimeSpanString(timeSpan);
    return parts ? toMilliseconds(...parts) : 0;
  }

  const { days, hours, minutes, seconds, milliseconds } = timeSpan;
  return toMilliseconds(days, hours, minutes, seconds, milliseconds);
}

/**
 * Converts a TimeSpan to a string representation.
 * @param timeSpan The TimeSpan to convert.
 * @returns A string representation of the time span.
 */
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

/**
 * Converts a TimeSpan to an object representation.
 * @param timeSpan The TimeSpan to convert.
 * @returns An object representation of the time span with properties for days, hours, minutes, seconds, and milliseconds.
 */
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
