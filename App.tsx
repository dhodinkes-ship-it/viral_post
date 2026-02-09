
import React, { useState, useRef } from 'react';
import { VideoMetadata, AnalysisState } from './types.ts';
import { analyzeContent } from './services/geminiService.ts';
import { CircularScore } from './components/CircularScore.tsx';
import { TimelineVisualizer } from './components/TimelineVisualizer.tsx';
import { 
  BarChart3, 
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
  Globe
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
      setState(prev => ({ ...prev, error: "Silakan masukkan Judul atau URL Video" }));
      return;
    }

    const isUrl = metadata.title.toLowerCase().includes('http');

    setState({
      isAnalyzing: true,
      progress: 5,
      statusText: isUrl ? 'Menginisialisasi URL Grounding...' : 'Memulai Analisis...',
      report: null,
      error: null
    });

    try {
      if (isUrl) {
        setState(prev => ({ ...prev, progress: 25, statusText: 'Mengambil metadata asli dari web...' }));
      } else {
        setState(prev => ({ ...prev, progress: 25, statusText: 'Menganalisis Metadata & Trigger...' }));
      }
      
      await new Promise(r => setTimeout(r, 1200));
      setState(prev => ({ ...prev, progress: 50, statusText: 'Mengevaluasi pola viralitas niche...' }));
      
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
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Gagal mengambil data. Pastikan URL benar atau coba lagi nanti." }));
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
    <div className="min-h-screen pb-20">
      <nav className="border-b border-white/10 px-6 py-4 flex justify-between items-center glass-card sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight">ViralVantage</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><Globe size={12} className="text-green-500" /> Search Grounding Aktif</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {!state.report && !state.isAnalyzing ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-outfit font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Analisa Link Apapun.<br />Kuasai Algoritma.
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                Tempelkan URL video Anda. Kami akan mengambil data asli dan memberi tahu Anda strategi viralitasnya secara akurat.
              </p>
            </div>

            <div className="gradient-border">
              <div className="gradient-border-inner p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-400 font-bold transition-all">
                    <LinkIcon size={20} />
                    URL Video
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl border border-white/10 bg-white/5 text-slate-400 font-medium transition-all hover:bg-white/10"
                  >
                    <Upload size={20} />
                    Upload File
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Tempel URL (YouTube, TikTok, atau IG)</label>
                    <div className="relative">
                      <input 
                        name="title"
                        value={metadata.title}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors pl-12"
                      />
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Platform</label>
                      <select 
                        name="platform"
                        value={metadata.platform}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none"
                      >
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">Niche Konten</label>
                      <select 
                        name="niche"
                        value={metadata.niche}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none"
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
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    {state.error}
                  </div>
                )}

                <button 
                  onClick={runAnalysis}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  Analisis Video
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : state.isAnalyzing ? (
          <div className="max-w-xl mx-auto text-center space-y-8 pt-20">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-indigo-400 w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-outfit font-bold">{state.statusText}</h2>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                  style={{ width: `${state.progress}%` }} 
                />
              </div>
            </div>
          </div>
        ) : state.report && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hasil Dashboard */}
            <div className="flex flex-col md:flex-row items-center gap-12 glass-card p-10 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-widest">
                   <Globe size={10} /> Data Terverifikasi
                 </div>
               </div>
              <CircularScore score={state.report.overallScore} size={200} />
              
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-outfit font-bold mb-2">Analisis Selesai</h2>
                  <p className="text-slate-400 leading-relaxed max-w-2xl">
                    Berdasarkan struktur konten Anda dan tren di <span className="text-white font-bold">{metadata.niche}</span>, berikut adalah laporannya.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                   <div className="bg-white/5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 border border-white/5">
                     Target: {metadata.platform}
                   </div>
                   <div className="bg-white/5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 border border-white/5">
                     Niche: {metadata.niche}
                   </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={reset} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-slate-300 font-bold flex items-center gap-2 hover:bg-white/10 transition">
                    <RefreshCcw size={18} /> Analisis Baru
                  </button>
                  <button className="bg-indigo-600 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-indigo-500 transition shadow-lg">
                    <Sparkles size={18} /> Pelajari Optimasi
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { data: state.report.metadataScore, icon: Layout, color: 'text-blue-400' },
                { data: state.report.thumbnailScore, icon: Camera, color: 'text-pink-400' },
                { data: state.report.videoScore, icon: PlayCircle, color: 'text-indigo-400' },
                { data: state.report.trendScore, icon: Layers, color: 'text-green-400' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl border-l-4 border-l-transparent hover:border-l-indigo-500 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <item.icon className={item.color} size={20} />
                    <span className="text-xl font-bold">{item.data.score}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{item.data.label}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.data.insights[0]}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-xl font-outfit font-bold flex items-center gap-2 mb-6">
                    <PlayCircle className="text-indigo-400" />
                    Timeline Retensi
                  </h3>
                  <TimelineVisualizer issues={state.report.timelineIssues} />
                </div>

                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-xl font-outfit font-bold flex items-center gap-2 mb-6">
                    <Sparkles className="text-purple-400" />
                    Optimasi Konten
                  </h3>
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Saran Judul Viral</h4>
                      <ul className="space-y-3">
                        {state.report.generatedAssets.alternativeTitles.map((t, i) => (
                          <li key={i} className="text-sm text-slate-200 flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl border-t-4 border-t-indigo-500">
                <h3 className="text-xl font-outfit font-bold flex items-center gap-2 mb-6">
                  <CheckCircle2 className="text-green-400" />
                  Roadmap Prioritas
                </h3>
                <div className="space-y-6">
                  {state.report.actionPlan.map((plan, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b border-white/5 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${plan.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                          {plan.priority}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">{plan.impact}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-100">{plan.task}</p>
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
