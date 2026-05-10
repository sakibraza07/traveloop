const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// GET /trips/:tripId/budget
router.get('/trips/:tripId/budget', auth, async (req, res) => {
  try {
    const items = await prisma.budgetItem.findMany({
      where: { tripId: Number(req.params.tripId) },
      orderBy: { id: 'asc' }
    })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /trips/:tripId/budget
router.post('/trips/:tripId/budget', auth, async (req, res) => {
  try {
    const { category, label, amount } = req.body
    const item = await prisma.budgetItem.create({
      data: { tripId: Number(req.params.tripId), category, label, amount: Number(amount) }
    })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /budget/:id
router.delete('/budget/:id', auth, async (req, res) => {
  try {
    await prisma.budgetItem.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
