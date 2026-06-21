import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, Sparkles, Scale, Info, Check, CornerRightDown, 
  ChevronRight, Calendar, AlertTriangle, FileText, Share2, 
  Award, RefreshCw, PenSquare, ArrowLeftRight, BookOpen, Download, Minimize2, Printer
} from "lucide-react";
import { FaislaAnalysis, SavedDilemma } from "../types";

interface AnalysisDashboardProps {
  analysis: FaislaAnalysis;
  onBackToComposer?: () => void;
  // Progress tracker syncing
  savedDilemma?: SavedDilemma;
  onUpdateProgress?: (progress: {
    firstStepCompleted: boolean;
    status: "Resolved" | "Undecided" | "In Progress";
    selectedOptionIndex?: number;
    notes?: string;
  }) => void;
}

export default function AnalysisDashboard({ 
  analysis, 
  onBackToComposer,
  savedDilemma,
  onUpdateProgress 
}: AnalysisDashboardProps) {
  const { executiveSummary, options, swot, comparison, recommendation } = analysis;
  
  // Local state initialized with saved values when available
  const [firstStepCompleted, setFirstStepCompleted] = useState(
    savedDilemma?.userProgress?.firstStepCompleted || false
  );
  const [decisionStatus, setDecisionStatus] = useState<"Resolved" | "Undecided" | "In Progress">(
    savedDilemma?.userProgress?.status || "In Progress"
  );
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    savedDilemma?.userProgress?.selectedOptionIndex
  );
  const [notes, setNotes] = useState(
    savedDilemma?.userProgress?.notes || ""
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  const handleDownload = (format: "txt" | "md") => {
    const dilemmaTitle = savedDilemma?.dilemma || "Decision Analysis";
    const contextText = savedDilemma?.context || "None provided";
    const dateStr = savedDilemma?.createdAt || new Date().toLocaleDateString();

    let text = "";

    if (format === "txt") {
      text = `================================================================================
                               FAISLA DECISION REPORT
                          Analytical Resolution Workspace
================================================================================
Generated on: ${dateStr}
Dilemma Status: ${decisionStatus}
Selected Path: ${selectedOption !== undefined ? options[selectedOption]?.name : "None selected yet"}

--------------------------------------------------------------------------------
CORE DILEMMA & CHALLENGE
--------------------------------------------------------------------------------
"${dilemmaTitle}"

BACKGROUND CONTEXT & CONSTRAINTS:
${contextText}

--------------------------------------------------------------------------------
SECTION 01: EXECUTIVE DIAGNOSIS
--------------------------------------------------------------------------------
Overview:
"${executiveSummary.acknowledgment}"

Strategic Core Tension:
${executiveSummary.coreTension}

--------------------------------------------------------------------------------
SECTION 02: STRUCTURAL BLIND SPOTS (PROS & CONS)
--------------------------------------------------------------------------------
${options.map((opt, oIdx) => `Option 0${oIdx + 1}: ${opt.name} [${selectedOption === oIdx ? "ACTIVE SELECTION" : "ALTERNATIVE"}]

  + Hidden Advantages & Gains:
${opt.pros.map(pro => `    * ${pro}`).join("\n")}

  - Potential Risks & Trade-offs:
${opt.cons.map(con => `    * ${con}`).join("\n")}
`).join("\n")}
--------------------------------------------------------------------------------
SECTION 03: FRAMEWORK AUDIT (SWOT)
--------------------------------------------------------------------------------
STRENGTHS (Internal Advantage):
${swot.strengths.map(s => `  * ${s}`).join("\n")}

WEAKNESSES (Internal Friction):
${swot.weaknesses.map(w => `  * ${w}`).join("\n")}

OPPORTUNITIES (External Catalyst):
${swot.opportunities.map(o => `  * ${o}`).join("\n")}

THREATS (External Vulnerability):
${swot.threats.map(t => `  * ${t}`).join("\n")}

--------------------------------------------------------------------------------
SECTION 04: PARAMETER ALIGNMENT (COMPARISON MATRIX)
--------------------------------------------------------------------------------
${comparison.map(row => `Metric: ${row.metric}
  Option Ratings: ${options.map((opt, idx) => `${opt.name}: ${row.ratings[idx] || 1}/5`).join(" | ")}
  Crux Trade-Off: ${row.tradeoffText}
`).join("\n")}
--------------------------------------------------------------------------------
SECTION 05: ACTIONABLE RECOMMENDATION & FIRST STEP
--------------------------------------------------------------------------------
Core Recommendation:
${recommendation.decisivePath}

Rationale:
${recommendation.rationale}

24-Hour Active Micro-Step:
[${firstStepCompleted ? "X" : " "}] ${recommendation.firstStep24Hours}

--------------------------------------------------------------------------------
PERSONAL REFLECTION JOURNAL
--------------------------------------------------------------------------------
${notes.trim() ? notes : "No personal journal entries recorded yet."}

================================================================================
              Generated by Faisla Decision System - Clarity over Impulse
================================================================================`;
    } else {
      text = `# Faisla Decision Report
*Analytical Resolution Workspace*

**Generated on:** ${dateStr}  
**Dilemma Status:** \`${decisionStatus}\`  
**Selected Path:** _${selectedOption !== undefined ? options[selectedOption]?.name : "None selected yet"}_

---

## Core Dilemma & Challenge
> ${dilemmaTitle}

### Background Context & Constraints
${contextText}

---

## Section 01: Executive Diagnosis
### Overview
"${executiveSummary.acknowledgment}"

### Strategic Core Tension
${executiveSummary.coreTension}

---

## Section 02: Structural Blind Spots (Pros & Cons)
${options.map((opt, oIdx) => `### Option 0${oIdx + 1}: ${opt.name} *${selectedOption === oIdx ? "(Active Selection)" : "(Alternative)"}*

#### Hidden Advantages & Gains
${opt.pros.map(pro => `- [x] ${pro}`).join("\n")}

#### Potential Risks & Trade-offs
${opt.cons.map(con => `- [ ] ${con}`).join("\n")}
`).join("\n")}
---

## Section 03: Framework Audit (SWOT)

### Strengths (Internal Advantage)
${swot.strengths.map(s => `- ${s}`).join("\n")}

### Weaknesses (Internal Friction)
${swot.weaknesses.map(w => `- ${w}`).join("\n")}

### Opportunities (External Catalyst)
${swot.opportunities.map(o => `- ${o}`).join("\n")}

### Threats (External Vulnerability)
${swot.threats.map(t => `- ${t}`).join("\n")}

---

## Section 04: Parameter Alignment (Comparison Matrix)
| Evaluation Metric | ${options.map((opt, idx) => `Option ${idx + 1} (${opt.name})`).join(" | ")} | Crux Trade-Off |
| :--- | :---: | :--- |
${comparison.map(row => `| **${row.metric}** | ${row.ratings.map(r => `${r}/5`).join(" | ")} | ${row.tradeoffText} |`).join("\n")}

---

## Section 05: Actionable Recommendation & First Step

### Core Recommendation
> **${recommendation.decisivePath}**

### Rationale
${recommendation.rationale}

### 24-Hour Active Micro-Step
- [${firstStepCompleted ? "x" : " "}] **${recommendation.firstStep24Hours}**
_Completing initial micro-steps develops physical momentum that breaks psychological stagnation._

---

## Personal Reflection Journal
${notes.trim() ? notes : "*No personal journal entries recorded yet.*"}

---
*Generated by Faisla Decision System — Clarity over Impulse*`;
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const slug = dilemmaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    link.href = url;
    link.download = `faisla-${slug || "report"}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sync state if savedDilemma changes
  useEffect(() => {
    if (savedDilemma) {
      setFirstStepCompleted(savedDilemma.userProgress?.firstStepCompleted || false);
      setDecisionStatus(savedDilemma.userProgress?.status || "In Progress");
      setSelectedOption(savedDilemma.userProgress?.selectedOptionIndex);
      setNotes(savedDilemma.userProgress?.notes || "");
    }
  }, [savedDilemma]);

  // Propagates changes back
  const handleProgressChange = (updates: {
    firstStepCompleted?: boolean;
    status?: "Resolved" | "Undecided" | "In Progress";
    selectedOptionIndex?: number | null;
    notes?: string;
  }) => {
    if (!onUpdateProgress) return;

    const nextCompleted = updates.firstStepCompleted !== undefined 
      ? updates.firstStepCompleted 
      : firstStepCompleted;
      
    const nextStatus = updates.status !== undefined 
      ? updates.status 
      : decisionStatus;

    let nextOption = selectedOption;
    if (updates.selectedOptionIndex !== undefined) {
      nextOption = updates.selectedOptionIndex === null ? undefined : updates.selectedOptionIndex;
    }

    const nextNotes = updates.notes !== undefined 
      ? updates.notes 
      : notes;

    onUpdateProgress({
      firstStepCompleted: nextCompleted,
      status: nextStatus,
      selectedOptionIndex: nextOption,
      notes: nextNotes
    });
  };

  const toggleFirstStep = () => {
    const nextVal = !firstStepCompleted;
    setFirstStepCompleted(nextVal);
    handleProgressChange({ firstStepCompleted: nextVal });
  };

  const handleStatusSelect = (status: "Resolved" | "Undecided" | "In Progress") => {
    setDecisionStatus(status);
    if (status !== "Resolved") {
      setSelectedOption(undefined);
      handleProgressChange({ status, selectedOptionIndex: null });
    } else {
      handleProgressChange({ status });
    }
  };

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
    handleProgressChange({ status: "Resolved", selectedOptionIndex: idx });
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    handleProgressChange({ notes });
  };

  if (isReadingMode) {
    return (
      <div className="fixed inset-0 bg-[#FDFCF7] text-[#1A1A1A] z-50 overflow-y-auto font-serif selection:bg-[#1A1A1A] selection:text-[#FDFCF7] transition-all animate-fade-in" id="reading-mode-canvas">
        {/* Floating / Sticky Pristine Toolbar */}
        <div className="sticky top-0 bg-[#FDFCF7]/95 backdrop-blur-md border-b border-[#D1D1CB] no-print z-10" id="reading-mode-toolbar">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase bg-[#1A1A1A] text-white px-2.5 py-1">
                Faisla
              </span>
              <span className="text-[10px] font-sans tracking-widest text-[#1A1A1A]/60 uppercase hidden sm:inline">
                // Reading Mode
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Download Option */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-1.5 text-[10px] uppercase tracking-widest bg-white border border-[#D1D1CB] hover:bg-[#EAEAE2] text-[#1A1A1A] font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-[#FDFCF7] border border-[#D1D1CB] rounded-none shadow-md hidden group-hover:block hover:block z-50 text-left">
                  <button
                    onClick={() => handleDownload("txt")}
                    className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] border-b border-[#D1D1CB]/50 cursor-pointer"
                  >
                    Plain Text (.txt)
                  </button>
                  <button
                    onClick={() => handleDownload("md")}
                    className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] border-b border-[#D1D1CB]/50 cursor-pointer"
                  >
                    Markdown (.md)
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsReadingMode(false)}
                className="px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-sans font-bold bg-[#1A1A1A] text-white hover:bg-[#333333] flex items-center gap-1.5 transition-all cursor-pointer"
                id="exit-reading-mode-btn"
              >
                <Minimize2 className="w-3.5 h-3.5" /> Exit Reader
              </button>
            </div>
          </div>
        </div>

        {/* Beautiful focused report container */}
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-16 space-y-12">
          
          {/* Header metadata layout */}
          <div className="space-y-4 text-center border-b border-[#D1D1CB] pb-8">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#1A1A1A]/60 uppercase block">
              Analytical Resolution Report
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] leading-tight italic">
              {savedDilemma?.dilemma || "Decision Formulation"}
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-sans text-[#1A1A1A]/60">
              <span className="uppercase tracking-widest">{savedDilemma?.createdAt || "Custom Report"}</span>
              <span>•</span>
              <span className="font-bold uppercase text-[#1A1A1A]">{decisionStatus}</span>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#D1D1CB] pb-1.5">
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/60">
                01 / Executive Diagnosis
              </span>
            </div>
            <p className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed italic font-serif">
              "{executiveSummary.acknowledgment}"
            </p>
            <div className="space-y-1 mt-4">
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block">
                The Strategic Tension
              </span>
              <p className="text-sm md:text-base text-[#1A1A1A]/85 leading-relaxed font-sans">
                {executiveSummary.coreTension}
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#D1D1CB] pb-1.5">
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/60">
                02 / Strategic Blind Spots
              </span>
              <span className="text-[9px] font-sans tracking-wider text-[#1A1A1A]/60">Pros & Cons</span>
            </div>

            {/* Brand visual progress / balance metrics row */}
            <div className="bg-[#FAF9F6] border border-[#D1D1CB] p-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="reading-decision-mass-balance">
              <div className="text-center sm:text-left space-y-0.5 max-w-xs">
                <h4 className="text-[11px] font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Advantage Bias Metrics
                </h4>
                <p className="text-[10px] text-[#1A1A1A]/70 font-sans leading-relaxed">
                  Proportion of identified <span className="font-bold">Advantages</span> (Dark ring) vs. <span className="font-bold">Risks</span> for each formulated path.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 py-1">
                {options.map((option, idx) => {
                  const pCount = option.pros.length;
                  const cCount = option.cons.length;
                  const total = pCount + cCount;
                  const ratio = total > 0 ? (pCount / total) : 0.5;
                  const percentage = Math.round(ratio * 100);
                  const strokeWidth = 3.5;
                  const radius = 18;
                  const circumference = 2 * Math.PI * radius; // ~113.1
                  const strokeDashoffset = circumference - ratio * circumference;

                  return (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 border border-[#D1D1CB] min-w-[170px]" id={`reading-balance-circle-${idx}`}>
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                          <circle
                            cx="22"
                            cy="22"
                            r={radius}
                            fill="transparent"
                            stroke="#EAEAE2"
                            strokeWidth={strokeWidth}
                          />
                          {total > 0 && pCount > 0 && (
                            <circle
                              cx="22"
                              cy="22"
                              r={radius}
                              fill="transparent"
                              stroke="#1A1A1A"
                              strokeWidth={strokeWidth}
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="square"
                            />
                          )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[9px] font-sans font-bold text-[#1A1A1A]">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-[11px] font-serif font-bold text-[#1A1A1A] line-clamp-1 leading-none">
                          {option.name}
                        </h5>
                        <div className="flex items-center gap-1 text-[8px] font-sans text-[#1A1A1A]">
                          <span className="bg-[#1A1A1A] text-white px-1 leading-none font-bold py-0.5">{pCount} PRO{pCount !== 1 ? 'S' : ''}</span>
                          <span className="text-neutral-400">/</span>
                          <span className="bg-[#EAEAE2] text-[#1A1A1A] px-1 leading-none font-bold py-0.5">{cCount} CON{cCount !== 1 ? 'S' : ''}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              {options.map((option, oIdx) => (
                <div key={oIdx} className={`p-5 border border-[#D1D1CB] ${selectedOption === oIdx ? "bg-white ring-1 ring-[#1A1A1A]" : "bg-transparent"}`}>
                  <div className="flex items-center justify-between border-b border-[#D1D1CB]/60 pb-2 mb-4">
                    <h3 className="font-serif font-bold text-base italic text-[#1A1A1A]">
                      Option 0{oIdx + 1}: {option.name}
                    </h3>
                    {selectedOption === oIdx && (
                      <span className="px-2 py-0.5 text-[8px] font-sans font-bold bg-[#1A1A1A] text-white uppercase tracking-widest">
                        Selected Path
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-sans font-bold tracking-wider text-[#1A1A1A] uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#1A1A1A]" /> Advantages
                      </span>
                      <ul className="space-y-1.5">
                        {option.pros.map((pro, pIdx) => (
                          <li key={pIdx} className="text-xs text-[#1A1A1A]/85 font-serif leading-relaxed flex items-start gap-1.5">
                            <span className="text-[10px] text-[#1A1A1A] mt-0.5">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-sans font-bold tracking-wider text-[#1A1A1A]/70 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#D1D1CB]" /> Risks
                      </span>
                      <ul className="space-y-1.5">
                        {option.cons.map((con, cIdx) => (
                          <li key={cIdx} className="text-xs text-[#1A1A1A]/85 font-serif leading-relaxed flex items-start gap-1.5">
                            <span className="text-[8px] text-[#1A1A1A] mt-1">▲</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#D1D1CB] pb-1.5">
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/60">
                03 / Comprehensive SWOT Matrix
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-[#D1D1CB] bg-white">
                <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A] uppercase block mb-2">// Strengths</span>
                <ul className="space-y-1.5">
                  {swot.strengths.map((s, idx) => (
                    <li key={idx} className="text-xs text-[#1A1A1A]/80 font-serif leading-relaxed flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1A1A1A] mt-1 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border border-[#D1D1CB] bg-white">
                <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A]/70 uppercase block mb-2">// Weaknesses</span>
                <ul className="space-y-1.5">
                  {swot.weaknesses.map((w, idx) => (
                    <li key={idx} className="text-xs text-[#1A1A1A]/80 font-serif leading-relaxed flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1A1A1A]/60 mt-1 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border border-[#D1D1CB] bg-white">
                <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A] uppercase block mb-2">// Opportunities</span>
                <ul className="space-y-1.5">
                  {swot.opportunities.map((o, idx) => (
                    <li key={idx} className="text-xs text-[#1A1A1A]/80 font-serif leading-relaxed flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1A1A1A] mt-1 shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border border-[#D1D1CB] bg-white">
                <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A]/70 uppercase block mb-2">// Threats</span>
                <ul className="space-y-1.5">
                  {swot.threats.map((t, idx) => (
                    <li key={idx} className="text-xs text-[#1A1A1A]/80 font-serif leading-relaxed flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#1A1A1A]/60 mt-1 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#D1D1CB] pb-1.5">
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/60">
                04 / Trade-Off Matrix
              </span>
            </div>
            <div className="border border-[#D1D1CB] overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#D1D1CB] font-sans text-[9px] font-bold tracking-wider text-[#1A1A1A]/60 uppercase">
                    <th className="p-3">Evaluation Metric</th>
                    {options.map((_, idx) => <th key={idx} className="p-3 text-center">Opt {idx + 1}</th>)}
                    <th className="p-3">Crux Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1D1CB]/40">
                  {comparison.map((row, idx) => (
                    <tr key={idx} className="text-xs">
                      <td className="p-3 font-sans font-bold text-[#1A1A1A]">{row.metric}</td>
                      {options.map((_, optIdx) => (
                        <td key={optIdx} className="p-3 text-center font-sans text-xs font-bold text-[#1A1A1A]">
                          {row.ratings[optIdx] || 1}/5
                        </td>
                      ))}
                      <td className="p-3 font-serif text-[#1A1A1A]/80 leading-relaxed">{row.tradeoffText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4 p-6 border border-[#D1D1CB] bg-white">
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase block">
              05 / Actionable Resolution
            </span>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-sans font-bold tracking-wider text-[#1A1A1A]/50 uppercase">
                  Strategic Recommendation
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  {recommendation.decisivePath}
                </h3>
                <p className="text-xs md:text-sm text-[#1A1A1A]/85 leading-relaxed font-serif">
                  {recommendation.rationale}
                </p>
              </div>
              <div className="border-t border-[#D1D1CB]/50 pt-4 space-y-2">
                <span className="text-[9px] font-sans font-bold tracking-wider text-[#1A1A1A]/50 uppercase">
                  The 24-Hour Active Step
                </span>
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 ${firstStepCompleted ? "bg-[#1A1A1A] text-white" : "bg-transparent border-[#D1D1CB]"}`}>
                    {firstStepCompleted && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-serif font-bold ${firstStepCompleted ? "line-through text-[#1A1A1A]/40" : "text-[#1A1A1A]"}`}>
                      {recommendation.firstStep24Hours}
                    </h4>
                    <p className="text-[10px] text-[#1A1A1A]/60 font-sans mt-0.5">
                      First step taken to break psychological inertia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reflection Log */}
          {notes.trim() && (
            <div className="space-y-3 p-6 border border-[#D1D1CB] bg-[#FAF9F6]">
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase block">
                Personal Reflection Journal
              </span>
              <p className="text-xs text-[#1A1A1A]/85 font-serif leading-relaxed whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          )}

          {/* Simple design footer */}
          <div className="border-t border-[#D1D1CB] pt-8 text-center text-[10px] font-sans text-[#1A1A1A]/50 tracking-widest uppercase no-print">
            Clarity Over Impulse // Created with Faisla
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="analysis-dashboard-root">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1D1CB]/50 pb-4 no-print" id="dashboard-action-toolbar">
        {onBackToComposer ? (
          <button
            onClick={onBackToComposer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#D1D1CB] hover:border-[#1A1A1A] hover:bg-[#EAEAE2] rounded-none transition-all cursor-pointer mr-auto"
            id="back-to-composer-btn"
          >
            <CornerRightDown className="w-3.5 h-3.5 rotate-90" />
            Back to Workspace
          </button>
        ) : <div />}

        <div className="flex flex-wrap items-center gap-2">
          {/* Reading Mode Button */}
          <button
            onClick={() => setIsReadingMode(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#D1D1CB] hover:border-[#1A1A1A] hover:bg-[#EAEAE2] rounded-none transition-all cursor-pointer"
            id="enter-reading-mode-btn"
            title="Enter full-screen reading mode"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Reading Mode
          </button>

          {/* Export Selector */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A] border border-[#D1D1CB] hover:border-[#1A1A1A] hover:bg-[#EAEAE2] rounded-none transition-all cursor-pointer"
              id="export-options-toggle"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-[#F5F5F0] border border-[#D1D1CB] rounded-none shadow-md hidden group-hover:block hover:block z-50 text-left">
              <button
                onClick={() => handleDownload("txt")}
                className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] border-b border-[#D1D1CB]/50 cursor-pointer"
              >
                Plain Text (.txt)
              </button>
              <button
                onClick={() => handleDownload("md")}
                className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] border-b border-[#D1D1CB]/50 cursor-pointer"
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-sans font-bold text-[#1A1A1A] hover:bg-[#EAEAE2] flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3 h-3" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY & CORE DILEMMA */}
      <div className="bg-[#FAF9F6] text-[#1A1A1A] rounded-none border border-[#D1D1CB] overflow-hidden" id="section-faisla-summary">
        {/* Subtle accent border */}
        <div className="h-1 bg-[#1A1A1A]" />
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#D1D1CB] pb-4">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase">
                Section 01 // Executive Diagnosis
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-light mt-1 text-[#1A1A1A] tracking-tight leading-snug italic">
                The Decision Crucible
              </h1>
            </div>
            
            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-[10px] rounded-none bg-[#1A1A1A] text-white font-sans uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                Gemini Flash System
              </span>
              <span className={`px-2.5 py-1 text-[10px] rounded-none border font-sans uppercase tracking-widest font-bold ${
                decisionStatus === "Resolved" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : decisionStatus === "In Progress"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-neutral-100 text-neutral-800 border-[#D1D1CB]"
              }`}>
                {decisionStatus}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 border border-[#D1D1CB] rounded-none space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase">
                Diagnosis Overview
              </span>
              <p className="text-sm md:text-base text-[#1A1A1A] leading-relaxed font-serif italic">
                "{executiveSummary.acknowledgment}"
              </p>
            </div>
            <div className="h-px bg-[#D1D1CB]" />
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block">
                The Core Strategic Tension
              </span>
              <p className="text-xs md:text-sm text-[#1A1A1A]/85 leading-relaxed font-sans">
                {executiveSummary.coreTension}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEEP DIVE (PROS VS CONS) */}
      <div className="space-y-4" id="section-faisla-proscons">
        <div className="border-b border-[#D1D1CB] pb-2">
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase">
            Section 02 // Strategic Blind Spots
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-light text-[#1A1A1A] mt-1 tracking-tight italic">
            Deep Dive: Pros vs. Cons Analysis
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Analyzing hidden advantages and risks typical indicators overlook.
          </p>
        </div>

        {/* Brand visual progress / balance metrics row */}
        <div className="bg-[#FAF9F6] border border-[#D1D1CB] p-5 flex flex-col lg:flex-row items-center justify-between gap-6" id="dashboard-decision-mass-balance">
          <div className="text-center lg:text-left space-y-1.5 max-w-sm">
            <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block">
              // Analytical Weight Indicator
            </span>
            <h4 className="text-xs font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
              Advantage Bias Metrics
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed">
              Visual representation of the identified Advantages (<span className="font-bold underline decoration-[#1A1A1A] decoration-1">Dark indicator</span>) compared to the Potential Risks (<span className="font-bold text-neutral-400">Light track</span>) for each formulated choice.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 py-1 w-full lg:w-auto">
            {options.map((option, idx) => {
              const pCount = option.pros.length;
              const cCount = option.cons.length;
              const total = pCount + cCount;
              const ratio = total > 0 ? (pCount / total) : 0.5;
              const percentage = Math.round(ratio * 100);
              const strokeWidth = 3.5;
              const radius = 18;
              const circumference = 2 * Math.PI * radius; // ~113.1
              const strokeDashoffset = circumference - ratio * circumference;

              return (
                <div key={idx} className="flex items-center gap-4 bg-white p-4 border border-[#D1D1CB] min-w-[210px] flex-1 sm:flex-initial" id={`dashboard-balance-circle-${idx}`}>
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                      {/* Cons/Risks track background */}
                      <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        fill="transparent"
                        stroke="#EAEAE2"
                        strokeWidth={strokeWidth}
                      />
                      {/* Pros progress segment */}
                      {total > 0 && pCount > 0 && (
                        <circle
                          cx="22"
                          cy="22"
                          r={radius}
                          fill="transparent"
                          stroke="#1A1A1A"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="square"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[11px] font-sans font-bold text-[#1A1A1A]">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-sans font-bold tracking-widest text-[#1A1A1A]/40 uppercase block">
                      Option 0{idx + 1} Weight
                    </span>
                    <h5 className="text-xs font-serif font-bold text-[#1A1A1A] line-clamp-1 leading-none">
                      {option.name}
                    </h5>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-sans text-[#1A1A1A]">
                      <span className="bg-[#1A1A1A] text-white px-1 leading-none font-bold py-0.5">{pCount} PRO{pCount !== 1 ? 'S' : ''}</span>
                      <span className="text-neutral-400">/</span>
                      <span className="bg-[#EAEAE2] text-[#1A1A1A] px-1 leading-none font-bold py-0.5">{cCount} CON{cCount !== 1 ? 'S' : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Options stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option, oIdx) => (
            <div 
              key={oIdx}
              id={`option-card-${oIdx}`}
              className={`rounded-none border bg-[#FAF9F6] p-5 md:p-6 transition-all duration-300 ${
                selectedOption === oIdx 
                  ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]" 
                  : "border-[#D1D1CB]"
              }`}
            >
              {/* Option Title */}
              <div className="flex items-start justify-between gap-2 border-b border-[#D1D1CB] pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block">
                    Option 0{oIdx + 1}
                  </span>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-sm md:text-base italic">
                    {option.name}
                  </h3>
                </div>
                
                {/* Visual marker */}
                <button
                  onClick={() => handleOptionSelect(oIdx)}
                  className={`px-3 py-1 text-[10px] font-sans uppercase tracking-widest rounded-none border font-bold transition-all ${
                    selectedOption === oIdx
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                      : "bg-white border-[#D1D1CB] text-[#1A1A1A] hover:bg-[#EAEAE2]"
                  }`}
                >
                  {selectedOption === oIdx ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> Active
                    </span>
                  ) : "Select Path"}
                </button>
              </div>

              {/* Side-by-side inside lists */}
              <div className="space-y-4">
                {/* Pros list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-sans tracking-widest text-[#1A1A1A] uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#1A1A1A]" />
                    Hidden Advantages & Gains
                  </h4>
                  <ul className="space-y-2">
                    {option.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                        <Check className="w-3 h-3 text-[#1A1A1A] mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px bg-[#D1D1CB]" />

                {/* Cons list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-sans tracking-widest text-[#1A1A1A]/70 uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#D1D1CB]" />
                    Potential Risks & Trade-offs
                  </h4>
                  <ul className="space-y-2">
                    {option.cons.map((con, cIdx) => (
                      <li key={con} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                        <span className="text-[#1A1A1A] font-bold mt-0.5 shrink-0 block text-[10px]">▲</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SWOT ANALYSIS */}
      <div className="space-y-4" id="section-faisla-swot">
        <div className="border-b border-[#D1D1CB] pb-2">
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase">
            Section 03 // Framework Audit
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-light text-[#1A1A1A] mt-1 tracking-tight italic">
            Comprehensive SWOT Matrix
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Contrasting internal assets against external shifts and environment conditions.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Strengths */}
          <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <span className="text-[10px] font-sans font-bold bg-[#1A1A1A] text-white w-5 h-5 flex items-center justify-center">S</span>
              <h4 className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#1A1A1A]">
                Strengths <span className="opacity-60 font-normal">// Internal Advantage</span>
              </h4>
            </div>
            <ul className="space-y-1.5 pl-1">
              {swot.strengths.map((item, idx) => (
                <li key={idx} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1 h-1 bg-[#1A1A1A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <span className="text-[10px] font-sans font-bold bg-[#1A1A1A]/60 text-white w-5 h-5 flex items-center justify-center">W</span>
              <h4 className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#1A1A1A]">
                Weaknesses <span className="opacity-60 font-normal">// Internal Friction</span>
              </h4>
            </div>
            <ul className="space-y-1.5 pl-1">
              {swot.weaknesses.map((item, idx) => (
                <li key={idx} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1 h-1 bg-[#1A1A1A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <span className="text-[10px] font-sans font-bold bg-[#1A1A1A] text-white w-5 h-5 flex items-center justify-center">O</span>
              <h4 className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#1A1A1A]">
                Opportunities <span className="opacity-60 font-normal">// External Catalyst</span>
              </h4>
            </div>
            <ul className="space-y-1.5 pl-1">
              {swot.opportunities.map((item, idx) => (
                <li key={idx} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1 h-1 bg-[#1A1A1A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#1A1A1A]">
              <span className="text-[10px] font-sans font-bold bg-[#1A1A1A]/60 text-white w-5 h-5 flex items-center justify-center">T</span>
              <h4 className="text-[10px] font-sans tracking-widest uppercase font-bold text-[#1A1A1A]">
                Threats <span className="opacity-60 font-normal">// External Vulnerability</span>
              </h4>
            </div>
            <ul className="space-y-1.5 pl-1">
              {swot.threats.map((item, idx) => (
                <li key={idx} className="text-xs text-[#1A1A1A]/80 flex items-start gap-2 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1 h-1 bg-[#1A1A1A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 4: COMPARISON & TRADE-OFFS */}
      <div className="space-y-4" id="section-faisla-comparison">
        <div className="border-b border-[#D1D1CB] pb-2">
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase">
            Section 04 // Parameter Alignment
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-light text-[#1A1A1A] mt-1 tracking-tight italic">
            Comparison & Trade-Off Matrix
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 font-sans mt-1">
            Ratings from 1 to 5. Higher ratings indicate strategic alignment or better manageability.
          </p>
        </div>

        {/* Comparison Desk Table */}
        <div className="overflow-x-auto rounded-none border border-[#D1D1CB] bg-white">
          <table className="w-full text-left border-collapse" id="comparison-table">
            <thead>
              <tr className="bg-[#FAF9F6] font-sans text-[10px] font-bold tracking-widest text-[#1A1A1A] border-b border-[#D1D1CB]">
                <th className="p-4 uppercase min-w-[150px]">Evaluation Metric</th>
                {options.map((option, idx) => (
                  <th key={idx} className="p-4 uppercase min-w-[120px] text-center md:text-left">
                    Option {idx + 1} rating
                  </th>
                ))}
                <th className="p-4 uppercase min-w-[280px]">Crux Trade-Off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1D1CB]/50">
              {comparison.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#FAF9F6]/50 transition-colors">
                  {/* Metric Name */}
                  <td className="p-4">
                    <span className="text-xs font-sans font-bold text-[#1A1A1A] block">
                      {row.metric}
                    </span>
                  </td>
                  
                  {/* Rating Columns */}
                  {options.map((_, optIdx) => {
                    const val = row.ratings[optIdx] || 1;
                    return (
                      <td key={optIdx} className="p-4 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start justify-center gap-1">
                          {/* Rectangle block indicator lines rather than plain rounds */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <span 
                                key={dot} 
                                className={`w-3.5 h-1.5 ${
                                  dot <= val 
                                    ? "bg-[#1A1A1A]" 
                                    : "bg-[#D1D1CB]/40"
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[9px] font-sans tracking-wide text-[#1A1A1A]/60">
                            {val}/5 Rating
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Tradeoff Explanation Text */}
                  <td className="p-4">
                    <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-serif max-w-[400px]">
                      {row.tradeoffText}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: ACTIONABLE RECOMMENDATION & FIRST STEP */}
      <div className="bg-[#FAF9F6] rounded-none border border-[#D1D1CB] p-6 md:p-8 space-y-6" id="section-faisla-recommendation">
        <div className="flex items-start justify-between gap-2 border-b border-[#D1D1CB] pb-5">
          <div>
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A]/60 uppercase">
              Section 05 // Decisive Resolution
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-light text-[#1A1A1A] mt-1 tracking-tight italic flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1A1A1A]" />
              Actionable Recommendation
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          {/* Recommended direction card */}
          <div className="bg-white p-5 rounded-none border border-[#D1D1CB] space-y-2">
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block">
              Core Recommendation
            </span>
            <h3 className="text-base md:text-lg font-serif font-bold text-[#1A1A1A] leading-snug">
              {recommendation.decisivePath}
            </h3>
            <p className="text-xs md:text-sm text-[#1A1A1A]/85 leading-relaxed font-serif">
              {recommendation.rationale}
            </p>
          </div>

          {/* Interactive Checkbox for 24-Hour Step */}
          <div className={`p-5 rounded-none border transition-all duration-300 ${
            firstStepCompleted 
              ? "bg-[#FAF9F6] border-[#D1D1CB]" 
              : "bg-[#FAF9F6] border-[#D1D1CB]"
          }`}>
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase block mb-1">
              Active Step (Take Action within 24 Hours)
            </span>
            <div className="flex items-start gap-4 mt-2">
              <button
                type="button"
                id="interactive-checkbox-btn"
                onClick={toggleFirstStep}
                className={`w-6 h-6 rounded-none border flex items-center justify-center shrink-0 transition-all ${
                  firstStepCompleted 
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" 
                    : "bg-white border-[#D1D1CB] hover:border-[#1A1A1A] text-transparent"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
              <div className="space-y-1">
                <h4 className={`text-sm font-serif font-bold transition-all ${
                  firstStepCompleted ? "line-through text-neutral-400" : "text-[#1A1A1A]"
                }`}>
                  {recommendation.firstStep24Hours}
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
                  Completing initial micro-steps develops physical momentum that breaks psychological stagnation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dilemma Outcomes, Note Log & Status Update */}
        <div className="border-t border-[#D1D1CB] pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status updates */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase">
                Decision Outcomes Status
              </h4>
              <div className="flex flex-wrap gap-2" id="status-badges-tray">
                {(["In Progress", "Resolved", "Undecided"] as const).map((statusValue) => (
                  <button
                    key={statusValue}
                    id={`status-${statusValue.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleStatusSelect(statusValue)}
                    className={`px-3 py-1.5 text-xs font-sans uppercase tracking-widest font-bold rounded-none border transition-all ${
                      decisionStatus === statusValue
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "bg-white border-[#D1D1CB] text-[#1A1A1A] hover:bg-[#EAEAE2]"
                    }`}
                  >
                    {statusValue}
                  </button>
                ))}
              </div>

              {decisionStatus === "Resolved" && (
                <div className="bg-white p-3 rounded-none border border-[#D1D1CB] text-xs text-[#1A1A1A] space-y-2">
                  <p className="font-sans font-bold uppercase tracking-wide text-[#1A1A1A]/60 text-[10px]">
                    Which path or option did you resolve to execute?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        id={`resolve-btn-${oIdx}`}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wide border rounded-none transition-all ${
                          selectedOption === oIdx
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white border-[#D1D1CB] text-[#1A1A1A] hover:bg-[#EAEAE2]"
                        }`}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note logging */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-sans font-bold tracking-widest text-[#1A1A1A]/50 uppercase">
                  Personal Decision Journal
                </h4>
                {!isEditingNotes && (
                  <button 
                    onClick={() => setIsEditingNotes(true)}
                    className="text-[10px] text-[#1A1A1A] hover:underline flex items-center gap-1 font-sans font-bold uppercase tracking-wider"
                    id="edit-journal-btn"
                  >
                    <PenSquare className="w-3.5 h-3.5" /> EDIT JOURNAL
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    id="personal-journal-textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Log personal feelings, timing constraints, or next micro action items here..."
                    className="w-full p-2.5 text-xs rounded-none border border-[#D1D1CB] bg-white focus:border-[#1A1A1A] outline-none font-sans leading-relaxed text-[#1A1A1A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setNotes(savedDilemma?.userProgress?.notes || "");
                        setIsEditingNotes(false);
                      }}
                      className="px-3 py-1.5 text-xs border border-[#D1D1CB] hover:bg-[#EAEAE2] font-sans uppercase tracking-widest font-bold rounded-none"
                      id="cancel-journal-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1.5 text-xs bg-[#1A1A1A] hover:bg-[#333333] text-white font-sans uppercase tracking-widest font-bold rounded-none"
                      id="save-journal-btn"
                    >
                      Save Log
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 rounded-none border border-[#D1D1CB] min-h-[64px] text-left">
                  {notes.trim() ? (
                    <p className="text-xs text-[#1A1A1A]/85 leading-relaxed whitespace-pre-wrap font-serif">
                      {notes}
                    </p>
                  ) : (
                    <p className="text-xs text-[#1A1A1A]/50 italic font-serif">
                      No personal logs recorded on this Faisla yet. Click "EDIT JOURNAL" above to log reflections.
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
