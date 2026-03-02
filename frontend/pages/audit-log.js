import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Audit Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-tighter">
              Decision Audit Log
            </h1>
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] mt-2">Historical AI Classification Data</p>
          </div>
          <Link href="/dashboard" className="glass px-6 py-3 rounded-2xl text-xs font-bold text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/20">
            ← DASHBOARD
          </Link>
        </header>

        {/* Audit Table */}
        <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Type</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-xs font-mono text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-6 font-bold text-sm text-slate-200">{log.event_type}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      log.decision === 'NOW' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      log.decision === 'LATER' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="p-6 text-xs text-slate-400 italic">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
              No intelligence logs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}