import { useState } from "react";
import Icon from "../components/Icon.jsx";

const STRINGS = {
  en: {
    navHome: "Home",
    navFeatures: "Features",
    navAbout: "About",
    heroTag: "AI Project Planning Assistant",
    heroHeadline: "From Idea to Implementation.",
    heroSub: "Turn your raw ideas into structured, actionable software projects with AI.",
    cta: "Start Building",
    ctaHint: "Sign in with Google and your projects are saved to your account.",
    featuresHeading: "Everything you need to plan a project",
    features: [
      { icon: "idea", emoji: "💡", title: "Idea Generator", desc: "Transform your raw idea into a complete project concept." },
      { icon: "requirements", emoji: "📋", title: "Requirements Generator", desc: "Generate functional requirements automatically." },
      { icon: "techstack", emoji: "🛠️", title: "Tech Stack Advisor", desc: "Get technology recommendations based on your project." },
      { icon: "database", emoji: "🗄️", title: "Database Generator", desc: "Create a suggested database structure using AI." },
      { icon: "roadmap", emoji: "🗺️", title: "Development Roadmap", desc: "Break your project into manageable development stages." },
      { icon: "memory", emoji: "🧠", title: "AI Memory", desc: "Keep context throughout your project conversation." },
    ],
    about:
      "ProjectPilot AI is an AI-powered project planning assistant that helps students and developers move from \"I have an idea\" to \"I know how to start building it\" - with a conversational workspace that remembers your project context along the way.",
    footer: "ProjectPilot AI - built for AI Productivity & API Integration for Developers.",
  },
  id: {
    navHome: "Beranda",
    navFeatures: "Fitur",
    navAbout: "Tentang",
    heroTag: "Asisten Perencanaan Project AI",
    heroHeadline: "Dari Ide Menjadi Nyata.",
    heroSub: "Ubah ide mentahmu jadi rencana software yang terstruktur dan siap dikembangkan, dibantu AI.",
    cta: "Mulai Sekarang",
    ctaHint: "Masuk dengan Google dan project kamu tersimpan otomatis ke akunmu.",
    featuresHeading: "Semua yang kamu butuhkan buat merencanakan project",
    features: [
      { icon: "idea", emoji: "💡", title: "Idea Generator", desc: "Ubah ide mentahmu jadi konsep project yang lengkap." },
      { icon: "requirements", emoji: "📋", title: "Requirements Generator", desc: "Buat functional requirements secara otomatis." },
      { icon: "techstack", emoji: "🛠️", title: "Tech Stack Advisor", desc: "Dapatkan rekomendasi teknologi sesuai kebutuhan project-mu." },
      { icon: "database", emoji: "🗄️", title: "Database Generator", desc: "Buat rancangan struktur database pakai AI." },
      { icon: "roadmap", emoji: "🗺️", title: "Development Roadmap", desc: "Bagi project-mu jadi tahapan pengembangan yang jelas." },
      { icon: "memory", emoji: "🧠", title: "AI Memory", desc: "AI tetap ingat konteks project sepanjang percakapan." },
    ],
    about:
      "ProjectPilot AI adalah asisten perencanaan project berbasis AI yang membantu mahasiswa dan developer beranjak dari \"aku punya ide\" ke \"aku tau harus mulai dari mana\" - lewat workspace percakapan yang selalu ingat konteks project-mu.",
    footer: "ProjectPilot AI - dibuat untuk AI Productivity & API Integration for Developers.",
  },
};

export default function Home({ onStart }) {
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-navy/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-semibold text-xl text-navy tracking-tight">ProjectPilot</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-ink/70">
            <a href="#home" className="hover:text-navy">{t.navHome}</a>
            <a href="#features" className="hover:text-navy">{t.navFeatures}</a>
            <a href="#about" className="hover:text-navy">{t.navAbout}</a>
          </div>
          <div className="flex items-center rounded-full border border-navy/15 text-xs font-medium overflow-hidden">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-navy text-white" : "text-ink/60 hover:text-navy"
                }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("id")}
              className={`px-3 py-1.5 transition-colors ${lang === "id" ? "bg-navy text-white" : "text-ink/60 hover:text-navy"
                }`}
            >
              ID
            </button>
          </div>
        </div>
      </nav>

      <header
        id="home"
        className="relative overflow-hidden bg-blueprint-grid bg-grid"
        style={{ backgroundColor: "#14294A" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <p className="text-gridline text-xs tracking-wide font-medium mb-4">{t.heroTag}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-5">
              {t.heroHeadline}
            </h1>
            <p className="text-paper/70 text-base md:text-lg mb-8 max-w-md">{t.heroSub}</p>
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-redline hover:bg-redline-hover text-white font-medium px-6 py-3 transition-colors"
            >
              {t.cta}
            </button>
            <p className="text-paper/40 text-xs mt-3">{t.ctaHint}</p>
          </div>

          <img
            src="/logo.png"
            alt="ProjectPilot AI"
            className="w-full max-w-[280px] mx-auto object-contain"
          />
        </div>
      </header>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy mb-10 text-center">
          {t.featuresHeading}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {t.features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-navy/10 bg-white p-5 hover:border-redline/40 transition-colors"
            >
              <Icon name={f.icon} emoji={f.emoji} alt={f.title} className="w-7 h-7 mb-3" />
              <h3 className="font-display font-semibold text-navy mb-1">{f.title}</h3>
              <p className="text-sm text-ink/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <p className="text-ink/60 leading-relaxed">{t.about}</p>
      </section>

      <footer className="border-t border-navy/10 py-6 text-center text-xs text-ink/40">
        {t.footer}
      </footer>
    </div>
  );
}

function BlueprintDiagram() {
  return (
    <svg viewBox="0 0 420 260" className="w-full max-w-md mx-auto" role="img" aria-label="Idea to plan to build diagram">
      <g fill="none" stroke="#7FB8D0" strokeWidth="1.5" opacity="0.5">
        <line x1="30" y1="40" x2="150" y2="40" />
        <line x1="270" y1="40" x2="390" y2="40" />
        <line x1="150" y1="130" x2="270" y2="130" />
        <line x1="30" y1="220" x2="150" y2="220" />
        <line x1="270" y1="220" x2="390" y2="220" />
      </g>
      <path
        d="M90 55 L90 115 L210 115 L210 205"
        fill="none"
        stroke="#D6432E"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M210 115 L330 115 L330 205"
        fill="none"
        stroke="#D6432E"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      <NodeBox x="30" y="20" w="120" h="40" label="IDEA" />
      <NodeBox x="150" y="110" w="120" h="40" label="PLAN" />
      <NodeBox x="30" y="200" w="120" h="40" label="REQUIREMENTS" small />
      <NodeBox x="270" y="200" w="120" h="40" label="BUILD" />
    </svg>
  );
}

function NodeBox({ x, y, w, h, label, small }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#1F3A63" stroke="#7FB8D0" strokeWidth="1" />
      <text
        x={Number(x) + Number(w) / 2}
        y={Number(y) + Number(h) / 2 + 4}
        textAnchor="middle"
        fill="#F5F3EE"
        fontSize={small ? "9" : "11"}
        fontFamily="'IBM Plex Mono', monospace"
        letterSpacing="1"
      >
        {label}
      </text>
    </g>
  );
}