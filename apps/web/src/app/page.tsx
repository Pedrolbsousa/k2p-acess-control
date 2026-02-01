import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import Link from "next/link";

export default async function Home() {
  const session = (await getServerSession(authOptions as any)) as any;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">K2P Portaria</h1>

      <div className="mt-4">
        {session ? (
          <div className="space-y-3">
            <div>Logado como: {(session?.user?.name ?? "Usuário")}</div>
            <a
              className="inline-flex items-center rounded-md border px-3 py-2"
              href="/api/auth/signout"
            >
              Sair
            </a>
          </div>
        ) : (
          <a
            className="inline-flex items-center rounded-md border px-3 py-2"
            href="/api/auth/signin"
          >
            Entrar
          </a>
        )}
      </div>
    </main>
  );
}
