import React, { useState } from "react";
import { Sparkles, HelpCircle, Scale, Plus, X, ArrowRight } from "lucide-react";

interface DilemmaFormProps {
  onSubmit: (dilemma: string, context: string, metrics: string[]) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    title: "Career Pivot: Corporate vs. Starting a Business",
    dilemma: "Should I resign from my secure corporate job to launch my own independent freelance agency?",
    context: "I have 6 years in corporate marketing. I've saved 6 months of living expenses, but I have a mortgage and value financial stability. My corporate job is draining my creativity.",
    metrics: ["Financial Impact", "Emotional Toll", "Long-term Value", "Temporal Effort", "Autonomy"]
  },
  {
    title: "Relocation: Settle in the Suburbs vs. City Center",
    dilemma: "Should we buy a spacious house in the suburbs or continue renting a small apartment in the active city center?",
    context: "We are a couple with a 2-year-old child. One of us commutes 3 days a week. We love city culture but feel cramped; the suburban houses offer a yard but require purchasing a vehicle.",
    metrics: ["Financial Impact", "Quality of Life", "Emotional Toll", "Commute Friction", "Long-term Value"]
  },
  {
    title: "Product Launch: Double Down vs. Pivot",
    dilemma: "Should we invest our remaining runway to polish our current SaaS product or pivot to an AI consulting model?",
    context: "We have 4 months of cash runway. Our SaaS has slow organic sign-ups (15% month-on-month) but high satisfaction. Enterprise leads keep asking if we can do custom consulting work instead.",
    metrics: ["Time to Revenue", "Long-term Scalability", "Execution Effort", "Capital Required", "Market Demand"]
  }
];

const STANDARD_METRICS = [
  "Financial Impact",
  "Emotional Toll",
  "Effort & Time",
  "Long-term Value"
];

