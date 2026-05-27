import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const empty = { playerName:'', age:18, position:'Midfielder', jerseyNumber:1, nationality:'', salary:0, phone:'' };

export default function Players() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = async () => { const { data } = await api.get('/players'); setItems(data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/players/${editing}`, form);
    else await api.post('/players', form);
    setOpen(false); setForm(empty); setEditing(null); load();
  };

  const edit = (p) => { setForm(p); setEditing(p._id); setOpen(true); };
  const remove = async (id) => { if (confirm('Delete this player?')) { await api.delete(`/players/${id}`); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Players</h1>
          <p className="text-white/60">Manage your squad roster</p>
        </div>
        {isAdmin && <button className="btn-primary" onClick={() => { setForm(empty); setEditing(null); setOpen(true); }}>+ Add Player</button>}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr><th className="table-th">#</th><th className="table-th">Name</th><th className="table-th">Position</th><th className="table-th">Age</th><th className="table-th">Nationality</th>{isAdmin && <th className="table-th">Actions</th>}</tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="hover:bg-white/5">
                <td className="table-td"><span className="badge bg-pitch-500 text-black">{p.jerseyNumber}</span></td>
                <td className="table-td font-semibold">{p.playerName}</td>
                <td className="table-td">{p.position}</td>
                <td className="table-td">{p.age}</td>
                <td className="table-td">{p.nationality}</td>
                {isAdmin && <td className="table-td space-x-2">
                  <button onClick={() => edit(p)} className="text-pitch-400 hover:underline">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-400 hover:underline">Delete</button>
                </td>}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="table-td text-center text-white/40">No players yet</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Player' : 'Add Player'}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Name</label><input className="input" value={form.playerName} onChange={e=>setForm({...form,playerName:e.target.value})} required /></div>
            <div><label className="label">Jersey #</label><input type="number" className="input" value={form.jerseyNumber} onChange={e=>setForm({...form,jerseyNumber:+e.target.value})} required min={1} max={99}/></div>
            <div><label className="label">Age</label><input type="number" className="input" value={form.age} onChange={e=>setForm({...form,age:+e.target.value})} required /></div>
            <div><label className="label">Position</label>
              <select className="input" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}>
                <option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option>
              </select>
            </div>
            <div className="col-span-2"><label className="label">Nationality</label><input className="input" value={form.nationality} onChange={e=>setForm({...form,nationality:e.target.value})} required /></div>
            <div><label className="label">Salary</label><input type="number" className="input" value={form.salary} onChange={e=>setForm({...form,salary:+e.target.value})}/></div>
            <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          </div>
          <button className="btn-primary w-full">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
}
