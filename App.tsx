import React, { useState, useEffect, useRef, useMemo } from 'react';
import Layout from './components/Layout';
import { View, Requirement, SensorWave, NeuralEvent, AnomalyMetric } from './types';
import { PRD_DATA, DHF_STRUCTURE, VERIFICATION_MATRIX, NEURAL_EVENTS } from './constants';
import { analyzeRiskPattern } from './services/geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, ReferenceLine, ScatterChart as SChart,
  XAxis as RXAxis, YAxis as RYAxis, Tooltip as RTooltip, Legend, ResponsiveContainer as RContainer,
  ReferenceDot
} from 'recharts';
import { 
  Heart, 
  ShieldAlert, 
  Users, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Cpu,
  Smartphone,
  Cloud,
  Folder,
  FileIcon,
  Send,
  Sparkles,
  Activity,
  Zap,
  Waves,
  Brain,
  Microscope,
  Fingerprint,
  TrendingUp,
  Radio,
  ArrowRight,
  Settings,
  ShieldCheck,
  Server,
  ZapOff,
  BarChart3,
  GitBranch,
  Dna,
  Baby,
  Thermometer,
  Stethoscope,
  Info,
  TrendingDown,
  Eye,
  ActivitySquare,
  BarChartHorizontal,
  Scale,
  ZapIcon,
  Layers,
  Link,
  History,
  Target,
  Wind,
  ZapIcon as Zap2,
  GitMerge,
  BoxSelect,
  TriangleAlert,
  Gauge,
  Microscope as MicroscopeIcon,
  Filter,
  ArrowDownToLine,
  ShieldCheck as ShieldCheckIcon,
  FileText,
  Share2,
  ClipboardCheck,
  ScatterChart as ScatterIcon,
  Activity as SpikesIcon,
  ScanSearch,
  ActivitySquare as ChartIcon
} from 'lucide-react';

// --- Sub-components ---

const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <div className="glass p-6 rounded-2xl relative overflow-hidden group border border-slate-800/40 transition-all hover:border-blue-500/30">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-600/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-${color}-600/20`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <div className="flex items-center gap-1.5 mt-2">
          {trend && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          <p className={`text-[10px] font-medium opacity-80 ${color === 'blue' ? 'text-blue-400' : color === 'purple' ? 'text-purple-400' : 'text-emerald-400'}`}>{sub}</p>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 shadow-lg shadow-${color}-500/5`}>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
    </div>
  </div>
);

const SectionTitle = ({ children, subtitle, icon: Icon }: { children?: React.ReactNode, subtitle?: string, icon?: any }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      {Icon && <Icon className="w-5 h-5 text-blue-500" />}
      <h2 className="text-xl font-bold text-white tracking-tight">{children}</h2>
    </div>
    {subtitle && <p className="text-slate-400 text-xs font-medium opacity-80 pl-8">{subtitle}</p>}
  </div>
);

// --- Real-time Clinical Monitor ---

