import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TripCard from '../components/TripCard'
import api from '../api/axios'

export default function MyTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTrips = () => api.get('/trips').then(r => setTrips(r.data)).finally(() => setLoading(false))

  useEffect(() => { fetchTrips() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return
    await api.delete(`/trips/${id}`)
    setTrips(t => t.filter(x => x.id !== id))
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-white">My Trips</h1>
          <Link to="/trips/new" className="btn-primary">+ New Trip</Link>
        </div>

        {loading && <p className="text-white/40">Loading...</p>}

        {!loading && trips.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-white/60 mb-4">No trips yet. Start planning!</p>
            <Link to="/trips/new" className="btn-primary inline-block">Plan Your First Trip</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  )
}
