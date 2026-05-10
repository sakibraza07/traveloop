const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')
const crypto = require('crypto')

// GET /trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json(trips)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /trips/:id  (full trip with stops + activities)
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        stops: {
          include: { activities: { orderBy: { id: 'asc' } } },
          orderBy: { orderIndex: 'asc' }
        },
        budgetItems: true,
        notes: { orderBy: { createdAt: 'desc' } }
      }
    })
    if (!trip || trip.userId !== req.user.id) return res.status(404).json({ error: 'Trip not found' })
    res.json(trip)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /trips
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhoto } = req.body
    const shareToken = crypto.randomBytes(8).toString('hex')
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.id, name, description,
        startDate: new Date(startDate), endDate: new Date(endDate),
        coverPhoto, shareToken
      }
    })
    res.json(trip)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /trips/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhoto, isPublic } = req.body
    const trip = await prisma.trip.update({
      where: { id: Number(req.params.id) },
      data: {
        name, description, coverPhoto, isPublic,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate   && { endDate:   new Date(endDate) }),
      }
    })
    res.json(trip)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /trips/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.trip.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
