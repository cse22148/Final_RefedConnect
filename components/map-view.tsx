"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Mail, Heart, Recycle } from "lucide-react"

interface Agent {
  id: string
  name: string
  type: "ngo" | "biogas"
  location: string
  distance: string
  contact: {
    phone: string
    email: string
  }
  description: string
  availability: "available" | "busy" | "offline"
}

interface MapViewProps {
  onBack: () => void
}

export function MapView({ onBack }: MapViewProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [userLocation, setUserLocation] = useState<string>("Getting location...")

  const [agents] = useState<Agent[]>([
    {
      id: "1",
      name: "Green Hope NGO",
      type: "ngo",
      location: "Downtown Community Center",
      distance: "0.8 km",
      contact: { phone: "+1-555-0123", email: "contact@greenhope.org" },
      description: "Serving meals to homeless communities daily. Specializing in fresh produce distribution.",
      availability: "available",
    },
    {
      id: "2",
      name: "EcoWaste Solutions",
      type: "biogas",
      location: "Industrial District",
      distance: "1.2 km",
      contact: { phone: "+1-555-0456", email: "info@ecowaste.com" },
      description: "Converting organic waste to clean energy. Pickup available for large quantities.",
      availability: "available",
    },
    {
      id: "3",
      name: "Food Rescue Alliance",
      type: "ngo",
      location: "Riverside Community",
      distance: "2.1 km",
      contact: { phone: "+1-555-0789", email: "help@foodrescue.org" },
      description: "Emergency food distribution network. Available 24/7 for urgent donations.",
      availability: "busy",
    },
    {
      id: "4",
      name: "BioEnergy Collective",
      type: "biogas",
      location: "Green Valley",
      distance: "3.5 km",
      contact: { phone: "+1-555-0321", email: "collect@bioenergy.co" },
      description: "Community-owned biogas facility. Accepting fruit and vegetable waste.",
      availability: "available",
    },
  ])

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation("Current Location (GPS)")
          },
          (error) => {
            setUserLocation("Location access denied")
          },
        )
      } else {
        setUserLocation("Location not supported")
      }
    }

    getLocation()
  }, [])

  const getAgentIcon = (type: "ngo" | "biogas") => {
    return type === "ngo" ? Heart : Recycle
  }

  const getAgentColor = (type: "ngo" | "biogas") => {
    return type === "ngo" ? "text-green-600" : "text-purple-600"
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Find Nearby Connections</h1>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {userLocation}
            </p>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map Placeholder */}
        <div className="flex-1 bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Interactive Map</p>
              <p className="text-gray-500 text-sm">Google Maps integration will show real locations here</p>
            </div>
          </div>

          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
            NGO
          </div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
            BIO
          </div>
          <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
            NGO
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Nearby Agents</h2>
            <p className="text-sm text-gray-600">
              {agents.filter((a) => a.availability === "available").length} available now
            </p>
          </div>

          <div className="p-4 space-y-4">
            {agents.map((agent) => {
              const Icon = getAgentIcon(agent.type)
              return (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAgent?.id === agent.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${getAgentColor(agent.type)}`} />
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                      </div>
                      <Badge className={getAvailabilityColor(agent.availability)}>{agent.availability}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {agent.location} • {agent.distance}
                      </p>
                      <p className="text-gray-700">{agent.description}</p>

                      {selectedAgent?.id === agent.id && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a href={`tel:${agent.contact.phone}`} className="text-blue-600 hover:underline">
                              {agent.contact.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <a href={`mailto:${agent.contact.email}`} className="text-blue-600 hover:underline">
                              {agent.contact.email}
                            </a>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1">
                              Contact Now
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
