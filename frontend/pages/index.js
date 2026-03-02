import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🚀 AUTH PERSISTENCE: Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Backend Connection Error (Check Port 5000)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="glass p-12 rounded-[3rem] w-full max-w-md border border-white/10 shadow-2xl relative z-10">
        <h1 className="text-4xl font-black text-center mb-10 tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">CYEPRO AI</h1>
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-6 text-xs font-bold text-center italic">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input className="w-full bg-slate-800/50 p-4 rounded-2xl border border-white/5 outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="admin@cyepro.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full bg-slate-800/50 p-4 rounded-2xl border border-white/5 outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            {loading ? 'AUTHENTICATING...' : 'ENTER SUITE'}
          </button>
        </form>
      </div>
    </div>
  );
}