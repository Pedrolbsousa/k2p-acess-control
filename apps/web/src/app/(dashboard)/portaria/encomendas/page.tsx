"use client";

import { useMemo, useState } from "react";

type EncomendaStatus = "PENDENTE" | "ENTREGUE" | "DEVOLVIDA";

type Encomenda = {
  id: string;
  unidade: string; // ex: "Apto 504"
  morador: string; // ex: "Julia Martins"
  transportadora: string; // ex: "Amazon"
  rastreio?: string;
  recebidoEm: string; // ISO
  entregueEm?: string; // ISO
  status: EncomendaStatus;
};

const MOCK_ENCOMENDAS: Encomenda[] = [
  {
    id: "ENC-0001",
    unidade: "Apto 504",
    morador: "Julia Martins",
    transportadora: "Amazon",
    rastreio: "BR123456789",
    recebidoEm: "2026-02-20T11:22:00.000Z",
    status: "PENDENTE",
  },
  {
    id: "ENC-0002",
    unidade: "Apto 4636",
    morador: "Paulo Souza",
    transportadora: "Mercado Livre",
    recebidoEm: "2026-02-20T10:15:00.000Z",
    entregueEm: "2026-02-20T12:45:00.000Z",
    status: "ENTREGUE",
  },
  {
    id: "ENC-0003",
    unidade: "Apto 5798",
    morador: "Matheus",
    transportadora: "DHL",
    recebidoEm: "2026-02-19T18:40:00.000Z",
    status: "PENDENTE",
  },
  {
    id: "ENC-0004",
    unidade: "Apto 101",
    morador: "Jovã Verino",
    transportadora: "Correios",
    recebidoEm: "2026-02-18T09:05:00.000Z",
    status: "DEVOLVIDA",
  },
  {
    id: "ENC-0005",
    unidade: "Apto 101",
    morador: "Kédyssa Stéfany",
    transportadora: "Correios",
    recebidoEm: "2026-02-18T09:05:00.000Z",
    status: "ENTREGUE",
  },
];

function fmtDate(iso: string) {
  // Formata localmente sem depender de libs
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

export default function EncomendasPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<EncomendaStatus | "TODAS">("TODAS");

  // no futuro: troque isso por fetch da API
  const encomendas = MOCK_ENCOMENDAS;

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
            <h1 className="mt-1 text-2xl font-semibold text-slate-100">
              Encomendas
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Lista completa com busca, filtros e ações rápidas.
            </p>
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
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              onClick={() => alert("Abrir /encomendas/nova (implementar rota)")}
            >
              + Nova Encomenda
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">
          <StatCard title="Total" value={counts.total} />
          <StatCard title="Pendentes" value={counts.pendentes} />
          <StatCard title="Entregues" value={counts.entregues} />
          <StatCard title="Devolvidas" value={counts.devolvidas} />
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
              {filtered.length === 0 ? (
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
                          Rastreio: <span className="text-slate-300">{e.rastreio}</span>
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
                          Entregue: <span className="text-slate-300">{fmtDate(e.entregueEm)}</span>
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
                          onClick={() => alert(`Abrir detalhes: ${e.id}`)}
                        >
                          Ver
                        </button>

                        {e.status === "PENDENTE" ? (
                          <button
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
                            onClick={() => alert(`Dar baixa (entregar): ${e.id}`)}
                          >
                            Dar baixa
                          </button>
                        ) : (
                          <button
                            className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                            onClick={() => alert(`Imprimir comprovante: ${e.id}`)}
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

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}