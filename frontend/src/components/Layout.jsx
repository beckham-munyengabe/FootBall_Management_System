import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: '🏟️' },
  { to: '/players', label: 'Players', icon: '🧍' },
  { to: '/coaches', label: 'Coaches', icon: '🧑‍🏫' },
  { to: '/matches', label: 'Matches', icon: '⚽' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
  { to: '/finance', label: 'Finance', icon: '💰', roles: ['administrator','accountant'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 hidden md:flex flex-col bg-black/40 border-r border-white/5 p-5">
        <Link to="/" className="text-2xl font-extrabold mb-8 text-pitch-400">⚽ FC Manager</Link>
        <nav className="flex flex-col gap-1">
          {nav.filter(n => !n.roles || n.roles.includes(user?.role)).map(n => (
            <NavLink key={n.to} to={n.to} end
              className={({isActive}) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${isActive ? 'bg-pitch-500 text-black font-semibold' : 'hover:bg-white/5'}`}>
              <span>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="text-xs text-white/50">Signed in as</div>
          <div className="font-semibold">{user?.username}</div>
          <span className="badge bg-pitch-500/20 text-pitch-400 mt-1">{user?.role}</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-ghost w-full mt-4">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
