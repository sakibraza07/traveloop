import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login            from './pages/Login'
import Signup           from './pages/Signup'
import Dashboard        from './pages/Dashboard'
import MyTrips          from './pages/MyTrips'
import CreateTrip       from './pages/CreateTrip'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView    from './pages/ItineraryView'
import Budget           from './pages/Budget'
import PackingChecklist from './pages/PackingChecklist'
import TripNotes        from './pages/TripNotes'
import SharedItinerary  from './pages/SharedItinerary'
import Profile          from './pages/Profile'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"        element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup"       element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/share/:token" element={<SharedItinerary />} />

          {/* Private */}
          <Route path="/"                    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/trips"               element={<PrivateRoute><MyTrips /></PrivateRoute>} />
          <Route path="/trips/new"           element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
          <Route path="/trips/:id/build"     element={<PrivateRoute><ItineraryBuilder /></PrivateRoute>} />
          <Route path="/trips/:id/view"      element={<PrivateRoute><ItineraryView /></PrivateRoute>} />
          <Route path="/trips/:id/budget"    element={<PrivateRoute><Budget /></PrivateRoute>} />
          <Route path="/trips/:id/packing"   element={<PrivateRoute><PackingChecklist /></PrivateRoute>} />
          <Route path="/trips/:id/notes"     element={<PrivateRoute><TripNotes /></PrivateRoute>} />
          <Route path="/profile"             element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
