import { Link } from 'react-router-dom'

export default function TripCard({ trip, onDelete }) {
  const start = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const end   = new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="card hover:border-brand-400/50 transition-all group">
      {trip.coverPhoto && (
        <img src={trip.coverPhoto} alt={trip.name}
          className="w-full h-36 object-cover rounded-xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
      )}
      {!trip.coverPhoto && (
        <div className="w-full h-36 rounded-xl mb-4 bg-gradient-to-br from-brand-400/20 to-brand-600/10 flex items-center justify-center text-4xl">
          ✈️
        </div>
      )}

      <h3 className="font-display text-xl text-white mb-1">{trip.name}</h3>
      <p className="text-white/40 text-sm mb-3">{start} → {end}</p>
      {trip.description && <p className="text-white/60 text-sm mb-4 line-clamp-2">{trip.description}</p>}

      <div className="flex gap-2 flex-wrap">
        <Link to={`/trips/${trip.id}/build`} className="btn-primary text-sm px-3 py-1.5">Build</Link>
        <Link to={`/trips/${trip.id}/view`}  className="btn-ghost  text-sm px-3 py-1.5">View</Link>
        <Link to={`/trips/${trip.id}/budget`}className="btn-ghost  text-sm px-3 py-1.5">💰 Budget</Link>
        <Link to={`/trips/${trip.id}/packing`}className="btn-ghost text-sm px-3 py-1.5">🎒 Pack</Link>
        <Link to={`/trips/${trip.id}/notes`} className="btn-ghost  text-sm px-3 py-1.5">📝 Notes</Link>
        {onDelete && (
          <button onClick={() => onDelete(trip.id)}
            className="ml-auto text-red-400 hover:text-red-300 text-sm transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
