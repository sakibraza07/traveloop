require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/auth',       require('./routes/auth.routes'))
app.use('/users',      require('./routes/user.routes'))
app.use('/share',      require('./routes/share.routes'))

// Trip-nested routes
const stopRouter     = require('./routes/stop.routes')
const budgetRouter   = require('./routes/budget.routes')
const packingRouter  = require('./routes/packing.routes')
const noteRouter     = require('./routes/note.routes')
const activityRouter = require('./routes/activity.routes')

app.use('/trips',      require('./routes/trip.routes'))
app.use('/',           stopRouter)       // /trips/:id/stops  &  /stops/:id
app.use('/',           activityRouter)   // /stops/:id/activities  &  /activities/:id
app.use('/',           budgetRouter)     // /trips/:id/budget  &  /budget/:id
app.use('/',           packingRouter)    // /trips/:id/packing  &  /packing/:id
app.use('/',           noteRouter)       // /trips/:id/notes  &  /notes/:id

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Traveloop server running at http://localhost:${PORT}`)
})
