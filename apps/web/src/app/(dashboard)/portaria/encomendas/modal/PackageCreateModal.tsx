  "use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CreatePackagePayload = {
  unitId?: string | null;
  recipientPersonId?: string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  description?: string | null;
  notes?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { payload: CreatePackagePayload; photo?: Blob | null }) => Promise<void> | void;
};

export default function PackageCreateModal({ open, onClose, onSubmit }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [unitId, setUnitId] = useState("");
  const [recipientPersonId, setRecipientPersonId] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [cameraError, setCameraError] = useState<string>("");
  const [cameraOn, setCameraOn] = useState(false);

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const canSubmit = useMemo(() => {
    // mínimo: description OU tracking
    return Boolean(description.trim() || trackingCode.trim());
  }, [description, trackingCode]);

  // Cleanup da URL da foto
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  // Fecha modal com ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Quando abre, opcionalmente liga a câmera automaticamente
  useEffect(() => {
    if (!open) {
      stopCamera();
      return;
    }
    // auto-start é opcional; se quiser manual, remova a linha abaixo
    startCamera().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function startCamera() {
    setCameraError("");
    try {
      // Se já estiver rodando, não reinicia
      if (streamRef.current) {
        setCameraOn(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setCameraOn(false);
      setCameraError(
        err?.message ||
          "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    }
  }

  function stopCamera() {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;
    setCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function takePhoto() {
    setCameraError("");
    setFormError("");

    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setPhotoBlob(blob);

        if (photoUrl) URL.revokeObjectURL(photoUrl);
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);

        // opcional: desligar câmera após tirar foto
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  function retakePhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl("");
    setPhotoBlob(null);
    startCamera().catch(() => {});
  }

  function resetForm() {
    setUnitId("");
    setRecipientPersonId("");
    setCarrier("");
    setTrackingCode("");
    setDescription("");
    setNotes("");
    setCameraError("");
    setFormError("");

    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl("");
    setPhotoBlob(null);
  }

  function handleClose() {
    stopCamera();
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!canSubmit) {
      setFormError("Preencha ao menos a descrição ou o código de rastreio.");
      return;
    }

    const payload: CreatePackagePayload = {
      unitId: unitId.trim() ? unitId.trim() : null,
      recipientPersonId: recipientPersonId.trim() ? recipientPersonId.trim() : null,
      carrier: carrier.trim() ? carrier.trim() : null,
      trackingCode: trackingCode.trim() ? trackingCode.trim() : null,
      description: description.trim() ? description.trim() : null,
      notes: notes.trim() ? notes.trim() : null,
    };

    try {
      setSaving(true);
      await onSubmit({ payload, photo: photoBlob });
      handleClose();
    } catch (err: any) {
      setFormError(err?.message || "Erro ao salvar encomenda.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        // fecha ao clicar fora
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <div className="text-xs text-slate-400">Portaria • Encomendas</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Nova Encomenda</h2>
          </div>

          <button
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
            onClick={handleClose}
            type="button"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 p-5 md:grid-cols-2">
            {/* Coluna esquerda: Form */}
            <div className="space-y-4">
              <Field label="Unidade (unitId)" hint="Opcional (por enquanto pode ser um ID/uuid)">
                <input
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: 504 (ou uuid)"
                />
              </Field>

              <Field label="Destinatário (recipientPersonId)" hint="Opcional (ID/uuid do morador)">
                <input
                  value={recipientPersonId}
                  onChange={(e) => setRecipientPersonId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: uuid da pessoa"
                />
              </Field>

              <Field label="Transportadora">
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: Correios, Amazon, Jadlog..."
                />
              </Field>

              <Field label="Código de rastreio">
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: BR123..."
                />
              </Field>

              <Field label="Descrição" hint="Preencha ao menos Descrição ou Rastreio">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: Caixa pequena / Mercado Livre..."
                />
              </Field>

              <Field label="Observações">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-600/60"
                  placeholder="ex: Avisar morador / deixar na administração..."
                />
              </Field>

              {formError ? (
                <div className="rounded-xl border border-rose-900/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
                  {formError}
                </div>
              ) : null}
            </div>

            {/* Coluna direita: Webcam */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-100">Foto da encomenda</div>
                  <div className="text-xs text-slate-400">
                    Tire uma foto para registrar chegada (opcional).
                  </div>
                </div>

                {!photoBlob ? (
                  <button
                    type="button"
                    className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                    onClick={() => (cameraOn ? stopCamera() : startCamera())}
                  >
                    {cameraOn ? "Desligar câmera" : "Ligar câmera"}
                  </button>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
                {photoBlob && photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto capturada"
                    className="h-[320px] w-full object-cover"
                  />
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="h-[320px] w-full bg-black object-cover"
                    />
                    {!cameraOn ? (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                        Câmera desligada
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
                  {cameraError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {!photoBlob ? (
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                    onClick={takePhoto}
                    disabled={!cameraOn}
                  >
                    Tirar foto
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    onClick={retakePhoto}
                  >
                    Refazer foto
                  </button>
                )}

                {photoBlob ? (
                  <span className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-300">
                    Foto pronta ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
                    Sem foto (opcional)
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500">
                Dica: em desktop, pode precisar permitir câmera no navegador (ícone na barra de endereço).
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <div className="text-xs text-slate-500">
              {saving ? "Salvando..." : "K2P • Encomendas"}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                onClick={handleClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                disabled={saving || !canSubmit}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-slate-100">{label}</label>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}