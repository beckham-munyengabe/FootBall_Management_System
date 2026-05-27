import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const empty = { coachName:'', role:'Head Coach', phone:'', email:'', nationality:'' };

export default function Coaches() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const { data } = await api.get('/coaches'); setItems(data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/coaches/${editing}`, form);
    else await api.post('/coaches', form);
    setOpen(false); setForm(empty); setEditing(null); load();
  };
  const edit = (p) => { setForm(p); setEditing(p._id); setOpen(true); };
  const remove = async (id) => { if (confirm('Delete?')) { await api.delete(`/coaches/${id}`); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-extrabold">Coaches</h1><p className="text-white/60">Coaching staff</p></div>
        {isAdmin && <button className="btn-primary" onClick={()=>{setForm(empty);setEditing(null);setOpen(true);}}>+ Add Coach</button>}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <div key={c._id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold">{c.coachName}</div>
                <span className="badge bg-pitch-500/20 text-pitch-400 mt-1">{c.role}</span>
              </div>
              {isAdmin && <div className="flex gap-2 text-sm">
                <button onClick={()=>edit(c)} className="text-pitch-400">Edit</button>
                <button onClick={()=>remove(c._id)} className="text-red-400">Delete</button>
              </div>}
            </div>
            <div className="mt-3 text-sm text-white/70 space-y-1">
              <div>📞 {c.phone}</div>
              {c.email && <div>✉️ {c.email}</div>}
              {c.nationality && <div>🌍 {c.nationality}</div>}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-white/40">No coaches yet</div>}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing ? 'Edit Coach' : 'Add Coach'}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Name</label><input className="input" value={form.coachName} onChange={e=>setForm({...form,coachName:e.target.value})} required /></div>
          <div><label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option>Head Coach</option><option>Assistant Coach</option><option>Goalkeeping Coach</option><option>Fitness Coach</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required /></div>
            <div><label className="label">Email</label><input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          </div>
          <div><label className="label">Nationality</label><input className="input" value={form.nationality} onChange={e=>setForm({...form,nationality:e.target.value})} /></div>
          <button className="btn-primary w-full">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
