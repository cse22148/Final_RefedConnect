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
import { Recycle, MapPin, Plus, Bell, Settings, LogOut, Package, Clock, Zap, Heart } from "lucide-react"

interface BiogasDashboardProps {
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
  onScheduleCollection: (collection: any) => void
}

export function BiogasDashboard({
  user,
  onLogout,
  onShowMap,
  notifications,
  onAcceptOrder,
  onMarkCollected,
  onScheduleCollection,
}: BiogasDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [collectionForm, setCollectionForm] = useState({
    area: "",
    wasteType: "organic waste",
    estimatedQuantity: "",
    collectionTime: "",
    notes: "",
  })

  const biogasNotifications = notifications.filter((n) => n.type === "organic waste")

  const handleScheduleCollection = () => {
    console.log("[v0] Biogas collection scheduled:", collectionForm)
    onScheduleCollection(collectionForm)
    setShowCollectionModal(false)
    setCollectionForm({
      area: "",
      wasteType: "organic waste",
      estimatedQuantity: "",
      collectionTime: "",
      notes: "",
    })
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
              onClick={onShowMap}
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <MapPin className="h-4 w-4" />
              Find Organic Waste
            </Button>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-green-600">
              <Bell className="h-5 w-5" />
              {biogasNotifications.filter((n) => n.status === "pending").length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                  {biogasNotifications.filter((n) => n.status === "pending").length}
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
                <Recycle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">Biogas Agent</p>
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
              onClick={() => setActiveTab("waste")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "waste" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Available Waste
              {biogasNotifications.filter((n) => n.status === "pending").length > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {biogasNotifications.filter((n) => n.status === "pending").length}
                </Badge>
              )}
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
              onClick={() => setActiveTab("production")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "production" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              }`}
            >
              Energy Production
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
                <Dialog open={showCollectionModal} onOpenChange={setShowCollectionModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
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
                          onChange={(e) => setCollectionForm({ ...collectionForm, estimatedQuantity: e.target.value })}
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
              </div>

              {/* Biogas Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Waste Processed</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {biogasNotifications.filter((n) => n.status === "collected").length * 15}kg
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">1,240 kWh</div>
                    <p className="text-xs text-muted-foreground">Clean energy produced</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Collections</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {biogasNotifications.filter((n) => n.status === "pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting pickup</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {biogasNotifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Recycle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Organic Waste Collection</p>
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
                    {biogasNotifications.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No organic waste available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "waste" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Available Organic Waste</h2>
              </div>

              <div className="grid gap-4">
                {biogasNotifications.map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Recycle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Organic Waste</h3>
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
                              Accept Collection
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
                {biogasNotifications.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No organic waste available at the moment</p>
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
