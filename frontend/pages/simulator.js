import { useState } from 'react';
import Link from 'next/link';

export default function Simulator() {
  const [eventType, setEventType] = useState('SECURITY');
  const [message, setMessage] = useState('Unusual login detected');
  const [status, setStatus] = useState(null);

  const triggerNotification = async () => {
    setStatus('Dispatching to Intelligence Engine...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          user_id: "user_bala_123",
          event_type: eventType,
          content: { message }
        }),
      });

      const data = await res.json();
      setStatus(`Result: ${data.decision || 'PROCESSED'} - ${data.reason || 'Analyzed by Gemini'}`);
      
    } catch (err) {
      setStatus('Error: Could not connect to backend');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white">
      
      {/* 🧭 Simple Navigation Link */}
      <Link href="/dashboard" className="mb-8 text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-widest transition-all">
        ← Back to Dashboard
      </Link>

      <div className="glass p-10 rounded-[2.5rem] w-full max-w-md border border-white/10 shadow-2xl relative">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>

        <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Engine Simulator
        </h2>
        
        <div className="space-y-6">
          {/* Dropdown Fix: Dark background, White text */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Event Category</label>
            <select 
              className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              value={eventType} onChange={(e) => setEventType(e.target.value)}
            >
              <option value="SECURITY" className="bg-slate-800">SECURITY</option>
              <option value="MARKETING" className="bg-slate-800">MARKETING</option>
              <option value="SYSTEM" className="bg-slate-800">SYSTEM HEALTH</option>
            </select>
          </div>

          {/* Textarea Fix: Dark background, White text */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Event Message</label>
            <textarea 
              rows="4"
              className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
              placeholder="Enter event details here..."
              value={message} onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            onClick={triggerNotification} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Trigger Notification
          </button>

          {status && (
            <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl font-mono text-xs text-blue-400 animate-pulse leading-relaxed">
              {status}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
        Authorized Injection • Port 5000
      </p>
    </div>
  );
}