const ClinicalLiveMonitor = () => {
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ bpm: 110, spo2: 98, temp: 37.1, sqi: 94, ecgPeak: 1.2 });
  const [detectedEvents, setDetectedEvents] = useState<{ id: number, time: string, type: string, conf: number }[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState({ 
    text: "Baseline analysis active...", 
    level: "Normal",
    confidence: 94.8,
    drivers: [
      { name: 'HR Variance', status: 'Stable', value: 'Nominal', description: 'Baseline consistency' },
      { name: 'PPG Amplitude', status: 'Stable', value: 'High', description: 'Strong perfusion' },
      { name: 'QRS Morphology', status: 'Stable', value: 'Normal', description: 'Sinus rhythm' }
    ]
  });
  const [statusHistory, setStatusHistory] = useState<{timestamp: string, level: string, reason: string}[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const timerRef = useRef<number>(0);
  const lastLevelRef = useRef<string>("Normal");
  
  const physioState = useRef({
    hrBase: 110,
    hrCurrent: 110,
    respFreq: 0.05,
    state: 'Resting',
    spo2Base: 98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const t = timerRef.current;
        const s = physioState.current;

        const isDistressed = (t > 200 && t < 350) || (t > 600 && t < 750);
        
        if (t % 150 === 0 && !isDistressed) {
           const states = ['Resting', 'Active', 'Resting', 'Fussing'];
           s.state = states[Math.floor(Math.random() * states.length)];
           s.hrBase = s.state === 'Active' ? 135 : s.state === 'Fussing' ? 122 : 108;
        }

        if (isDistressed) {
          s.state = 'Acute Tachycardia';
          s.hrBase = 172;
          s.spo2Base = 92;
        } else {
          s.spo2Base = 98;
        }

        const respWave = Math.sin(t * s.respFreq);
        s.hrCurrent = s.hrBase + (respWave * 5) + (Math.random() * 3);
        const hrPeriod = 60 / s.hrCurrent; 
        const beatPos = (t * 0.15) % hrPeriod;
        
        const isQRS = beatPos > 0.08 && beatPos < 0.12;
        const snnConfidence = (96.2 + Math.random() * 3.5) - (isDistressed ? 4.2 : 0);
        
        const ecgVal = isQRS ? (1.2 + Math.random() * 0.15) : (0.05 + Math.random() * 0.05);
        const ppgVal = (Math.sin(t * 0.15) * 0.2 + 0.5) + Math.random() * 0.01;
        const spo2Val = s.spo2Base + (respWave * 0.4) + (Math.random() * 0.2);

        if (isQRS && t % 5 === 0) {
           setDetectedEvents(prevE => [
             { id: t, time: new Date().toLocaleTimeString().split(' ')[0], type: 'QRS Detection', conf: snnConfidence },
             ...prevE
           ].slice(0, 3));
        }

        if (t % 8 === 0) {
           setMetrics({
             bpm: Math.round(s.hrCurrent),
             spo2: Math.round(spo2Val),
             temp: 37.1 + (isDistressed ? 0.9 : (Math.sin(t * 0.01) * 0.1)),
             sqi: 95 + (Math.random() * 4 - 2),
             ecgPeak: parseFloat(ecgVal.toFixed(2))
           });
        }

        if (t % 100 === 0) {
          setIsAiProcessing(true);
          setTimeout(() => {
            const distress = isDistressed;
            const newLevel = distress ? "Critical" : "Normal";
            const newText = distress 
                ? "CRITICAL: Abnormal HR elevation detected relative to activity profile. SpO2 threshold triggered (<94%)." 
                : "Cardiovascular profile stable. Normal sinus rhythm with typical pediatric variability.";
            
            setAiAnalysis({
              text: newText,
              level: newLevel,
              confidence: distress ? 88.4 + (Math.random() * 4) : 95.2 + (Math.random() * 2),
              drivers: distress ? [
                { name: 'HR Variance', status: 'Elevated', value: '+42%', description: 'Unstable rate transition' },
                { name: 'PPG Amplitude', status: 'Decreased', value: '-18%', description: 'Potential contractility drop' },
                { name: 'QRS Morphology', status: 'Irregular', value: 'Abnormal', description: 'Width deviation detected' }
              ] : [
                { name: 'HR Variance', status: 'Stable', value: 'Nominal', description: 'Resting rhythm consistency' },
                { name: 'PPG Amplitude', status: 'Stable', value: 'High', description: 'Optimal perfusion signal' },
                { name: 'QRS Morphology', status: 'Stable', value: 'Normal', description: 'Expected pediatric pattern' }
              ]
            });

            if (newLevel !== lastLevelRef.current || statusHistory.length === 0) {
              const now = new Date();
              const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                             now.getMinutes().toString().padStart(2, '0') + ":" + 
                             now.getSeconds().toString().padStart(2, '0');
              
              setStatusHistory(prevH => [
                { timestamp: timeStr, level: newLevel, reason: distress ? "Risk Detected" : "Stable Baseline" },
                ...prevH
              ].slice(0, 5));
              lastLevelRef.current = newLevel;
            }

            setIsAiProcessing(false);
          }, 1200);
        }

        timerRef.current += 1;
        const next = [...prev, { t, ecg: ecgVal, ppg: ppgVal, snnTrigger: isQRS, snnConf: snnConfidence }];
        return next.length > 50 ? next.slice(1) : next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [statusHistory.length]);

  const alertLevel = aiAnalysis.level === 'Critical' ? 'rose' : 'emerald';

  const SnnCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.snnTrigger && payload.ecg > 0.8) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="#10b981" fillOpacity={0.3} className="animate-ping" />
          <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
          <line x1={cx} y1={cy} x2={cx} y2={cy - 25} stroke="#10b981" strokeWidth={1} strokeDasharray="2 2" />
          <rect x={cx - 20} y={cy - 40} width={40} height={14} rx={4} fill="#020617" stroke="#10b981" strokeWidth={0.5} />
          <text x={cx} y={cy - 30} textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold" className="font-mono">
            {payload.snnConf.toFixed(1)}%
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-[2.5rem] border border-slate-800/40 overflow-hidden bg-slate-900/40">
        <div className={`px-8 py-4 flex items-center justify-between border-b transition-colors duration-500 ${
          alertLevel === 'rose' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-4">
             <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <Baby className={`w-5 h-5 ${alertLevel === 'rose' ? 'text-rose-500 animate-pulse' : 'text-blue-500'}`} />
             </div>
             <div>
                <h4 className="text-white font-bold text-sm tracking-tight">Patient: 0042-ALPHA</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pediatric Core Vitals</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${alertLevel === 'rose' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${alertLevel === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {aiAnalysis.level} State
                </span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="text-right">
                <p className="text-[9px] text-slate-500 font-bold uppercase">SQI (Signal Quality)</p>
                <p className="text-xs font-mono text-white">{metrics.sqi.toFixed(1)}%</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-800/60 divide-x divide-slate-800/60">
           <div className="p-8 flex flex-col items-center justify-center group hover:bg-emerald-500/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-2 text-emerald-500">
                 <Heart className={`w-4 h-4 ${metrics.bpm > 160 ? 'animate-bounce' : ''}`} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">HR / BPM</span>
              </div>
              <h3 className="text-5xl font-bold text-white font-mono tracking-tighter tabular-nums">
                 {metrics.bpm}
              </h3>
              <div className="flex items-center gap-1.5 mt-2">
                 <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min((metrics.bpm/200)*100, 100)}%` }}></div>
                 </div>
              </div>
           </div>

           <div className="p-8 flex flex-col items-center justify-center group hover:bg-blue-500/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                 <Activity className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">SpO₂ / %</span>
              </div>
              <h3 className={`text-5xl font-bold font-mono tracking-tighter tabular-nums ${metrics.spo2 < 94 ? 'text-rose-500' : 'text-white'}`}>
                 {metrics.spo2}
              </h3>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase">Target: 98%</span>
              </div>
           </div>

           <div className="p-8 flex flex-col items-center justify-center group hover:bg-emerald-500/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                 <Zap className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">ECG PK / mV</span>
              </div>
              <h3 className="text-5xl font-bold text-white font-mono tracking-tighter tabular-nums">
                 {metrics.ecgPeak}
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">Lead II Textile</p>
           </div>

           <div className="p-8 flex flex-col items-center justify-center group hover:bg-purple-500/[0.02] transition-colors">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                 <Thermometer className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">TEMP / °C</span>
              </div>
              <h3 className="text-5xl font-bold text-white font-mono tracking-tighter tabular-nums">
                 {metrics.temp.toFixed(1)}
              </h3>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1 w-3 rounded-full ${i < 3 ? (metrics.temp > 37.5 ? 'bg-rose-500' : 'bg-purple-500') : 'bg-slate-800'}`}></div>
                ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-x divide-slate-800/60">
           <div className="lg:col-span-2 p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                 <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Radio className="w-3 h-3 text-emerald-500" /> Multimodal Sensor Streams
                 </h5>
                 <div className="flex gap-4">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SNN QRS TRIGGER
                    </span>
                    <span className="text-[9px] font-bold text-blue-400 uppercase flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> PPG IR
                    </span>
                 </div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line 
                      type="monotone" 
                      dataKey="ecg" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={<SnnCustomDot />} 
                      isAnimationActive={false} 
                    />
                    <Line type="monotone" dataKey="ppg" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    <YAxis hide domain={[0, 1.8]} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <ScanSearch className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">SNN Inference Buffer:</span>
                 </div>
                 <div className="flex gap-4 flex-1">
                    {detectedEvents.map((evt, i) => (
                       <div key={evt.id} className={`flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300 opacity-${100 - i * 30}`}>
                          <span className="text-[9px] font-mono text-slate-500">{evt.time}</span>
                          <span className="text-[10px] text-white font-medium">{evt.type}</span>
                          <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[10px] font-bold text-emerald-500 font-mono">{evt.conf.toFixed(1)}%</span>
                          </div>
                       </div>
                    ))}
                    {detectedEvents.length === 0 && <span className="text-[10px] text-slate-600 italic">Awaiting spiking event...</span>}
                 </div>
              </div>
           </div>

           <div className="p-8 bg-slate-950/40 relative">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
                 <Brain className="w-3 h-3 text-purple-400" /> AI Interpretation Panel
              </h5>
              
              <div className="space-y-6">
                 <div className="relative">
                    {isAiProcessing && (
                       <div className="absolute inset-x-0 -top-2 h-0.5 bg-blue-500 animate-[loading_1s_infinite_linear] rounded-full"></div>
                    )}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Assessment Summary</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            aiAnalysis.level === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {aiAnalysis.level}
                          </span>
                       </div>
                       <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                          "{aiAnalysis.text}"
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={125.6} 
                            strokeDashoffset={125.6 - (aiAnalysis.confidence / 100) * 125.6}
                            strokeLinecap="round"
                            className={`transition-all duration-1000 ${aiAnalysis.confidence > 90 ? 'text-emerald-500' : 'text-amber-500'}`}
                          />
                       </svg>
                       <span className="absolute text-[10px] font-bold text-white font-mono">{Math.round(aiAnalysis.confidence)}%</span>
                    </div>
                    <div>
                       <h6 className="text-[10px] font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                          <Target className="w-3 h-3 text-purple-400" /> Interpretation Confidence
                       </h6>
                       <p className="text-[9px] text-slate-500 font-medium">Derived from 450+ latency-pooled markers</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-3 h-3 text-blue-400" /> Diagnostic Evidence (XAI)
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {aiAnalysis.drivers.map((driver, idx) => (
                        <div key={idx} className="group relative p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-blue-500/30 transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-300 font-bold tracking-tight">{driver.name}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{driver.value}</span>
                               <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                 driver.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-400' : 
                                 driver.status === 'Elevated' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                               }`}>
                                 {driver.status}
                               </span>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                             {driver.description}
                          </p>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3" /> Detection History
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {statusHistory.length > 0 ? statusHistory.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/30 border border-slate-800/40">
                          <span className="text-[9px] font-mono text-slate-500">{h.timestamp}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${h.level === 'Critical' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                          <span className={`text-[10px] font-bold uppercase tracking-tight flex-1 ${h.level === 'Critical' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {h.level}
                          </span>
                          <span className="text-[9px] text-slate-500">{h.reason}</span>
                        </div>
                      )) : (
                        <p className="text-[9px] text-slate-600 text-center py-2">Waiting for clinical assessment...</p>
                      )}
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex gap-3">
                 <button className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <ActivitySquare className="w-3 h-3" /> Wave Export
                 </button>
                 <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Auditor Performance Components ---

const SubgroupPerformanceDashboard = () => {
  const ageData = [
    { bracket: '0-1y', auc: 0.94, sensitivity: 0.91, specificity: 0.96 },
    { bracket: '1-3y', auc: 0.96, sensitivity: 0.93, specificity: 0.98 },
    { bracket: '3-5y', auc: 0.95, sensitivity: 0.92, specificity: 0.97 },
  ];

  const skinToneData = [
    { tone: 'I-II', auc: 0.97, sensitivity: 0.94 },
    { tone: 'III-IV', auc: 0.96, sensitivity: 0.93 },
    { tone: 'V-VI', auc: 0.94, sensitivity: 0.90 },
  ];

  const activityData = [
    { profile: 'Resting', auc: 0.98, sqi: 98 },
    { profile: 'Moderate', auc: 0.94, sqi: 92 },
    { profile: 'High/Crying', auc: 0.88, sqi: 74 },
  ];

  const motionRobustnessData = [
    { motion: 0, sensitivity: 0.98 },
    { motion: 20, sensitivity: 0.96 },
    { motion: 40, sensitivity: 0.92 },
    { motion: 60, sensitivity: 0.88 },
    { motion: 80, sensitivity: 0.82 },
    { motion: 100, sensitivity: 0.74 },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
           <Scale className="w-4 h-4 text-purple-400" /> Model Transparency Dashboard
        </h4>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
           <ShieldCheckIcon className="w-3 h-3" /> FDA SaMD COMPLIANT
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border border-slate-800/60">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Age Stratification (AUC)</p>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={ageData}>
                 <XAxis dataKey="bracket" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                 <YAxis hide domain={[0, 1]} />
                 <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
                 <Bar dataKey="auc" radius={[4, 4, 0, 0]}>
                   {ageData.map((_, i) => (
                     <Cell key={i} fill={i === 1 ? '#3b82f6' : '#1e293b'} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-slate-800/60">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">PPG Bias: Fitzpatrick Scales</p>
           <div className="space-y-4">
             {skinToneData.map((item, i) => (
               <div key={i} className="space-y-1">
                 <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-slate-400">Tone {item.tone}</span>
                    <span className="text-white font-mono">{item.auc.toFixed(2)} AUC</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${item.auc * 100}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-slate-800/60">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Activity SQI Radar</p>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activityData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="profile" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                  <Radar name="SQI Uptime" dataKey="sqi" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-slate-800/60">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Motion Sensitivity Decay</p>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={motionRobustnessData}>
                 <XAxis dataKey="motion" tick={{ fill: '#94a3b8', fontSize: 8 }} />
                 <YAxis hide domain={[0, 1]} />
                 <Area type="monotone" dataKey="sensitivity" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} dot={false} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           <p className="text-[8px] text-center text-slate-500 uppercase mt-2">Motion Intensity (%) vs Detection Sensitivity</p>
        </div>
      </div>
    </div>
  );
};

// --- Synaptic Activity Monitor (SNN Layers) ---

const LayerSpikeSparkline = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-10 w-full mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="rate" 
          stroke={color} 
          strokeWidth={1.5} 
          dot={false} 
          isAnimationActive={false} 
        />
        <YAxis hide domain={[0, 100]} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const SynapticActivityMonitor = () => {
  const [spikeDensity, setSpikeDensity] = useState<any[]>([]);
  const [rasterSpikes, setRasterSpikes] = useState<any[]>([]);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const t = timerRef.current;
      const isPVC = (t > 100 && t < 150); 
      const isRespTransition = (t % 80 < 10);

      const newSpikes: any[] = [];
      const layers = [1, 2, 3];
      
      layers.forEach(layer => {
        let prob = 0.1;
        if (layer === 1) prob = 0.4 + (isPVC ? 0.3 : 0);
        if (layer === 2) prob = 0.2 + (isPVC ? 0.2 : 0) + (isRespTransition ? 0.1 : 0);
        if (layer === 3) prob = 0.05 + (isPVC ? 0.15 : 0);

        if (Math.random() < prob) {
          newSpikes.push({ time: t, layer, type: isPVC ? 'arrhythmia' : 'physiological' });
        }
      });

      setRasterSpikes(prev => [...prev, ...newSpikes].filter(s => s.time > t - 50));

      setSpikeDensity(prev => {
        const inputRate = 45 + (isPVC ? 40 : 0) + Math.random() * 10;
        const hiddenRate = 20 + (isPVC ? 15 : 0) + (isRespTransition ? 5 : 0) + Math.random() * 5;
        const outputRate = 2 + (isPVC ? 8 : 0) + Math.random() * 2;

        const next = [...prev, { time: t, inputRate, hiddenRate, outputRate, isEvent: isPVC ? 1 : 0 }];
        return next.length > 50 ? next.slice(1) : next;
      });

      timerRef.current += 1;
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const layerMetrics = [
    { 
      name: 'Input Encoder', 
      firingRate: '48.2 Hz', 
      burstIndex: '12%', 
      meanISI: '20.7 ms', 
      latency: '0.4 ms', 
      color: '#3b82f6',
      trend: spikeDensity.map(d => ({ rate: d.inputRate }))
    },
    { 
      name: 'Feature Map', 
      firingRate: '22.5 Hz', 
      burstIndex: '28%', 
      meanISI: '44.4 ms', 
      latency: '1.2 ms', 
      color: '#a855f7',
      trend: spikeDensity.map(d => ({ rate: d.hiddenRate }))
    },
    { 
      name: 'Classifier', 
      firingRate: '4.1 Hz', 
      burstIndex: '65%', 
      meanISI: '243 ms', 
      latency: '1.8 ms', 
      color: '#10b981',
      trend: spikeDensity.map(d => ({ rate: d.outputRate * 10 }))
    },
  ];

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-slate-800/40 space-y-8 bg-slate-900/20">
      <div className="flex items-center justify-between">
        <SectionTitle subtitle="Layer-wise SNN Spike Train Decomposition & Temporal Characteristics" icon={ZapIcon}>
           Synaptic Activity Intelligence
        </SectionTitle>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase rounded-lg">Real-time SNN Event Monitor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-8">
            <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                 <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <SpikesIcon className="w-3 h-3 text-emerald-500" /> Temporal Spike Raster (Raster Plot)
                 </h5>
                 <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 uppercase"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Encoder</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-purple-400 uppercase"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Feature</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> SNN QRS TRIGGER</span>
                 </div>
              </div>
              <div className="h-40 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <SChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                       <RXAxis type="number" dataKey="time" domain={['auto', 'auto']} hide />
                       <RYAxis type="number" dataKey="layer" domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={(val) => val === 1 ? 'ENC' : val === 2 ? 'FEAT' : 'OUT'} tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                       <RTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b' }} />
                       <Scatter data={rasterSpikes} fill="#3b82f6" shape="square">
                          {rasterSpikes.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.layer === 1 ? '#3b82f6' : entry.layer === 2 ? '#a855f7' : '#10b981'} />
                          ))}
                       </Scatter>
                    </SChart>
                 </ResponsiveContainer>
                 <div className="absolute left-12 right-0 bottom-0 h-px bg-slate-800"></div>
              </div>
              <p className="mt-4 text-[9px] text-slate-500 text-center uppercase tracking-widest font-medium opacity-60">Synchronized asynchronous spiking events correlated to clinical QRS peaks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">ISI Distribution (Inter-Spike Interval)</h5>
                  <div className="h-32 w-full flex items-end gap-1 px-4">
                     {[2, 5, 8, 12, 45, 62, 34, 15, 8, 4, 2].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-500/20 border-t border-blue-500/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-2">
                     <span>5ms</span>
                     <span>Mean: 22ms</span>
                     <span>150ms</span>
                  </div>
               </div>

               <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"><Wind className="w-4 h-4 text-purple-400" /></div>
                     <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Respiration Modulation</p>
                        <p className="text-xs text-white font-medium">Spike frequency coupled to inhalation phase.</p>
                     </div>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
                     <div className="h-full bg-purple-500 animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-purple-400 uppercase">Sinus Arrhythmia Synchronization: 88% Coherence</span>
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <Layers className="w-3 h-3" /> Synaptic Metrics
            </p>
            {layerMetrics.map((layer, idx) => (
               <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/20 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[10px] font-bold" style={{ color: layer.color }}>{layer.name}</span>
                     <span className="text-[8px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">{layer.latency}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <p className="text-[7px] text-slate-600 uppercase font-bold mb-1">Mean ISI</p>
                        <p className="text-[10px] text-white font-bold">{layer.meanISI}</p>
                     </div>
                     <div>
                        <p className="text-[7px] text-slate-600 uppercase font-bold mb-1">Bursting</p>
                        <p className="text-[10px] text-white font-bold">{layer.burstIndex}</p>
                     </div>
                  </div>
                  <LayerSpikeSparkline data={layer.trend} color={layer.color} />
                  <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity">
                     <div className="h-full bg-blue-500" style={{ width: `${Math.random() * 100}%` }}></div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="pt-6 border-t border-slate-800/40">
         <div className="flex items-center gap-2 mb-4">
            <Link className="w-4 h-4 text-emerald-500" />
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Clinical-Synaptic Correlation Matrix</h5>
         </div>
         <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/20">
            <table className="w-full text-left">
               <thead className="bg-slate-950/80">
                  <tr className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                     <th className="px-6 py-4">Physiological Event</th>
                     <th className="px-6 py-4">Spike Pattern Character</th>
                     <th className="px-6 py-4">Layer 1 (ENC) Δ ISI</th>
                     <th className="px-6 py-4">Layer 3 (OUT) Bursting</th>
                     <th className="px-6 py-4">Diagnostic Inference</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-blue-500/[0.02] transition-colors">
                     <td className="px-6 py-4 text-[10px] text-white font-medium flex items-center gap-2">
                        <Heart className="w-3 h-3 text-rose-500" /> PVC Event
                     </td>
                     <td className="px-6 py-4 text-[10px] text-slate-400 italic">Pre-mature High-Freq Burst</td>
                     <td className="px-6 py-4 text-[10px] text-rose-400 font-mono">-15.2 ms</td>
                     <td className="px-6 py-4 text-[10px] text-rose-400 font-mono">92% Index</td>
                     <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[8px] font-bold uppercase border border-rose-500/20">Arrhythmia Detect</span></td>
                  </tr>
                  <tr className="hover:bg-blue-500/[0.02] transition-colors">
                     <td className="px-6 py-4 text-[10px] text-white font-medium flex items-center gap-2">
                        <Wind className="w-3 h-3 text-blue-400" /> Respiration Shift
                     </td>
                     <td className="px-6 py-4 text-[10px] text-slate-400 italic">Harmonic Rate Modulation</td>
                     <td className="px-6 py-4 text-[10px] text-blue-400 font-mono">+2.1 ms</td>
                     <td className="px-6 py-4 text-[10px] text-blue-400 font-mono">14% Index</td>
                     <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase border border-blue-500/20">Normal Phys. Loop</span></td>
                  </tr>
                  <tr className="hover:bg-blue-500/[0.02] transition-colors">
                     <td className="px-6 py-4 text-[10px] text-white font-medium flex items-center gap-2">
                        <Fingerprint className="w-3 h-3 text-amber-500" /> Motion Artifact
                     </td>
                     <td className="px-6 py-4 text-[10px] text-slate-400 italic">Asynchronous Noise Scatter</td>
                     <td className="px-6 py-4 text-[10px] text-slate-500 font-mono">0.0 ms (Decoupled)</td>
                     <td className="px-6 py-4 text-[10px] text-amber-400 font-mono">45% Index</td>
                     <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 text-[8px] font-bold uppercase border border-slate-700">Filter Applied</span></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// --- Helper for Event Markers in Charts ---
const ReferenceArea = ({ x1, x2, y1, y2, fill, fillOpacity }: any) => (
   <rect 
      x={x1} 
      y={y1} 
      width={x2 - x1} 
      height={y2 - y1} 
      fill={fill} 
      fillOpacity={fillOpacity} 
      className="pointer-events-none" 
   />
);

// --- Overview View ---

const OverviewView = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active SQI" value="96.2%" sub="Signal Quality Index" icon={Zap} color="blue" trend={2.4} />
        <StatCard title="Heart Rate" value="112 BPM" sub="Avg (Last 1hr)" icon={Activity} color="emerald" trend={-1.2} />
        <StatCard title="Anomaly Score" value="Nominal" sub="Unsupervised Engine" icon={Fingerprint} color="purple" />
        <StatCard title="SNN Latency" value="1.8 ms" sub="Edge-Core Inference" icon={Brain} color="blue" />
      </div>

      <ClinicalLiveMonitor />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnomalyCore />
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border border-emerald-500/10 h-full">
            <SectionTitle subtitle="Neural event timeline" icon={Zap}>Detection Log</SectionTitle>
            <div className="space-y-4">
              {NEURAL_EVENTS.map((event, i) => (
                <div key={i} className="group relative pl-6 py-2 border-l border-slate-800 hover:border-blue-500/50 transition-all">
                  <div className={`absolute left-[-5px] top-4 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                    event.type === 'Arrhythmia' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{event.timestamp}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      event.source === 'SNN-Edge' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>{event.source}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1">{event.type}</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ENHANCED ANOMALY DETECTION MODULE ---

const DriverTrendItem = ({ label, color, value, history, icon: Icon }: { label: string, color: string, value: number, history: any[], icon?: any }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-tight">
       <span className="flex items-center gap-1.5" style={{ color }}>
          {Icon && <Icon className="w-2.5 h-2.5" />}
          {label}
       </span>
       <span className="text-white font-mono">{(value * 100 || 0).toFixed(0)}%</span>
    </div>
    <div className="h-8 w-full flex items-center px-1 mt-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history}>
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false} 
          />
          <YAxis hide domain={[0, 1.2]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AnomalyCore = () => {
  const [data, setData] = useState<SensorWave[]>([]);
  const [anomalyHistory, setAnomalyHistory] = useState<any[]>([]);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [anomalyCount, setAnomalyCount] = useState(0);
  const timerRef = useRef<number>(0);
  
  const baselineState = useRef({
    ecg: 0.08,
    ppg: 0.04,
    scg: 0.03,
    hr: 110,
    alpha: 0.005,
    rnnTrend: 0,
    ifDensity: 0.5
  });

  const physioState = useRef({
    hrTarget: 110,
    hrBase: 110,
    hrCurrent: 110,
    respFreq: 0.05,
    motionIntensity: 0.05,
    isMotionBurst: false,
    motionBurstTimer: 0,
    ectopicProbability: 0.005,
    pathology: 'None' as 'None' | 'SVT' | 'Bradycardia' | 'PVC_Burst',
    state: 'Resting' as 'Resting' | 'Fussing' | 'Crying' | 'Active',
    temporalTrend: 0
  });

  const ANOMALY_THRESHOLD = 0.65;

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const t = timerRef.current;
        const s = physioState.current;
        const b = baselineState.current;

        // --- Behavioral & Pathology Transitions ---
        if (t % 150 === 0) {
          const rand = Math.random();
          s.pathology = 'None';
          s.ectopicProbability = 0.005;

          if (rand > 0.94) {
             s.pathology = 'SVT';
             s.hrTarget = 245; 
             s.respFreq = 0.12;
             s.motionIntensity = 0.1;
          } else if (rand > 0.88) {
             s.pathology = 'Bradycardia';
             s.hrTarget = 48; 
             s.respFreq = 0.03;
             s.motionIntensity = 0.02;
          } else if (rand > 0.82) {
             s.pathology = 'PVC_Burst';
             s.ectopicProbability = 0.45;
             s.hrTarget = 125;
          } else if (rand > 0.65) { 
            s.state = 'Crying'; s.hrTarget = 165; s.respFreq = 0.14; s.motionIntensity = 0.9; 
          } else if (rand > 0.45) { 
            s.state = 'Active'; s.hrTarget = 135; s.respFreq = 0.09; s.motionIntensity = 0.45; 
          } else { 
            s.state = 'Resting'; s.hrTarget = 105; s.respFreq = 0.04; s.motionIntensity = 0.04; 
          }
        }

        s.hrBase += (s.hrTarget - s.hrBase) * 0.05;
        const respWave = Math.sin(t * s.respFreq);
        s.hrCurrent = s.hrBase + (respWave * 10) + (Math.random() * 5 - 2.5);
        
        const hrPeriod = 60 / s.hrCurrent; 
        let beatPosition = (t * 0.18) % hrPeriod; 
        let isPVC = Math.random() < s.ectopicProbability;
        if (isPVC) beatPosition = 0.04; 

        const qrsWidthFactor = s.pathology === 'SVT' ? 0.8 : (s.pathology === 'Bradycardia' ? 1.2 : 1.0);
        const qrsAmplitude = beatPosition < 0.12 ? (isPVC ? 2.1 : (1.3 * qrsWidthFactor) + Math.random() * 0.25) : (0.06 + Math.random() * 0.04);
        
        const activeMotionNoise = (Math.random() - 0.5) * s.motionIntensity * 1.5;
        const strokeVolumeFactor = s.pathology === 'SVT' ? 0.45 : (s.pathology === 'Bradycardia' ? 1.35 : 1.0);

        // Feature Contribution Integration
        const ecgContribution = (isPVC ? 0.8 : (s.pathology === 'SVT' ? 0.6 : (s.pathology === 'Bradycardia' ? 0.4 : 0.05))) + (Math.random() * 0.05);
        const ppgContribution = (strokeVolumeFactor < 0.8 ? 0.5 : (strokeVolumeFactor > 1.2 ? 0.3 : 0.1)) + (Math.random() * 0.05);
        const scgContribution = (s.state === 'Crying' ? 0.4 : (s.pathology !== 'None' ? 0.5 : 0.1)) + (activeMotionNoise > 0.5 ? 0.2 : 0);
        
        const totalScore = Math.min((ecgContribution * 0.5) + (ppgContribution * 0.3) + (scgContribution * 0.2), 1.0);

        const newPoint: SensorWave = {
          time: t,
          ecg: (qrsAmplitude + activeMotionNoise),
          ppg: (((Math.sin(t * 0.18) * 0.25 + 0.6) * strokeVolumeFactor)),
          scg: (((Math.cos(t * 0.6) * 0.2) * strokeVolumeFactor)),
          anomalyScore: totalScore
        };

        if (t % 5 === 0) {
          setAnomalyHistory(h => [...h, { 
            timestamp: t, 
            score: totalScore, 
            ecgDev: ecgContribution, 
            ppgDev: ppgContribution, 
            scgDev: scgContribution,
            state: s.state, 
            pathology: s.pathology 
          }].slice(-40));
        }

        if (calibrationProgress < 100) setCalibrationProgress(p => Math.min(p + 0.4, 100));
        if (s.pathology === 'None' && calibrationProgress >= 100) b.hr = b.hr * 0.99 + s.hrCurrent * 0.01;

        timerRef.current += 1;
        return [...prev, newPoint].slice(-60);
      });
    }, 120);
    return () => clearInterval(interval);
  }, [calibrationProgress]);

  const currentStatus = useMemo(() => {
    const lastPoint = data[data.length - 1];
    const lastScore = lastPoint?.anomalyScore || 0;
    const s = physioState.current;
    if (s.pathology !== 'None' || lastScore > ANOMALY_THRESHOLD) return { label: s.pathology !== 'None' ? `Pathological Event: ${s.pathology.replace('_', ' ')}` : 'System Alert: Multimodal Outlier', color: 'rose', pulse: true, icon: TriangleAlert };
    if (calibrationProgress < 100) return { label: 'Temporal Baseline Training...', color: 'amber', pulse: true, icon: Zap };
    return { label: 'Multimodal Baseline Stable', color: 'emerald', pulse: false, icon: CheckCircle2 };
  }, [data, calibrationProgress]);

  return (
    <div className="space-y-6">
      <div className="glass p-8 rounded-[2.5rem] border border-blue-500/10 overflow-hidden relative bg-slate-950/20">
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end z-20">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-${currentStatus.color}-500/10 border border-${currentStatus.color}-500/20 shadow-xl backdrop-blur-md transition-colors duration-500`}>
            <currentStatus.icon className={`w-3.5 h-3.5 text-${currentStatus.color}-500 ${currentStatus.pulse ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] font-bold text-${currentStatus.color}-500 uppercase tracking-widest`}>{currentStatus.label}</span>
          </div>
          <div className="mt-2 text-[9px] text-slate-500 font-mono flex items-center gap-2 bg-slate-950/50 px-2 py-0.5 rounded-md">
            <Target className="w-3 h-3" /> FUSION GATE: {ANOMALY_THRESHOLD}
          </div>
        </div>
        <SectionTitle subtitle="Stacked Contribution Analysis of Multimodal Neural Marker Deviations" icon={Brain}>Pediatric Hemodynamic Anomaly Engine</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 h-72 relative">
             <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-3xl opacity-20 pointer-events-none"></div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={anomalyHistory}>
                <defs>
                  <linearGradient id="ecgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/><stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/></linearGradient>
                  <linearGradient id="ppgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/></linearGradient>
                  <linearGradient id="scgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/></linearGradient>
                </defs>
                <XAxis dataKey="timestamp" hide />
                <YAxis hide domain={[0, 1.5]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8' }} />
                <ReferenceLine y={ANOMALY_THRESHOLD} stroke="#f43f5e" strokeDasharray="4 4" label={{ position: 'right', value: 'CRIT', fill: '#f43f5e', fontSize: 9, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="ecgDev" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#ecgGrad)" strokeWidth={2} name="ECG Morphology Dev" />
                <Area type="monotone" dataKey="ppgDev" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#ppgGrad)" strokeWidth={2} name="PPG Perfusion Drop" />
                <Area type="monotone" dataKey="scgDev" stackId="1" stroke="#f59e0b" fillOpacity={1} fill="url(#scgGrad)" strokeWidth={2} name="SCG Pattern Shift" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1"><ChartIcon className="w-3 h-3 text-blue-400" /> Feature Vectors</h4>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 shadow-inner">
               <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <p className="text-[8px] text-slate-500 font-bold uppercase">Clinical State</p>
                  <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${physioState.current.pathology !== 'None' ? 'text-rose-400' : 'text-blue-400'}`}>
                    {physioState.current.pathology !== 'None' ? physioState.current.pathology.replace('_', ' ') : physioState.current.state}
                  </span>
               </div>
               <div className="pt-1 border-t border-slate-800/20">
                  <p className="text-[8px] text-slate-500 font-bold uppercase mb-3">Marker Risk Weightings</p>
                  <div className="space-y-3">
                    <DriverTrendItem label="ECG Morph" color="#10b981" value={anomalyHistory[anomalyHistory.length-1]?.ecgDev} history={anomalyHistory.slice(-10).map(h => ({ val: h.ecgDev }))} icon={SpikesIcon} />
                    <DriverTrendItem label="PPG Damp" color="#3b82f6" value={anomalyHistory[anomalyHistory.length-1]?.ppgDev} history={anomalyHistory.slice(-10).map(h => ({ val: h.ppgDev }))} icon={Activity} />
                    <DriverTrendItem label="SCG Shift" color="#f59e0b" value={anomalyHistory[anomalyHistory.length-1]?.scgDev} history={anomalyHistory.slice(-10).map(h => ({ val: h.scgDev }))} icon={Zap} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Missing View Components ---

const PRDView = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionTitle subtitle="Traceability matrix of clinical and technical requirements" icon={FileText}>Requirements Engineering</SectionTitle>
    <div className="grid grid-cols-1 gap-4">
      {PRD_DATA.map((req) => (
        <div key={req.id} className="glass p-6 rounded-2xl border border-slate-800/40 flex items-center justify-between group hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${
              req.type === 'FR' ? 'bg-blue-500/10 text-blue-500' : 
              req.type === 'MLR' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {req.id}
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{req.title}</h4>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{req.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
              req.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'
            }`}>
              {req.priority}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
              req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              {req.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ArchitectureView = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionTitle subtitle="Distributed compute from textile-embedded SNN to Cloud CNN" icon={Share2}>System Topology</SectionTitle>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="glass p-8 rounded-3xl border border-slate-800/60 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-xl shadow-blue-500/5">
          <Smartphone className="text-blue-500 w-8 h-8" />
        </div>
        <h4 className="text-white font-bold mb-2">On-Body Edge (SNN)</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-6">Ultra-low power spiking neural network performing QRS detection and rhythm analysis in micro-watt regime.</p>
        <div className="w-full space-y-2 text-left">
           <div className="flex justify-between text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-1"><span>Target HW</span><span>Cortex-M4F</span></div>
           <div className="flex justify-between text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-1"><span>Inference Latency</span><span>&lt;2ms</span></div>
        </div>
      </div>
      <div className="flex items-center justify-center">
         <div className="flex flex-col items-center gap-2">
            <div className="h-px w-24 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">BLE 5.2 / Mesh</span>
         </div>
      </div>
      <div className="glass p-8 rounded-3xl border border-slate-800/60 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-xl shadow-purple-500/5">
          <Cloud className="text-purple-500 w-8 h-8" />
        </div>
        <h4 className="text-white font-bold mb-2">Clinical Core (CNN)</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-6">Heavyweight multi-path CNN fusion engine for structural anomaly detection and longitudinal risk tracking.</p>
        <div className="w-full space-y-2 text-left">
           <div className="flex justify-between text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-1"><span>Backend</span><span>GCP Vertex AI</span></div>
           <div className="flex justify-between text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-1"><span>Accuracy</span><span>94.2% AUC</span></div>
        </div>
      </div>
    </div>
  </div>
);

const NeuralAnalysisView = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionTitle subtitle="Low-level spike train analysis and synaptic firing patterns" icon={Brain}>Neural Intelligence Deep-Dive</SectionTitle>
    <SynapticActivityMonitor />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
       <div className="glass p-8 rounded-3xl border border-slate-800/60">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
             <Dna className="w-4 h-4 text-blue-400" /> Genomic Architecture
          </h4>
          <div className="space-y-4">
             {['LIF Neuron Model', 'STDP Learning Rule', 'Temporal Coding', 'Surrogate Gradient Descent'].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-white font-medium">{item}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
               </div>
             ))}
          </div>
       </div>
       <div className="glass p-8 rounded-3xl border border-slate-800/60">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
             <Cpu className="w-4 h-4 text-purple-400" /> Hardware Acceleration
          </h4>
          <div className="h-40 w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><Server className="w-4 h-4 text-blue-400" /></div>
                <div>
                   <p className="text-[10px] text-white font-bold uppercase">SNN Pipeline V3</p>
                   <p className="text-[8px] text-slate-500">Compiling for ARM CMSIS-NN...</p>
                </div>
             </div>
             <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[78%]"></div>
             </div>
             <p className="text-[9px] text-slate-400 italic">"Optimizing sparsity: 82.4% zero-weight pruning achieved."</p>
          </div>
       </div>
    </div>
  </div>
);

