"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type TriadaResuelta = {
  triada_id: number;
  contexto: string;
  orden: number;
  umbral_visibilidad: number;
  activa: boolean;
  geometria_id: number;
  numero_romano: string;
  nombre: string;
  pregunta: string;
  vertice_a: string;
  vertice_b: string;
  vertice_c: string;
  pregunta_contexto: string | null;
  que_revela: string;
  cuando_usarla: string;
};

type Percepcion = {
  triada_id: number;
  peso_a: number;
  peso_b: number;
  peso_c: number;
  narrativa: string | null;
};

type Respuesta = {
  weights: [number, number, number];
  narrativa: string;
  guardada: boolean;
};

const SIZE = 340;
const CX = SIZE / 2;
const HEIGHT = SIZE * 0.86;
const PAD = 52;

const A = { x: CX, y: PAD };
const B = { x: PAD, y: HEIGHT };
const C = { x: SIZE - PAD, y: HEIGHT };

function baryToCart(wa: number, wb: number, wc: number) {
  return {
    x: wa * A.x + wb * B.x + wc * C.x,
    y: wa * A.y + wb * B.y + wc * C.y,
  };
}

function cartToBary(x: number, y: number): [number, number, number] {
  const denom = (B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y);
  const wa = ((B.y - C.y) * (x - C.x) + (C.x - B.x) * (y - C.y)) / denom;
  const wb = ((C.y - A.y) * (x - C.x) + (A.x - C.x) * (y - C.y)) / denom;
  const wc = 1 - wa - wb;
  const clamped: [number, number, number] = [
    Math.max(0, wa),
    Math.max(0, wb),
    Math.max(0, wc),
  ];
  const sum = clamped[0] + clamped[1] + clamped[2];
  return [clamped[0] / sum, clamped[1] / sum, clamped[2] / sum];
}

function isInsideTriangle(x: number, y: number) {
  const [wa, wb, wc] = cartToBary(x, y);
  return wa >= 0 && wb >= 0 && wc >= 0;
}

function TriangleField({
  weights,
  onChange,
}: {
  weights: [number, number, number];
  onChange: (w: [number, number, number]) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const pos = baryToCart(weights[0], weights[1], weights[2]);

  const handlePointer = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging.current && e.type !== "pointerdown") return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = SIZE / rect.width;
      const scaleY = (HEIGHT + PAD) / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      if (isInsideTriangle(x, y) || e.type === "pointerdown") {
        onChange(cartToBary(x, y));
      }
    },
    [onChange]
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${HEIGHT + PAD}`}
      style={{ width: "100%", maxWidth: 340, cursor: "crosshair", userSelect: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointer(e);
      }}
      onPointerMove={handlePointer}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#F5EDD8" opacity="0.4" />
      {[0.33, 0.66].map((t) => {
        const ab = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
        const ac = { x: A.x + (C.x - A.x) * t, y: A.y + (C.y - A.y) * t };
        const bc = { x: B.x + (C.x - B.x) * t, y: B.y + (C.y - B.y) * t };
        return (
          <g key={t} opacity="0.15">
            <line x1={ab.x} y1={ab.y} x2={ac.x} y2={ac.y} stroke="#8B6F3A" strokeWidth="0.5" />
            <line x1={ab.x} y1={ab.y} x2={bc.x} y2={bc.y} stroke="#8B6F3A" strokeWidth="0.5" />
            <line x1={ac.x} y1={ac.y} x2={bc.x} y2={bc.y} stroke="#8B6F3A" strokeWidth="0.5" />
          </g>
        );
      })}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.7" />
      {[A, B, C].map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={4} fill="#C9A84C" opacity="0.8" />
      ))}
      {[A, B, C].map((v, i) => (
        <line key={i} x1={v.x} y1={v.y} x2={pos.x} y2={pos.y} stroke="#C9A84C" strokeWidth={0.8 + weights[i] * 1.8} strokeDasharray="3 4" opacity={0.2 + weights[i] * 0.5} />
      ))}
      <circle cx={pos.x} cy={pos.y} r={22} fill="url(#glow)" />
      <circle cx={pos.x} cy={pos.y} r={9} fill="#5C4A1E" opacity="0.9" />
      <circle cx={pos.x} cy={pos.y} r={5} fill="#C9A84C" />
    </svg>
  );
}

function WeightBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#8B6F3A", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#5C4A1E" }}>{Math.round(value * 100)}%</span>
      </div>
      <div style={{ height: 3, background: "#E8DCC8", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value * 100}%`, background: color, borderRadius: 2, transition: "width 0.15s ease" }} />
      </div>
    </div>
  );
}

function IntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF5", fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <div style={{ fontSize: 11, color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Paradigma Aleph</div>
        <h1 style={{ fontSize: 26, fontWeight: 400, color: "#3D2B1A", marginBottom: 28, textAlign: "center", lineHeight: 1.4 }}>Antes de empezar</h1>
        <div style={{ fontSize: 15, color: "#3D2B1A", lineHeight: 1.8, marginBottom: 36 }}>
          <p style={{ marginBottom: 16 }}>Lo que sigue no es un cuestionario. Son ocho momentos para posicionarte en un campo — cada uno con tres fuerzas que tiran desde los vértices de un triángulo.</p>
          <p style={{ marginBottom: 16 }}>No vas a elegir una opción entre tres. Vas a ubicar tu punto donde sientas que estás hoy, con la mezcla que sea: más cerca de una, a mitad de camino entre dos, en el centro de las tres. Nadie está esperando una respuesta correcta — solo la que es tuya ahora.</p>
          <p style={{ marginBottom: 16 }}>Te sugerimos no apurar el gesto. El instrumento funciona mejor cuando el movimiento del punto sigue al pensamiento, no al revés.</p>
          <p style={{ marginBottom: 16 }}>Cuando todos completan los ocho momentos, emerge la topografía del grupo — un mapa del campo colectivo que nadie podía producir solo. Tu posición contribuye a ese mapa.</p>
        </div>
        <button onClick={onContinue} style={{ width: "100%", background: "#5C4A1E", color: "#FDFAF5", border: "none", borderRadius: 10, padding: "16px", fontSize: 15, cursor: "pointer", letterSpacing: "0.04em", fontFamily: "'Georgia', serif" }}>Empezá cuando estés →</button>
      </div>
    </div>
  );
}

