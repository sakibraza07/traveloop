const router = require('express').Router()
const prisma = require('../lib/prisma')

// GET /share/:token  — public, no auth required
router.get('/:token', async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { shareToken: req.params.token },
      include: {
        stops: {
          include: { activities: { orderBy: { id: 'asc' } } },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })
    if (!trip || !trip.isPublic) return res.status(404).json({ error: 'Trip not found or not public' })
    res.json(trip)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
