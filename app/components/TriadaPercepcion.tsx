"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

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
  narrativa_pospuesta: boolean;
};

type Respuesta = {
  weights: [number, number, number];
  narrativa: string;
  pospuesta: boolean;
  guardada: boolean;
};

const BG = "#F8F3EA";
const INK = "#2A1F14";
const INK_MID = "#5C4A1E";
const INK_LIGHT = "#8B6F3A";
const AMBER = "#C9A84C";
const SAGE = "#8B9E6F";
const CREAM = "#EDE4D0";
const FD = "var(--font-display, 'Fraunces', Georgia, serif)";
const FB = "var(--font-body, 'Lora', Georgia, serif)";

function Styles() {
  return (
    <style>{`
      @keyframes pulseOpacity { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.26; } }
      .triada-btn:hover { background: #3D2B1A !important; color: #FDFAF5 !important; transform: translateY(-1px); }
      .narrativa-area { border: none !important; border-bottom: 1px solid ${CREAM} !important; border-radius: 0 !important; background: transparent !important; outline: none !important; }
      .narrativa-area:focus { border-bottom-color: ${AMBER} !important; }
      .drop-cap::first-letter {
        font-family: ${FD};
        font-style: italic;
        font-size: 4em;
        float: left;
        line-height: 0.72;
        margin: 0.06em 0.1em 0 0;
        color: ${INK};
      }
    `}</style>
  );
}

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,
        opacity: 0.3,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function TriangleField({
  weights,
  onChange,
  size,
  interactive = true,
}: {
  weights: [number, number, number];
  onChange: (w: [number, number, number]) => void;
  size: number;
  interactive?: boolean;
}) {
  const cx = size / 2;
  const height = size * 0.86;
  const pad = size * 0.04;
  const A = { x: cx, y: pad };
  const B = { x: pad, y: height };
  const C = { x: size - pad, y: height };
  const gradId = `glow-${size}`;

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
    const cl: [number, number, number] = [Math.max(0, wa), Math.max(0, wb), Math.max(0, wc)];
    const s = cl[0] + cl[1] + cl[2];
    return [cl[0] / s, cl[1] / s, cl[2] / s];
  }

  function isInsideTriangle(x: number, y: number) {
    const [wa, wb, wc] = cartToBary(x, y);
    return wa >= 0 && wb >= 0 && wc >= 0;
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const pos = baryToCart(weights[0], weights[1], weights[2]);
  const verts = [A, B, C];

  const handlePointer = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!interactive) return;
      if (!dragging.current && e.type !== "pointerdown") return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (size / rect.width);
      const y = (e.clientY - rect.top) * ((height + pad) / rect.height);
      if (isInsideTriangle(x, y) || e.type === "pointerdown") {
        onChange(cartToBary(x, y));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, size, interactive]
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${size} ${height + pad}`}
      style={{ width: "100%", maxWidth: size, cursor: interactive ? "crosshair" : "default", userSelect: "none", display: "block" }}
      onPointerDown={interactive ? (e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); handlePointer(e); } : undefined}
      onPointerMove={interactive ? handlePointer : undefined}
      onPointerUp={interactive ? () => { dragging.current = false; } : undefined}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.3" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>

      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={CREAM} opacity="0.32" />

      {[0.33, 0.66].map((t) => {
        const ab = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
        const ac = { x: A.x + (C.x - A.x) * t, y: A.y + (C.y - A.y) * t };
        const bc = { x: B.x + (C.x - B.x) * t, y: B.y + (C.y - B.y) * t };
        return (
          <g key={t} opacity="0.07">
            <line x1={ab.x} y1={ab.y} x2={ac.x} y2={ac.y} stroke={INK_LIGHT} strokeWidth="0.6" />
            <line x1={ab.x} y1={ab.y} x2={bc.x} y2={bc.y} stroke={INK_LIGHT} strokeWidth="0.6" />
            <line x1={ac.x} y1={ac.y} x2={bc.x} y2={bc.y} stroke={INK_LIGHT} strokeWidth="0.6" />
          </g>
        );
      })}

      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke={AMBER} strokeWidth="1" opacity="0.65" />

      {verts.map((v, i) => (
        <circle key={`h${i}`} cx={v.x} cy={v.y} r={interactive ? 8 : 5} fill={AMBER} opacity="0.14" />
      ))}
      {verts.map((v, i) => (
        <circle key={`d${i}`} cx={v.x} cy={v.y} r={interactive ? 3 : 2} fill={AMBER} opacity="0.85" />
      ))}

      {interactive && verts.map((v, i) => (
        <line key={`c${i}`} x1={v.x} y1={v.y} x2={pos.x} y2={pos.y} stroke={AMBER}
          strokeWidth={0.5 + weights[i] * 1.5} strokeDasharray="3 5"
          opacity={0.12 + weights[i] * 0.48} />
      ))}

      {interactive && (
        <circle cx={pos.x} cy={pos.y} r={28} fill={`url(#${gradId})`}
          style={{ animationName: "pulseOpacity", animationDuration: "2.6s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
      )}

      <circle cx={pos.x} cy={pos.y} r={interactive ? 18 : 10} fill={`url(#${gradId})`} />
      <circle cx={pos.x} cy={pos.y} r={interactive ? 9.5 : 6} fill="none" stroke={AMBER} strokeWidth="0.7" opacity="0.4" />
      <circle cx={pos.x} cy={pos.y} r={interactive ? 6.5 : 4} fill={INK} opacity="0.88" />
      <circle cx={pos.x} cy={pos.y} r={interactive ? 3.5 : 2.2} fill={AMBER} />
    </svg>
  );
}

