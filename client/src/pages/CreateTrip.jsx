import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function CreateTrip() {
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', coverPhoto: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/trips', form)
      navigate(`/trips/${data.id}/build`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl text-white mb-8">Plan a New Trip</h1>

        <div className="card">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Trip Name</label>
              <input className="input" placeholder="e.g. Europe Summer 2025"
                value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input resize-none" rows={3} placeholder="What's this trip about?"
                value={form.description} onChange={set('description')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input className="input" type="date" value={form.startDate} onChange={set('startDate')} required />
              </div>
              <div>
                <label className="label">End Date</label>
                <input className="input" type="date" value={form.endDate} onChange={set('endDate')} required />
              </div>
            </div>
            <div>
              <label className="label">Cover Photo URL <span className="text-white/30">(optional)</span></label>
              <input className="input" placeholder="https://..."
                value={form.coverPhoto} onChange={set('coverPhoto')} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip & Build Itinerary →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
