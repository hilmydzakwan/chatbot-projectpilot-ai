import { useState } from "react";

const PERSONAS = [
  { value: "mentor", label: "Mentor", hint: "Educational, explains the why" },
  { value: "developer", label: "Developer", hint: "Technical, peer-to-peer" },
  { value: "quick", label: "Quick", hint: "Short and to the point" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const LANGUAGES = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
];

const PROJECT_TYPES = [
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile Application" },
  { value: "desktop", label: "Desktop Application" },
  { value: "ai", label: "AI Application" },
  { value: "iot", label: "IoT Project" },
  { value: "data", label: "Data Analytics" },
  { value: "game", label: "Game" },
];

const INFO_TEXT = {
  persona:
    "Ini menentukan GAYA BICARA AI. Mentor = jelasin sambil ngajarin (cocok kalau kamu masih belajar). Developer = to-the-point, ngobrol teknis kayak sesama engineer. Quick = jawaban singkat, nggak banyak basa-basi.",
  experienceLevel:
    "Ini menentukan SEBERAPA DALAM istilah teknis yang dipakai AI. Beginner = istilah teknis dijelasin ulang. Intermediate = anggap kamu udah paham dasar pemrograman. Advanced = langsung pakai istilah developer tanpa banyak penjelasan.",
};

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-label="Info"
        className="w-4 h-4 rounded-full bg-navy/15 text-navy text-[10px] font-bold leading-4 text-center hover:bg-navy/25"
      >
        i
      </button>
      {open && (
        <span className="absolute z-10 left-1/2 -translate-x-1/2 top-6 w-64 bg-navy text-paper text-xs leading-relaxed rounded-lg px-3 py-2.5 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function RadioGroup({ title, name, options, value, onChange, columns = 1, info }) {
  return (
    <fieldset className="mb-6">
      <legend className="font-display text-sm font-semibold text-navy mb-2 flex items-center">
        {title}
        {info && <InfoTooltip text={info} />}
      </legend>
      <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
              value === opt.value
                ? "border-redline bg-redline/5 text-navy"
                : "border-navy/10 text-ink/80 hover:border-navy/25"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 accent-redline"
            />
            <span>
              <span className="font-medium block">{opt.label}</span>
              {opt.hint && <span className="text-xs text-ink/50">{opt.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SettingsPanel({ settings, onChange, onClose, onSave, isNewProject }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md h-full bg-paper shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10 bg-white">
          <h2 className="font-display text-lg font-semibold text-navy">
            {isNewProject ? "Setup AI untuk project ini" : "Settings"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/50 hover:text-ink text-xl leading-none"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-ink/60 mb-6 leading-relaxed bg-navy/5 border border-navy/10 rounded-lg px-3 py-2.5">
            {isNewProject
              ? "Atur dulu gaya AI buat project baru ini. Klik ikon (i) kalau bingung maksud tiap pilihan. Pengaturan ini melekat ke project ini terus, nggak ke project lain."
              : "Pengaturan ini melekat ke project yang sedang dibuka dan tersimpan otomatis - nggak reset walau browser ditutup. Klik ikon (i) kalau bingung maksud tiap pilihan."}
          </p>

          <RadioGroup
            title="AI Persona"
            name="persona"
            options={PERSONAS}
            value={settings.persona}
            onChange={(v) => onChange({ ...settings, persona: v })}
            info={INFO_TEXT.persona}
          />
          <RadioGroup
            title="Experience Level"
            name="experienceLevel"
            options={EXPERIENCE_LEVELS}
            value={settings.experienceLevel}
            onChange={(v) => onChange({ ...settings, experienceLevel: v })}
            columns={2}
            info={INFO_TEXT.experienceLevel}
          />
          <RadioGroup
            title="Language"
            name="language"
            options={LANGUAGES}
            value={settings.language}
            onChange={(v) => onChange({ ...settings, language: v })}
            columns={2}
          />
          <RadioGroup
            title="Project Type"
            name="projectType"
            options={PROJECT_TYPES}
            value={settings.projectType}
            onChange={(v) => onChange({ ...settings, projectType: v })}
            columns={2}
          />

          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-lg bg-navy hover:bg-navy-light text-white font-medium text-sm py-2.5 transition-colors"
          >
            {isNewProject ? "Simpan & Mulai Chat" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}