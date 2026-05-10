const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// GET /trips/:tripId/notes
router.get('/trips/:tripId/notes', auth, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { tripId: Number(req.params.tripId) },
      orderBy: { createdAt: 'desc' }
    })
    res.json(notes)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /trips/:tripId/notes
router.post('/trips/:tripId/notes', auth, async (req, res) => {
  try {
    const { content, stopId } = req.body
    const note = await prisma.note.create({
      data: {
        tripId: Number(req.params.tripId),
        content,
        ...(stopId && { stopId: Number(stopId) })
      }
    })
    res.json(note)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /notes/:id
router.delete('/notes/:id', auth, async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
