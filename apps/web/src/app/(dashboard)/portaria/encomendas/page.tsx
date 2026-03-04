"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import PackageCreateModal from "./modal/PackageCreateModal";

type EncomendaStatus = "PENDENTE" | "ENTREGUE" | "DEVOLVIDA";

type Encomenda = {
  id: string;
  unidade: string; // ex: "Apto 504" (aqui vamos usar unitId por enquanto)
  morador: string; // ainda não temos join -> placeholder
  transportadora: string;
  rastreio?: string;
  recebidoEm: string; // ISO
  entregueEm?: string; // ISO
  status: EncomendaStatus;
};

type ApiPackageDelivery = {
  id: string;
  condominiumId: string;
  unitId?: string | null;
  recipientPersonId?: string | null;

  carrier?: string | null;
  trackingCode?: string | null;
  description?: string | null;
  status: "RECEIVED" | "DELIVERED" | string;

  receivedAt: string;
  deliveredAt?: string | null;

  // outros campos existem, mas não precisamos agora
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function createPackageWithOptionalPhoto(accessToken: string, payload: any, photo?: Blob | null) {
  // Se você ainda NÃO tem endpoint de upload, mande só JSON:
  if (!photo) {
    const res = await fetch(`${API_BASE_URL}/portaria/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Erro ao cadastrar (HTTP ${res.status})`);
    return await res.json();
  }

  // Se você for aceitar foto no backend, use multipart:
  const fd = new FormData();
  fd.append("data", JSON.stringify(payload));
  fd.append("photo", photo, "package.jpg");

  const res = await fetch(`${API_BASE_URL}/portaria/packages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: fd,
  });

  if (!res.ok) throw new Error(`Erro ao cadastrar (HTTP ${res.status})`);
  return await res.json();
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function statusBadge(status: EncomendaStatus) {
  switch (status) {
    case "PENDENTE":
      return "bg-blue-600/25 text-blue-200 border-blue-500/30";
    case "ENTREGUE":
      return "bg-emerald-600/25 text-emerald-200 border-emerald-500/30";
    case "DEVOLVIDA":
      return "bg-rose-600/25 text-rose-200 border-rose-500/30";
    default:
      return "bg-slate-600/25 text-slate-200 border-slate-500/30";
  }
}

function mapApiToUi(p: ApiPackageDelivery): Encomenda {
  const uiStatus: EncomendaStatus =
    p.status === "DELIVERED" ? "ENTREGUE" : "PENDENTE";

  const unidade = p.unitId ? `Apto ${p.unitId}` : "Sem unidade";

  // Ainda não temos join com Person/Unit no front:
  const morador = p.recipientPersonId ? `Pessoa ${p.recipientPersonId}` : "—";

  return {
    id: p.id,
    unidade,
    morador,
    transportadora: p.carrier || "—",
    rastreio: p.trackingCode || undefined,
    recebidoEm: p.receivedAt,
    entregueEm: p.deliveredAt || undefined,
    status: uiStatus,
  };
}

async function apiFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let msg = `Erro HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.message?.toString?.() || msg;
    } catch { }
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

export default function EncomendasPage() {
  const { data: session, status: authStatus } = useSession();
  const accessToken = (session as any)?.accessToken;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<EncomendaStatus | "TODAS">("TODAS");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);

  const [open, setOpen] = useState(false);

  async function load() {
    if (!accessToken) return;

    setLoading(true);
    setError("");
    try {
      // traz todas (pendentes + entregues) e filtra no front
      const data = await apiFetch<ApiPackageDelivery[]>(
        "/portaria/packages",
        accessToken,
      );
      setEncomendas(data.map(mapApiToUi));
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar encomendas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authStatus === "authenticated") {
      load();
    }
  }, [authStatus]);

  async function darBaixa(id: string) {
    if (!accessToken) return;

    try {
      await apiFetch(`/portaria/packages/${id}/deliver`, accessToken, {
        method: "POST",
      });
      await load();
    } catch (e: any) {
      alert(e?.message || "Erro ao dar baixa");
    }
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return encomendas
      .filter((e) => (status === "TODAS" ? true : e.status === status))
      .filter((e) => {
        if (!query) return true;
        return (
          e.id.toLowerCase().includes(query) ||
          e.unidade.toLowerCase().includes(query) ||
          e.morador.toLowerCase().includes(query) ||
          e.transportadora.toLowerCase().includes(query) ||
          (e.rastreio?.toLowerCase().includes(query) ?? false)
        );
      })
      .sort((a, b) => new Date(b.recebidoEm).getTime() - new Date(a.recebidoEm).getTime());
  }, [encomendas, q, status]);

  const counts = useMemo(() => {
    const total = encomendas.length;
    const pendentes = encomendas.filter((e) => e.status === "PENDENTE").length;
    const entregues = encomendas.filter((e) => e.status === "ENTREGUE").length;
    const devolvidas = encomendas.filter((e) => e.status === "DEVOLVIDA").length;
    return { total, pendentes, entregues, devolvidas };
  }, [encomendas]);

  return (
    <div className="p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 shadow-xl backdrop-blur">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-800 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-400">Cadastros &gt; Encomendas</div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">Encomendas</h1>
            <p className="mt-1 text-sm text-slate-400">
              Lista completa com busca, filtros e ações rápidas.
            </p>
            {error ? (
              <p className="mt-2 text-sm text-rose-300">Erro: {error}</p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-[340px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por unidade, morador, rastreio, transportadora..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-600/60"
              />
              <div className="pointer-events-none absolute right-3 top-2.5 text-slate-500">
                ⌕
              </div>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
            >
              <option value="TODAS">Todas</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="ENTREGUE">Entregues</option>
              <option value="DEVOLVIDA">Devolvidas</option>
            </select>

            <button
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              disabled={authStatus !== "authenticated"}
              onClick={() => setOpen(true)}
            >
              + Nova Encomenda
            </button>
            <PackageCreateModal
              open={open}
              onClose={() => setOpen(false)}
              onSubmit={async ({ payload, photo }) => {
                if (!accessToken) throw new Error("Sem accessToken");
                await createPackageWithOptionalPhoto(accessToken, payload, photo);
              }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">
          <StatCard title="Total" value={loading ? "—" : counts.total} />
          <StatCard title="Pendentes" value={loading ? "—" : counts.pendentes} />
          <StatCard title="Entregues" value={loading ? "—" : counts.entregues} />
          <StatCard title="Devolvidas" value={loading ? "—" : counts.devolvidas} />
        </div>

        {/* Table */}
        <div className="p-5 pt-0">
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <div className="hidden grid-cols-12 gap-3 bg-slate-900/60 px-4 py-3 text-xs font-semibold text-slate-300 md:grid">
              <div className="col-span-2">ID</div>
              <div className="col-span-2">Unidade</div>
              <div className="col-span-3">Morador</div>
              <div className="col-span-2">Transportadora</div>
              <div className="col-span-2">Recebido em</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>

            <div className="divide-y divide-slate-800 bg-slate-950/20">
              {loading ? (
                <div className="p-6 text-sm text-slate-400">Carregando encomendas...</div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">
                  Nenhuma encomenda encontrada com os filtros atuais.
                </div>
              ) : (
                filtered.map((e) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-2">
                      <div className="text-sm font-semibold text-slate-100">{e.id}</div>
                      {e.rastreio ? (
                        <div className="mt-1 text-xs text-slate-400">
                          Rastreio:{" "}
                          <span className="text-slate-300">{e.rastreio}</span>
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-slate-500">Sem rastreio</div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-100">{e.unidade}</div>
                      <div className="mt-1 text-xs text-slate-500">{e.status}</div>
                    </div>

                    <div className="md:col-span-3">
                      <div className="text-sm text-slate-100">{e.morador}</div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${statusBadge(
                            e.status
                          )}`}
                        >
                          {e.status}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-100">{e.transportadora}</div>
                      {e.entregueEm ? (
                        <div className="mt-1 text-xs text-slate-400">
                          Entregue:{" "}
                          <span className="text-slate-300">{fmtDate(e.entregueEm)}</span>
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-slate-500">Ainda não entregue</div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-100">{fmtDate(e.recebidoEm)}</div>
                    </div>

                    <div className="md:col-span-1 md:text-right">
                      <div className="flex gap-2 md:justify-end">
                        <button
                          className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                          onClick={() => alert(`Abrir detalhes: ${e.id} (implementar)`)}
                        >
                          Ver
                        </button>

                        {e.status === "PENDENTE" ? (
                          <button
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
                            onClick={() => darBaixa(e.id)}
                          >
                            Dar baixa
                          </button>
                        ) : (
                          <button
                            className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                            onClick={() => alert(`Comprovante: ${e.id} (implementar)`)}
                          >
                            Comprovante
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Mostrando <span className="text-slate-300">{filtered.length}</span> de{" "}
              <span className="text-slate-300">{encomendas.length}</span>
            </span>
            <span className="hidden md:block">K2P • Encomendas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}