const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type CreatePackagePayload = {
  unitId?: string | null;
  recipientPersonId?: string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  description?: string | null;
  notes?: string | null;
};

export async function cadastrarEncomenda(payload: CreatePackagePayload, accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/portaria/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message?.toString?.() || `Erro ao cadastrar encomenda (HTTP ${res.status}).`;
    throw new Error(msg);
  }

  return data;
}