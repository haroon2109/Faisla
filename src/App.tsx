import React, { useState, useEffect } from "react";
import { 
  Scale, History, Trash2, ArrowLeft, GitCommit, Sparkles, CheckCircle, 
  HelpCircle, ChevronDown, Check, LogOut, CheckCircle2, RotateCcw, Search
} from "lucide-react";
import DilemmaForm from "./components/DilemmaForm";
import AnalysisDashboard from "./components/AnalysisDashboard";
import { FaislaAnalysis, SavedDilemma, OptionAnalysis, SwotAnalysis, MetricComparison, RecommendationReport } from "./types";

const LOCAL_STORAGE_KEY = "faisla_saved_dilemmas";

export default function App() {
  const [savedDilemmas, setSavedDilemmas] = useState<SavedDilemma[]>([]);
  const [selectedDilemmaId, setSelectedDilemmaId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<FaislaAnalysis | null>(null);
  const [historySearch, setHistorySearch] = useState("");
  
  // Workspace inputs
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedDilemma[];
        setSavedDilemmas(parsed);
      }
    } catch (e) {
      console.error("Failed to load saved decisions", e);
    }
  }, []);

  // Save history to localStorage
  const saveToLocalStorage = (list: SavedDilemma[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      setSavedDilemmas(list);
    } catch (e) {
      console.error("Failed to save decisions to cache", e);
    }
  };

  // Triggers Gemini analysis
  const handleAnalyzeDilemma = async (dilemmaText: string, contextText: string, selectedMetrics: string[]) => {
    setIsLoading(true);
    setError(null);
    setActiveAnalysis(null);

    try {
      const basePath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
      const apiUrl = basePath + "api/analyze";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dilemma: dilemmaText,
          context: contextText,
          customMetrics: selectedMetrics
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status code ${res.status}`);
      }

      const report = (await res.json()) as FaislaAnalysis;
      
      // Save newly formulated decision report
      const newSavedItem: SavedDilemma = {
        id: `faisla_${Date.now()}`,
        dilemma: dilemmaText,
        context: contextText,
        customMetrics: selectedMetrics,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        analysis: report,
        userProgress: {
          firstStepCompleted: false,
          status: "In Progress"
        }
      };

      const newList = [newSavedItem, ...savedDilemmas];
      saveToLocalStorage(newList);
      setSelectedDilemmaId(newSavedItem.id);
      setActiveAnalysis(report);
    } catch (err: any) {
      console.error("Failed to generate Faisla", err);
      setError(
        err?.message || "A secure channel error occurred while generating analysis. Make sure GEMINI_API_KEY is configured."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDilemma = (id: string) => {
    const found = savedDilemmas.find(item => item.id === id);
    if (found) {
      setSelectedDilemmaId(id);
      setActiveAnalysis(found.analysis);
      setIsHistoryOpen(false);
      setError(null);
    }
  };

  const handleDeleteDilemma = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this decision analysis from history?");
    if (!confirmed) return;

    const filtered = savedDilemmas.filter(item => item.id !== id);
    saveToLocalStorage(filtered);

    if (selectedDilemmaId === id) {
      setSelectedDilemmaId(null);
      setActiveAnalysis(null);
    }
  };

  const handleUpdateProgress = (progressData: SavedDilemma["userProgress"]) => {
    if (!selectedDilemmaId || !progressData) return;

    const updated = savedDilemmas.map(item => {
      if (item.id === selectedDilemmaId) {
        return {
          ...item,
          userProgress: progressData
        };
      }
      return item;
    });

    saveToLocalStorage(updated);
  };

  const handleClearForm = () => {
    setSelectedDilemmaId(null);
    setActiveAnalysis(null);
    setError(null);
  };

  // Find currently loaded full saved dilemma
  const loadedDilemma = savedDilemmas.find(item => item.id === selectedDilemmaId);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-serif selection:bg-[#1A1A1A] selection:text-[#F5F5F0]" id="faisla-app-root">
      
      {/* Visual top subtle divider line */}
      <div className="h-1 bg-[#1A1A1A]" />

      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/90 backdrop-blur-md border-b border-[#D1D1CB]" id="global-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand click resets to workspace */}
          <button 
            onClick={handleClearForm}
            className="flex items-baseline gap-3 text-[#1A1A1A] group transition text-left" 
            id="logo-reset-btn"
          >
            <span className="text-xs font-sans font-bold tracking-[0.2em] uppercase bg-[#1A1A1A] text-white px-3 py-1.5 transition-colors group-hover:bg-[#333333]">
              Faisla
            </span>
            <span className="text-[10px] font-sans uppercase tracking-[0.15em] opacity-60 hidden sm:inline">
              // decision system
            </span>
          </button>

          {/* Quick Controls Section */}
          <div className="flex items-center gap-3">
            
            {/* Collapsible History Dropdown Menu Button */}
            <div className="relative">
              <button
                type="button"
                id="history-toggle-dropdown"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={`px-3 py-2 text-xs font-sans uppercase tracking-widest font-semibold border transition-all flex items-center gap-2 ${
                  isHistoryOpen 
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-[#F5F5F0]" 
                    : "bg-transparent border-[#D1D1CB] text-[#1A1A1A] hover:border-[#1A1A1A]"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History ({savedDilemmas.length})
                <ChevronDown className={`w-3 h-3 transition-transform ${isHistoryOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Collapsible Panel */}
              {isHistoryOpen && (
                <div className="absolute right-0 mt-2 w-72 md:w-80 bg-[#F5F5F0] border border-[#D1D1CB] rounded-none shadow-lg p-3 space-y-2.5 z-50 text-left animate-fade-in" id="history-panel-overlay">
                  <div className="px-1 py-1.5 border-b border-[#D1D1CB] flex items-center justify-between">
                    <span className="text-[10px] font-sans tracking-widest font-bold text-[#1A1A1A]/60 uppercase">
                      Decision Archives
                    </span>
                    <span className="text-[9px] bg-[#1A1A1A] text-[white] px-1.5 py-0.5 font-sans tracking-wide">
                      LOCAL
                    </span>
                  </div>

                  {/* Search query input inside archives */}
                  <div className="relative px-0.5">
                    <input
                      type="text"
                      placeholder="Search past dilemmas..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full text-xs font-sans bg-white border border-[#D1D1CB] py-1.5 pl-8 pr-7 outline-none focus:border-[#1A1A1A] transition-all rounded-none placeholder:text-[#1A1A1A]/40 text-[#1A1A1A] font-medium"
                      id="history-search-input"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
                    {historySearch && (
                      <button
                        type="button"
                        onClick={() => setHistorySearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-sans font-bold text-[#1A1A1A]/40 hover:text-[#1A1A1A] px-1 py-0.5"
                        id="clear-search-btn"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1 divide-y divide-[#D1D1CB]/40 pr-0.5">
                    {savedDilemmas.filter(item => 
                      item.dilemma.toLowerCase().includes(historySearch.toLowerCase())
                    ).map((item) => {
                      const isActive = item.id === selectedDilemmaId;
                      const isResolved = item.userProgress?.status === "Resolved";
                      return (
                        <div
                          key={item.id}
                          className={`w-full p-2 rounded-none text-xs flex justify-between gap-2.5 group items-start transition-all ${
                            isActive 
                              ? "bg-[#1A1A1A]" 
                              : "hover:bg-[#EAEAE2]"
                          }`}
                        >
                          <button
                            type="button"
                            id={`history-item-btn-${item.id}`}
                            onClick={() => handleSelectDilemma(item.id)}
                            className="flex-1 text-left font-serif cursor-pointer focus:outline-none"
                          >
                            <div className="space-y-1">
                              <span className={`block font-serif font-light text-sm line-clamp-1 ${isActive ? "text-[#F5F5F0]" : "text-[#1A1A1A]"}`}>
                                {item.dilemma}
                              </span>
                              <div className="flex items-center gap-2 text-[9px] font-sans tracking-wider opacity-60">
                                <span className={isActive ? "text-[#F5F5F0]/75" : "text-[#1A1A1A]/75"}>{item.createdAt}</span>
                                <span className={isActive ? "text-[#F5F5F0]/50" : "text-[#1A1A1A]/50"}>•</span>
                                <span className={`font-bold uppercase ${
                                  isActive
                                    ? "text-[#FAF9F6] underline decoration-dotted decoration-1"
                                    : isResolved ? "text-emerald-800" : "text-amber-800"
                                }`}>
                                  {item.userProgress?.status || "In Progress"}
                                </span>
                              </div>
                            </div>
                          </button>
                          
                          {/* Trash button */}
                          <button
                            type="button"
                            id={`delete-btn-${item.id}`}
                            onClick={(e) => handleDeleteDilemma(e, item.id)}
                            className={`p-1.5 hover:bg-rose-900 hover:text-white transition shrink-0 rounded-none cursor-pointer ${
                              isActive 
                                ? "text-neutral-400 hover:text-[#FAF9F6]" 
                                : "text-[#1A1A1A]/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                            }`}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {savedDilemmas.length > 0 && savedDilemmas.filter(item => 
                      item.dilemma.toLowerCase().includes(historySearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-xs text-[#1A1A1A]/50 italic text-center py-6 font-sans">
                        No results matching "{historySearch}"
                      </p>
                    )}

                    {savedDilemmas.length === 0 && (
                      <p className="text-xs text-[#1A1A1A]/50 italic text-center py-4 font-sans">
                        Your decision history is empty.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Clear workflow to draft new dilemma */}
            {activeAnalysis && (
              <button
                onClick={handleClearForm}
                className="px-3.5 py-2 text-xs font-sans uppercase tracking-widest font-bold bg-[#1A1A1A] text-white hover:bg-[#333333] transition-all"
                id="header-nav-new"
              >
                + New Draft
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Main body canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10" id="main-content-canvas">
        
        {/* Banner Section inside workspace */}
        {!activeAnalysis && !isLoading && (
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-10 border-b border-[#D1D1CB] pb-8" id="home-banner">
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#1A1A1A] opacity-65 uppercase inline-flex items-center gap-1.5">
              <span>System Framework 01</span>
              <span>/</span>
              <span>Analytical Resolution</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight leading-none italic">
              The Decisiveness Workspace
            </h1>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed max-w-xl mx-auto font-sans">
              Do not surrender major paths of career, scaling, or focus to baseline impulses. Frame dilemmas objectively, reveal critical trade-offs, and design small 24-hour actions.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-none text-rose-950 text-xs md:text-sm flex flex-col md:flex-row md:items-center justify-between gap-3" id="error-banner">
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none shrink-0">⚠️</span>
              <div className="font-sans">
                <p className="font-bold uppercase tracking-wider text-[11px] text-rose-900">Analysis Compromised</p>
                <p className="text-rose-950 font-normal mt-0.5">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] hover:underline shrink-0 cursor-pointer"
            >
              Dismiss Error
            </button>
          </div>
        )}

        {/* Loading overlay inside workspace */}
        {isLoading && (
          <div className="bg-[#EAEAE2] rounded-none border border-[#D1D1CB] p-12 text-center space-y-6 animate-pulse" id="loading-backdrop">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full rounded-full border-2 border-[#1A1A1A]/10 border-t-[#1A1A1A] animate-spin" />
              <Scale className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-light text-xl text-[#1A1A1A] italic">
                Formulating Dilemma Analysis...
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed font-sans">
                Faisla is breaking down options, evaluating threats, and extracting initial micro-steps. This process takes 4 to 8 seconds.
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans uppercase tracking-widest text-[#1A1A1A]/60">
              <span className="w-2 h-2 bg-emerald-800 animate-ping" />
              <span>Invoking Gemini Flash Engine</span>
            </div>
          </div>
        )}

        {/* Core content switch */}
        {!isLoading && (
          <div>
            {activeAnalysis ? (
              <AnalysisDashboard
                analysis={activeAnalysis}
                onBackToComposer={handleClearForm}
                savedDilemma={loadedDilemma}
                onUpdateProgress={handleUpdateProgress}
              />
            ) : (
              <DilemmaForm
                onSubmit={handleAnalyzeDilemma}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

      </main>

      {/* Pristine simple footer */}
      <footer className="border-t border-[#D1D1CB] py-12 bg-[#F5F5F0] relative z-10" id="global-footer">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
          <p className="text-[10px] text-[#1A1A1A] font-sans tracking-[0.2em] font-bold uppercase">
            FAISLA : STRUCTURED EDITORIAL ANALYSIS SYSTEM
          </p>
          <p className="text-xs text-[#1A1A1A]/60 max-w-lg mx-auto font-sans leading-relaxed">
            All analytical content processed server-side through Gemini 2.0. Data resides secure inside your sandbox environment local storage.
          </p>
        </div>
      </footer>

    </div>
  );
}
