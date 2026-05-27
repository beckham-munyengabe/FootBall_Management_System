import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await login(email, password); navigate('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-pitch-400 mb-2">⚽ FC Manager</h1>
        <p className="text-white/60 mb-6">Sign in to your club dashboard</p>
        {err && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
          <div><label className="label">Password</label><input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="text-sm text-white/60 mt-6 text-center">
          No account? <Link to="/register" className="text-pitch-400 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
