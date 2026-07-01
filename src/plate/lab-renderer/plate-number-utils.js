// Kennzeichen Physical Lab b306 / shared numeric helpers.

export function formatNumber(value) {
  return Number(value).toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

export function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

export function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function formatSvgNumber(value) {
  return numberOrFallback(value).toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
