export function timeFormat(s?: number) {
  if (!s) return "0:0";
  return `${Math.floor(s / 60)}:${(s % 60).toFixed()}`;
}
