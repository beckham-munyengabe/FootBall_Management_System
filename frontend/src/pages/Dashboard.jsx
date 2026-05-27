import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';

const Stat = ({ icon, label, value, color = 'text-pitch-400' }) => (
  <div className="card p-5">
    <div className="text-white/60 text-sm">{label}</div>
    <div className={`text-3xl font-extrabold mt-1 ${color}`}>{icon} {value}</div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ players: 0, coaches: 0, matches: 0, upcoming: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [p, c, m] = await Promise.all([
          api.get('/players'), api.get('/coaches'), api.get('/matches'),
        ]);
        const upcoming = m.data.filter(x => new Date(x.matchDate) > new Date()).length;
        setStats({ players: p.data.length, coaches: c.data.length, matches: m.data.length, upcoming });
      } catch {}
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2">Welcome back, {user?.username} 👋</h1>
      <p className="text-white/60 mb-8">Here's what's happening at your club today.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon="🧍" label="Players" value={stats.players} />
        <Stat icon="🧑‍🏫" label="Coaches" value={stats.coaches} />
        <Stat icon="⚽" label="Matches" value={stats.matches} />
        <Stat icon="📅" label="Upcoming" value={stats.upcoming} color="text-yellow-400" />
      </div>
    </div>
  );
}
