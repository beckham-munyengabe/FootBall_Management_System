import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'player' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { await register(form); navigate('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-pitch-400 mb-6">Create account</h1>
        {err && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-4">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Username</label><input className="input" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required /></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required /></div>
          <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required minLength={6} /></div>
          <div><label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="accountant">Accountant</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          <button className="btn-primary w-full">Register</button>
        </form>
        <p className="text-sm text-white/60 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-pitch-400 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
