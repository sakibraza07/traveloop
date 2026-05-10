const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// GET /trips/:tripId/packing
router.get('/trips/:tripId/packing', auth, async (req, res) => {
  try {
    const items = await prisma.packingItem.findMany({
      where: { tripId: Number(req.params.tripId) },
      orderBy: { category: 'asc' }
    })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /trips/:tripId/packing
router.post('/trips/:tripId/packing', auth, async (req, res) => {
  try {
    const { name, category } = req.body
    const item = await prisma.packingItem.create({
      data: { tripId: Number(req.params.tripId), name, category: category || 'other' }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PATCH /packing/:id/toggle
router.patch('/packing/:id/toggle', auth, async (req, res) => {
  try {
    const item = await prisma.packingItem.findUnique({ where: { id: Number(req.params.id) } })
    const updated = await prisma.packingItem.update({
      where: { id: Number(req.params.id) },
      data: { isPacked: !item.isPacked }
    })
    res.json(updated)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /packing/:id
router.delete('/packing/:id', auth, async (req, res) => {
  try {
    await prisma.packingItem.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
