import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // 🛡️ Hydration Fix
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Component is now safe to render in browser
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/');
      return;
    }

    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/metrics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setMetrics(data);
      } catch (err) { 
        console.error("Sync Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // 🛡️ Prevent server-side render mismatch
  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-blue-400 font-bold tracking-widest animate-pulse">
      SYNCHRONIZING NEURAL LINK...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-20 md:w-64 border-r border-white/5 p-6 flex flex-col gap-6">
        <div className="mb-10 px-4">
          <h2 className="text-xl font-black text-blue-400">CYEPRO</h2>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem href="/dashboard" label="Dashboard" active />
          <NavItem href="/simulator" label="Simulator" />
          <NavItem href="/audit-log" label="Audit Logs" />
        </nav>
        <button 
          onClick={handleLogout}
          className="mt-auto p-4 rounded-2xl text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all text-left"
        >
          Logout Session
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent italic">
              CYEPRO COMMAND
            </h1>
            <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Intelligence Suite v3.2.0</p>
          </div>
          <div className="glass px-6 py-3 rounded-2xl border border-white/5 text-xs font-bold text-slate-400">
            Node: <span className="text-emerald-400">127.0.0.1:5000</span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6">
          
          <div className="glass p-8 rounded-[2.5rem] md:col-span-2 border-t border-white/10 group hover:border-blue-500/50 transition-all">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Ingested</p>
            <h2 className="text-7xl font-black mt-4 group-hover:scale-105 transition-transform duration-500">{metrics?.total || 0}</h2>
            <div className="h-1 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] md:col-span-2 border-t border-white/10 relative overflow-hidden text-center">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 blur-2xl"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mean Confidence</p>
            <h2 className="text-7xl font-black mt-4 text-purple-400">{(metrics?.ai_metrics?.average_confidence * 100).toFixed(0) || 0}%</h2>
            <p className="text-[8px] text-slate-600 mt-4 uppercase font-bold tracking-widest italic">Model: Gemini-1.5-Flash</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] md:col-span-2 border-t border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Latency</p>
            <h2 className="text-7xl font-black mt-4 text-emerald-400">1.2<span className="text-2xl ml-1">ms</span></h2>
            <p className="text-[10px] text-emerald-500/50 mt-6 font-bold uppercase">⚡ Ultra Fast</p>
          </div>

          <div className="glass p-10 rounded-[3rem] md:col-span-3 border-t border-white/10">
            <h3 className="text-xl font-black mb-10 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               CLASSIFICATION DISTRIBUTION
            </h3>
            <div className="space-y-12">
              <StatBar label="Immediate (NOW)" count={metrics?.breakdown?.NOW || 0} color="bg-rose-500" total={metrics?.total} />
              <StatBar label="Scheduled (LATER)" count={metrics?.breakdown?.LATER || 0} color="bg-amber-500" total={metrics?.total} />
              <StatBar label="Suppressed (NEVER)" count={metrics?.breakdown?.NEVER || 0} color="bg-slate-600" total={metrics?.total} />
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] md:col-span-3 border-t border-white/10 flex flex-col">
            <h3 className="text-xl font-black mb-8 flex justify-between items-center">
               <span>LATEST EVENTS</span>
               <span className="text-[10px] text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full tracking-widest">LIVE</span>
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
               <LogItem type="NOW" msg="Critical CPU Spike: Region AP-South" time="Just Now" />
               <LogItem type="LATER" msg="Daily Database Cleanup Scheduled" time="2m ago" />
               <LogItem type="NEVER" msg="Redundant System Heartbeat" time="5m ago" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ href, label, active = false }) {
  return (
    <Link href={href} className={`p-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
    }`}>
      {label}
    </Link>
  );
}

function StatBar({ label, count, color, total }) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-black">{count}</span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
        <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{width: `${percent}%`}}></div>
      </div>
    </div>
  );
}

function LogItem({ type, msg, time }) {
  const color = type === 'NOW' ? 'text-rose-400' : type === 'LATER' ? 'text-amber-400' : 'text-slate-500';
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center hover:bg-white/[0.05] transition-colors">
      <div>
        <span className={`text-[8px] font-bold uppercase tracking-widest ${color}`}>{type}</span>
        <p className="text-xs font-medium text-slate-300 mt-1">{msg}</p>
      </div>
      <span className="text-[10px] text-slate-600 font-mono italic">{time}</span>
    </div>
  );
}