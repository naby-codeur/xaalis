"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Point d'integration observabilite (Sentry/DataDog/etc.).
    console.error("web_global_error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "#fafafa",
          }}
        >
          <section
            style={{
              width: "100%",
              maxWidth: 560,
              border: "1px solid #e4e4e7",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>
              Une erreur est survenue
            </h1>
            <p style={{ marginTop: 0, color: "#3f3f46" }}>
              L'erreur a ete journalisee. Vous pouvez reessayer.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 8,
                border: "1px solid #d4d4d8",
                borderRadius: 8,
                background: "#18181b",
                color: "#fff",
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              Reessayer
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
