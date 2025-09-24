"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MapPin, Bell, Settings, LogOut, Package, Clock, Navigation, Satellite } from "lucide-react"
import { RealTimeMap } from "./real-time-map"

interface NGODashboardProps {
  user: { name: string; email: string }
  onLogout: () => void
  onShowMap: () => void
  notifications: Array<{
    id: string
    type: string
    details: any
    status: "pending" | "accepted" | "collected"
    donorName: string
  }>
  onAcceptOrder: (id: string) => void
  onMarkCollected: (id: string) => void
}

export function NGODashboard({
  user,
  onLogout,
  onShowMap,
  notifications,
  onAcceptOrder,
  onMarkCollected,
}: NGODashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showRealTimeMap, setShowRealTimeMap] = useState(false)

  const ngoNotifications = notifications.filter((n) => n.type === "packed food" || n.type === "fresh food")

  const handleShowRealTimeMap = () => {
    console.log("[v0] Opening real-time GPS map for NGO agent")
    setShowRealTimeMap(true)
  }

  if (showRealTimeMap) {
    return <RealTimeMap onBack={() => setShowRealTimeMap(false)} userRole="ngo" />
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RefedConnect</h1>
                <p className="text-sm text-green-600">Sharing food, connecting hearts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleShowRealTimeMap}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <Satellite className="h-4 w-4" />
              Real-Time GPS
            </Button>
            <Button
              variant="outline"
              onClick={onShowMap}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <MapPin className="h-4 w-4" />
              Find Food Donors
            </Button>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-green-600">
              <Bell className="h-5 w-5" />
              {ngoNotifications.filter((n) => n.status === "pending").length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                  {ngoNotifications.filter((n) => n.status === "pending").length}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-green-600">
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">NGO Agent</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="px-6 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "overview" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("available")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "available" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Available Food
              {ngoNotifications.filter((n) => n.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {ngoNotifications.filter((n) => n.status === "pending").length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("gps")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "gps" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              GPS Navigation
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "collections" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              My Collections
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "impact" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Community Impact
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
              </div>

              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Satellite className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Real-Time GPS Navigation</h3>
                        <p className="text-sm text-gray-600">
                          Navigate to food donors with live directions and tracking
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleShowRealTimeMap} className="bg-green-600 hover:bg-green-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Open GPS Map
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* NGO Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Food Collected</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {ngoNotifications.filter((n) => n.status === "collected").length}
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">People Served</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">342</div>
                    <p className="text-xs text-muted-foreground">Estimated reach</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {ngoNotifications.filter((n) => n.status === "pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting collection</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ngoNotifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{notification.type}</p>
                          <p className="text-xs text-gray-500">
                            From {notification.donorName} • {notification.details.location}
                          </p>
                        </div>
                        <Badge
                          variant={
                            notification.status === "pending"
                              ? "destructive"
                              : notification.status === "accepted"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {notification.status}
                        </Badge>
                      </div>
                    ))}
                    {ngoNotifications.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No food donations available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "gps" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">GPS Navigation & Tracking</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="h-5 w-5 text-green-600" />
                      Real-Time Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Navigate to food donors with live GPS tracking and turn-by-turn directions.
                    </p>
                    <Button onClick={handleShowRealTimeMap} className="w-full bg-green-600 hover:bg-green-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Open GPS Navigation
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Donor Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      View all available food donations and donor locations in your area.
                    </p>
                    <Button
                      onClick={onShowMap}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View Donor Map
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Satellite className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Live GPS Tracking</h3>
                      <p className="text-sm text-gray-600">Real-time location updates</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Turn-by-Turn Directions</h3>
                      <p className="text-sm text-gray-600">Navigate to pickup locations</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">ETA Calculation</h3>
                      <p className="text-sm text-gray-600">Estimated arrival times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "available" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Available Food Donations</h2>
              </div>

              <div className="grid gap-4">
                {ngoNotifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold capitalize">{notification.type}</h3>
                            <p className="text-sm text-gray-600">From: {notification.donorName}</p>
                            <p className="text-sm text-gray-600">Quantity: {notification.details.quantity}</p>
                            <p className="text-sm text-gray-600">Location: {notification.details.location}</p>
                            <p className="text-sm text-gray-600">
                              Available until: {new Date(notification.details.pickupTime).toLocaleString()}
                            </p>
                            {notification.details.description && (
                              <p className="text-sm text-gray-600">Note: {notification.details.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.status === "pending"
                                ? "destructive"
                                : notification.status === "accepted"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {notification.status}
                          </Badge>
                          {notification.status === "pending" && (
                            <Button
                              onClick={() => onAcceptOrder(notification.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              Accept Pickup
                            </Button>
                          )}
                          {notification.status === "accepted" && (
                            <Button
                              onClick={() => onMarkCollected(notification.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              Mark Collected
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {ngoNotifications.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No food donations available at the moment</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
