"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Mail, Heart, Recycle, Navigation, Clock, Route } from "lucide-react"

interface Agent {
  id: string
  name: string
  type: "ngo" | "biogas"
  coordinates: { lat: number; lng: number }
  contact: { phone: string; email: string }
  description: string
  availability: "available" | "busy" | "offline"
  realTimeDistance?: number
  estimatedTime?: string
}

interface RealTimeMapProps {
  onBack: () => void
  userRole: "donor" | "ngo" | "biogas"
}

export function RealTimeMap({ onBack, userRole }: RealTimeMapProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<string>("Getting location...")
  const [isTracking, setIsTracking] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [directions, setDirections] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Initialize agents with real coordinates
  useEffect(() => {
    const initialAgents: Agent[] = [
      {
        id: "1",
        name: "Green Hope NGO",
        type: "ngo",
        coordinates: { lat: 28.6139, lng: 77.209 }, // Delhi coordinates
        contact: { phone: "+91-9876543210", email: "contact@greenhope.org" },
        description: "Serving meals to homeless communities daily. Specializing in fresh produce distribution.",
        availability: "available",
      },
      {
        id: "2",
        name: "EcoWaste Solutions",
        type: "biogas",
        coordinates: { lat: 28.6304, lng: 77.2177 }, // Delhi coordinates
        contact: { phone: "+91-9876543211", email: "info@ecowaste.com" },
        description: "Converting organic waste to clean energy. Pickup available for large quantities.",
        availability: "available",
      },
      {
        id: "3",
        name: "Food Rescue Alliance",
        type: "ngo",
        coordinates: { lat: 28.5355, lng: 77.391 }, // Noida coordinates
        contact: { phone: "+91-9876543212", email: "help@foodrescue.org" },
        description: "Emergency food distribution network. Available 24/7 for urgent donations.",
        availability: "busy",
      },
      {
        id: "4",
        name: "BioEnergy Collective",
        type: "biogas",
        coordinates: { lat: 28.4595, lng: 77.0266 }, // Gurgaon coordinates
        contact: { phone: "+91-9876543213", email: "collect@bioenergy.co" },
        description: "Community-owned biogas facility. Accepting fruit and vegetable waste.",
        availability: "available",
      },
    ]
    setAgents(initialAgents)
  }, [])

  // Real-time GPS tracking
  useEffect(() => {
    const startTracking = () => {
      if (!navigator.geolocation) {
        setLocationStatus("GPS not supported")
        return
      }

      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(coords)
          setLocationStatus("GPS Active")
          updateDistances(coords)
          console.log("[v0] GPS location obtained:", coords)
        },
        (error) => {
          setLocationStatus("GPS access denied")
          console.log("[v0] GPS error:", error.message)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )

      // Start real-time tracking
      if (isTracking) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setUserLocation(coords)
            updateDistances(coords)
            console.log("[v0] Real-time GPS update:", coords)
          },
          (error) => {
            console.log("[v0] GPS tracking error:", error.message)
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 },
        )
      }
    }

    startTracking()

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [isTracking])

  // Calculate real distances using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Update distances to all agents
  const updateDistances = (userCoords: { lat: number; lng: number }) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        const distance = calculateDistance(userCoords.lat, userCoords.lng, agent.coordinates.lat, agent.coordinates.lng)
        const estimatedTime = Math.round(distance * 3) // Rough estimate: 3 minutes per km
        return {
          ...agent,
          realTimeDistance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          estimatedTime: `${estimatedTime} min`,
        }
      }),
    )
  }

  // Get directions to selected agent
  const getDirections = (agent: Agent) => {
    if (!userLocation) {
      alert("Current location not available. Please enable GPS.")
      return
    }

    const destination = `${agent.coordinates.lat},${agent.coordinates.lng}`
    const origin = `${userLocation.lat},${userLocation.lng}`

    // Create the Google Maps URL
    const googleMapsWeb = `https://www.google.com/maps/dir/${origin}/${destination}`

    console.log("[v0] Navigation opened for:", agent.name)

    // Try to open in same tab to avoid popup blocking
    window.location.href = googleMapsWeb
  }

  const handleContact = (agent: Agent, type: "phone" | "email") => {
    // These will now be handled by direct href links in the JSX
    console.log(`[v0] ${type} contact initiated for:`, agent.name)
  }

  const toggleTracking = () => {
    setIsTracking(!isTracking)
    console.log("[v0] GPS tracking toggled:", !isTracking)
  }

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

  // Filter agents based on user role
  const filteredAgents = agents.filter((agent) => {
    if (userRole === "donor") return true // Donors can see all agents
    if (userRole === "ngo") return agent.type === "ngo"
    if (userRole === "biogas") return agent.type === "biogas"
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Real-Time GPS Navigation</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {locationStatus}
                {userLocation && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={isTracking ? "default" : "outline"} size="sm" onClick={toggleTracking}>
              <Navigation className="h-4 w-4 mr-2" />
              {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Interactive Map */}
        <div className="flex-1 bg-gray-200 relative" ref={mapRef}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
            {/* Map Grid */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute border-gray-300"
                  style={{
                    left: `${i * 5}%`,
                    top: 0,
                    bottom: 0,
                    borderLeft: "1px solid",
                  }}
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute border-gray-300"
                  style={{
                    top: `${i * 5}%`,
                    left: 0,
                    right: 0,
                    borderTop: "1px solid",
                  }}
                />
              ))}
            </div>

            {/* User Location */}
            {userLocation && (
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  You are here
                </div>
              </div>
            )}

            {/* Agent Markers */}
            {filteredAgents.map((agent, index) => {
              const Icon = getAgentIcon(agent.type)
              return (
                <div
                  key={agent.id}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg ${
                    agent.type === "ngo" ? "bg-green-500" : "bg-purple-500"
                  } ${selectedAgent?.id === agent.id ? "ring-4 ring-yellow-400" : ""}`}
                  style={{
                    left: `${30 + index * 15}%`,
                    top: `${25 + index * 20}%`,
                  }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )
            })}

            {/* Route Line */}
            {selectedAgent && userLocation && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${30 + filteredAgents.findIndex((a) => a.id === selectedAgent.id) * 15}%`}
                  y2={`${25 + filteredAgents.findIndex((a) => a.id === selectedAgent.id) * 20}%`}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <h3 className="font-semibold text-sm mb-2">Legend</h3>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>NGO Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Biogas Agents</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Nearby Agents</h2>
            <p className="text-sm text-gray-600">
              {filteredAgents.filter((a) => a.availability === "available").length} available now
            </p>
            {isTracking && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live tracking active
              </div>
            )}
          </div>

          {/* Directions Panel */}
          {directions && (
            <div className="p-4 border-b bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  <Route className="h-4 w-4" />
                  Navigation
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setDirections(null)}>
                  ×
                </Button>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{directions}</pre>
            </div>
          )}

          <div className="p-4 space-y-4">
            {filteredAgents
              .sort((a, b) => (a.realTimeDistance || 999) - (b.realTimeDistance || 999))
              .map((agent) => {
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
                        <div className="flex items-center justify-between">
                          <p className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {agent.realTimeDistance ? `${agent.realTimeDistance} km` : "Calculating..."}
                          </p>
                          {agent.estimatedTime && (
                            <p className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-3 w-3" />
                              {agent.estimatedTime}
                            </p>
                          )}
                        </div>
                        <p className="text-gray-700">{agent.description}</p>

                        {selectedAgent?.id === agent.id && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <a
                                href={`tel:${agent.contact.phone}`}
                                className="text-blue-600 hover:underline"
                                onClick={() => console.log("[v0] Phone call initiated to:", agent.contact.phone)}
                              >
                                {agent.contact.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <a
                                href={`mailto:${agent.contact.email}?subject=${encodeURIComponent(`Food Donation Inquiry - ${agent.name}`)}&body=${encodeURIComponent(`Hi ${agent.name},\n\nI would like to connect regarding food donation/collection.\n\nBest regards`)}`}
                                className="text-blue-600 hover:underline"
                                onClick={() => console.log("[v0] Email opened to:", agent.contact.email)}
                              >
                                {agent.contact.email}
                              </a>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <a
                                href={`tel:${agent.contact.phone}`}
                                className="flex-1"
                                onClick={() => console.log("[v0] Phone call initiated to:", agent.contact.phone)}
                              >
                                <Button size="sm" className="w-full">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Contact Now
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => getDirections(agent)}
                              >
                                <Navigation className="h-3 w-3 mr-1" />
                                Navigate
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
