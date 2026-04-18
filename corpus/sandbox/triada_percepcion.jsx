import { useState, useRef, useCallback, useEffect } from "react";

const TRIADAS = [
  {
    id: 1,
    geometria: "El momento del campo",
    pregunta: "Antes de explorar, ¿desde dónde llegás hoy?",
    vertices: [
      { label: "Lo que ya\nse movió", short: "Se movió" },
      { label: "Lo que estoy\nsosteniendo", short: "Sosteniendo" },
      { label: "Lo que todavía\nno tiene nombre", short: "Sin nombre" },
    ],
  },
  {
    id: 2,
    geometria: "Las tres miradas",
    pregunta: "¿Desde qué mirada estás llegando a esto?",
    vertices: [
      { label: "Lo que veo\nyo solo", short: "Yo solo" },
      { label: "Lo que vemos\njuntos", short: "Juntos" },
      { label: "Lo que se vuelve\nvisible con ayuda", short: "Con ayuda" },
    ],
  },
];

const SIZE = 340;
const CX = SIZE / 2;
const HEIGHT = SIZE * 0.86;
const PAD = 52;

const A = { x: CX, y: PAD };
const B = { x: PAD, y: HEIGHT };
const C = { x: SIZE - PAD, y: HEIGHT };

function baryToCart(wa, wb, wc) {
  return {
    x: wa * A.x + wb * B.x + wc * C.x,
    y: wa * A.y + wb * B.y + wc * C.y,
  };
}

function cartToBary(x, y) {
  const denom = (B.y - C.y) * (A.x - C.x) + (C.x - B.x) * (A.y - C.y);
  const wa = ((B.y - C.y) * (x - C.x) + (C.x - B.x) * (y - C.y)) / denom;
  const wb = ((C.y - A.y) * (x - C.x) + (A.x - C.x) * (y - C.y)) / denom;
  const wc = 1 - wa - wb;
  const clamped = [Math.max(0, wa), Math.max(0, wb), Math.max(0, wc)];
  const sum = clamped[0] + clamped[1] + clamped[2];
  return clamped.map((v) => v / sum);
}

function isInsideTriangle(x, y) {
  const [wa, wb, wc] = cartToBary(x, y);
  return wa >= 0 && wb >= 0 && wc >= 0;
}

