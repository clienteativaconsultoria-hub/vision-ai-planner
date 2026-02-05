import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Onboarding from "./pages/Onboarding"
import Roadmap from "./pages/Roadmap"
import Goals from "./pages/Goals"
import Settings from "./pages/Settings"
import LandingPage from "./pages/LandingPage"
import AdsPage from "./pages/AdsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App

