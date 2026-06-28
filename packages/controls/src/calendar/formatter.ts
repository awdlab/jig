/**
 * Formats a Date object into a string based on the provided format.
 * @param value The Date object to format. If null, an empty string is returned.
 * @param format The format string that specifies how the date should be formatted. Supported tokens include:
 * Tokens follow the standard (Unicode/moment-style) convention — uppercase `M` is
 * month, lowercase `m` is minute — matching `getDateOrTimeMask`:
 * - 'dd': Day of the month, 2 digits with leading zeros (01 to 31)
 * - 'd': Day of the month without leading zeros (1 to 31)
 * - 'MM': Month, 2 digits with leading zeros (01 to 12)
 * - 'M': Month without leading zeros (1 to 12)
 * - 'yyyy': Year, 4 digits (e.g., 2024)
 * - 'yy': Year, 2 digits (e.g., 24)
 * - 'HH': Hours (24-hour), 2 digits with leading zeros (00 to 23)
 * - 'H': Hours (24-hour) without leading zeros (0 to 23)
 * - 'hh': Hours (12-hour), 2 digits with leading zeros (01 to 12)
 * - 'h': Hours (12-hour) without leading zeros (1 to 12)
 * - 'mm': Minutes, 2 digits with leading zeros (00 to 59)
 * - 'm': Minutes without leading zeros (0 to 59)
 * - 'ss': Seconds, 2 digits with leading zeros (00 to 59)
 * - 's': Seconds without leading zeros (0 to 59)
 * - 'a': AM/PM marker
 * - 'SSS': Milliseconds, 3 digits with leading zeros (000 to 999)
 * @returns The formatted date string.
 */
const DATE_TOKEN = /^(yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a)/;

/** Maximum digit count per numeric token — bounds the capture so adjacent
 * numeric tokens (separator-free formats like `MMddyyyy`) still parse. */
const TOKEN_MAX_DIGITS: Record<string, number> = {
  yyyy: 4,
  yy: 2,
  MM: 2,
  M: 2,
  dd: 2,
  d: 2,
  HH: 2,
  H: 2,
  hh: 2,
  h: 2,
  mm: 2,
  m: 2,
  ss: 2,
  s: 2,
  SSS: 3,
};

/**
 * Parses a date string according to `format`, the inverse of {@link formatDate}.
 *
 * Unlike `new Date(string)` this is format-aware (so e.g. `dd.MM.yyyy` parses
 * correctly) and, crucially, **clamps the day to the number of days in the
 * resolved month/year** instead of rolling over: `31` in February becomes the
 * 28th/29th rather than spilling into March. Returns `null` when the string does
 * not match the format.
 *
 * Two-digit years (`yy`) are interpreted as 2000–2099. Numeric tokens are capped
 * at their natural digit count so separator-free formats parse unambiguously.
 */
export function parseDate(str: string, format: string): Date | null {
  // Build a regex from the format, remembering the token captured at each group.
  let pattern = '';
  const tokens: string[] = [];
  let i = 0;
  while (i < format.length) {
    const m = DATE_TOKEN.exec(format.slice(i));
    if (m) {
      const tok = m[0]; // the whole match is the token
      tokens.push(tok);
      pattern += tok === 'a' ? '(AM|PM)' : `(\\d{1,${TOKEN_MAX_DIGITS[tok]}})`;
      i += tok.length;
    } else {
      pattern += format.charAt(i).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      i++;
    }
  }

  const match = new RegExp(`^${pattern}$`).exec(str);
  if (!match) return null;

  const part: Record<string, string> = {};
  tokens.forEach((tok, idx) => (part[tok] = match[idx + 1] ?? ''));

  const num = (...keys: string[]): number | undefined => {
    for (const k of keys) if (part[k] !== undefined) return Number(part[k]);
    return undefined;
  };

  const now = new Date();
  const year =
    num('yyyy') ?? (part['yy'] !== undefined ? 2000 + Number(part['yy']) : now.getFullYear());
  const month = num('MM', 'M') ?? 1; // 1-12
  const dayRaw = num('dd', 'd') ?? 1;

  let hours = num('HH', 'H') ?? 0;
  const hour12 = num('hh', 'h');
  if (hour12 !== undefined) {
    if (hour12 < 1 || hour12 > 12) return null;
    const pm = part['a'] === 'PM';
    hours = (hour12 % 12) + (pm ? 12 : 0);
  }
  const minutes = num('mm', 'm') ?? 0;
  const seconds = num('ss', 's') ?? 0;
  const ms = num('SSS') ?? 0;

  // Reject out-of-range components rather than letting `new Date` silently
  // normalize them (e.g. month 13 → next year, hour 25 → next day).
  if (
    month < 1 ||
    month > 12 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59 ||
    ms < 0 ||
    ms > 999
  ) {
    return null;
  }

  // Clamp the day to the resolved month's length (handles leap years) so an
  // out-of-range day never rolls over into the next month.
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.max(1, Math.min(dayRaw, daysInMonth));

  const date = new Date(year, month - 1, day, hours, minutes, seconds, ms);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: Date | null, format: string): string {
  if (!value) {
    return '';
  }
  const day = value.getDate();
  const month = value.getMonth() + 1;
  const year = value.getFullYear();
  const hours = value.getHours();
  const minutes = value.getMinutes();
  const seconds = value.getSeconds();
  const milliseconds = value.getMilliseconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  // Longest tokens first within each group; 'a' (AM/PM) last so the inserted
  // letters are never re-matched by an earlier numeric replacement.
  return format
    .replace(/yyyy/g, String(year))
    .replace(/yy/g, String(year).slice(-2))
    .replace(/dd/g, String(day).padStart(2, '0'))
    .replace(/d/g, String(day))
    .replace(/MM/g, String(month).padStart(2, '0'))
    .replace(/M/g, String(month))
    .replace(/HH/g, String(hours).padStart(2, '0'))
    .replace(/H/g, String(hours))
    .replace(/hh/g, String(hour12).padStart(2, '0'))
    .replace(/h/g, String(hour12))
    .replace(/mm/g, String(minutes).padStart(2, '0'))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, String(seconds).padStart(2, '0'))
    .replace(/s/g, String(seconds))
    .replace(/SSS/g, String(milliseconds).padStart(3, '0'))
    .replace(/a/g, ampm);
}