export default function TriadaPercepcion({
  contexto = "convocatoria_quanam",
  onComplete,
}: {
  contexto?: string;
  onComplete?: () => void;
}) {
  const [triadas, setTriadas] = useState<TriadaResuelta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [stage, setStage] = useState<"loading" | "intro" | "triadas" | "completado">("loading");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  const colors = ["#C9A84C", "#8B9E6F", "#7A8DB0"];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/triadas/posicion?contexto=${encodeURIComponent(contexto)}`);
        if (!res.ok) throw new Error("No se pudieron cargar las tríadas");
        const data: { triadas: TriadaResuelta[]; percepciones: Percepcion[] } = await res.json();
        const triadasOrdenadas = data.triadas.sort((a, b) => a.orden - b.orden);
        const percepcionesMap = new Map(data.percepciones.map((p) => [p.triada_id, p]));
        const initResp: Respuesta[] = triadasOrdenadas.map((t) => {
          const existente = percepcionesMap.get(t.triada_id);
          if (existente) {
            return { weights: [existente.peso_a, existente.peso_b, existente.peso_c], narrativa: existente.narrativa || "", guardada: true };
          }
          return { weights: [0.333, 0.333, 0.334], narrativa: "", guardada: false };
        });
        setTriadas(triadasOrdenadas);
        setRespuestas(initResp);
        const todasGuardadas = initResp.every((r) => r.guardada);
        setStage(todasGuardadas ? "completado" : "intro");
      } catch (err) {
        console.error("Error cargando tríadas:", err);
        setSaveError("No se pudieron cargar las tríadas. Recargá la página.");
        setStage("loading");
      }
    })();
  }, [contexto]);

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
  }, [stage]);

  const updateWeights = (weights: [number, number, number]) => {
    setRespuestas((prev) => prev.map((r, i) => (i === step ? { ...r, weights } : r)));
  };

  const updateNarrativa = (narrativa: string) => {
    setRespuestas((prev) => prev.map((r, i) => (i === step ? { ...r, narrativa } : r)));
  };

  const guardarYAvanzar = async () => {
    const triada = triadas[step];
    const respuesta = respuestas[step];
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/triadas/posicion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triada_id: triada.triada_id,
          peso_a: Number(respuesta.weights[0].toFixed(3)),
          peso_b: Number(respuesta.weights[1].toFixed(3)),
          peso_c: Number(respuesta.weights[2].toFixed(3)),
          narrativa: respuesta.narrativa || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }
      setRespuestas((prev) => prev.map((r, i) => (i === step ? { ...r, guardada: true } : r)));
      if (step === triadas.length - 1) {
        setStage("completado");
        onComplete?.();
      } else {
        setStep((s) => s + 1);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Error desconocido al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (stage === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFAF5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "#8B6F3A" }}>
        {saveError ? saveError : "Cargando..."}
      </div>
    );
  }

  if (stage === "intro") {
    return <IntroScreen onContinue={() => setStage("triadas")} />;
  }

  if (stage === "completado") {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFAF5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: "24px" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>
          <h2 style={{ fontSize: 24, color: "#3D2B1A", fontWeight: 400, marginBottom: 14 }}>Ya estás adentro del campo</h2>
          <p style={{ color: "#8B6F3A", fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>Tu posición quedó registrada en los ocho momentos. Lo que explorés a continuación ya sabe desde dónde venís.</p>
          <div style={{ background: "#F5EDD8", borderRadius: 12, padding: "20px 24px", textAlign: "left", marginBottom: 32 }}>
            {triadas.map((t, i) => {
              const r = respuestas[i];
              return (
                <div key={t.triada_id} style={{ marginBottom: i === triadas.length - 1 ? 0 : 20 }}>
                  <div style={{ fontSize: 10, color: "#C9A84C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{t.numero_romano} · {t.nombre}</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    {[t.vertice_a, t.vertice_b, t.vertice_c].map((_v, j) => (
                      <div key={j} style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: colors[j] }}>{Math.round(r.weights[j] * 100)}%</div>
                      </div>
                    ))}
                  </div>
                  {r.narrativa && (<p style={{ fontSize: 12, color: "#5C4A1E", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>&ldquo;{r.narrativa}&rdquo;</p>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const triada = triadas[step];
  const current = respuestas[step];

  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF5", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", opacity: entered ? 1 : 0, transform: entered ? "none" : "translateY(10px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
      <div style={{ width: "100%", borderBottom: "1px solid #E8DCC8", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FDFAF5" }}>
        <span style={{ fontSize: 12, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Paradigma Aleph</span>
        <div style={{ display: "flex", gap: 6 }}>
          {triadas.map((_, i) => (
            <div key={i} style={{ width: 24, height: 3, borderRadius: 2, background: i === step ? "#C9A84C" : respuestas[i]?.guardada ? "#8B9E6F" : "#E8DCC8", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 460, width: "100%", padding: "36px 24px 60px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{triada.numero_romano} · {triada.nombre}</div>
          <h1 style={{ fontSize: 20, fontWeight: 400, color: "#3D2B1A", lineHeight: 1.4, margin: 0 }}>{triada.pregunta}</h1>
          <p style={{ fontSize: 13, color: "#8B6F3A", marginTop: 10, lineHeight: 1.6 }}>Tocá o arrastrá tu punto dentro del campo.</p>
        </div>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, display: "inline-block", maxWidth: 240 }}>{triada.vertice_a}</span>
          </div>
          <TriangleField weights={current.weights} onChange={updateWeights} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingLeft: 8, paddingRight: 8, gap: 12 }}>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, maxWidth: 130, display: "inline-block" }}>{triada.vertice_b}</span>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, maxWidth: 130, textAlign: "right", display: "inline-block" }}>{triada.vertice_c}</span>
          </div>
        </div>
        <div style={{ background: "#F5EDD8", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
          <WeightBar label="A" value={current.weights[0]} color={colors[0]} />
          <WeightBar label="B" value={current.weights[1]} color={colors[1]} />
          <WeightBar label="C" value={current.weights[2]} color={colors[2]} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 12, color: "#8B6F3A", marginBottom: 8, letterSpacing: "0.04em" }}>¿Qué te trajo a ese lugar? <span style={{ opacity: 0.6 }}>(opcional)</span></label>
          <textarea value={current.narrativa} onChange={(e) => updateNarrativa(e.target.value)} placeholder="Una frase, una imagen, lo que sea que lo explique..." rows={3} style={{ width: "100%", background: "transparent", border: "1px solid #E8DCC8", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#3D2B1A", fontFamily: "'Georgia', serif", resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
        </div>
        {saveError && (<div style={{ background: "#F5D8D8", border: "1px solid #C94C4C", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#5C1E1E", marginBottom: 16 }}>{saveError}</div>)}
        <button onClick={guardarYAvanzar} disabled={saving} style={{ width: "100%", background: saving ? "#8B6F3A" : "#5C4A1E", color: "#FDFAF5", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, cursor: saving ? "wait" : "pointer", letterSpacing: "0.04em", fontFamily: "'Georgia', serif", transition: "background 0.2s" }}>
          {saving ? "Guardando..." : step === triadas.length - 1 ? "Entrar al campo →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}
