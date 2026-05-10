const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// GET /stops/:stopId/activities
router.get('/stops/:stopId/activities', auth, async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { stopId: Number(req.params.stopId) },
      orderBy: { id: 'asc' }
    })
    res.json(activities)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /stops/:stopId/activities
router.post('/stops/:stopId/activities', auth, async (req, res) => {
  try {
    const { name, type, cost, durationMinutes, description, imageUrl, scheduledAt } = req.body
    const activity = await prisma.activity.create({
      data: {
        stopId: Number(req.params.stopId),
        name, type: type || 'sightseeing',
        cost: Number(cost) || 0,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        description, imageUrl,
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) })
      }
    })
    res.json(activity)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /activities/:id
router.put('/activities/:id', auth, async (req, res) => {
  try {
    const { name, type, cost, durationMinutes, description } = req.body
    const activity = await prisma.activity.update({
      where: { id: Number(req.params.id) },
      data: { name, type, cost: Number(cost), durationMinutes: Number(durationMinutes), description }
    })
    res.json(activity)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /activities/:id
router.delete('/activities/:id', auth, async (req, res) => {
  try {
    await prisma.activity.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