export default function DilemmaForm({ onSubmit, isLoading }: DilemmaFormProps) {
  const [dilemma, setDilemma] = useState("");
  const [context, setContext] = useState("");
  const [metrics, setMetrics] = useState<string[]>([...STANDARD_METRICS]);
  const [customMetric, setCustomMetric] = useState("");

  const handleAddCustomMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customMetric.trim();
    if (clean && !metrics.includes(clean)) {
      setMetrics([...metrics, clean]);
      setCustomMetric("");
    }
  };

  const handleRemoveMetric = (metricToRemove: string) => {
    setMetrics(metrics.filter(m => m !== metricToRemove));
  };

  const handleToggleMetric = (m: string) => {
    if (metrics.includes(m)) {
      setMetrics(metrics.filter(item => item !== m));
    } else {
      setMetrics([...metrics, m]);
    }
  };

  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setDilemma(preset.dilemma);
    setContext(preset.context);
    setMetrics(preset.metrics);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) return;
    onSubmit(dilemma.trim(), context.trim(), metrics);
  };

  return (
    <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-6 md:p-8 space-y-8" id="faisla-composer-container">
      {/* Header section */}
      <div className="border-b border-[#D1D1CB] pb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase bg-[#1A1A1A] text-white px-2 py-1">
            Form 01
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-light text-[#1A1A1A] tracking-tight italic" id="app-composer-title">
            Draft Your Dilemma
          </h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans mt-2">
          Outline your current situation, background context, and direct dependencies. Calibrate Faisla with specialized variables to optimize the final comparison matrix.
        </p>
      </div>

      {/* Preset Pickers */}
      <div className="space-y-3">
        <span className="text-[10px] font-sans tracking-widest text-[#1A1A1A]/60 uppercase block font-bold">
          Start with a baseline dilemma archetype
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="presets-grid">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              id={`preset-btn-${index}`}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="text-left p-4 rounded-none border border-[#D1D1CB] hover:border-[#1A1A1A] hover:bg-[#EAEAE2]/50 transition-all group relative bg-transparent"
            >
              <h4 className="text-xs font-sans font-bold text-[#1A1A1A] mb-1.5 flex items-center justify-between">
                <span>{preset.title}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all text-[#1A1A1A]" />
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed font-serif italic">
                {preset.dilemma}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Form */}
      <form onSubmit={handleSubmit} className="space-y-6" id="dilemma-core-form">
        {/* Core Question input */}
        <div className="space-y-2">
          <label htmlFor="dilemma-word" className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/60 uppercase flex items-center justify-between">
            <span>The Dilemma (Core Question)</span>
            <span>{dilemma.length}/200</span>
          </label>
          <textarea
            id="dilemma-word"
            required
            maxLength={200}
            rows={2}
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder="e.g., Should I accept the corporate director promotion or maintain my current flexible hybrid arrangement?"
            className="w-full px-4 py-3 rounded-none border border-[#D1D1CB] focus:border-[#1A1A1A] text-sm md:text-base placeholder-neutral-400 outline-none transition-all resize-none bg-white font-serif italic"
          />
        </div>

        {/* Dynamic Context input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="dilemma-context" className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/60 uppercase">
              Underlying Context & Nuance parameters
            </label>
            <span className="text-[10px] text-[#1A1A1A]/60 font-sans uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> context values
            </span>
          </div>
          <textarea
            id="dilemma-context"
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Share key elements such as saving limits, emotional stress, timeline deadlines, personal dependencies, or unwritten rules that keep you stuck..."
            className="w-full px-4 py-3 rounded-none border border-[#D1D1CB] focus:border-[#1A1A1A] text-xs md:text-sm placeholder-neutral-400 outline-none transition bg-white font-sans leading-relaxed"
          />
        </div>

        {/* Dynamic Metrics selector */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/60 uppercase block mb-1">
              Evaluation variables (Select 3-5 factors)
            </label>
            <p className="text-[11px] text-[#1A1A1A]/70 font-sans">
              Toggle standard categories or register dynamic variables suited to your analysis bounds.
            </p>
          </div>

          {/* Quick toggle chips */}
          <div className="flex flex-wrap gap-2" id="metric-toggles">
            {STANDARD_METRICS.map((sm) => {
              const active = metrics.includes(sm);
              return (
                <button
                  type="button"
                  key={sm}
                  id={`metric-toggle-${sm.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleToggleMetric(sm)}
                  className={`px-3 py-1.5 text-xs text-sans font-medium uppercase tracking-wider rounded-none border transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                      : "bg-white border-[#D1D1CB] text-[#1A1A1A] hover:bg-[#EAEAE2]/30"
                  }`}
                >
                  {sm}
                  {active && <X className="w-3 h-3 ml-0.5 text-white/70" />}
                </button>
              );
            })}
          </div>

          {/* Added & Custom List */}
          <div className="flex flex-wrap gap-2 items-center min-h-[38px] bg-[#EAEAE2]/40 p-2 text-left rounded-none border border-[#D1D1CB]" id="selected-metrics-tray">
            {metrics.map((m) => {
              return (
                <span
                  key={m}
                  id={`metric-tag-${m.replace(/\s+/g, '-').toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 font-sans text-[10px] uppercase font-bold tracking-wider rounded-none bg-white text-[#1A1A1A] border border-[#D1D1CB]"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(m)}
                    className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] p-0.5 transition"
                    title={`Remove ${m}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            
            {metrics.length === 0 && (
              <span className="text-xs text-[#1A1A1A]/60 italic font-sans p-1">
                No evaluation variables active. Please add some below.
              </span>
            )}
          </div>

          {/* Custom variable input inline */}
          <div className="flex gap-2">
            <input
              id="custom-metric-input"
              type="text"
              value={customMetric}
              onChange={(e) => setCustomMetric(e.target.value)}
              placeholder="Inject custom factor (e.g. Spouse Comfort, Long-term Scalability)"
              className="flex-1 px-3 py-2 font-sans text-xs rounded-none border border-[#D1D1CB] focus:border-[#1A1A1A] outline-none bg-white"
            />
            <button
              id="add-custom-metric-btn"
              type="button"
              onClick={handleAddCustomMetric}
              className="px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider border border-[#D1D1CB] hover:border-[#1A1A1A] hover:bg-[#EAEAE2]/40 rounded-none transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          id="faisla-submit-action"
          type="submit"
          disabled={isLoading || !dilemma.trim() || metrics.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A1A] hover:bg-[#333333] disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-sans font-bold text-xs uppercase tracking-[0.15em] rounded-none cursor-pointer disabled:cursor-not-allowed transition shadow-none"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
              <span>Processing Decision Context...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Generate Faisla Analysis</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
