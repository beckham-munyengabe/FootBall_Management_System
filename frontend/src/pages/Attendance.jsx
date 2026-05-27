import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

export default function Attendance() {
  const { user } = useAuth();
  const canEdit = ['administrator','coach'].includes(user?.role);
  const [players, setPlayers] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  const load = async () => {
    const [p, a] = await Promise.all([api.get('/players'), api.get('/attendance')]);
    setPlayers(p.data); setRecords(a.data);
  };
  useEffect(() => { load(); }, []);

  const todays = records.filter(r => r.trainingDate?.slice(0,10) === date);
  const statusOf = (pid) => todays.find(r => (r.playerId?._id || r.playerId) === pid)?.status;

  const setStatus = async (playerId, status) => {
    if (!canEdit) return;
    const existing = todays.find(r => (r.playerId?._id || r.playerId) === playerId);
    if (existing) await api.put(`/attendance/${existing._id}`, { status });
    else await api.post('/attendance', { playerId, trainingDate: date, status });
    load();
  };

  const colors = { Present: 'bg-pitch-500 text-black', Absent: 'bg-red-500/30 text-red-300', Late: 'bg-yellow-500/30 text-yellow-300', Excused: 'bg-blue-500/30 text-blue-300' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="text-3xl font-extrabold">Attendance</h1><p className="text-white/60">Training session tracking</p></div>
        <input type="date" className="input max-w-xs" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5"><tr><th className="table-th">#</th><th className="table-th">Player</th><th className="table-th">Status</th>{canEdit && <th className="table-th">Mark</th>}</tr></thead>
          <tbody>
            {players.map(p => {
              const s = statusOf(p._id);
              return (
                <tr key={p._id} className="hover:bg-white/5">
                  <td className="table-td"><span className="badge bg-pitch-500 text-black">{p.jerseyNumber}</span></td>
                  <td className="table-td font-semibold">{p.playerName}</td>
                  <td className="table-td">{s ? <span className={`badge ${colors[s]}`}>{s}</span> : <span className="text-white/40">—</span>}</td>
                  {canEdit && <td className="table-td space-x-1">
                    {['Present','Absent','Late','Excused'].map(opt =>
                      <button key={opt} onClick={()=>setStatus(p._id, opt)} className={`badge ${s===opt?colors[opt]:'bg-white/5 hover:bg-white/10'}`}>{opt}</button>
                    )}
                  </td>}
                </tr>
              );
            })}
            {players.length === 0 && <tr><td colSpan={4} className="table-td text-center text-white/40">Add players first</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
