const router = require('express').Router()
const prisma = require('../lib/prisma')
const auth = require('../middleware/auth.middleware')

// PUT /users/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email }
    })
    res.json({ id: user.id, name: user.name, email: user.email })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /users/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
