import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TripCard from '../components/TripCard'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const DESTINATIONS = [
  { name: 'Paris',     emoji: '🗼', country: 'France' },
  { name: 'Tokyo',     emoji: '🏯', country: 'Japan' },
  { name: 'Bali',      emoji: '🌴', country: 'Indonesia' },
  { name: 'New York',  emoji: '🗽', country: 'USA' },
  { name: 'Santorini', emoji: '🏛️', country: 'Greece' },
  { name: 'Dubai',     emoji: '🌆', country: 'UAE' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips').then(r => setTrips(r.data.slice(0, 3))).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* Hero */}
        <div className="mb-12">
          <p className="text-brand-400 font-medium mb-2">Good to see you, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="font-display text-5xl text-white mb-4">Where to next?</h1>
          <Link to="/trips/new" className="btn-primary inline-block">+ Plan New Trip</Link>
        </div>

        {/* Recent Trips */}
        {!loading && trips.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-white">Recent Trips</h2>
              <Link to="/trips" className="text-brand-400 text-sm hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </section>
        )}

        {/* Explore Destinations */}
        <section>
          <h2 className="font-display text-2xl text-white mb-5">Explore Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {DESTINATIONS.map(d => (
              <Link to="/trips/new" key={d.name}
                className="card text-center hover:border-brand-400/60 transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-3xl mb-2">{d.emoji}</div>
                <p className="text-white font-medium text-sm">{d.name}</p>
                <p className="text-white/40 text-xs">{d.country}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
