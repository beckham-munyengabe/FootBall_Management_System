import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const empty = { opponent:'', matchDate:'', stadium:'', competition:'League', homeOrAway:'Home', status:'Scheduled', result:{ teamScore:null, opponentScore:null, outcome:null } };

export default function Matches() {
  const { user } = useAuth();
  const canEdit = ['administrator','coach'].includes(user?.role);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const { data } = await api.get('/matches'); setItems(data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editing) await api.put(`/matches/${editing}`, payload);
    else await api.post('/matches', payload);
    setOpen(false); setForm(empty); setEditing(null); load();
  };
  const edit = (m) => { setForm({...m, matchDate: m.matchDate?.slice(0,16)}); setEditing(m._id); setOpen(true); };
  const remove = async (id) => { if (confirm('Delete?')) { await api.delete(`/matches/${id}`); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-extrabold">Matches</h1><p className="text-white/60">Fixtures & results</p></div>
        {canEdit && <button className="btn-primary" onClick={()=>{setForm(empty);setEditing(null);setOpen(true);}}>+ New Match</button>}
      </div>
      <div className="space-y-3">
        {items.map(m => {
          const upcoming = new Date(m.matchDate) > new Date();
          return (
            <div key={m._id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="badge bg-white/10">{m.competition}</span>
                  <span className={`badge ${upcoming?'bg-yellow-500/20 text-yellow-300':'bg-pitch-500/20 text-pitch-400'}`}>{m.status}</span>
                  <span className="badge bg-white/10">{m.homeOrAway}</span>
                </div>
                <div className="mt-2 text-lg font-bold">vs {m.opponent}</div>
                <div className="text-sm text-white/60">📍 {m.stadium} • 📅 {new Date(m.matchDate).toLocaleString()}</div>
              </div>
              <div className="text-3xl font-extrabold">
                {m.result?.teamScore ?? '-'} : {m.result?.opponentScore ?? '-'}
              </div>
              {canEdit && <div className="flex gap-2">
                <button onClick={()=>edit(m)} className="btn-ghost">Edit</button>
                <button onClick={()=>remove(m._id)} className="btn-ghost text-red-400">Delete</button>
              </div>}
            </div>
          );
        })}
        {items.length === 0 && <div className="text-white/40">No matches scheduled</div>}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Edit Match':'New Match'}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Opponent</label><input className="input" value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date & time</label><input type="datetime-local" className="input" value={form.matchDate} onChange={e=>setForm({...form,matchDate:e.target.value})} required /></div>
            <div><label className="label">Stadium</label><input className="input" value={form.stadium} onChange={e=>setForm({...form,stadium:e.target.value})} required /></div>
            <div><label className="label">Competition</label><input className="input" value={form.competition} onChange={e=>setForm({...form,competition:e.target.value})}/></div>
            <div><label className="label">Home/Away</label>
              <select className="input" value={form.homeOrAway} onChange={e=>setForm({...form,homeOrAway:e.target.value})}>
                <option>Home</option><option>Away</option>
              </select>
            </div>
            <div><label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>Scheduled</option><option>Completed</option><option>Postponed</option><option>Cancelled</option>
              </select>
            </div>
          </div>
          {form.status === 'Completed' && (
            <div className="grid grid-cols-3 gap-3">
              <div><label className="label">Our score</label><input type="number" className="input" value={form.result?.teamScore ?? ''} onChange={e=>setForm({...form,result:{...form.result,teamScore:+e.target.value}})}/></div>
              <div><label className="label">Their score</label><input type="number" className="input" value={form.result?.opponentScore ?? ''} onChange={e=>setForm({...form,result:{...form.result,opponentScore:+e.target.value}})}/></div>
              <div><label className="label">Outcome</label>
                <select className="input" value={form.result?.outcome ?? ''} onChange={e=>setForm({...form,result:{...form.result,outcome:e.target.value||null}})}>
                  <option value="">-</option><option>Win</option><option>Loss</option><option>Draw</option>
                </select>
              </div>
            </div>
          )}
          <button className="btn-primary w-full">{editing?'Update':'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
