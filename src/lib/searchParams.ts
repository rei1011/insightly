type RawParam = string | string[] | undefined;

export function parseStringParam(param: RawParam): string | undefined {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

export function parseStringArrayParam(param: RawParam): string[] | undefined {
  const raw = parseStringParam(param);
  if (!raw) return undefined;
  const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
  return ids.length ? ids : undefined;
}

export function parseIntParam(param: RawParam): number | undefined {
  const raw = parseStringParam(param);
  if (!raw) return undefined;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}