const DHFView = () => {
  const renderFiles = (files: any[]) => (
    <div className="space-y-2 ml-4">
      {files.map((file, i) => (
        <div key={i} className="group">
          <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
            {file.type === 'Folder' ? <Folder className="w-4 h-4 text-blue-400" /> : <FileIcon className="w-4 h-4 text-slate-500" />}
            <span className="text-xs text-slate-300 font-medium">{file.name}</span>
            {file.status && (
              <span className={`text-[8px] ml-auto px-1.5 py-0.5 rounded font-bold uppercase ${
                file.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>{file.status}</span>
            )}
          </div>
          {file.children && renderFiles(file.children)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <SectionTitle subtitle="Design History File structure per ISO 13485" icon={ShieldCheck}>Regulatory Repository</SectionTitle>
      <div className="glass p-8 rounded-3xl border border-slate-800/60 max-w-2xl">
        {renderFiles(DHF_STRUCTURE)}
      </div>
    </div>
  );
};

const VerificationView = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <SectionTitle subtitle="Verification results and protocol alignment" icon={ClipboardCheck}>Verification Matrix</SectionTitle>
    <div className="glass rounded-3xl border border-slate-800/60 overflow-hidden bg-slate-900/40">
      <table className="w-full text-left">
        <thead className="bg-slate-950/80">
          <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
            <th className="px-6 py-4">Req ID</th>
            <th className="px-6 py-4">Method</th>
            <th className="px-6 py-4">Protocol</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {VERIFICATION_MATRIX.map((item, i) => (
            <tr key={i} className="hover:bg-blue-500/[0.02] transition-colors">
              <td className="px-6 py-4 text-xs font-mono text-blue-400">{item.reqId}</td>
              <td className="px-6 py-4 text-xs text-slate-300">{item.method}</td>
              <td className="px-6 py-4 text-xs text-slate-500 font-mono">{item.protocolId}</td>
              <td className="px-6 py-4">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                  item.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  item.status === 'Fail' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-[11px] text-slate-400 italic">{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AIAuditorView = () => {
  const [input, setInput] = useState('');
  const [showTransparency, setShowTransparency] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Neural Intelligence Auditor online. Analyzing pediatric cardiac markers, SNN optimization, and subgroup bias monitoring (Age/Skin Tone/Activity). How can I assist with your clinical transparency or regulatory analysis today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const userMsg = customPrompt || input;
    if (!userMsg.trim() || isLoading) return;
    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const aiResponse = await analyzeRiskPattern(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  const runBiasAudit = () => {
    const auditPrompt = `Perform a comprehensive equity audit of the current risk model. 
    1. Analyze potential performance biases across age groups (0-1y, 1-3y, 3-5y) and skin tones (Fitzpatrick I-VI).
    2. Evaluate robustness against various motion profiles (Resting, Feeding, Active, Crying).
    3. Suggest specific SNN architecture adjustments (e.g., adaptive temporal dilation) or training data enhancements (e.g., specific ethnic data sourcing) to improve performance equity.
    4. Ensure alignment with FDA SaMD guidelines for AI/ML monitoring.`;
    handleSend(auditPrompt);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <SectionTitle subtitle="Intelligence-driven neural cardiac compliance assistant" icon={Brain}>Neural AI Auditor</SectionTitle>
        <div className="flex gap-3">
          <button 
            onClick={runBiasAudit}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600/20 shadow-lg shadow-blue-500/5 disabled:opacity-50"
          >
            <ShieldCheckIcon className="w-4 h-4" />
            Generate Equity Audit Report
          </button>
          <button 
            onClick={() => setShowTransparency(!showTransparency)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border ${
              showTransparency ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <BarChartHorizontal className="w-4 h-4" />
            {showTransparency ? 'Hide Transparency Dashboard' : 'View Performance Transparency'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className={`flex flex-col glass rounded-[2.5rem] overflow-hidden relative border border-blue-500/10 shadow-2xl transition-all duration-500 ${showTransparency ? 'lg:w-1/2' : 'w-full'}`}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[13px] leading-relaxed tracking-tight ${
                  msg.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 backdrop-blur-md'
                }`}>
                  {msg.text.split('\n').map((line, idx) => <p key={idx} className={line.startsWith('#') || line.startsWith('*') ? 'mb-1 font-semibold' : 'mb-2'}>{line}</p>)}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 animate-pulse flex gap-2">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </div>
            )}
          </div>
          <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/60 flex gap-3 items-center">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about age-bias mitigation, SNN efficiency, or FDA ISO gaps..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium"
            />
            <button onClick={() => handleSend()} disabled={isLoading} className="p-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
        {showTransparency && <div className="lg:w-1/2 overflow-y-auto custom-scrollbar"><SubgroupPerformanceDashboard /></div>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.OVERVIEW);
  const renderContent = () => {
    switch (currentView) {
      case View.OVERVIEW: return <OverviewView />;
      case View.PRD: return <PRDView />;
      case View.ARCHITECTURE: return <ArchitectureView />;
      case View.NEURAL_ANALYSIS: return <NeuralAnalysisView />;
      case View.DHF: return <DHFView />;
      case View.VERIFICATION: return <VerificationView />;
      case View.AI_AUDITOR: return <AIAuditorView />;
      default: return <OverviewView />;
    }
  };
  return <Layout currentView={currentView} setView={setView}>{renderContent()}</Layout>;
};

export default App;