# ✈️ Traveloop – Personalized Travel Planning Made Easy

> Built for the Odoo Hackathon 2025

Traveloop is a full-stack travel planning platform that empowers users to dream, design, and organize trips with ease. Plan multi-city itineraries, track budgets, manage packing lists, and share trips with friends — all in one place.

---

## 🚀 Live Demo

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Demo Login:** `demo@traveloop.com` / `demo1234`

---

## 📸 Features

| Screen | Description |
|--------|-------------|
| 🔐 Login / Signup | Secure JWT-based authentication |
| 🏠 Dashboard | Overview of trips + destination inspiration |
| 🗺️ Itinerary Builder | Add cities, stops, and activities day-by-day |
| 📋 Itinerary View | Timeline view of full trip plan |
| 💰 Budget Tracker | Cost breakdown by category with visual bars |
| 🎒 Packing Checklist | Per-trip checklist with categories |
| 📝 Trip Notes | Save reminders and details per trip |
| 🔗 Shared Itinerary | Public shareable link for any trip |
| 👤 Profile | Manage account settings |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js + Express
- Prisma ORM
- SQLite (relational database)
- JWT Authentication
- bcryptjs

---

## 📁 Project Structure

```
traveloop/
├── client/               # React Frontend
│   ├── src/
│   │   ├── pages/        # All 13 screens
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   └── api/          # Axios instance
│   └── ...
│
└── server/               # Express Backend
    ├── src/
    │   ├── routes/       # API route handlers
    │   ├── middleware/   # JWT auth middleware
    │   └── lib/          # Prisma client
    ├── prisma/
    │   ├── schema.prisma # Database schema
    │   └── seed.js       # Demo data
    └── ...
```

---

## 🗄️ Database Schema

Built with a fully relational database (SQLite via Prisma):

```
User → Trip → Stop → Activity
               ↓
          BudgetItem
          PackingItem
          Note
```

Key relationships:
- One user can have many trips
- Each trip has multiple city stops (ordered)
- Each stop has multiple activities with cost tracking
- Trips have budget items, packing lists, and notes

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/traveloop.git
cd traveloop
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env       # Add your JWT_SECRET
npx prisma migrate dev --name init
node prisma/seed.js        # Load demo data
npm run dev                # Runs on http://localhost:3000
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev                # Runs on http://localhost:5173
```

### 4. Open the app
Visit **http://localhost:5173** and login with:
- Email: `demo@traveloop.com`
- Password: `demo1234`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/trips` | Get all user trips |
| POST | `/trips` | Create new trip |
| GET | `/trips/:id` | Get trip with stops + activities |
| POST | `/trips/:id/stops` | Add city stop |
| POST | `/stops/:id/activities` | Add activity to stop |
| GET | `/trips/:id/budget` | Get budget breakdown |
| GET | `/trips/:id/packing` | Get packing list |
| PATCH | `/packing/:id/toggle` | Toggle item packed |
| GET | `/share/:token` | Public shared itinerary |

---

## 👥 Team

Built with ❤️ for the Odoo Hackathon 2025
