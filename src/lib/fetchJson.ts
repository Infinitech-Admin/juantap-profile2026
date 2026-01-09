export async function fetchJson(
  url: string,
  options?: RequestInit,
  fallback404 = false
) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    if (res.status === 404 && fallback404) return null;
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ""}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON response but received: ${text.slice(0, 200)}`);
  }

  return res.json();
}

export default fetchJson;
//deploy
