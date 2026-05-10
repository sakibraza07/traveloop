import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function ActivityForm({ stopId, onAdd }) {
  const [form, setForm] = useState({ name: '', type: 'sightseeing', cost: '', durationMinutes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAdd = async () => {
    if (!form.name) return
    await api.post(`/stops/${stopId}/activities`, { ...form, cost: Number(form.cost) || 0 })
    onAdd()
    setForm({ name: '', type: 'sightseeing', cost: '', durationMinutes: '' })
  }

  return (
    <div className="mt-3 bg-white/5 rounded-xl p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input className="input text-sm py-2" placeholder="Activity name" value={form.name} onChange={set('name')} />
        <select className="input text-sm py-2" value={form.type} onChange={set('type')}>
          {['sightseeing','food','adventure','transport','other'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="input text-sm py-2" type="number" placeholder="Cost ($)" value={form.cost} onChange={set('cost')} />
        <input className="input text-sm py-2" type="number" placeholder="Duration (min)" value={form.durationMinutes} onChange={set('durationMinutes')} />
      </div>
      <button onClick={handleAdd} className="btn-primary text-sm px-3 py-1.5">+ Add Activity</button>
    </div>
  )
}

export default function ItineraryBuilder() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [stopForm, setStopForm] = useState({ city: '', country: '', startDate: '', endDate: '' })
  const [showStopForm, setShowStopForm] = useState(false)
  const [expandedStop, setExpandedStop] = useState(null)

  const fetchTrip = () => api.get(`/trips/${id}`).then(r => setTrip(r.data))
  useEffect(() => { fetchTrip() }, [id])

  const addStop = async () => {
    await api.post(`/trips/${id}/stops`, { ...stopForm, orderIndex: trip.stops?.length || 0 })
    setStopForm({ city: '', country: '', startDate: '', endDate: '' })
    setShowStopForm(false)
    fetchTrip()
  }

  const deleteStop = async (stopId) => {
    await api.delete(`/stops/${stopId}`)
    fetchTrip()
  }

  const deleteActivity = async (actId) => {
    await api.delete(`/activities/${actId}`)
    fetchTrip()
  }

  if (!trip) return <div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-white">{trip.name}</h1>
            <p className="text-white/40 text-sm mt-1">Itinerary Builder</p>
          </div>
          <Link to={`/trips/${id}/view`} className="btn-primary">View Itinerary →</Link>
        </div>

        {/* Stops */}
        <div className="space-y-4 mb-6">
          {trip.stops?.map((stop, idx) => (
            <div key={stop.id} className="card">
              <div className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-400 text-dark text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-white font-semibold">{stop.city}, {stop.country}</p>
                    <p className="text-white/40 text-xs">
                      {new Date(stop.startDate).toLocaleDateString()} → {new Date(stop.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-sm">{stop.activities?.length || 0} activities</span>
                  <button onClick={e => { e.stopPropagation(); deleteStop(stop.id) }}
                    className="text-red-400 hover:text-red-300 text-sm">✕</button>
                </div>
              </div>

              {expandedStop === stop.id && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  {stop.activities?.map(act => (
                    <div key={act.id} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <span className="text-white text-sm">{act.name}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{act.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-400 text-sm">${act.cost}</span>
                        <button onClick={() => deleteActivity(act.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                      </div>
                    </div>
                  ))}
                  <ActivityForm stopId={stop.id} onAdd={fetchTrip} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Stop Form */}
        {showStopForm ? (
          <div className="card">
            <h3 className="text-white font-semibold mb-4">Add City Stop</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label">City</label>
                <input className="input" placeholder="e.g. Paris"
                  value={stopForm.city} onChange={e => setStopForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className="label">Country</label>
                <input className="input" placeholder="e.g. France"
                  value={stopForm.country} onChange={e => setStopForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <label className="label">Arrival Date</label>
                <input className="input" type="date"
                  value={stopForm.startDate} onChange={e => setStopForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="label">Departure Date</label>
                <input className="input" type="date"
                  value={stopForm.endDate} onChange={e => setStopForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addStop} className="btn-primary">Add Stop</button>
              <button onClick={() => setShowStopForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowStopForm(true)} className="btn-ghost w-full py-4 border-dashed">
            + Add City Stop
          </button>
        )}
      </div>
    </div>
  )
}