function IntroScreen({ onContinue, isDesktop }: { onContinue: () => void; isDesktop: boolean }) {
  const p1 = "Lo que sigue no es un cuestionario. Son ocho momentos para posicionarte en un campo — cada uno con tres fuerzas que tiran desde los vértices de un triángulo.";
  const p2 = "No vas a elegir una opción entre tres. Vas a ubicar tu punto donde sientas que estás hoy, con la mezcla que sea: más cerca de una, a mitad de camino entre dos, en el centro de las tres. Nadie está esperando una respuesta correcta — solo la que es tuya ahora.";
  const p3 = "Te sugerimos no apurar el gesto. El instrumento funciona mejor cuando el movimiento del punto sigue al pensamiento, no al revés.";
  const p4 = "Cuando todos completan los ocho momentos, emerge la topografía del grupo — un mapa del campo colectivo que nadie podía producir solo. Tu posición contribuye a ese mapa.";

  const paraStyle: React.CSSProperties = {
    fontSize: isDesktop ? 15.5 : 15,
    fontFamily: FB,
    fontWeight: 400,
    color: INK_MID,
    lineHeight: 1.6,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  };

  const btnEl = (
    <button
      onClick={onContinue}
      className="triada-btn"
      style={{
        display: "inline-block",
        background: "transparent",
        color: "#5C4A1E",
        border: "1.5px solid #5C4A1E",
        padding: "16px 40px",
        fontSize: 13,
        fontFamily: FB,
        fontWeight: 400,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 400ms ease",
      }}
    >
      Ingresar
    </button>
  );

  if (isDesktop) {
    return (
      <div
        style={{
          height: "100dvh",
          minHeight: "100vh",
          background: "#FDFAF5",
          padding: "clamp(40px, 6vh, 72px) clamp(60px, 6.5vw, 130px) clamp(32px, 4.5vh, 56px) clamp(60px, 4.7vw, 95px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header: eyebrow PARADIGMA ALEPH (izq) + logo aleph (der) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: "clamp(12px, 0.85vw, 15px)",
              fontFamily: FB,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: AMBER,
            }}
          >
            Paradigma Aleph
          </div>
          <Image
            src="/images/Aleph_vectorial_poweredby.svg"
            alt="aleph powered by Quanam"
            width={200}
            height={100}
            priority
            unoptimized
            style={{ width: "clamp(60px, 4vw, 80px)", height: "auto", display: "block" }}
          />
        </div>

        {/* Grid principal: 2×2 con 4 celdas separadas */}
        <div
          style={{
            flex: "none",
            display: "grid",
            gridTemplateColumns: "min(48vw, 880px) minmax(0, 1fr)",
            gridTemplateRows: "1fr auto",
            columnGap: "clamp(40px, 5vw, 100px)",
            rowGap: "clamp(7px, 1.4vh, 19px)",
            marginTop: "clamp(12px, 2vh, 28px)",
            alignContent: "start",
          }}
        >
          {/* (1,1) Imagen topográfica */}
          <div style={{ alignSelf: "start" }}>
            <Image
              src="/images/topografia-intro.png"
              alt="Topografía del campo colectivo"
              width={1839}
              height={1122}
              priority
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>

          {/* (1,2) Subtítulo El gesto + párrafos p2, p3, p4 */}
          <div style={{ alignSelf: "start", minWidth: 0, maxWidth: "100%", paddingTop: 4 }}>
            <h2
              style={{
                fontFamily: FD,
                fontSize: "clamp(26px, 2vw, 36px)",
                fontWeight: 300,
                color: "#3D2B1A",
                lineHeight: 1.1,
                letterSpacing: "-0.005em",
                marginTop: 0,
                marginRight: 0,
                marginBottom: 24,
                marginLeft: 0,
              }}
            >
              <span style={{ color: AMBER, marginRight: 16 }}>✦</span>
              El gesto
            </h2>
            <p style={{ ...paraStyle, marginBottom: 16 }}>{p2}</p>
            <p style={{ ...paraStyle, marginBottom: 16 }}>{p3}</p>
            <p style={paraStyle}>{p4}</p>
          </div>

          {/* (2,1) Título + p1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 1.5vh, 20px)" }}>
            <h1
              style={{
                fontFamily: FD,
                fontSize: "clamp(32px, 2.6vw, 50px)",
                fontWeight: 300,
                color: "#3D2B1A",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0,
              }}
            >
              Antes de ingresar al campo
            </h1>
            <p style={{ ...paraStyle, maxWidth: "100%" }}>{p1}</p>
          </div>

          {/* (2,2) Botón — centrado verticalmente en su fila, alineado a la derecha */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            {btnEl}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FDFAF5", padding: "80px 32px 100px" }}>
      <div style={{ fontSize: 14, fontFamily: FB, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase", color: AMBER, marginBottom: 32 }}>
        Paradigma Aleph
      </div>
      <Image
        src="/images/topografia-intro.png"
        alt="Topografía de lugares geométricos situados habitando el espacio alephiano"
        width={1839}
        height={1119}
        priority={false}
        style={{ display: "block", width: "100%", height: "auto", marginBottom: 40 }}
      />
      <h1 style={{ fontFamily: FD, fontSize: 32, fontWeight: 300, color: "#3D2B1A", lineHeight: 1.15, margin: "0 0 48px" }}>
        Antes de ingresar al campo
      </h1>
      <p style={{ ...paraStyle, marginBottom: 20 }}>{p1}</p>
      <p style={{ ...paraStyle, marginBottom: 20 }}>{p2}</p>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <span style={{ fontFamily: FD, fontSize: 24, color: AMBER }}>✦</span>
      </div>
      <p style={{ ...paraStyle, marginBottom: 20 }}>{p3}</p>
      <p style={paraStyle}>{p4}</p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        {btnEl}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Aleph_vectorial_poweredby.svg"
        alt="aleph Powered by QUANAM"
        style={{ display: "block", width: 64, height: "auto", margin: "32px auto 24px" }}
      />
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
  const isDesktop = useIsDesktop();
  const triangleSize = isDesktop ? 640 : 380;

  const [triadas, setTriadas] = useState<TriadaResuelta[]>([]);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [stage, setStage] = useState<"loading" | "intro" | "triadas" | "completado">("loading");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/triadas/posicion?contexto=${encodeURIComponent(contexto)}`);
        if (!res.ok) throw new Error("No se pudieron cargar las tríadas");
        const data: { triadas: TriadaResuelta[]; percepciones: Percepcion[] } = await res.json();
        const sorted = data.triadas.sort((a, b) => a.orden - b.orden);
        const pm = new Map(data.percepciones.map((p) => [p.triada_id, p]));
        const initResp: Respuesta[] = sorted.map((t) => {
          const e = pm.get(t.triada_id);
          if (e) return { weights: [e.peso_a, e.peso_b, e.peso_c], narrativa: e.narrativa || "", pospuesta: e.narrativa_pospuesta || false, guardada: true };
          return { weights: [0.333, 0.333, 0.334], narrativa: "", pospuesta: false, guardada: false };
        });
        setTriadas(sorted);
        setRespuestas(initResp);
        setStage(initResp.every((r) => r.guardada) ? "completado" : "intro");
      } catch (err) {
        console.error("Error cargando tríadas:", err);
        setSaveError("No se pudieron cargar las tríadas. Recargá la página.");
      }
    })();
  }, [contexto]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [stage]);

  const updateWeights = (weights: [number, number, number]) => {
    setRespuestas((prev) => prev.map((r, i) => (i === step ? { ...r, weights } : r)));
  };

  const updateNarrativa = (narrativa: string) => {
    setRespuestas((prev) => prev.map((r, i) => (i === step ? { ...r, narrativa, pospuesta: false } : r)));
  };

  const guardarYAvanzar = async () => {
    const triada = triadas[step];
    const resp = respuestas[step];
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/triadas/posicion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triada_id: triada.triada_id,
          peso_a: Number(resp.weights[0].toFixed(3)),
          peso_b: Number(resp.weights[1].toFixed(3)),
          peso_c: Number(resp.weights[2].toFixed(3)),
          narrativa: resp.pospuesta ? null : (resp.narrativa || null),
          narrativa_pospuesta: resp.pospuesta,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error al guardar");
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
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FB, color: INK_LIGHT, fontSize: 15 }}>
        {saveError || "Cargando..."}
      </div>
    );
  }

  if (stage === "intro") {
    return (
      <>
        <Styles />
        <GrainOverlay />
        <IntroScreen onContinue={() => { setEntered(false); setStage("triadas"); }} isDesktop={isDesktop} />
      </>
    );
  }

  if (stage === "completado") {
    const pendientes = triadas.filter((_, i) => respuestas[i]?.pospuesta).length;
    return (
      <>
        <Styles />
        <GrainOverlay />
        <div style={{ minHeight: "100vh", background: BG, fontFamily: FB, padding: isDesktop ? "72px 80px" : "60px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
              <div style={{ fontSize: isDesktop ? 40 : 28, color: AMBER, marginBottom: 16 }}>✦</div>
              <h2 style={{ fontFamily: FD, fontSize: isDesktop ? 44 : 32, fontWeight: 300, color: INK, margin: "0 0 18px", lineHeight: 1.2 }}>
                Ya estás adentro del campo
              </h2>
              <p style={{ fontSize: 16, fontFamily: FB, color: INK_MID, lineHeight: 1.85, maxWidth: 520, margin: "0 auto" }}>
                Tu posición quedó registrada en los ocho momentos. Lo que explorés a continuación ya sabe desde dónde venís.
              </p>
              {pendientes > 0 && (
                <p style={{ fontFamily: FB, fontStyle: "italic", fontSize: 14, color: INK_LIGHT, marginTop: 20 }}>
                  Te quedan {pendientes} narrativa{pendientes > 1 ? "s" : ""} por escribir antes de que el campo colectivo se vuelva visible.
                </p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: isDesktop ? 20 : 12 }}>
              {triadas.map((t, i) => {
                const r = respuestas[i];
                return (
                  <div key={t.triada_id} style={{ background: CREAM, padding: "14px 14px 16px", borderLeft: r.pospuesta ? `2px dashed ${AMBER}` : "none" }}>
                    <div style={{ fontSize: 9, fontFamily: FB, letterSpacing: "0.18em", textTransform: "uppercase", color: AMBER, marginBottom: 10 }}>
                      {t.numero_romano} · {t.nombre}
                    </div>
                    <div style={{ opacity: r.pospuesta ? 0.35 : 1 }}>
                      <TriangleField weights={r.weights} onChange={() => {}} size={140} interactive={false} />
                    </div>
                    <div style={{ marginTop: 10, minHeight: 18 }}>
                      {r.pospuesta
                        ? <p style={{ fontSize: 11, fontFamily: FB, fontStyle: "italic", color: AMBER, margin: 0 }}>Postergada</p>
                        : r.narrativa
                        ? <p style={{ fontSize: 11, fontFamily: FB, fontStyle: "italic", color: INK_MID, margin: 0, lineHeight: 1.55 }}>
                            &ldquo;{r.narrativa.slice(0, 72)}{r.narrativa.length > 72 ? "…" : ""}&rdquo;
                          </p>
                        : null
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── TRIADAS ──
  const triada = triadas[step];
  const current = respuestas[step];

  const puntoMovido = !(Math.abs(current.weights[0] - 0.333) < 0.01 && Math.abs(current.weights[1] - 0.333) < 0.01);
  const narrativaOK = current.narrativa.trim().length >= 10 || current.pospuesta;
  const botonHabilitado = puntoMovido && narrativaOK;

  const tooltipTexto = saving ? undefined
    : !puntoMovido && !narrativaOK ? "Movete en el triángulo y escribí tu palabra para continuar"
    : !puntoMovido ? "Movete en el triángulo para continuar"
    : !narrativaOK ? "Completá tu palabra o elegí postergarla"
    : undefined;

  const opacityA = 0.38 + current.weights[0] * 0.62;
  const opacityB = 0.38 + current.weights[1] * 0.62;
  const opacityC = 0.38 + current.weights[2] * 0.62;

  const checkboxEl = (
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FB, fontSize: 14, fontStyle: "italic", color: INK_LIGHT, cursor: "pointer", marginTop: isDesktop ? 28 : 20, userSelect: "none" }}>
      <div style={{ position: "relative", width: 18, height: 18, flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={current.pospuesta}
          onChange={(e) => setRespuestas((prev) => prev.map((r, i) => i === step ? { ...r, pospuesta: e.target.checked, narrativa: e.target.checked ? "" : r.narrativa } : r))}
          style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", margin: 0 }}
        />
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="0.5" y="0.5" width="17" height="17" stroke={AMBER} strokeOpacity="0.55" fill="none" />
          {current.pospuesta && <path d="M4 9L7.5 12.5L14 6" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
      <span>No deseo responder esta pregunta ahora</span>
    </label>
  );

  const progressEl = (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 7, marginTop: isDesktop ? 40 : 28 }}>
      {triadas.map((_, i) => (
        <div key={i} style={{
          width: "1.5px",
          height: i === step ? 14 : respuestas[i]?.guardada ? 12 : 10,
          background: i === step ? AMBER : respuestas[i]?.guardada ? SAGE : CREAM,
          borderRadius: "1px",
          transition: "height 0.3s, background 0.3s",
        }} />
      ))}
    </div>
  );

  const controlsBlock = (
    <>
      <div style={{ marginBottom: isDesktop ? 40 : 28 }}>
        <label style={{ display: "block", fontSize: 15, fontFamily: FB, color: INK, marginBottom: 12 }}>
          ¿Qué te trajo a ese lugar?
          <em style={{ display: "block", fontSize: 13, fontStyle: "italic", color: INK_LIGHT, opacity: 0.7, marginTop: 3, fontWeight: 400 }}>
            una frase, o postergá
          </em>
        </label>
        <textarea
          value={current.narrativa}
          onChange={(e) => updateNarrativa(e.target.value)}
          readOnly={current.pospuesta}
          placeholder="Una frase, una imagen, lo que sea que lo explique..."
          rows={3}
          className="narrativa-area"
          style={{
            width: "100%",
            padding: "10px 0",
            fontSize: 15,
            fontFamily: FB,
            fontStyle: "italic",
            color: INK,
            resize: "none",
            lineHeight: 1.7,
            boxSizing: "border-box",
            opacity: current.pospuesta ? 0.32 : 1,
            cursor: current.pospuesta ? "not-allowed" : "text",
            transition: "opacity 0.3s",
          }}
        />
        {checkboxEl}
      </div>

      {saveError && (
        <div style={{ background: "#F5D8D8", border: "1px solid #C94C4C", padding: "10px 14px", fontSize: 13, color: "#5C1E1E", marginBottom: 20 }}>
          {saveError}
        </div>
      )}

      <button
        onClick={botonHabilitado && !saving ? guardarYAvanzar : undefined}
        title={tooltipTexto}
        className="triada-btn"
        style={{
          display: "inline-block",
          background: "transparent",
          color: botonHabilitado ? INK : INK_LIGHT,
          border: botonHabilitado ? `1px solid ${INK}` : `1px dashed ${AMBER}`,
          padding: "18px 44px",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontFamily: FB,
          fontWeight: 400,
          cursor: saving ? "wait" : botonHabilitado ? "pointer" : "not-allowed",
          transition: "all 500ms ease",
          opacity: botonHabilitado || saving ? 1 : 0.25,
          pointerEvents: (!botonHabilitado && !saving) ? "none" : "auto",
        }}
      >
        {saving ? "·  ·  ·" : step === triadas.length - 1 ? "Entrar al campo" : "Continuar"}
      </button>

      {progressEl}
    </>
  );

  const fadeIn = { opacity: entered ? 1 : 0, transform: entered ? "none" : "translateY(12px)", transition: "opacity 0.55s ease, transform 0.55s ease" };

  if (isDesktop) {
    return (
      <>
        <Styles />
        <GrainOverlay />
        <div style={{ minHeight: "100vh", background: BG, ...fadeIn }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 100, alignItems: "start", paddingTop: 24 }}>
              {/* Columna izquierda — triángulo */}
              <div style={{ paddingTop: 40 }}>
                <div style={{ textAlign: "center", marginBottom: 0 }}>
                  <span style={{ fontFamily: FB, fontSize: 15, color: INK, display: "inline-block", maxWidth: 200, textAlign: "center", opacity: opacityA, transition: "opacity 0.2s ease" }}>
                    {triada.vertice_a}
                  </span>
                </div>
                <TriangleField weights={current.weights} onChange={updateWeights} size={triangleSize} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: -18, paddingLeft: 4, paddingRight: 4 }}>
                  <span style={{ fontFamily: FB, fontSize: 15, color: INK, lineHeight: 1.4, maxWidth: 180, opacity: opacityB, transition: "opacity 0.2s ease" }}>{triada.vertice_b}</span>
                  <span style={{ fontFamily: FB, fontSize: 15, color: INK, lineHeight: 1.4, maxWidth: 180, textAlign: "right", opacity: opacityC, transition: "opacity 0.2s ease" }}>{triada.vertice_c}</span>
                </div>
              </div>

              {/* Columna derecha — controles */}
              <div style={{ paddingTop: 40 }}>
                <div style={{ marginBottom: 48 }}>
                  <div style={{ fontSize: 11, fontFamily: FB, letterSpacing: "0.22em", textTransform: "uppercase", color: AMBER, marginBottom: 12 }}>
                    {triada.numero_romano} · {triada.nombre}
                  </div>
                  <h1 style={{ fontFamily: FD, fontSize: 34, fontWeight: 300, color: INK, lineHeight: 1.2, margin: "0 0 40px" }}>
                    {triada.pregunta}
                  </h1>
                  <p style={{ fontSize: 13, fontFamily: FB, color: INK_LIGHT, lineHeight: 1.6, margin: 0 }}>
                    Tocá o arrastrá tu punto dentro del campo.
                  </p>
                </div>
                {controlsBlock}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <GrainOverlay />
      <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", ...fadeIn }}>
        <div style={{ maxWidth: 520, width: "100%", padding: "56px 24px 64px" }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontFamily: FB, letterSpacing: "0.22em", textTransform: "uppercase", color: AMBER, marginBottom: 8 }}>
              {triada.numero_romano} · {triada.nombre}
            </div>
            <h1 style={{ fontFamily: FD, fontSize: 26, fontWeight: 300, color: INK, lineHeight: 1.2, margin: "0 0 28px" }}>
              {triada.pregunta}
            </h1>
            <p style={{ fontSize: 13, fontFamily: FB, color: INK_LIGHT, margin: 0, lineHeight: 1.6 }}>
              Tocá o arrastrá tu punto dentro del campo.
            </p>
          </div>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: FB, fontSize: 14, color: INK, display: "inline-block", maxWidth: 260, opacity: opacityA, transition: "opacity 0.2s ease" }}>
              {triada.vertice_a}
            </span>
          </div>
          <TriangleField weights={current.weights} onChange={updateWeights} size={triangleSize} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: -8, paddingLeft: 4, paddingRight: 4, gap: 12 }}>
            <span style={{ fontFamily: FB, fontSize: 14, color: INK, lineHeight: 1.4, maxWidth: 140, opacity: opacityB, transition: "opacity 0.2s ease" }}>{triada.vertice_b}</span>
            <span style={{ fontFamily: FB, fontSize: 14, color: INK, lineHeight: 1.4, maxWidth: 140, textAlign: "right", opacity: opacityC, transition: "opacity 0.2s ease" }}>{triada.vertice_c}</span>
          </div>
          <div style={{ marginTop: 36 }}>
            {controlsBlock}
          </div>
        </div>
      </div>
    </>
  );
}
