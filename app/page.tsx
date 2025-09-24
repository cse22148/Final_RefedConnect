"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Recycle, MapPin } from "lucide-react"
import { MapView } from "@/components/map-view"
import { AuthModal } from "@/components/auth-modal"
import { DonorDashboard } from "@/components/donor-dashboard"
import { NGODashboard } from "@/components/ngo-dashboard"
import { BiogasDashboard } from "@/components/biogas-dashboard"

export default function HomePage() {
  const [showMap, setShowMap] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [user, setUser] = useState<{ role: "donor" | "ngo" | "biogas"; name: string; email: string } | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)

  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      type: string
      details: any
      targetAgent: "ngo" | "biogas"
      status: "pending" | "accepted" | "collected"
      acceptedBy?: string
      donorName: string
    }>
  >([])

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleAuthSuccess = (userData: { role: "donor" | "ngo" | "biogas"; name: string; email: string }) => {
    setUser(userData)
    setShowAuth(false)
    setShowDashboard(true)
  }

  const handleLogout = () => {
    setUser(null)
    setShowDashboard(false)
  }

  const handleNewDonation = (donationForm: any) => {
    console.log("[v0] New donation created:", donationForm)

    let targetAgent: "ngo" | "biogas" = "ngo"
    if (donationForm.foodType === "organic waste") {
      targetAgent = "biogas"
    }

    const newNotification = {
      id: Date.now().toString(),
      type: donationForm.foodType,
      details: { ...donationForm },
      targetAgent,
      status: "pending" as const,
      donorName: user?.name || "Unknown",
    }

    setNotifications((prev) => [...prev, newNotification])
    console.log("[v0] Notification sent to:", targetAgent, "for:", donationForm.foodType)
  }

  const handleAcceptOrder = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, status: "accepted", acceptedBy: user?.name } : notif,
      ),
    )
    console.log("[v0] Order accepted by:", user?.name, "for notification:", notificationId)
  }

  const handleMarkCollected = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, status: "collected" } : notif)),
    )
    console.log("[v0] Item marked as collected:", notificationId)
  }

  const handleScheduleCollection = (collectionForm: any) => {
    console.log("[v0] Collection scheduled:", collectionForm)

    const newCollection = {
      id: Date.now().toString(),
      type: "collection scheduled",
      details: { ...collectionForm },
      targetAgent: "biogas" as const,
      status: "pending" as const,
      donorName: user?.name || "Unknown",
    }

    setNotifications((prev) => [...prev, newCollection])
  }

  if (showMap) {
    return <MapView onBack={() => setShowMap(false)} />
  }

  if (showDashboard && user) {
    if (user.role === "donor") {
      return (
        <DonorDashboard
          user={user}
          onLogout={handleLogout}
          onShowMap={() => setShowMap(true)}
          donations={notifications.filter((n) => n.donorName === user.name)}
          onNewDonation={handleNewDonation}
        />
      )
    } else if (user.role === "ngo") {
      return (
        <NGODashboard
          user={user}
          onLogout={handleLogout}
          onShowMap={() => setShowMap(true)}
          notifications={notifications}
          onAcceptOrder={handleAcceptOrder}
          onMarkCollected={handleMarkCollected}
        />
      )
    } else if (user.role === "biogas") {
      return (
        <BiogasDashboard
          user={user}
          onLogout={handleLogout}
          onShowMap={() => setShowMap(true)}
          notifications={notifications}
          onAcceptOrder={handleAcceptOrder}
          onMarkCollected={handleMarkCollected}
          onScheduleCollection={handleScheduleCollection}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RefedConnect</h1>
            <p className="text-sm text-green-600">Sharing food, connecting hearts</p>
          </div>
        </div>
        <div className="flex gap-3">
          {user ? (
            <Button onClick={handleLogout} className="bg-gray-900 hover:bg-gray-800">
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleAuthClick("login")} className="border-gray-300">
                Login
              </Button>
              <Button onClick={() => handleAuthClick("signup")} className="bg-gray-900 hover:bg-gray-800">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Connect. Share. Impact.</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Join our community of donors, NGOs, and biogas agents working together to reduce food waste and help those in
          need. Every donation makes a difference.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setShowMap(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Find Nearby Connections
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* For Donors */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Donors</h3>
              <p className="text-gray-600 mb-6">Share your excess food with those who need it most</p>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  Submit donations of packed food, fresh produce, or organic waste. Track your impact and see how your
                  contributions help the community.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* For NGOs */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For NGOs</h3>
              <p className="text-gray-600 mb-6">Efficiently manage food distribution to communities</p>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  Access real-time donations of fresh and packed food. Coordinate collection and ensure food reaches
                  those in need quickly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* For Biogas Agents */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Biogas Agents</h3>
              <p className="text-gray-600 mb-6">Convert organic waste into renewable energy</p>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  Collect organic waste donations and transform them into biogas. Support sustainable waste management
                  and clean energy production.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to make a difference?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users already making an impact in their communities
        </p>
        <Button
          onClick={() => handleAuthClick("signup")}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          Get Started Today
        </Button>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
