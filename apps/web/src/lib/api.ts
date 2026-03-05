export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  args: {
    accessToken?: string;
    condominiumId?: string;
    init?: RequestInit;
  }
): Promise<T> {
  const { accessToken, condominiumId, init } = args;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "Content-Type": "application/json",
      ...(condominiumId ? { "x-condominium-id": condominiumId } : {}),
    },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.message?.toString?.() || msg;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}