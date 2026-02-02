import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authOptions";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions as any);
  const roles: string[] = session?.roles ?? [];

  if (!session) {
    return (
      <main className="p-6">
        <p>Você precisa estar logado.</p>
        <a className="underline" href="/api/auth/signin">Entrar</a>
      </main>
    );
  }

  const items = [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/portaria/encomendas", label: "Encomendas", show: roles.includes("PORTARIA") || roles.includes("ADMIN_CONDOMINIO") || roles.includes("SINDICO") },
    { href: "/portaria/chegadas", label: "Chegadas", show: roles.includes("PORTARIA") || roles.includes("ADMIN_CONDOMINIO") || roles.includes("SINDICO") },
    { href: "/morador/liberacoes", label: "Liberações", show: roles.includes("MORADOR") || roles.includes("ADMIN_CONDOMINIO") || roles.includes("SINDICO") },
  ].filter((i) => i.show);

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b md:border-b-0 md:border-r md:w-64 p-4">
        <div className="font-semibold text-lg">K2P</div>
        <nav className="mt-4 flex md:block gap-3 flex-wrap">
          {items.map((i) => (
            <Link key={i.href} className="text-sm underline" href={i.href}>
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 text-xs opacity-70">
          {session.user?.name}
          <div>{roles.join(", ")}</div>
        </div>
        <div className="mt-4">
          <a className="text-sm underline" href="/api/auth/signout">Sair</a>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
