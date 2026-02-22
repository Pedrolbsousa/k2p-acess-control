// apps/web/src/app/(dashboard)/page.tsx
import { getServerSession } from "next-auth";
// ✅ Ajuste este import se o seu authOptions estiver em outro arquivo.
// Opção comum (App Router):
import { authOptions } from "../../authOptions";

type Status = "Aguardando" | "Aprovada" | "Recusada";

function statusPillClass(status: Status) {
  switch (status) {
    case "Aguardando":
      return "bg-amber-500/20 text-amber-200 border-amber-500/30";
    case "Aprovada":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
    case "Recusada":
      return "bg-rose-500/20 text-rose-200 border-rose-500/30";
    default:
      return "bg-white/10 text-white/80 border-white/10";
  }
}

function firstName(full?: string | null) {
  if (!full) return "Usuário";
  const trimmed = full.trim();
  if (!trimmed) return "Usuário";
  return trimmed.split(" ")[0] ?? "Usuário";
}

export default async function Page() {
  // Pega o usuário logado (Keycloak/NextAuth)
  const session = await getServerSession(authOptions);

  const userDisplayName =
    session?.user?.name ||
    // algumas integrações colocam "preferred_username"
   
    session?.user?.preferred_username ||
  
    session?.user?.username ||
    "Usuário";

  // 🔸 Dados fake (substituir depois por chamadas reais)
  const kpis = {
    visitantes: 2,
    encomendasPendentes: 5,
    autorizacoes: 12,
    eventos: 23,
  };

  const lastAuthorizations = [
    { person: "Jová Verino", unit: "BP-552", code: "#A79865", status: "Aguardando" as Status },
    { person: "Gear Vioves", unit: "XT71A", code: "#A79864", status: "Aprovada" as Status },
    { person: "Jona Martins", unit: "TMG85", code: "#A79645", status: "Aprovada" as Status },
    { person: "Matheus", unit: "SAS01", code: "#A79666", status: "Recusada" as Status },
    { person: "Athos Kaus", unit: "RP-912", code: "#A79666", status: "Recusada" as Status },
  ];

  const pendingPackages = [
    { unit: "Apto 504", carrier: "Amazon", ago: "Há 5 min", thumb: "https://picsum.photos/seed/p1/120/72" },
    { unit: "Apto 4636", carrier: "Mercado Livre", ago: "Há 2 min", thumb: "https://picsum.photos/seed/p2/120/72" },
    { unit: "Apto 5798", carrier: "DHL", ago: "Há 5 min", thumb: "https://picsum.photos/seed/p3/120/72" },
    { unit: "Apto 5798", carrier: "iFood", ago: "Há 2 min", thumb: "https://picsum.photos/seed/p4/120/72" },
  ];

  const recentEvents = [
    { text: "Julia Martins chegou e está aguardando aprovação.", by: "Paulo (porteiro)", tag: "VISITA" },
    { text: "Encomenda recebida para Apto 504", by: "Paulo (porteiro)", tag: "ENCOMENDA" },
    { text: "Marteme. Paulo (porteiro)", by: "Há 5 min", tag: "VISITA" },
    { text: "Bruno (porteiro)", by: "Há 5 min", tag: "SERVICE" },
  ];

  return (
    <div className="min-h-[calc(100vh-2rem)] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.16),_transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#070A12] via-[#050814] to-[#070A12]" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Olá, {firstName(userDisplayName)}!</h1>
        <p className="mt-1 text-white/70">Bem-vindo ao painel de controle K2P</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="text-sm text-white/70">Visitantes</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">{String(kpis.visitantes).padStart(2, "0")}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="text-sm text-white/70">Encomendas</div>
          <div className="text-xs font-medium text-white/60">PENDENTES</div>
          <div className="mt-1 text-4xl font-semibold tabular-nums">
            {String(kpis.encomendasPendentes).padStart(2, "0")}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="text-sm text-white/70">Autorizações</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">{kpis.autorizacoes}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="text-sm text-white/70">Eventos</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">{kpis.eventos}</div>
        </div>
      </div>

      {/* Middle panels */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Últimas autorizações */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Últimas Autorizações</h2>
            <button className="text-sm text-white/70 hover:text-white">Ver Todas →</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-12 gap-2 bg-white/5 px-3 py-2 text-xs font-medium text-white/70">
              <div className="col-span-5">Pessoa</div>
              <div className="col-span-2">Unid</div>
              <div className="col-span-2">Code</div>
              <div className="col-span-3 text-right">Status</div>
            </div>

            <div className="divide-y divide-white/10">
              {lastAuthorizations.map((row) => (
                <div key={row.code} className="grid grid-cols-12 gap-2 px-3 py-3">
                  <div className="col-span-5">
                    <div className="font-medium">{row.person}</div>
                    <div className="text-xs text-white/55">Visitante (fake)</div>
                  </div>
                  <div className="col-span-2 flex items-center text-white/80">{row.unit}</div>
                  <div className="col-span-2 flex items-center text-white/80">{row.code}</div>
                  <div className="col-span-3 flex items-center justify-end">
                    <span className={`rounded-full border px-3 py-1 text-xs ${statusPillClass(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Encomendas pendentes */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Encomendas Pendentes</h2>
            <button className="text-sm text-white/70 hover:text-white">Ver Todas →</button>
          </div>

          <div className="space-y-3">
            {pendingPackages.map((p, idx) => (
              <div key={`${p.unit}-${idx}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <img
                  src={p.thumb}
                  alt="encomenda"
                  className="h-[52px] w-[92px] rounded-lg object-cover ring-1 ring-white/10"
                />
                <div className="flex-1">
                  <div className="font-medium">{p.unit}</div>
                  <div className="text-sm text-white/60">
                    {p.carrier} • <span className="text-white/50">{p.ago}</span>
                  </div>
                </div>
                <button className="rounded-xl bg-blue-600/80 px-4 py-2 text-sm font-medium hover:bg-blue-600">
                  Dar Baixa
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Eventos recentes */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Eventos Recentes</h2>
          <button className="text-sm text-white/70 hover:text-white">Ver Todas →</button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {recentEvents.map((e, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div>
                <div className="font-medium">{e.text}</div>
                <div className="text-sm text-white/60">{e.by}</div>
              </div>
              <span className="rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                {e.tag}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}