import React, { useEffect, useRef, useState } from "react";

/**
 * LANDING PAGE — Aventura Educativa (estilo voxel/gamer, sin assets oficiales)
 * React + TypeScript + Tailwind CSS — mobile-first, una sola página, sin dependencias pesadas.
 *
 * ⚠️ Antes de publicar:
 * 1) Reemplaza CHECKOUT_URL por tu link real de pago.
 * 2) Ajusta los precios de la sección OFERTA.
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const CHECKOUT_URL =
  "https://pay.hotmart.com/V107201272V?checkoutMode=10&sck=facebook";
const META_PIXEL_ID = "1706278740498413";

// Guards a nivel de módulo para evitar eventos duplicados (StrictMode / remounts)
let pixelBooted = false;
let pageViewFired = false;

function injectMetaPixel() {
  if (pixelBooted || typeof window === "undefined") return;
  pixelBooted = true;

  (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function (...args: any[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", META_PIXEL_ID);
}

/* ---------- Bloque voxel decorativo (signature visual) ---------- */
function Block({
  size = 40,
  from,
  to,
  className = "",
  style = {},
}: {
  size?: number;
  from: string;
  to: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-md ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        boxShadow:
          "inset 3px 3px 0 rgba(255,255,255,0.35), inset -3px -3px 0 rgba(0,0,0,0.28)",
        ...style,
      }}
    />
  );
}

