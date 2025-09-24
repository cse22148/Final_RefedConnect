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
import {
  Heart,
  Users,
  Recycle,
  MapPin,
  Plus,
  Bell,
  Settings,
  LogOut,
  Package,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react"

interface DashboardProps {
  user: { role: "donor" | "ngo" | "biogas"; name: string }
  onLogout: () => void
  onShowMap: () => void
}

export function Dashboard({ user, onLogout, onShowMap }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [currentRole, setCurrentRole] = useState<"donor" | "ngo" | "biogas">(user.role)
  const [donationForm, setDonationForm] = useState({
    foodType: "",
    quantity: "",
    description: "",
    location: "",
    pickupTime: "",
  })
  const [collectionForm, setCollectionForm] = useState({
    area: "",
    wasteType: "organic waste",
    estimatedQuantity: "",
    collectionTime: "",
    notes: "",
  })
  const [notifications, setNotifications] = useState<
    Array<{
      id: string
      type: string
      details: any
      targetAgent: "ngo" | "biogas"
      status: "pending" | "accepted" | "collected"
      acceptedBy?: string
      donorName: string // Added donor name to track who made the donation
    }>
  >([])

  const handleNewDonation = () => {
    console.log("[v0] New donation button clicked")
    if (currentRole === "biogas") {
      setShowCollectionModal(true)
    } else {
      setShowDonationModal(true)
    }
  }

  const handleSubmitDonation = () => {
    console.log("[v0] Donation submitted:", donationForm)

    // Determine target agent based on food type
    let targetAgent: "ngo" | "biogas" = "ngo"
    if (donationForm.foodType === "organic waste") {
      targetAgent = "biogas"
    }

    // Create notification
    const newNotification = {
      id: Date.now().toString(),
      type: donationForm.foodType,
      details: { ...donationForm },
      targetAgent,
      status: "pending" as const,
      donorName: user.name, // Track which donor made this donation
    }

    setNotifications((prev) => [...prev, newNotification])
    console.log("[v0] Notification sent to:", targetAgent, "for:", donationForm.foodType)
    console.log("[v0] Donor", user.name, "can now see this as pending order")

    setShowDonationModal(false)
    setDonationForm({
      foodType: "",
      quantity: "",
      description: "",
      location: "",
      pickupTime: "",
    })
  }

  const handleScheduleCollection = () => {
    console.log("[v0] Collection scheduled:", collectionForm)

    // Create a collection notification
    const newCollection = {
      id: Date.now().toString(),
      type: "collection scheduled",
      details: { ...collectionForm },
      targetAgent: "biogas" as const,
      status: "pending" as const,
      donorName: user.name,
    }

    setNotifications((prev) => [...prev, newCollection])
    console.log("[v0] Collection scheduled by:", user.name)

    setShowCollectionModal(false)
    setCollectionForm({
      area: "",
      wasteType: "organic waste",
      estimatedQuantity: "",
      collectionTime: "",
      notes: "",
    })
  }

  const handleAcceptOrder = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, status: "accepted", acceptedBy: user.name } : notif,
      ),
    )
    console.log("[v0] Order accepted by:", user.name, "for notification:", notificationId)
  }

  const handleCollected = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, status: "collected" } : notif)),
    )
    console.log("[v0] Item marked as collected:", notificationId)
  }

  const getRoleIcon = () => {
    switch (currentRole) {
      case "donor":
        return <Users className="h-6 w-6 text-blue-600" />
      case "ngo":
        return <Heart className="h-6 w-6 text-green-600" />
      case "biogas":
        return <Recycle className="h-6 w-6 text-purple-600" />
    }
  }

  const getRoleColor = () => {
    switch (currentRole) {
      case "donor":
        return "bg-blue-50 border-blue-200"
      case "ngo":
        return "bg-green-50 border-green-200"
      case "biogas":
        return "bg-purple-50 border-purple-200"
    }
  }

  const getRoleName = () => {
    switch (currentRole) {
      case "donor":
        return "Donor"
      case "ngo":
        return "NGO Agent"
      case "biogas":
        return "Biogas Agent"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RefedConnect</h1>
                <p className="text-sm text-green-600">Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Test as:</Label>
              <Select value={currentRole} onValueChange={(value: "donor" | "ngo" | "biogas") => setCurrentRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="ngo">NGO Agent</SelectItem>
                  <SelectItem value="biogas">Biogas Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={onShowMap} className="flex items-center gap-2 bg-transparent">
              <MapPin className="h-4 w-4" />
              Find Connections
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={onLogout} className="flex items-center gap-2">
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
            <div className={`p-4 rounded-lg border-2 ${getRoleColor()}`}>
              <div className="flex items-center gap-3">
                {getRoleIcon()}
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{getRoleName()}</p>
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
              Overview
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "donations" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              {currentRole === "donor"
                ? "My Donations"
                : currentRole === "ngo"
                  ? "Available Food"
                  : "Waste Collections"}
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "connections" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Connections
            </button>
            {(currentRole === "ngo" || currentRole === "biogas") && (
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "notifications" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
                }`}
              >
                Notifications
                {notifications.filter((n) => n.targetAgent === currentRole && n.status === "pending").length > 0 && (
                  <Badge className="ml-2 bg-red-500">
                    {notifications.filter((n) => n.targetAgent === currentRole && n.status === "pending").length}
                  </Badge>
                )}
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
                {currentRole === "biogas" ? (
                  <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewDonation} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Collection
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Schedule Waste Collection</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="area">Collection Area</Label>
                          <Input
                            id="area"
                            placeholder="e.g., Downtown, Residential Area A"
                            value={collectionForm.area}
                            onChange={(e) => setCollectionForm({ ...collectionForm, area: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wasteType">Waste Type</Label>
                          <Select
                            value={collectionForm.wasteType}
                            onValueChange={(value) => setCollectionForm({ ...collectionForm, wasteType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="organic waste">Organic Waste</SelectItem>
                              <SelectItem value="food scraps">Food Scraps</SelectItem>
                              <SelectItem value="garden waste">Garden Waste</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estimatedQuantity">Estimated Quantity</Label>
                          <Input
                            id="estimatedQuantity"
                            placeholder="e.g., 50kg, 10 bags"
                            value={collectionForm.estimatedQuantity}
                            onChange={(e) =>
                              setCollectionForm({ ...collectionForm, estimatedQuantity: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="collectionTime">Collection Time</Label>
                          <Input
                            id="collectionTime"
                            type="datetime-local"
                            value={collectionForm.collectionTime}
                            onChange={(e) => setCollectionForm({ ...collectionForm, collectionTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Additional collection details or requirements"
                            value={collectionForm.notes}
                            onChange={(e) => setCollectionForm({ ...collectionForm, notes: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleScheduleCollection} className="w-full bg-green-600 hover:bg-green-700">
                          Schedule Collection
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewDonation} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {currentRole === "donor" ? "New Donation" : "Request Food"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{currentRole === "donor" ? "Create New Donation" : "Request Food"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="foodType">{currentRole === "donor" ? "Food Type" : "Food Needed"}</Label>
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
                            placeholder="Additional details about the food/request"
                            value={donationForm.description}
                            onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="Pickup/delivery location"
                            value={donationForm.location}
                            onChange={(e) => setDonationForm({ ...donationForm, location: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pickupTime">{currentRole === "donor" ? "Pickup Time" : "Needed By"}</Label>
                          <Input
                            id="pickupTime"
                            type="datetime-local"
                            value={donationForm.pickupTime}
                            onChange={(e) => setDonationForm({ ...donationForm, pickupTime: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleSubmitDonation} className="w-full bg-green-600 hover:bg-green-700">
                          {currentRole === "donor" ? "Create Donation" : "Submit Request"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* ... existing stats cards and recent activity ... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {currentRole === "donor"
                        ? "Total Donations"
                        : currentRole === "ngo"
                          ? "Food Distributed"
                          : "Waste Processed"}
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">+2 new this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92</div>
                    <p className="text-xs text-muted-foreground">Excellent performance</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {currentRole === "donor"
                            ? "Food donation completed"
                            : currentRole === "ngo"
                              ? "Food distributed to community"
                              : "Waste collection completed"}
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New connection request</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pickup scheduled</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (currentRole === "ngo" || currentRole === "biogas") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentRole === "ngo" ? "Food Notifications" : "Waste Collection Notifications"}
                </h2>
              </div>

              <div className="grid gap-4">
                {notifications
                  .filter((notification) => notification.targetAgent === currentRole)
                  .map((notification) => (
                    <Card key={notification.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">{notification.type}</h3>
                              <p className="text-sm text-gray-600">Quantity: {notification.details.quantity}</p>
                              <p className="text-sm text-gray-600">Location: {notification.details.location}</p>
                              <p className="text-sm text-gray-600">
                                Pickup: {new Date(notification.details.pickupTime).toLocaleString()}
                              </p>
                              {notification.details.description && (
                                <p className="text-sm text-gray-600">Note: {notification.details.description}</p>
                              )}
                              {notification.acceptedBy && (
                                <p className="text-sm text-green-600 font-medium">
                                  Accepted by: {notification.acceptedBy}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                notification.status === "pending"
                                  ? "default"
                                  : notification.status === "accepted"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {notification.status}
                            </Badge>
                            {notification.status === "pending" && (
                              <Button
                                onClick={() => handleAcceptOrder(notification.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                                size="sm"
                              >
                                Accept Order
                              </Button>
                            )}
                            {notification.status === "accepted" && (
                              <Button
                                onClick={() => handleCollected(notification.id)}
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
                {notifications.filter((n) => n.targetAgent === currentRole).length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No notifications yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ... existing donations and connections tabs ... */}
          {activeTab === "donations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentRole === "donor"
                    ? "My Donations"
                    : currentRole === "ngo"
                      ? "Available Food"
                      : "Waste Collections"}
                </h2>
                {currentRole === "biogas" ? (
                  <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewDonation} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Collection
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                ) : (
                  <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewDonation} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        {currentRole === "donor"
                          ? "Add Donation"
                          : currentRole === "ngo"
                            ? "Request Food"
                            : "Schedule Collection"}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>

              <div className="grid gap-4">
                {currentRole === "donor" && (
                  <>
                    {notifications
                      .filter((notification) => notification.donorName === user.name)
                      .map((donation) => (
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
                                    Pickup: {new Date(donation.details.pickupTime).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Assigned to: {donation.targetAgent === "ngo" ? "NGO Agent" : "Biogas Agent"}
                                  </p>
                                  {donation.acceptedBy && (
                                    <p className="text-sm text-green-600 font-medium">
                                      Accepted by: {donation.acceptedBy}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {notifications.filter((n) => n.donorName === user.name).length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-gray-500">No donations yet. Click "Add Donation" to get started!</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {(currentRole === "ngo" || currentRole === "biogas") && (
                  <>
                    {notifications
                      .filter((notification) => notification.targetAgent === currentRole)
                      .map((notification) => (
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
                                    Pickup: {new Date(notification.details.pickupTime).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    notification.status === "pending"
                                      ? "default"
                                      : notification.status === "accepted"
                                        ? "outline"
                                        : "secondary"
                                  }
                                >
                                  {notification.status}
                                </Badge>
                                {notification.status === "pending" && (
                                  <Button
                                    onClick={() => handleAcceptOrder(notification.id)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                    size="sm"
                                  >
                                    Accept Order
                                  </Button>
                                )}
                                {notification.status === "accepted" && (
                                  <Button
                                    onClick={() => handleCollected(notification.id)}
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
                    {notifications.filter((n) => n.targetAgent === currentRole).length === 0 && (
                      <Card>
                        <CardContent className="p-6 text-center">
                          <p className="text-gray-500">No available items yet</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Connections</h2>
                <Button onClick={onShowMap} className="bg-green-600 hover:bg-green-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find New Connections
                </Button>
              </div>

              <div className="grid gap-4">
                {[
                  { name: "Green Valley NGO", type: "NGO", status: "Active", distance: "2.3 km" },
                  { name: "EcoWaste Solutions", type: "Biogas", status: "Active", distance: "1.8 km" },
                  { name: "Community Kitchen", type: "NGO", status: "Pending", distance: "3.1 km" },
                ].map((connection, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              connection.type === "NGO" ? "bg-green-100" : "bg-purple-100"
                            }`}
                          >
                            {connection.type === "NGO" ? (
                              <Heart className="h-6 w-6 text-green-600" />
                            ) : (
                              <Recycle className="h-6 w-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{connection.name}</h3>
                            <p className="text-sm text-gray-600">
                              {connection.type} • {connection.distance} away
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={connection.status === "Active" ? "default" : "secondary"}>
                            {connection.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
