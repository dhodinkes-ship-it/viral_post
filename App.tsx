
import React, { useState, useRef } from 'react';
import { VideoMetadata, AnalysisState } from './types';
import { analyzeContent } from './services/geminiService';
import { CircularScore } from './components/CircularScore';
import { TimelineVisualizer } from './components/TimelineVisualizer';
import { 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ArrowRight,
  RefreshCcw,
  Sparkles,
  Camera,
  Layers,
  Layout,
  PlayCircle,
  Globe,
  TrendingUp
} from 'lucide-react';

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    description: '',
    hashtags: [],
    niche: 'Entertainment',
    platform: 'TikTok'
  });
  
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    statusText: '',
    report: null,
    error: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMetadata(prev => ({ ...prev, videoBlob: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!metadata.title.trim()) {
      setState(prev => ({ ...prev, error: "Silakan masukkan Judul atau URL Video untuk dianalisis." }));
      return;
    }

    const isUrl = metadata.title.toLowerCase().includes('http');

    setState({
      isAnalyzing: true,
      progress: 5,
      statusText: isUrl ? 'Menghubungkan ke Grounding Search...' : 'Menginisialisasi Mesin Analisis...',
      report: null,
      error: null
    });

    try {
      // Simulate steps for better UX
      setTimeout(() => setState(prev => ({ ...prev, progress: 20, statusText: isUrl ? 'Mengambil data real-time dari platform...' : 'Membedah struktur metadata...' })), 800);
      setTimeout(() => setState(prev => ({ ...prev, progress: 45, statusText: 'Mengevaluasi tren niche terbaru...' })), 2000);
      setTimeout(() => setState(prev => ({ ...prev, progress: 70, statusText: 'Menyusun rencana aksi viralitas...' })), 3500);
      
      const report = await analyzeContent(metadata, thumbnailPreview || undefined);

      setState({
        isAnalyzing: false,
        progress: 100,
        statusText: 'Analisis Selesai!',
        report,
        error: null
      });
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: "Analisis gagal. Pastikan API Key tersedia dan URL valid." 
      }));
    }
  };

  const reset = () => {
    setState({
      isAnalyzing: false,
      progress: 0,
      statusText: '',
      report: null,
      error: null
    });
    setThumbnailPreview(null);
    setMetadata({
      title: '',
      description: '',
      hashtags: [],
      niche: 'Entertainment',
      platform: 'TikTok'
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-[#050505] text-slate-200">
      <nav className="border-b border-white/5 px-6 py-4 flex justify-between items-center glass-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-outfit text-xl font-extrabold tracking-tight text-white uppercase">ViralVantage</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <Globe size={12} /> Search Grounding Aktif
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-slate-900 border border-white/10" />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {!state.report && !state.isAnalyzing ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                <TrendingUp size={14} /> AI-Powered Creator Growth Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-outfit font-extrabold mb-8 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent leading-[1.1] tracking-tight">
                Ubah Konten Mentah Menjadi Viralitas.
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Tempelkan URL video atau upload draf Anda. Kami menggunakan <span className="text-white font-medium">Gemini 3 Pro</span> untuk membedah algoritma dan memberi Anda roadmap sukses.
              </p>
            </div>

            <div className="gradient-border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="gradient-border-inner p-10 space-y-10">
                <div className="grid grid-cols-2 gap-6">
                  <button className="flex items-center justify-center gap-3 py-5 rounded-2xl border-2 border-indigo-500 bg-indigo-500/5 text-indigo-400 font-bold transition-all shadow-inner">
                    <LinkIcon size={22} />
                    Link / URL
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 py-5 rounded-2xl border border-white/10 bg-white/5 text-slate-400 font-bold transition-all hover:bg-white/10"
                  >
                    <Upload size={22} />
                    File Draf
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black ml-1">Sumber Konten</label>
                    <div className="relative">
                      <input 
                        name="title"
                        value={metadata.title}
                        onChange={handleInputChange}
                        placeholder="Tempel link YouTube, TikTok, atau Instagram di sini..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-indigo-500/50 transition-all pl-14 placeholder:text-slate-600 shadow-xl"
                      />
                      <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black ml-1">Platform Target</label>
                      <select 
                        name="platform"
                        value={metadata.platform}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
                      >
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube (Shorts)</option>
                        <option value="Instagram">Instagram Reels</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black ml-1">Niche Konten</label>
                      <select 
                        name="niche"
                        value={metadata.niche}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:border-indigo-500/50 transition-all"
                      >
                        <option value="Entertainment">Entertainment</option>
                        <option value="Education">Education</option>
                        <option value="Lifestyle/Vlog">Lifestyle/Vlog</option>
                        <option value="Tech/Gadgets">Tech/Gadgets</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>
                </div>

                {state.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3 animate-pulse">
                    <AlertCircle size={20} />
                    {state.error}
                  </div>
                )}

                <button 
                  onClick={runAnalysis}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-wider"
                >
                  Mulai Analisis Sekarang
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        ) : state.isAnalyzing ? (
          <div className="max-w-xl mx-auto text-center space-y-12 pt-32">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-indigo-400 w-10 h-10 animate-pulse" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-outfit font-bold text-white">{state.statusText}</h2>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden max-w-sm mx-auto border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${state.progress}%` }} 
                />
              </div>
              <p className="text-slate-500 text-sm italic">"Kreator hebat bukan karena keberuntungan, tapi karena data."</p>
            </div>
          </div>
        ) : state.report && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Header Report */}
            <div className="flex flex-col md:flex-row items-center gap-16 glass-card p-12 rounded-[2.5rem] relative overflow-hidden border border-white/10">
               <div className="absolute top-0 right-0 p-6">
                 <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">
                   <Globe size={12} /> Data Grounding Terverifikasi
                 </div>
               </div>
              
              <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all" />
                <CircularScore score={state.report.overallScore} size={220} />
              </div>
              
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="text-4xl font-outfit font-extrabold mb-4 text-white">Laporan Viralitas Kreator</h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                    Berdasarkan analisis konten Anda di platform <span className="text-indigo-400 font-bold uppercase tracking-wider">{metadata.platform}</span>, berikut adalah audit menyeluruh kami.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                   <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/10 flex items-center gap-2">
                     <Layout size={14} className="text-indigo-400" /> Platform: {metadata.platform}
                   </div>
                   <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/10 flex items-center gap-2">
                     <Layers size={14} className="text-purple-400" /> Niche: {metadata.niche}
                   </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={reset} className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-slate-300 font-bold flex items-center gap-3 hover:bg-white/10 transition shadow-lg">
                    <RefreshCcw size={20} /> Analisis Baru
                  </button>
                  <button className="bg-indigo-600 px-8 py-4 rounded-2xl text-white font-bold flex items-center gap-3 hover:bg-indigo-500 transition shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]">
                    <Sparkles size={20} /> Bagikan Hasil
                  </button>
                </div>
              </div>
            </div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { data: state.report.metadataScore, icon: Layout, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { data: state.report.thumbnailScore, icon: Camera, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                { data: state.report.videoScore, icon: PlayCircle, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                { data: state.report.trendScore, icon: Layers, color: 'text-green-400', bg: 'bg-green-500/10' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-center mb-6">
                    <div className={`p-3 rounded-2xl ${item.bg}`}>
                      <item.icon className={item.color} size={24} />
                    </div>
                    <span className="text-3xl font-outfit font-black text-white">{item.data.score}</span>
                  </div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{item.data.label}</h3>
                  <div className="space-y-3">
                    {item.data.insights.slice(0, 2).map((ins, i) => (
                      <p key={i} className="text-xs text-slate-400 leading-relaxed">• {ins}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Timeline & Assets Section */}
              <div className="lg:col-span-2 space-y-10">
                <div className="glass-card p-10 rounded-[2rem] border border-white/5">
                  <h3 className="text-2xl font-outfit font-bold flex items-center gap-3 mb-8 text-white">
                    <div className="p-2 bg-indigo-500/10 rounded-lg"><PlayCircle className="text-indigo-400" size={24} /></div>
                    Timeline Retensi & Hook
                  </h3>
                  <TimelineVisualizer issues={state.report.timelineIssues} />
                </div>

                <div className="glass-card p-10 rounded-[2rem] border border-white/5">
                  <h3 className="text-2xl font-outfit font-bold flex items-center gap-3 mb-8 text-white">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><Sparkles className="text-purple-400" size={24} /></div>
                    Aset Optimasi AI
                  </h3>
                  <div className="space-y-8">
                    <div className="p-8 rounded-[1.5rem] bg-white/5 border border-white/5 group hover:bg-white/[0.07] transition-all">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                        <TrendingUp size={14} /> Judul Alternatif (High CTR)
                      </h4>
                      <ul className="space-y-5">
                        {state.report.generatedAssets.alternativeTitles.map((t, i) => (
                          <li key={i} className="text-slate-200 flex items-center gap-4 group/item">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-black shrink-0 border border-indigo-500/20">
                              {i+1}
                            </div> 
                            <span className="text-base font-medium group-hover/item:text-white transition-colors">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Priority Plan */}
              <div className="glass-card p-10 rounded-[2rem] border-t-4 border-t-indigo-500 shadow-2xl h-fit">
                <h3 className="text-2xl font-outfit font-bold flex items-center gap-3 mb-10 text-white">
                  <CheckCircle2 className="text-green-400" size={26} />
                  Roadmap Prioritas
                </h3>
                <div className="space-y-8">
                  {state.report.actionPlan.map((plan, idx) => (
                    <div key={idx} className="space-y-4 pb-8 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          plan.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'
                        }`}>
                          {plan.priority}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                          <Zap size={12} fill="currentColor" /> {plan.impact}
                        </div>
                      </div>
                      <p className="text-base font-medium text-slate-200 leading-snug">{plan.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
