import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function SharedItinerary() {
  const { token } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/share/${token}`).then(r => setTrip(r.data)).catch(() => setError('Trip not found or not public.'))
  }, [token])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-white/60">{error}</p>
      </div>
    </div>
  )

  if (!trip) return <div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>

  const totalCost = trip.stops?.flatMap(s => s.activities).reduce((s, a) => s + (a.cost || 0), 0) || 0

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand-400 font-medium mb-1">Shared Itinerary</p>
          <h1 className="font-display text-4xl text-white mb-2">{trip.name}</h1>
          <p className="text-white/40 text-sm">
            {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}
          </p>
          {trip.description && <p className="text-white/60 mt-3">{trip.description}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Cities', value: trip.stops?.length || 0 },
            { label: 'Activities', value: trip.stops?.flatMap(s => s.activities).length || 0 },
            { label: 'Est. Cost', value: `$${totalCost.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="font-display text-3xl text-brand-400">{s.value}</p>
              <p className="text-white/40 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {trip.stops?.map((stop, idx) => (
            <div key={stop.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-brand-400 text-dark text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-white font-semibold">{stop.city}, {stop.country}</p>
                  <p className="text-white/40 text-xs">
                    {new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {stop.activities?.map(act => (
                <div key={act.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 pl-10">
                  <span className="text-white/80 text-sm">{act.name}</span>
                  <span className="text-brand-400 text-sm">${act.cost}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-white/30 text-sm">Made with</p>
          <p className="font-display text-xl text-brand-400">Traveloop</p>
        </div>
      </div>
    </div>
  )
}
