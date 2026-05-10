import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const CATEGORIES = ['transport', 'stay', 'food', 'activity', 'misc']
const COLORS = { transport: '#f5c842', stay: '#60a5fa', food: '#34d399', activity: '#f87171', misc: '#a78bfa' }

export default function Budget() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ category: 'transport', label: '', amount: '' })

  const fetchData = async () => {
    const [tripRes, budgetRes] = await Promise.all([api.get(`/trips/${id}`), api.get(`/trips/${id}/budget`)])
    setTrip(tripRes.data)
    setItems(budgetRes.data)
  }

  useEffect(() => { fetchData() }, [id])

  const addItem = async () => {
    if (!form.label || !form.amount) return
    await api.post(`/trips/${id}/budget`, { ...form, amount: Number(form.amount) })
    setForm({ category: 'transport', label: '', amount: '' })
    fetchData()
  }

  const deleteItem = async (itemId) => {
    await api.delete(`/budget/${itemId}`)
    fetchData()
  }

  const total = items.reduce((s, i) => s + i.amount, 0)
  const byCategory = CATEGORIES.map(cat => ({
    cat, total: items.filter(i => i.category === cat).reduce((s, i) => s + i.amount, 0)
  })).filter(x => x.total > 0)

  // Activity costs from itinerary
  const activityCost = trip?.stops?.flatMap(s => s.activities).reduce((s, a) => s + (a.cost || 0), 0) || 0

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl text-white mb-2">{trip?.name}</h1>
        <p className="text-white/40 mb-8">Budget & Cost Breakdown</p>

        {/* Total */}
        <div className="card mb-6 text-center">
          <p className="text-white/40 text-sm mb-1">Total Estimated Cost</p>
          <p className="font-display text-5xl text-brand-400">${(total + activityCost).toLocaleString()}</p>
          <p className="text-white/30 text-xs mt-1">Includes ${activityCost} from itinerary activities</p>
        </div>

        {/* Category Bars */}
        {byCategory.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-white font-semibold mb-4">Breakdown by Category</h2>
            <div className="space-y-3">
              {byCategory.map(({ cat, total: catTotal }) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70 capitalize">{cat}</span>
                    <span className="text-white">${catTotal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${(catTotal / total) * 100}%`, backgroundColor: COLORS[cat] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Item */}
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-4">Add Budget Item</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Label (e.g. Flight)" value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            <input className="input" type="number" placeholder="Amount ($)" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <button onClick={addItem} className="btn-primary">+ Add Item</button>
        </div>

        {/* Items List */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">All Budget Items</h2>
          {items.length === 0 && <p className="text-white/30 text-sm">No items added yet.</p>}
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <span className="text-white text-sm">{item.label}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{ backgroundColor: COLORS[item.category] + '33', color: COLORS[item.category] }}>
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-brand-400 font-medium">${item.amount.toLocaleString()}</span>
                  <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
