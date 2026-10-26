const dayStamp = (date: Date) =>
  date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

/** Whether `date` lies within `min` and `max`, compared by calendar day so the time of day is ignored. */
export function isWithinBounds(date: Date, min: Date | null, max: Date | null): boolean {
  const day = dayStamp(date);
  return (!min || day >= dayStamp(min)) && (!max || day <= dayStamp(max));
}

/** Moves `date` onto the day of the nearest bound when it falls outside them, keeping its time of day. */
export function clampToBounds(date: Date, min: Date | null, max: Date | null): Date {
  const bound = !isWithinBounds(date, min, null)
    ? min
    : !isWithinBounds(date, null, max)
      ? max
      : null;
  const clamped = new Date(date);
  if (bound) {
    clamped.setFullYear(bound.getFullYear(), bound.getMonth(), bound.getDate());
  }
  return clamped;
}
