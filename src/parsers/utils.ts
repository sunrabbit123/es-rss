export type Xml = Record<string, unknown>;

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function text(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object" && value !== null && "#text" in value) {
    return text((value as Xml)["#text"]);
  }
  return undefined;
}

export function attr(node: Xml, name: string): string | undefined {
  const val = node[`@_${name}`];
  return val != null ? String(val) : undefined;
}
