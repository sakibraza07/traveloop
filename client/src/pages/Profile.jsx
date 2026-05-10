import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await api.put(`/users/${user.id}`, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl text-white mb-8">Profile</h1>

        <div className="card mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-400 flex items-center justify-center text-dark font-bold text-2xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <button onClick={handleSave} className="btn-primary">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-white font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <button onClick={handleLogout} className="btn-ghost w-full text-left">
              🚪 Logout
            </button>
            <button className="w-full text-left text-red-400/60 hover:text-red-400 text-sm px-5 py-2.5 rounded-xl hover:bg-red-400/10 transition-all">
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
