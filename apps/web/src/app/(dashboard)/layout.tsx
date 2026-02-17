"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
      {children}
    </span>
  );
}

function Svg({
  d,
  className = "",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-slate-200/90 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: NavItem[] = useMemo(
    () => [
      {
        label: "Início",
        href: "/dashboard",
        icon: <Svg d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />,
      },
      {
        label: "Autorizações",
        href: "/dashboard/authorizations",
        icon: <Svg d="M12 3v8l6 3M5 21h14" />,
      },
      {
        label: "Encomendas",
        href: "/dashboard/packages",
        icon: <Svg d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />,
      },
      {
        label: "Eventos",
        href: "/dashboard/events",
        icon: <Svg d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
      },
      {
        label: "Relatórios",
        href: "/dashboard/reports",
        icon: <Svg d="M4 19V5m0 14h16M8 15v-3m4 3V8m4 7v-5" />,
      },
      {
        label: "Configurações",
        href: "/dashboard/settings",
        icon: <Svg d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a8 8 0 0 0 .1-1l2-1-2-4-2 1a8 8 0 0 0-1.7-1l-.3-2h-5l-.3 2a8 8 0 0 0-1.7 1l-2-1-2 4 2 1a8 8 0 0 0 .1 1 8 8 0 0 0-.1 1l-2 1 2 4 2-1a8 8 0 0 0 1.7 1l.3 2h5l.3-2a8 8 0 0 0 1.7-1l2 1 2-4-2-1a8 8 0 0 0-.1-1z" />,
      },
    ],
    [],
  );

  function Sidebar({ compact }: { compact?: boolean }) {
    return (
      <aside
        className={[
          "h-full w-[290px] shrink-0",
          "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
          "shadow-2xl shadow-black/30",
          compact ? "w-[300px]" : "",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="relative h-12 w-12">
            <Image
              src="/logo-k2p.png"
              alt="K2P"
              fill
              className="object-contain drop-shadow-[0_0_16px_rgba(56,189,248,0.25)]"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight">K2P</div>
            <div className="text-xs text-slate-400">Portaria • v1.0.0</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 pb-4">
          <div className="space-y-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200/90 ring-1 ring-transparent transition hover:bg-white/5 hover:ring-white/10"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover:bg-white/10">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-200/90 ring-1 ring-transparent transition hover:bg-rose-500/10 hover:ring-rose-500/20"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <Icon>
                <Svg d="M10 17l-1 0a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h1M14 7l5 5-5 5M19 12H10" />
              </Icon>
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </nav>

        {/* User card */}
        <div className="mt-auto px-4 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image
                  src="https://picsum.photos/80"
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">José Silva</div>
                <div className="text-xs text-slate-400">Administrador</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-black/20 px-3 py-2 text-xs text-slate-400 ring-1 ring-white/10">
              Condomínio: <span className="text-slate-200">K2P Demo</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050B17] text-slate-100">
      {/* Background (igual ao estilo do mock) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[520px] w-[520px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_30%,rgba(56,189,248,0.08),transparent_55%),radial-gradient(900px_500px_at_80%_40%,rgba(37,99,235,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-3 py-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 gap-4 lg:grid-cols-[290px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* Topbar */}
            <header className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-2xl shadow-black/30">
              <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-white/10 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Abrir menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Search */}
                <div className="relative w-full max-w-[520px]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                  </span>
                  <input
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:border-sky-500/30 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10">
                  <Svg d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m3 4a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
                </button>

                <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-white/10">
                  <Image
                    src="https://picsum.photos/90"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-3 top-3 bottom-3 w-[320px] max-w-[90vw]">
            <div className="h-full">
              <div className="mb-3 flex justify-end">
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar compact />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