function TriangleField({ weights, onChange }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const pos = baryToCart(weights[0], weights[1], weights[2]);

  const handlePointer = useCallback(
    (e) => {
      if (!dragging.current && e.type !== "pointerdown") return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const scaleX = SIZE / rect.width;
      const scaleY = (HEIGHT + PAD) / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      if (isInsideTriangle(x, y) || e.type === "pointerdown") {
        const [wa, wb, wc] = cartToBary(x, y);
        onChange([wa, wb, wc]);
      }
    },
    [onChange]
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${HEIGHT + PAD}`}
      style={{ width: "100%", maxWidth: 340, cursor: "crosshair", userSelect: "none" }}
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); handlePointer(e); }}
      onPointerMove={handlePointer}
      onPointerUp={() => { dragging.current = false; }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Fondo cálido */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="#F5EDD8"
        opacity="0.4"
      />

      {/* Líneas internas guía */}
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

      {/* Borde del triángulo */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Vértices — puntos */}
      {[A, B, C].map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={4} fill="#C9A84C" opacity="0.8" />
      ))}

      {/* Líneas desde vértices al punto */}
      {[A, B, C].map((v, i) => (
        <line
          key={i}
          x1={v.x} y1={v.y}
          x2={pos.x} y2={pos.y}
          stroke="#C9A84C"
          strokeWidth={0.8 + weights[i] * 1.8}
          strokeDasharray="3 4"
          opacity={0.2 + weights[i] * 0.5}
        />
      ))}

      {/* Halo del punto */}
      <circle cx={pos.x} cy={pos.y} r={22} fill="url(#glow)" />

      {/* Punto de posición */}
      <circle cx={pos.x} cy={pos.y} r={9} fill="#5C4A1E" opacity="0.9" />
      <circle cx={pos.x} cy={pos.y} r={5} fill="#C9A84C" />
    </svg>
  );
}

function WeightBar({ label, value, color }) {
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

export default function TriadaPercepcion() {
  const [step, setStep] = useState(0); // 0 = tríada 1, 1 = tríada 2, 2 = completado
  const [responses, setResponses] = useState([
    { weights: [0.333, 0.333, 0.334], narrativa: "" },
    { weights: [0.333, 0.333, 0.334], narrativa: "" },
  ]);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
  }, []);

  const triada = TRIADAS[step];
  const current = responses[step];
  const colors = ["#C9A84C", "#8B9E6F", "#7A8DB0"];

  const updateWeights = (weights) => {
    setResponses((prev) => prev.map((r, i) => i === step ? { ...r, weights } : r));
  };

  const updateNarrativa = (narrativa) => {
    setResponses((prev) => prev.map((r, i) => i === step ? { ...r, narrativa } : r));
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDFAF5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
        <div style={{ maxWidth: 480, padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 16 }}>✦</div>
          <h2 style={{ fontSize: 22, color: "#3D2B1A", fontWeight: 400, marginBottom: 12 }}>Ya estás adentro del campo</h2>
          <p style={{ color: "#8B6F3A", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            Tu posición quedó registrada. Lo que explorés a continuación ya sabe desde dónde venís.
          </p>
          <div style={{ background: "#F5EDD8", borderRadius: 12, padding: "20px 24px", textAlign: "left", marginBottom: 32 }}>
            {responses.map((r, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? 20 : 0 }}>
                <div style={{ fontSize: 11, color: "#C9A84C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{TRIADAS[i].geometria}</div>
                <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                  {TRIADAS[i].vertices.map((v, j) => (
                    <div key={j} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: colors[j] }}>{Math.round(r.weights[j] * 100)}%</div>
                      <div style={{ fontSize: 9, color: "#8B6F3A", lineHeight: 1.3 }}>{v.short}</div>
                    </div>
                  ))}
                </div>
                {r.narrativa && <p style={{ fontSize: 12, color: "#5C4A1E", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>"{r.narrativa}"</p>}
              </div>
            ))}
          </div>
          <button style={{ background: "#5C4A1E", color: "#FDFAF5", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 14, cursor: "pointer", letterSpacing: "0.04em" }}>
            Explorar los lentes →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDFAF5",
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(10px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      {/* Topbar */}
      <div style={{ width: "100%", borderBottom: "1px solid #E8DCC8", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FDFAF5" }}>
        <span style={{ fontSize: 12, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase" }}>Paradigma Aleph</span>
        <div style={{ display: "flex", gap: 6 }}>
          {TRIADAS.map((_, i) => (
            <div key={i} style={{ width: 24, height: 3, borderRadius: 2, background: i === step ? "#C9A84C" : i < step ? "#8B9E6F" : "#E8DCC8", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 460, width: "100%", padding: "36px 24px 60px" }}>
        {/* Encabezado */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            {step + 1} de {TRIADAS.length} · {triada.geometria}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 400, color: "#3D2B1A", lineHeight: 1.4, margin: 0 }}>
            {triada.pregunta}
          </h1>
          <p style={{ fontSize: 13, color: "#8B6F3A", marginTop: 10, lineHeight: 1.6 }}>
            Tocá o arrastrá tu punto dentro del campo.
          </p>
        </div>

        {/* Triángulo + vértices */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          {/* Label vértice top */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, whiteSpace: "pre-line", display: "inline-block" }}>
              {triada.vertices[0].label}
            </span>
          </div>

          <TriangleField weights={current.weights} onChange={updateWeights} />

          {/* Labels vértices bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingLeft: 8, paddingRight: 8 }}>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, whiteSpace: "pre-line", maxWidth: 100, display: "inline-block" }}>
              {triada.vertices[1].label}
            </span>
            <span style={{ fontSize: 11, color: "#5C4A1E", lineHeight: 1.4, whiteSpace: "pre-line", maxWidth: 100, textAlign: "right", display: "inline-block" }}>
              {triada.vertices[2].label}
            </span>
          </div>
        </div>

        {/* Barras de peso */}
        <div style={{ background: "#F5EDD8", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
          {triada.vertices.map((v, i) => (
            <WeightBar key={i} label={v.short} value={current.weights[i]} color={colors[i]} />
          ))}
        </div>

        {/* Micro-narrativa */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 12, color: "#8B6F3A", marginBottom: 8, letterSpacing: "0.04em" }}>
            ¿Qué te trajo a ese lugar? <span style={{ opacity: 0.6 }}>(opcional)</span>
          </label>
          <textarea
            value={current.narrativa}
            onChange={(e) => updateNarrativa(e.target.value)}
            placeholder="Una frase, una imagen, lo que sea que lo explique..."
            rows={3}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid #E8DCC8",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 14,
              color: "#3D2B1A",
              fontFamily: "'Georgia', serif",
              resize: "none",
              outline: "none",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Botón */}
        <button
          onClick={() => setStep((s) => s + 1)}
          style={{
            width: "100%",
            background: "#5C4A1E",
            color: "#FDFAF5",
            border: "none",
            borderRadius: 10,
            padding: "14px",
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: "0.04em",
            fontFamily: "'Georgia', serif",
          }}
        >
          {step === TRIADAS.length - 1 ? "Entrar al campo →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}
