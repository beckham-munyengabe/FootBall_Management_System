import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal.jsx';

const empty = { expenseName:'', type:'Expense', category:'Other', amount:0, date:new Date().toISOString().slice(0,10), description:'' };

export default function Finance() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totals: [], byCategory: [] });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [a, b] = await Promise.all([api.get('/finance'), api.get('/finance/report/summary')]);
    setItems(a.data); setSummary(b.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => { e.preventDefault(); await api.post('/finance', form); setOpen(false); setForm(empty); load(); };
  const remove = async (id) => { if (confirm('Delete?')) { await api.delete(`/finance/${id}`); load(); } };

  const income = summary.totals.find(t => t._id === 'Income')?.total || 0;
  const expense = summary.totals.find(t => t._id === 'Expense')?.total || 0;
  const balance = income - expense;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-extrabold">Finance</h1><p className="text-white/60">Income, expenses, and reports</p></div>
        <button className="btn-primary" onClick={()=>{setForm(empty);setOpen(true);}}>+ New Entry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5"><div className="text-white/60 text-sm">Income</div><div className="text-3xl font-extrabold text-pitch-400 mt-1">+${income.toLocaleString()}</div></div>
        <div className="card p-5"><div className="text-white/60 text-sm">Expenses</div><div className="text-3xl font-extrabold text-red-400 mt-1">−${expense.toLocaleString()}</div></div>
        <div className="card p-5"><div className="text-white/60 text-sm">Balance</div><div className={`text-3xl font-extrabold mt-1 ${balance>=0?'text-pitch-400':'text-red-400'}`}>${balance.toLocaleString()}</div></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5"><tr><th className="table-th">Date</th><th className="table-th">Name</th><th className="table-th">Category</th><th className="table-th">Type</th><th className="table-th text-right">Amount</th><th className="table-th"></th></tr></thead>
            <tbody>
              {items.map(f => (
                <tr key={f._id} className="hover:bg-white/5">
                  <td className="table-td">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="table-td font-semibold">{f.expenseName}</td>
                  <td className="table-td"><span className="badge bg-white/10">{f.category}</span></td>
                  <td className="table-td"><span className={`badge ${f.type==='Income'?'bg-pitch-500/20 text-pitch-400':'bg-red-500/20 text-red-300'}`}>{f.type}</span></td>
                  <td className={`table-td text-right font-bold ${f.type==='Income'?'text-pitch-400':'text-red-400'}`}>{f.type==='Income'?'+':'−'}${f.amount.toLocaleString()}</td>
                  <td className="table-td text-right"><button onClick={()=>remove(f._id)} className="text-red-400">Delete</button></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} className="table-td text-center text-white/40">No entries</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card p-5">
          <h3 className="font-bold mb-3">By Category</h3>
          <div className="space-y-2">
            {summary.byCategory.map(c => (
              <div key={c._id}>
                <div className="flex justify-between text-sm"><span>{c._id}</span><span className="font-semibold">${c.total.toLocaleString()}</span></div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-pitch-500" style={{width: `${Math.min(100, (c.total/(summary.byCategory[0]?.total||1))*100)}%`}}/>
                </div>
              </div>
            ))}
            {summary.byCategory.length === 0 && <div className="text-white/40 text-sm">No data</div>}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="New Finance Entry">
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Name</label><input className="input" value={form.expenseName} onChange={e=>setForm({...form,expenseName:e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Type</label>
              <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option>Expense</option><option>Income</option>
              </select>
            </div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {['Salary','Equipment','Travel','Stadium','Medical','Sponsorship','TicketSales','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Amount</label><input type="number" className="input" value={form.amount} onChange={e=>setForm({...form,amount:+e.target.value})} required min={0}/></div>
            <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></div>
          </div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <button className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
