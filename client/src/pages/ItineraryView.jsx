import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function ItineraryView() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)

  useEffect(() => { api.get(`/trips/${id}`).then(r => setTrip(r.data)) }, [id])

  const totalCost = trip?.stops?.flatMap(s => s.activities).reduce((sum, a) => sum + (a.cost || 0), 0) || 0

  if (!trip) return <div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-white">{trip.name}</h1>
            <p className="text-white/40 text-sm mt-1">
              {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/trips/${id}/build`} className="btn-ghost text-sm">Edit</Link>
            <Link to={`/trips/${id}/budget`} className="btn-primary text-sm">💰 Budget</Link>
          </div>
        </div>

        {/* Stats Bar */}
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

        {/* Timeline */}
        <div className="space-y-6">
          {trip.stops?.map((stop, idx) => (
            <div key={stop.id} className="relative pl-8">
              {/* Timeline line */}
              {idx < trip.stops.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-brand-400/30" />
              )}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-400 text-dark text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-xl text-white">{stop.city}, {stop.country}</h2>
                  <span className="text-white/40 text-xs">
                    {new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}
                  </span>
                </div>

                {stop.activities?.length === 0 && (
                  <p className="text-white/30 text-sm italic">No activities yet</p>
                )}

                <div className="space-y-2">
                  {stop.activities?.map(act => (
                    <div key={act.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <span className="text-white text-sm">{act.name}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 capitalize">{act.type}</span>
                        {act.durationMinutes && (
                          <span className="ml-2 text-xs text-white/30">{act.durationMinutes}min</span>
                        )}
                      </div>
                      <span className="text-brand-400 text-sm font-medium">${act.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {trip.stops?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-white/40 mb-4">No stops added yet</p>
            <Link to={`/trips/${id}/build`} className="btn-primary inline-block">Build Itinerary</Link>
          </div>
        )}
      </div>
    </div>
  )
}
