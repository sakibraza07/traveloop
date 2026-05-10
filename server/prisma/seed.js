const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function main() {
  // Demo user
  const passwordHash = await bcrypt.hash('demo1234', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@traveloop.com' },
    update: {},
    create: { name: 'Demo User', email: 'demo@traveloop.com', passwordHash }
  })

  // Demo trip
  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      name: 'Europe Summer 2025',
      description: 'A dream trip across Europe hitting the best cities!',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-21'),
      isPublic: true,
      shareToken: crypto.randomBytes(8).toString('hex'),
      stops: {
        create: [
          {
            city: 'Paris', country: 'France',
            startDate: new Date('2025-06-01'), endDate: new Date('2025-06-07'), orderIndex: 0,
            activities: {
              create: [
                { name: 'Eiffel Tower', type: 'sightseeing', cost: 25, durationMinutes: 120 },
                { name: 'Louvre Museum', type: 'sightseeing', cost: 17, durationMinutes: 180 },
                { name: 'Seine River Cruise', type: 'adventure', cost: 15, durationMinutes: 60 },
              ]
            }
          },
          {
            city: 'Rome', country: 'Italy',
            startDate: new Date('2025-06-07'), endDate: new Date('2025-06-14'), orderIndex: 1,
            activities: {
              create: [
                { name: 'Colosseum Tour', type: 'sightseeing', cost: 18, durationMinutes: 150 },
                { name: 'Vatican Museums', type: 'sightseeing', cost: 20, durationMinutes: 240 },
                { name: 'Pasta Making Class', type: 'food', cost: 65, durationMinutes: 180 },
              ]
            }
          },
          {
            city: 'Barcelona', country: 'Spain',
            startDate: new Date('2025-06-14'), endDate: new Date('2025-06-21'), orderIndex: 2,
            activities: {
              create: [
                { name: 'Sagrada Familia', type: 'sightseeing', cost: 26, durationMinutes: 120 },
                { name: 'Park Güell', type: 'sightseeing', cost: 10, durationMinutes: 90 },
                { name: 'Tapas Food Tour', type: 'food', cost: 45, durationMinutes: 180 },
              ]
            }
          }
        ]
      },
      budgetItems: {
        create: [
          { category: 'transport', label: 'Flights (Round trip)', amount: 650 },
          { category: 'transport', label: 'Trains between cities', amount: 120 },
          { category: 'stay', label: 'Hotels (21 nights)', amount: 1800 },
          { category: 'food', label: 'Daily meals budget', amount: 630 },
        ]
      }
    }
  })

  console.log('✅ Seed complete!')
  console.log('📧 Login: demo@traveloop.com')
  console.log('🔑 Password: demo1234')
  console.log(`🗺️  Trip: ${trip.name}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
