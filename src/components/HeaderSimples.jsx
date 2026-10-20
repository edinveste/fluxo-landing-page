import React from "react";

export function Logo({ size = "md", onVoltar }) {
  const box = size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  const word = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <a
      href="/"
      onClick={(e) => {
        if (onVoltar) {
          e.preventDefault();
          onVoltar();
        }
      }}
      className="flex items-center gap-3 group"
    >
      <div
        className={`${box} rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105`}
      >
        <img
          src="/favicon.png"
          alt="Fluxo"
          className="w-full h-full object-cover"
        />
      </div>
      <span
        className={`${word} font-black tracking-tight text-slate-800 dark:text-white`}
      >
        Fluxo
      </span>
    </a>
  );
}

export function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-label="Alternar tema"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors
                 border-slate-200 bg-white text-slate-600 hover:bg-slate-50
                 dark:border-slate-700 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800 cursor-pointer"
    >
      <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
    </button>
  );
}

export default function HeaderSimples({ dark, onToggleTheme, onVoltar }) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <div onClick={onVoltar} className="cursor-pointer">
          <Logo onVoltar={onVoltar} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <button
            onClick={onVoltar}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Voltar ao início</span>
          </button>
        </div>
      </div>
    </header>
  );
}
