"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, MapPin, Plus, Bell, Settings, LogOut, Package, Heart, Navigation, Satellite } from "lucide-react"
import { RealTimeMap } from "./real-time-map"

interface DonorDashboardProps {
  user: { name: string; email: string }
  onLogout: () => void
  onShowMap: () => void
  donations: Array<{
    id: string
    type: string
    details: any
    status: "pending" | "accepted" | "collected"
    acceptedBy?: string
  }>
  onNewDonation: (donation: any) => void
}

export function DonorDashboard({ user, onLogout, onShowMap, donations, onNewDonation }: DonorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showRealTimeMap, setShowRealTimeMap] = useState(false)
  const [donationForm, setDonationForm] = useState({
    foodType: "",
    quantity: "",
    description: "",
    location: "",
    pickupTime: "",
  })

  const handleSubmitDonation = () => {
    console.log("[v0] Donor donation submitted:", donationForm)
    onNewDonation(donationForm)
    setShowDonationModal(false)
    setDonationForm({
      foodType: "",
      quantity: "",
      description: "",
      location: "",
      pickupTime: "",
    })
  }

  const handleShowRealTimeMap = () => {
    console.log("[v0] Opening real-time GPS map for donor")
    setShowRealTimeMap(true)
  }

  if (showRealTimeMap) {
    return <RealTimeMap onBack={() => setShowRealTimeMap(false)} userRole="donor" />
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
              Real-Time GPS Map
            </Button>
            <Button
              variant="outline"
              onClick={onShowMap}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <MapPin className="h-4 w-4" />
              Find Agents
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-green-600">
              <Bell className="h-5 w-5" />
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
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">Food Donor</p>
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
              onClick={() => setActiveTab("donations")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "donations" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              My Donations
            </button>
            <button
              onClick={() => setActiveTab("gps")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "gps" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              GPS Tracking
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "impact" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Impact Report
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "connections" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              My Connections
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
                <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Donation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="foodType">Food Type</Label>
                        <Select
                          value={donationForm.foodType}
                          onValueChange={(value) => setDonationForm({ ...donationForm, foodType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select food type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="packed food">Packed Food</SelectItem>
                            <SelectItem value="fresh food">Fresh Food</SelectItem>
                            <SelectItem value="organic waste">Organic Waste</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          placeholder="e.g., 5kg, 20 portions"
                          value={donationForm.quantity}
                          onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Additional details about the food"
                          value={donationForm.description}
                          onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Pickup Location</Label>
                        <Input
                          id="location"
                          placeholder="Where can agents pick this up?"
                          value={donationForm.location}
                          onChange={(e) => setDonationForm({ ...donationForm, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Available Until</Label>
                        <Input
                          id="pickupTime"
                          type="datetime-local"
                          value={donationForm.pickupTime}
                          onChange={(e) => setDonationForm({ ...donationForm, pickupTime: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleSubmitDonation} className="w-full bg-green-600 hover:bg-green-700">
                        Create Donation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                        <p className="text-sm text-gray-600">Find nearby agents with live directions and tracking</p>
                      </div>
                    </div>
                    <Button onClick={handleShowRealTimeMap} className="bg-green-600 hover:bg-green-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Open GPS Map
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{donations.length}</div>
                    <p className="text-xs text-muted-foreground">Lifetime contributions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">People Fed</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <p className="text-xs text-muted-foreground">Estimated impact</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Waste Diverted</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">45kg</div>
                    <p className="text-xs text-muted-foreground">From landfills</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{donation.type}</p>
                          <p className="text-xs text-gray-500">
                            {donation.details.quantity} • {donation.details.location}
                          </p>
                        </div>
                        <Badge
                          variant={
                            donation.status === "pending"
                              ? "destructive"
                              : donation.status === "accepted"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {donation.status === "pending" && "Waiting"}
                          {donation.status === "accepted" && "Assigned"}
                          {donation.status === "collected" && "Completed"}
                        </Badge>
                      </div>
                    ))}
                    {donations.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No donations yet. Create your first donation!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "gps" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">GPS Tracking & Navigation</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="h-5 w-5 text-green-600" />
                      Real-Time Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Enable GPS tracking to find the nearest NGO and biogas agents with live directions.
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
                      Nearby Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      View all available NGO and biogas agents in your area with contact information.
                    </p>
                    <Button
                      onClick={onShowMap}
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View Agent Map
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>GPS Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Satellite className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Real-Time Tracking</h3>
                      <p className="text-sm text-gray-600">Live GPS location updates</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Navigation className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Turn-by-Turn Directions</h3>
                      <p className="text-sm text-gray-600">Navigate to agents easily</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Distance Calculation</h3>
                      <p className="text-sm text-gray-600">Real-time distance updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Donations</h2>
                <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Donation
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {donations.map((donation) => (
                  <Card key={donation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold capitalize">{donation.type}</h3>
                            <p className="text-sm text-gray-600">Quantity: {donation.details.quantity}</p>
                            <p className="text-sm text-gray-600">Location: {donation.details.location}</p>
                            <p className="text-sm text-gray-600">
                              Available until: {new Date(donation.details.pickupTime).toLocaleString()}
                            </p>
                            {donation.acceptedBy && (
                              <p className="text-sm text-green-600 font-medium">Accepted by: {donation.acceptedBy}</p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            donation.status === "pending"
                              ? "destructive"
                              : donation.status === "accepted"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {donation.status === "pending" && "Waiting for Agent"}
                          {donation.status === "accepted" && "Agent Assigned"}
                          {donation.status === "collected" && "Completed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {donations.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No donations yet. Click "Add Donation" to get started!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "impact" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Impact Report</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{donations.length}</div>
                    <p className="text-xs text-muted-foreground">All time contributions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">People Fed</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{donations.length * 12}</div>
                    <p className="text-xs text-muted-foreground">Estimated meals provided</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Waste Diverted</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{donations.length * 3.5}kg</div>
                    <p className="text-xs text-muted-foreground">From landfills</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{donations.length * 2.1}kg</div>
                    <p className="text-xs text-muted-foreground">Carbon footprint reduced</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Donation Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["packed food", "fresh food", "organic waste"].map((type) => {
                      const count = donations.filter((d) => d.type === type).length
                      const percentage = donations.length > 0 ? (count / donations.length) * 100 : 0
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type}</span>
                            <span>
                              {count} donations ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Impact Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Making a Difference!</h3>
                    <p className="text-gray-600">
                      Your {donations.length} donations have helped feed {donations.length * 12} people and diverted{" "}
                      {donations.length * 3.5}kg of waste from landfills.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">My Connections</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Connected NGO Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donations
                        .filter((d) => d.acceptedBy && (d.type === "packed food" || d.type === "fresh food"))
                        .reduce((agents: string[], donation) => {
                          if (donation.acceptedBy && !agents.includes(donation.acceptedBy)) {
                            agents.push(donation.acceptedBy)
                          }
                          return agents
                        }, [])
                        .map((agent, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{agent}</h3>
                              <p className="text-sm text-gray-600">NGO Agent</p>
                            </div>
                            <Badge variant="secondary">Connected</Badge>
                          </div>
                        ))}
                      {donations.filter((d) => d.acceptedBy && (d.type === "packed food" || d.type === "fresh food"))
                        .length === 0 && <p className="text-gray-500 text-center py-4">No NGO connections yet</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Connected Biogas Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donations
                        .filter((d) => d.acceptedBy && d.type === "organic waste")
                        .reduce((agents: string[], donation) => {
                          if (donation.acceptedBy && !agents.includes(donation.acceptedBy)) {
                            agents.push(donation.acceptedBy)
                          }
                          return agents
                        }, [])
                        .map((agent, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{agent}</h3>
                              <p className="text-sm text-gray-600">Biogas Agent</p>
                            </div>
                            <Badge variant="secondary">Connected</Badge>
                          </div>
                        ))}
                      {donations.filter((d) => d.acceptedBy && d.type === "organic waste").length === 0 && (
                        <p className="text-gray-500 text-center py-4">No biogas connections yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          donations
                            .filter((d) => d.acceptedBy)
                            .reduce((agents: string[], donation) => {
                              if (donation.acceptedBy && !agents.includes(donation.acceptedBy)) {
                                agents.push(donation.acceptedBy)
                              }
                              return agents
                            }, []).length
                        }
                      </div>
                      <p className="text-sm text-gray-600">Total Connections</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          donations
                            .filter((d) => d.acceptedBy && (d.type === "packed food" || d.type === "fresh food"))
                            .reduce((agents: string[], donation) => {
                              if (donation.acceptedBy && !agents.includes(donation.acceptedBy)) {
                                agents.push(donation.acceptedBy)
                              }
                              return agents
                            }, []).length
                        }
                      </div>
                      <p className="text-sm text-gray-600">NGO Agents</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          donations
                            .filter((d) => d.acceptedBy && d.type === "organic waste")
                            .reduce((agents: string[], donation) => {
                              if (donation.acceptedBy && !agents.includes(donation.acceptedBy)) {
                                agents.push(donation.acceptedBy)
                              }
                              return agents
                            }, []).length
                        }
                      </div>
                      <p className="text-sm text-gray-600">Biogas Agents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {donations.filter((d) => d.acceptedBy).length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connections Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start making donations to connect with NGO and biogas agents in your area.
                    </p>
                    <Button onClick={() => setShowDonationModal(true)} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Donation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
