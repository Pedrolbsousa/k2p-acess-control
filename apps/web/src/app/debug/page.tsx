"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data, status } = useSession();

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Debug Session</h1>
      <div className="mt-4">Status: {status}</div>
      <pre className="mt-4 rounded-md border p-3 text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
