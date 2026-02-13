import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = (await getServerSession(authOptions as any)) as any;

  // ✅ Se estiver logado, manda pro dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B17] text-slate-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[520px] w-[520px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_30%,rgba(56,189,248,0.08),transparent_55%),radial-gradient(900px_500px_at_80%_40%,rgba(37,99,235,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-12">
          {/* Left panel */}
          <section className="lg:col-span-6">
            <div className="mx-auto max-w-xl">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <Image
                    src="/logo-k2p.png"
                    alt="K2P"
                    fill
                    className="object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    K2P <span className="text-slate-300">PORTARIA</span>
                  </h1>
                  <p className="mt-1 text-sm text-slate-300">
                    Acesse e controle. Gestão de portaria em tempo real.
                  </p>
                </div>
              </div>

              <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:block">
                <h2 className="text-base font-medium text-slate-200">
                  Visão geral
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Autorizações, visitantes, entregas e auditoria em um só lugar —
                  com notificações via WhatsApp e validação na portaria.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Acessos</div>
                    <div className="mt-1 text-lg font-semibold">Tempo real</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Encomendas</div>
                    <div className="mt-1 text-lg font-semibold">Com fotos</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Auditoria</div>
                    <div className="mt-1 text-lg font-semibold">Completa</div>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-400">
                K2P — Portaria v1.0.0
              </p>
            </div>
          </section>

          {/* Center card */}
          <section className="lg:col-span-6">
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center gap-3 lg:hidden">
                  <div className="relative h-10 w-10">
                    <Image
                      src="/logo-k2p.png"
                      alt="K2P"
                      fill
                      className="object-contain drop-shadow-[0_0_14px_rgba(56,189,248,0.25)]"
                      priority
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      K2P <span className="text-slate-300">PORTARIA</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Acesse e controle com segurança.
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Entrar</h2>
                  <p className="text-sm text-slate-300">
                    Use seu login para acessar o painel.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/10 transition hover:brightness-110 active:brightness-95"
                    href="/api/auth/signin"
                  >
                    Entrar
                  </a>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Autenticação via Keycloak</span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                      OIDC
                    </span>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-4 text-center text-xs text-slate-400">
                  <span className="opacity-90">Português (Brasil)</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/60" />
                <span>Segurança e auditoria</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
