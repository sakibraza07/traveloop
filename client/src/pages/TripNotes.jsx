import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function TripNotes() {
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')

  const fetchNotes = () => api.get(`/trips/${id}/notes`).then(r => setNotes(r.data))
  useEffect(() => { fetchNotes() }, [id])

  const addNote = async () => {
    if (!content.trim()) return
    await api.post(`/trips/${id}/notes`, { content })
    setContent('')
    fetchNotes()
  }

  const deleteNote = async (noteId) => {
    await api.delete(`/notes/${noteId}`)
    fetchNotes()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-display text-4xl text-white mb-8">Trip Notes</h1>

        <div className="card mb-6">
          <label className="label">Add a note</label>
          <textarea className="input resize-none mb-3" rows={4}
            placeholder="Hotel check-in details, local contacts, reminders..."
            value={content} onChange={e => setContent(e.target.value)} />
          <button onClick={addNote} className="btn-primary">Save Note</button>
        </div>

        <div className="space-y-4">
          {notes.length === 0 && (
            <div className="card text-center py-10">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-white/40">No notes yet. Add important details here.</p>
            </div>
          )}
          {notes.map(note => (
            <div key={note.id} className="card">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <span className="text-white/30 text-xs">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
                <button onClick={() => deleteNote(note.id)} className="text-red-400/50 hover:text-red-400 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
