import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const CATEGORIES = ['clothing', 'documents', 'electronics', 'toiletries', 'other']

export default function PackingChecklist() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', category: 'clothing' })

  const fetchItems = () => api.get(`/trips/${id}/packing`).then(r => setItems(r.data))
  useEffect(() => { fetchItems() }, [id])

  const addItem = async () => {
    if (!form.name) return
    await api.post(`/trips/${id}/packing`, form)
    setForm({ name: '', category: 'clothing' })
    fetchItems()
  }

  const toggle = async (item) => {
    await api.patch(`/packing/${item.id}/toggle`)
    fetchItems()
  }

  const deleteItem = async (itemId) => {
    await api.delete(`/packing/${itemId}`)
    fetchItems()
  }

  const packed = items.filter(i => i.isPacked).length

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl text-white mb-2">Packing Checklist</h1>
        <p className="text-white/40 mb-6">{packed}/{items.length} items packed</p>

        {/* Progress */}
        {items.length > 0 && (
          <div className="h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-brand-400 rounded-full transition-all"
              style={{ width: `${(packed / items.length) * 100}%` }} />
          </div>
        )}

        {/* Add Item */}
        <div className="card mb-6">
          <div className="flex gap-3">
            <input className="input flex-1" placeholder="Item name (e.g. Passport)"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addItem()} />
            <select className="input w-36" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addItem} className="btn-primary px-4">+</button>
          </div>
        </div>

        {/* Items by Category */}
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          if (catItems.length === 0) return null
          return (
            <div key={cat} className="card mb-4">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3 capitalize">{cat}</h3>
              <div className="space-y-2">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-1.5">
                    <button onClick={() => toggle(item)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.isPacked ? 'bg-brand-400 border-brand-400' : 'border-white/30'
                      }`}>
                      {item.isPacked && <span className="text-dark text-xs">✓</span>}
                    </button>
                    <span className={`flex-1 text-sm transition-all ${item.isPacked ? 'line-through text-white/30' : 'text-white'}`}>
                      {item.name}
                    </span>
                    <button onClick={() => deleteItem(item.id)} className="text-red-400/50 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-4xl mb-3">🎒</p>
            <p className="text-white/40">Start adding items to your packing list</p>
          </div>
        )}
      </div>
    </div>
  )
}
