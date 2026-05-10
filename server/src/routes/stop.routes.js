const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// GET /trips/:tripId/stops
router.get('/trips/:tripId/stops', auth, async (req, res) => {
  try {
    const stops = await prisma.stop.findMany({
      where: { tripId: Number(req.params.tripId) },
      include: { activities: true },
      orderBy: { orderIndex: 'asc' }
    })
    res.json(stops)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /trips/:tripId/stops
router.post('/trips/:tripId/stops', auth, async (req, res) => {
  try {
    const { city, country, startDate, endDate, orderIndex } = req.body
    const stop = await prisma.stop.create({
      data: {
        tripId: Number(req.params.tripId),
        city, country, orderIndex: orderIndex || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })
    res.json(stop)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /stops/:id
router.put('/stops/:id', auth, async (req, res) => {
  try {
    const { city, country, startDate, endDate, orderIndex } = req.body
    const stop = await prisma.stop.update({
      where: { id: Number(req.params.id) },
      data: {
        city, country, orderIndex,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate   && { endDate:   new Date(endDate) }),
      }
    })
    res.json(stop)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /stops/:id
router.delete('/stops/:id', auth, async (req, res) => {
  try {
    await prisma.stop.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
