import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  Share2, 
  ShieldCheck, 
  ClipboardCheck, 
  BrainCircuit,
  Activity,
  ChevronRight,
  Brain,
  Info
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: View.OVERVIEW, icon: LayoutDashboard, label: 'Market Overview' },
    { id: View.PRD, icon: FileText, label: 'Product Requirements' },
    { id: View.ARCHITECTURE, icon: Share2, label: 'System Architecture' },
    { id: View.NEURAL_ANALYSIS, icon: Brain, label: 'Neural Intelligence' },
    { id: View.DHF, icon: ShieldCheck, label: 'ISO 13485 / DHF' },
    { id: View.VERIFICATION, icon: ClipboardCheck, label: 'Verification Matrix' },
    { id: View.AI_AUDITOR, icon: BrainCircuit, label: 'AI Auditor' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-800/60 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white">Hakilix<span className="text-blue-500">M</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold opacity-80">Pediatric Cardiac Intel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden border ${
                  isActive 
                  ? 'bg-blue-600/10 text-white border-blue-500/20 shadow-sm' 
                  : 'text-slate-400 bg-transparent border-transparent hover:bg-slate-900/40 hover:text-slate-100 hover:border-slate-800/80 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] rounded-full my-2 ml-0.5 animate-pulse" />
                )}
                
                <div className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110 translate-x-0 group-hover:translate-x-0.5'
                }`}>
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-pulse" />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
                    isActive 
                    ? 'text-blue-400' 
                    : 'text-slate-500 group-hover:text-slate-300'
                  }`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`font-medium text-sm tracking-wide transition-all duration-300 ${
                  isActive ? 'translate-x-1.5 font-semibold' : 'group-hover:translate-x-1'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-100 text-blue-500/80 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-4">
          <div className="p-4 rounded-xl glass-blue border border-blue-500/10 bg-blue-500/[0.02]">
            <p className="text-xs text-blue-300 font-bold mb-1.5 flex items-center justify-between">
              Status <span className="text-[10px] bg-blue-500/20 px-1.5 rounded">V0.1.2</span>
            </p>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out"
                style={{ width: '45%' }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-tight">AI Core: Active</p>
          </div>

          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex flex-col gap-1 text-[8px] text-slate-500 font-medium">
              <p className="flex items-center gap-1.5">
                <Info className="w-2.5 h-2.5 text-blue-500/60" />
                PI: Musah Shaibu (MS3)
              </p>
              <p className="text-slate-600 truncate">research@hakilix.co.uk</p>
              <p className="mt-1 leading-tight">
                Copyright © 2025 Hakilix Labs UK Ltd. Proprietary and Confidential.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

        <header className="h-16 glass border-b border-slate-800/60 px-8 flex items-center justify-between z-10">
          <h2 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            Workspace <ChevronRight className="w-4 h-4 opacity-30" /> 
            <span className="text-slate-100 font-semibold tracking-wide">
              {navItems.find(i => i.id === currentView)?.label}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]"></div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Neural Sync Active</span>
            </div>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold transition-all hover:border-slate-700 hover:shadow-lg active:scale-95">
              Export Dossier
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;