/* ---------- Botón CTA tipo "bloque presionable" ---------- */
function CTAButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden font-display font-extrabold uppercase tracking-wide rounded-xl border-4 border-[#062D16] bg-gradient-to-b from-[#7CFF76] via-[#43D95E] to-[#16A83A] text-[#062D16] shadow-[0_8px_0_#064F20,0_12px_24px_rgba(0,0,0,.45),0_0_25px_rgba(74,222,128,.30)] hover:brightness-110 hover:-translate-y-1 active:translate-y-[6px] active:shadow-[0_2px_0_#064F20] transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Mockup de producto (100% CSS, sin imágenes externas) ---------- */
function ProductMockup({ size = "lg" }: { size?: "lg" | "sm" }) {
  const big = size === "lg";

  return (
    <div
      className={`relative mx-auto ${
        big ? "w-[280px] h-[360px]" : "w-[190px] h-[250px]"
      }`}
    >
      {/* páginas atrás */}
      <img
        src="/assets/atividade-labirinto.jpg"
        alt="Actividad de laberinto"
        className={`absolute ${
          big ? "w-[170px]" : "w-[115px]"
        } left-0 top-8 -rotate-12 rounded-xl border-4 border-white shadow-2xl`}
      />

      <img
        src="/assets/atividade-codigo-secreto.jpg"
        alt="Actividad de código secreto"
        className={`absolute ${
          big ? "w-[170px]" : "w-[115px]"
        } right-0 top-5 rotate-12 rounded-xl border-4 border-white shadow-2xl`}
      />

      <img
        src="/assets/atividade-diferencas.jpg"
        alt="Actividad de diferencias"
        className={`absolute ${
          big ? "w-[155px]" : "w-[105px]"
        } left-1/2 top-2 -translate-x-1/2 rotate-3 rounded-xl border-4 border-white shadow-2xl`}
      />

      {/* capa principal */}
      <img
        src="/assets/capa.jpg"
        alt="Aventura educativa"
        className={`absolute left-1/2 bottom-0 -translate-x-1/2 ${
          big ? "w-[190px]" : "w-[130px]"
        } rounded-2xl border-4 border-[#0B2818] shadow-[0_18px_40px_rgba(0,0,0,.45)] z-20`}
      />

      {/* glow atrás */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-44 h-44 bg-yellow-300/30 blur-3xl rounded-full" />

      {/* blocos decorativos */}
      <Block
        from="#F4B93E"
        to="#C9860F"
        size={big ? 34 : 24}
        className="absolute top-0 left-2 rotate-12 z-30"
      />

      <Block
        from="#38BDF8"
        to="#0E7EB8"
        size={big ? 30 : 20}
        className="absolute bottom-6 right-0 -rotate-12 z-30"
      />
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const offerRef = useRef<HTMLDivElement | null>(null);
  const viewContentFired = useRef(false);

  // Meta Pixel: init + PageView (una sola vez)
  useEffect(() => {
    injectMetaPixel();
    const t = setTimeout(() => {
      if (window.fbq && !pageViewFired) {
        window.fbq("track", "PageView");
        pageViewFired = true;
      }
    }, 250);
    return () => clearTimeout(t);
  }, []);

  // ViewContent al ver la sección de oferta (una sola vez)
  useEffect(() => {
    const el = offerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewContentFired.current) {
            viewContentFired.current = true;
            if (window.fbq) window.fbq("track", "ViewContent");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCheckout = () => {
  if (window.fbq) {
    window.fbq("track", "InitiateCheckout");
  }

  const currentParams = new URLSearchParams(window.location.search);
  const checkoutUrl = new URL(CHECKOUT_URL);

  currentParams.forEach((value, key) => {
    checkoutUrl.searchParams.set(key, value);
  });

  window.location.href = checkoutUrl.toString();
};

  const faqs = [
    {
      q: "¿Cómo recibo el material?",
      a: "Al confirmar tu compra recibes acceso inmediato por correo electrónico, para usar desde el celular, tablet o computadora.",
    },
    {
      q: "¿Es un pago único?",
      a: "Sí. Pagas una sola vez y el acceso es tuyo, sin mensualidades ni cargos ocultos.",
    },
    {
      q: "¿Puedo imprimir las actividades?",
      a: "Claro, el material está pensado para usarse en pantalla o imprimirse las veces que quieras.",
    },
    {
      q: "¿Para qué edades está recomendado?",
      a: "Las actividades están diseñadas para niños y niñas de 5 a 10 años, con niveles de dificultad progresivos.",
    },
  ];

  return (
    <div className="font-body bg-[#0B2818] text-[#F5F1E6] min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@600;800;900&family=Inter:wght@400;500;600;700&display=swap');
        .font-display{font-family:'Rubik',ui-sans-serif,system-ui,sans-serif;}
        .font-body{font-family:'Inter',ui-sans-serif,system-ui,sans-serif;}
        .block-grid{
          background-image:
            linear-gradient(rgba(245,241,230,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,241,230,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* ============ 1. HERO ============ */}
      <section
  className="relative overflow-hidden px-5 pt-10 pb-12 text-center bg-cover bg-center"
  style={{
  backgroundImage:
    "linear-gradient(180deg, rgba(1,10,18,.58) 0%, rgba(2,18,13,.28) 34%, rgba(2,18,12,.16) 62%, rgba(1,12,8,.82) 100%), url('/assets/hero-voxel-bg.png')",
  backgroundPosition: "center center",
  backgroundSize: "cover",
}}
>
  {/* SOMBRA PARA O TEXTO CONTINUAR LEGÍVEL */}
<div
  className="pointer-events-none absolute left-1/2 top-[43%] h-[460px] w-[460px] -translate-x-1/2 rounded-full"
  style={{
    background:
      "radial-gradient(circle, rgba(255,210,70,.50) 0%, rgba(255,190,40,.18) 34%, transparent 68%)",
  }}
/>

{/* LUZ ATRÁS DO PRODUTO */}
<div
  className="pointer-events-none absolute left-1/2 top-[44%] h-[400px] w-[400px] -translate-x-1/2 rounded-full"
  style={{
    background:
      "radial-gradient(circle, rgba(255,205,55,.38) 0%, rgba(255,185,35,.14) 38%, transparent 70%)",
  }}
/>
{/* LUZ / DEGRADÊ DO HERO */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  <div
    className="absolute left-1/2 top-[38%] h-[430px] w-[430px] -translate-x-1/2 rounded-full"
    style={{
      background:
        "radial-gradient(circle, rgba(74,222,128,.25) 0%, rgba(74,222,128,.08) 42%, transparent 72%)",
    }}
  />

  <div
    className="absolute left-1/2 top-[47%] h-[300px] w-[300px] -translate-x-1/2 rounded-full blur-3xl"
    style={{
      background: "rgba(244,185,62,.12)",
    }}
  />

  <div
    className="absolute inset-0"
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.30) 100%)",
    }}
  />

</div>
        <Block from="#F4B93E" to="#C9860F" size={30} className="absolute top-6 left-4 rotate-12 opacity-90" />
        <Block from="#38BDF8" to="#0E7EB8" size={22} className="absolute top-20 right-6 -rotate-6 opacity-80" />
        <Block from="#4ADE80" to="#1B9C46" size={26} className="absolute bottom-6 left-8 -rotate-12 opacity-70" />
{/* SOMBRA SUAVE ATRÁS DO TEXTO */}
<div
  className="pointer-events-none absolute left-1/2 top-6 h-[260px] w-[110%] -translate-x-1/2"
  style={{
    background:
      "radial-gradient(ellipse at center, rgba(0,10,20,.68) 0%, rgba(0,10,20,.38) 45%, transparent 75%)",
  }}
/>\
        <span className="relative z-10 inline-flex items-center gap-2 font-display font-bold text-xs bg-[#F4B93E] text-[#0B2818] px-4 py-2 rounded-full border-2 border-[#0B2818] shadow-[0_3px_0_#0B2818]">
          🎮 AVENTURA EDUCATIVA
        </span>

        <h1 className="relative z-10 font-display font-black uppercase text-3xl leading-tight mt-5 max-w-md mx-auto drop-shadow-[0_4px_0_rgba(0,0,0,.75)]">
          ¡Aprender ahora se siente <span className="text-[#4ADE80]">como jugar</span>!
        </h1>

        <p className="relative z-10 mt-3 text-sm text-[#F5F1E6] max-w-xs mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,.9)]">
          Actividades, desafíos y aventuras creadas para aprender mientras se divierten.
        </p>

        <div className="mt-7">
          <ProductMockup size="lg" />
        </div>

        <div className="flex justify-center gap-4 mt-6 text-xs font-display font-bold text-[#F5F1E6]/90">
          <span>🧠 Lógica</span>
          <span>🎨 Creatividad</span>
          <span>🧩 Desafíos</span>
        </div>

        <CTAButton onClick={handleCheckout} className="mt-6 w-full max-w-xs mx-auto py-4 text-base">
          🔓 Desbloquear ahora
        </CTAButton>
      </section>

     {/* ============ 2. PROBLEMA + SOLUCIÓN ============ */}
<section className="relative overflow-hidden px-5 py-12 text-center bg-gradient-to-b from-[#163f28] via-[#102c1d] to-[#091d14]">

  {/* decoração estilo caverna */}
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="absolute top-0 left-0 w-24 h-24 bg-[#3b4c3b] rotate-12" />
    <div className="absolute top-20 right-0 w-20 h-20 bg-[#27362b] -rotate-12" />
    <div className="absolute bottom-8 left-8 w-16 h-16 bg-[#38513e]" />
  </div>

  <div className="relative z-10 max-w-md mx-auto">

    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#0B2818] border-2 border-[#4ADE80]/30 text-xs font-display font-bold text-[#4ADE80] shadow-[0_4px_0_rgba(0,0,0,.35)]">
      🎮 MISIÓN: APRENDER
    </span>

    <h2 className="font-display font-black text-2xl leading-tight mt-5 text-[#F5F1E6]">
      ¿Tu hijo ama los juegos pero se aburre cuando llega la hora de aprender?
    </h2>

    <p className="mt-4 text-sm leading-relaxed text-[#F5F1E6]/75">
      Convierte el aprendizaje en misiones, desafíos y aventuras que despiertan su curiosidad.
    </p>

    {/* comparação */}
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-8">

      {/* lado ruim */}
      <div className="relative overflow-hidden rounded-xl border-2 border-[#59645c] bg-[#121a16] px-3 py-5 opacity-75 shadow-[0_6px_0_#07110c]">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10">
          <p className="text-3xl grayscale">📱</p>
          <p className="font-display font-bold text-[11px] mt-2 text-[#c5cec7]">
            SOLO PANTALLA
          </p>
          <div className="mt-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-black">
            ✕
          </div>
        </div>
      </div>

      {/* seta */}
      <div className="font-display text-3xl font-black text-[#F4B93E] drop-shadow-md">
        ➜
      </div>

      {/* lado bom */}
      <div className="relative overflow-hidden rounded-xl border-2 border-[#4ADE80] bg-gradient-to-b from-[#205f37] to-[#123B24] px-3 py-5 shadow-[0_6px_0_#071b10,0_0_20px_rgba(74,222,128,.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4ADE80]/10 to-transparent" />

        <div className="relative z-10">
          <p className="text-3xl">🎮</p>
          <p className="font-display font-bold text-[11px] mt-2 text-[#4ADE80]">
            APRENDER JUGANDO
          </p>
          <div className="mt-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#4ADE80] text-[#0B2818] font-black">
            ✓
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


{/* ============ 3. MOSTRAR EL PRODUCTO ============ */}
<section className="relative overflow-hidden px-5 py-12 bg-[#081b12] text-center">

  {/* textura/grid do mundo */}
  <div
    className="absolute inset-0 opacity-[0.08]"
    style={{
      backgroundImage:
        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
      backgroundSize: "30px 30px",
    }}
  />

  <div className="relative z-10 max-w-md mx-auto">

    <span className="font-display font-bold text-xs text-[#4ADE80] uppercase tracking-widest">
      🌍 Mundos desbloqueados
    </span>

    <h2 className="font-display font-black text-2xl uppercase mt-2 text-[#F5F1E6]">
      Todo un mundo de aventuras
    </h2>

    <p className="mt-3 text-sm text-[#F5F1E6]/65">
      Explora diferentes desafíos y actividades mientras avanzan de misión en misión.
    </p>

    {/* cards com páginas reais */}
    <div className="grid grid-cols-2 gap-4 mt-8">

      {/* Lógica */}
      <div className="group overflow-hidden rounded-xl border-2 border-[#315b39] bg-[#102c1d] shadow-[0_6px_0_#05150c] transition hover:-translate-y-1">

        <div className="bg-gradient-to-b from-[#4ADE80] to-[#23984a] py-2 px-2">
          <p className="font-display font-black text-xs text-[#0B2818]">
            🧠 LÓGICA
          </p>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <img
            src="/assets/atividade-codigo-secreto.jpg"
            alt="Actividad de lógica"
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          />

          <span className="absolute bottom-2 left-2 rounded-md bg-[#0B2818]/90 px-2 py-1 text-[9px] font-display font-bold text-[#4ADE80]">
            ✓ DESBLOQUEADO
          </span>
        </div>
      </div>

      {/* Matemáticas */}
      <div className="group overflow-hidden rounded-xl border-2 border-[#27647b] bg-[#0c2932] shadow-[0_6px_0_#05150c] transition hover:-translate-y-1">

        <div className="bg-gradient-to-b from-[#38BDF8] to-[#1180b4] py-2 px-2">
          <p className="font-display font-black text-xs text-[#062434]">
            🔢 MATEMÁTICAS
          </p>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <img
            src="/assets/atividade-labirinto.jpg"
            alt="Actividad de matemáticas"
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          />

          <span className="absolute bottom-2 left-2 rounded-md bg-[#0B2818]/90 px-2 py-1 text-[9px] font-display font-bold text-[#38BDF8]">
            ✓ DESBLOQUEADO
          </span>
        </div>
      </div>

      {/* Desafíos */}
      <div className="group overflow-hidden rounded-xl border-2 border-[#8f671c] bg-[#392c10] shadow-[0_6px_0_#05150c] transition hover:-translate-y-1">

        <div className="bg-gradient-to-b from-[#F4B93E] to-[#C9860F] py-2 px-2">
          <p className="font-display font-black text-xs text-[#382407]">
            🧩 DESAFÍOS
          </p>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <img
            src="/assets/atividade-diferencas.jpg"
            alt="Actividad de desafíos"
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          />

          <span className="absolute bottom-2 left-2 rounded-md bg-[#0B2818]/90 px-2 py-1 text-[9px] font-display font-bold text-[#F4B93E]">
            ✓ DESBLOQUEADO
          </span>
        </div>
      </div>

      {/* Creatividad */}
      <div className="relative overflow-hidden rounded-xl border-2 border-[#3b6c52] bg-gradient-to-br from-[#143c27] to-[#092017] shadow-[0_6px_0_#05150c]">

        <div className="bg-gradient-to-b from-[#56e4ba] to-[#1ba77c] py-2 px-2">
          <p className="font-display font-black text-xs text-[#063428]">
            🎨 CREATIVIDAD
          </p>
        </div>

        <div className="aspect-[3/4] flex flex-col items-center justify-center px-3">
          <div className="text-5xl">🎨</div>

          <p className="font-display text-xs font-black text-[#F5F1E6] mt-4">
            CREA Y EXPLORA
          </p>

          <p className="text-[10px] text-[#F5F1E6]/60 mt-2">
            Actividades para imaginar, resolver y crear.
          </p>

          <span className="mt-4 rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-2 py-1 text-[9px] font-display font-bold text-[#4ADE80]">
            ✓ DESBLOQUEADO
          </span>
        </div>
      </div>

    </div>

    {/* benefícios */}
    <div className="grid grid-cols-3 gap-2 mt-8">

      <div className="rounded-lg border border-[#4ADE80]/20 bg-[#123B24] py-3 px-1">
        <div className="text-xl">⚡</div>
        <p className="font-display text-[9px] font-bold mt-1">
          ACCESO DIGITAL
        </p>
      </div>

      <div className="rounded-lg border border-[#38BDF8]/20 bg-[#102d35] py-3 px-1">
        <div className="text-xl">🎮</div>
        <p className="font-display text-[9px] font-bold mt-1">
          FÁCIL DE USAR
        </p>
      </div>

      <div className="rounded-lg border border-[#F4B93E]/20 bg-[#392c10] py-3 px-1">
        <div className="text-xl">🏆</div>
        <p className="font-display text-[9px] font-bold mt-1">
          MUY DIVERTIDO
        </p>
      </div>

    </div>
  </div>
</section>

     {/* ============ 4. BENEFICIOS ============ */}
<section className="relative overflow-hidden px-5 py-12 bg-gradient-to-b from-[#123B24] via-[#0d2c1b] to-[#081b12]">

  {/* textura gamer */}
  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />

  <div className="relative z-10 max-w-md mx-auto">

    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-md border border-[#4ADE80]/30 bg-[#0B2818] px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-[#4ADE80] shadow-[0_3px_0_#05150c]">
        ⚔️ Mejora tus habilidades
      </span>

      <h2 className="font-display font-black text-2xl uppercase mt-4 text-[#F5F1E6]">
        Aprende. Juega. <span className="text-[#F4B93E]">Avanza.</span>
      </h2>

      <p className="mt-3 text-sm text-[#F5F1E6]/65">
        Cada actividad se convierte en una nueva habilidad por desarrollar.
      </p>
    </div>

    {/* painel de atributos */}
    <div className="grid grid-cols-2 gap-3 mt-8">

      <div className="rounded-xl border-2 border-[#315b39] bg-[#0B2818] p-4 shadow-[0_5px_0_#05150c]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#4ADE80]/30 bg-[#4ADE80]/10 text-2xl">
            🧠
          </div>

          <div className="text-left">
            <p className="font-display text-[11px] font-black uppercase text-white">
              Razonamiento
            </p>

            <div className="mt-1 flex gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#F4B93E] text-[10px]">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-[#315b39] bg-[#0B2818] p-4 shadow-[0_5px_0_#05150c]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-2xl">
            🎯
          </div>

          <div className="text-left">
            <p className="font-display text-[11px] font-black uppercase text-white">
              Concentración
            </p>

            <div className="mt-1 flex gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#F4B93E] text-[10px]">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-[#315b39] bg-[#0B2818] p-4 shadow-[0_5px_0_#05150c]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#F4B93E]/30 bg-[#F4B93E]/10 text-2xl">
            🎨
          </div>

          <div className="text-left">
            <p className="font-display text-[11px] font-black uppercase text-white">
              Creatividad
            </p>

            <div className="mt-1 flex gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#F4B93E] text-[10px]">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-[#315b39] bg-[#0B2818] p-4 shadow-[0_5px_0_#05150c]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#A78BFA]/30 bg-[#A78BFA]/10 text-2xl">
            🧩
          </div>

          <div className="text-left">
            <p className="font-display text-[11px] font-black uppercase leading-tight text-white">
              Resolución
            </p>

            <div className="mt-1 flex gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#F4B93E] text-[10px]">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* XP */}
    <div className="mt-8 rounded-xl border-2 border-[#315b39] bg-[#091d14] p-4 shadow-[0_6px_0_#05150c]">

      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-[11px] font-black uppercase text-[#F4B93E]">
          ⚡ Nivel de diversión
        </p>

        <p className="font-display text-xs font-black text-[#4ADE80]">
          100%
        </p>
      </div>

      <div className="h-5 overflow-hidden rounded-md border-2 border-[#05150c] bg-[#06150c] shadow-inner">
        <div className="h-full w-full bg-gradient-to-r from-[#1FA23D] via-[#4ADE80] to-[#7CFF76] shadow-[0_0_15px_rgba(74,222,128,.45)]" />
      </div>

      <div className="mt-3 flex justify-between text-[9px] font-display font-bold text-[#F5F1E6]/40">
        <span>NIVEL 1</span>
        <span>MISIÓN COMPLETADA 🏆</span>
      </div>
    </div>

  </div>
</section>

     {/* ============ 5. OFERTA ============ */}
<section
  ref={offerRef}
  className="relative overflow-hidden px-5 py-14 text-center bg-gradient-to-b from-[#071b12] via-[#12351f] to-[#081b12] border-y-4 border-[#F4B93E]"
>
  {/* GRID / TEXTURA */}
  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />

  {/* GLOW DOURADO */}
  <div className="absolute left-1/2 top-44 h-64 w-64 -translate-x-1/2 rounded-full bg-[#F4B93E]/10 blur-3xl" />

  {/* DECORAÇÕES */}
  <Block
    from="#F4B93E"
    to="#C9860F"
    size={26}
    className="absolute top-7 right-6 rotate-12"
  />

  <Block
    from="#38BDF8"
    to="#0E7EB8"
    size={20}
    className="absolute top-[390px] right-8 -rotate-12"
  />

  <Block
    from="#4ADE80"
    to="#1B9C46"
    size={22}
    className="absolute bottom-8 left-5 -rotate-12"
  />

  <div className="relative z-10 mx-auto max-w-md">

    {/* LABEL */}
    <span className="inline-flex items-center gap-2 rounded-md border border-[#F4B93E]/40 bg-[#251b08] px-4 py-2 font-display text-[10px] font-black uppercase tracking-widest text-[#F4B93E] shadow-[0_4px_0_#050b07]">
      🏆 RECOMPENSA DESBLOQUEADA
    </span>

    {/* TÍTULO */}
    <h2 className="mt-5 font-display text-3xl font-black uppercase leading-tight text-[#F5F1E6]">
      Desbloquea la
      <span className="block text-[#F4B93E]">
        aventura completa
      </span>
    </h2>

    <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#F5F1E6]/65">
      Todo lo que necesita para aprender, resolver desafíos y divertirse en una sola aventura.
    </p>

    {/* PRODUTO */}
    <div className="relative mt-7 flex justify-center">
      <div className="absolute bottom-10 left-1/2 h-44 w-56 -translate-x-1/2 rounded-full bg-[#F4B93E]/20 blur-3xl" />

      <div className="relative z-10 scale-105">
        <ProductMockup size="sm" />
      </div>
    </div>

    {/* PAINEL DO QUE RECEBE */}
    <div className="relative mt-7 overflow-hidden rounded-2xl border-2 border-[#5b4720] bg-[#0B2818] text-left shadow-[0_8px_0_#041009]">

      {/* topo painel */}
      <div className="border-b-2 border-[#5b4720] bg-gradient-to-r from-[#5a3c16] via-[#8b6323] to-[#5a3c16] px-4 py-3 text-center">
        <p className="font-display text-xs font-black uppercase text-[#FFF2C5]">
          🎒 TU AVENTURA INCLUYE
        </p>
      </div>

      <div className="space-y-3 p-5">

        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#4ADE80] text-xs font-black text-[#092014]">
            ✓
          </span>

          <p className="text-sm leading-relaxed text-[#F5F1E6]">
            Actividades de lógica, matemáticas, desafíos y creatividad
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#4ADE80] text-xs font-black text-[#092014]">
            ✓
          </span>

          <p className="text-sm leading-relaxed text-[#F5F1E6]">
            Acceso digital inmediato
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#4ADE80] text-xs font-black text-[#092014]">
            ✓
          </span>

          <p className="text-sm leading-relaxed text-[#F5F1E6]">
            Ideal para imprimir o usar en pantalla
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#4ADE80] text-xs font-black text-[#092014]">
            ✓
          </span>

          <p className="text-sm leading-relaxed text-[#F5F1E6]">
            Pago único, sin mensualidades
          </p>
        </div>

      </div>
    </div>

    {/* PREÇO */}
    <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-[#F4B93E]/60 bg-gradient-to-b from-[#251b08] to-[#120e06] px-5 py-6 shadow-[0_8px_0_#040804,0_0_30px_rgba(244,185,62,.10)]">

      <p className="font-display text-[10px] font-bold uppercase tracking-widest text-[#F4B93E]">
        🔓 DESBLOQUEA TODO HOY
      </p>

      <div className="mt-4 flex items-end justify-center gap-3">

        <div className="pb-1 text-right">
          <p className="text-[10px] uppercase text-[#F5F1E6]/40">
            Antes
          </p>

          <span className="text-base font-black text-[#F5F1E6]/40 line-through">
            MX$ 199
          </span>
        </div>

        <div>
          <p className="text-[10px] uppercase text-[#F4B93E]">
            Ahora
          </p>

          <span className="font-display text-4xl font-black text-[#F4B93E] drop-shadow-md">
            MX$ 65.50
          </span>
        </div>

      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#F5F1E6]/55">
        <span>✓ Pago único</span>
        <span>•</span>
        <span>⚡ Acceso inmediato</span>
      </div>

    </div>

    {/* CTA */}
    <CTAButton
      onClick={handleCheckout}
      className="mt-7 w-full py-5 text-base animate-pulse"
    >
      🎮 QUIERO DESBLOQUEARLO
    </CTAButton>

    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#F5F1E6]/45">
      <span>🔒 Compra segura</span>
      <span>•</span>
      <span>⚡ Acceso digital</span>
    </div>

  </div>
</section>

     {/* ============ 6. FAQ + CTA FINAL ============ */}
<section className="relative overflow-hidden px-5 py-12 bg-gradient-to-b from-[#081b12] via-[#0c2a1b] to-[#071810]">

  {/* textura */}
  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />

  <div className="relative z-10 max-w-md mx-auto">

    <div className="text-center">
      <span className="inline-flex items-center rounded-md border border-[#4ADE80]/25 bg-[#0B2818] px-3 py-1.5 font-display text-[10px] font-black uppercase tracking-widest text-[#4ADE80] shadow-[0_3px_0_#041009]">
        📜 MENÚ DE AYUDA
      </span>

      <h2 className="mt-4 font-display text-2xl font-black uppercase text-[#F5F1E6]">
        Preguntas frecuentes
      </h2>
    </div>

    {/* FAQ */}
    <div className="mt-7 space-y-3">
      {faqs.map((f, i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-xl border-2 transition-all ${
            openFaq === i
              ? "border-[#4ADE80] bg-[#123B24] shadow-[0_5px_0_#041009,0_0_18px_rgba(74,222,128,.08)]"
              : "border-[#315b39] bg-[#0B2818] shadow-[0_4px_0_#041009]"
          }`}
        >
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#4ADE80]/20 bg-[#4ADE80]/10 text-sm">
                {i === 0 ? "📩" : i === 1 ? "💰" : i === 2 ? "🖨️" : "👦"}
              </span>

              <span className="font-display text-sm font-black text-[#F5F1E6]">
                {f.q}
              </span>
            </div>

            <span
              className={`font-display text-lg font-black ${
                openFaq === i ? "text-[#F4B93E]" : "text-[#4ADE80]"
              }`}
            >
              {openFaq === i ? "−" : "+"}
            </span>
          </button>

          {openFaq === i && (
            <div className="border-t border-[#4ADE80]/10 px-4 pb-4 pt-3">
              <p className="text-sm leading-relaxed text-[#F5F1E6]/70">
                {f.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* CTA FINAL */}
    <div className="relative mt-12 overflow-hidden rounded-2xl border-2 border-[#315b39] bg-gradient-to-b from-[#154c2a] via-[#0d3520] to-[#071b12] px-5 py-9 text-center shadow-[0_8px_0_#041009]">

      <div className="absolute -top-5 -left-5 h-20 w-20 rounded-full bg-[#4ADE80]/10 blur-2xl" />
      <div className="absolute -bottom-6 -right-4 h-24 w-24 rounded-full bg-[#F4B93E]/10 blur-2xl" />

      <div className="relative z-10">

        <span className="inline-flex items-center rounded-md border border-[#F4B93E]/30 bg-[#251b08] px-3 py-1.5 font-display text-[10px] font-black uppercase tracking-widest text-[#F4B93E]">
          🏁 NUEVA MISIÓN
        </span>

        <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight text-[#F5F1E6]">
          ¿Listos para la
          <span className="block text-[#4ADE80]">
            próxima misión?
          </span>
        </h3>

        <p className="mx-auto mt-3 max-w-xs text-sm text-[#F5F1E6]/65">
          Desbloquea todas las actividades y empieza la aventura ahora.
        </p>

        <CTAButton
          onClick={handleCheckout}
          className="mt-6 w-full py-5 text-base"
        >
          🎮 EMPEZAR LA AVENTURA
        </CTAButton>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#F5F1E6]/45">
          <span>🔒 Compra segura</span>
          <span>•</span>
          <span>⚡ Acceso inmediato</span>
        </div>

      </div>
    </div>

  </div>
</section>
    </div>
  );
}
