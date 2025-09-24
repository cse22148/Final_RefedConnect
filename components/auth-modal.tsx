"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Users, Heart, Recycle } from "lucide-react"

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

interface AuthModalProps {
  mode: "login" | "signup"
  onClose: () => void
  onSwitchMode: (mode: "login" | "signup") => void
  onSuccess: (userData: { role: "donor" | "ngo" | "biogas"; name: string; email?: string; authMethod?: string }) => void
}

export function AuthModal({ mode, onClose, onSwitchMode, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"donor" | "ngo" | "biogas" | null>(null)
  const [step, setStep] = useState<"auth" | "role">(mode === "signup" ? "role" : "auth")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false)
  const [availableAccounts, setAvailableAccounts] = useState<Array<{ name: string; email: string; picture?: string }>>(
    [],
  )

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Email authentication logic here
    const userData = {
      role: selectedRole || ("donor" as "donor" | "ngo" | "biogas"),
      name: formData.name,
      email: formData.email,
      authMethod: "email",
    }
    console.log("User authenticated with email:", userData)
    onSuccess(userData)
  }

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (typeof window !== "undefined") {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

        if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
          console.log("Google OAuth in development mode - will simulate real accounts")
          return
        }

        // Load Google Identity Services
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleResponse,
              auto_select: false,
              cancel_on_tap_outside: false,
            })
          }
        }
        document.head.appendChild(script)
      }
    }

    initializeGoogleAuth()
  }, [])

  const handleGoogleResponse = (response: any) => {
    try {
      const credential = response.credential
      const payload = JSON.parse(atob(credential.split(".")[1]))

      console.log("Google authentication successful:", payload)

      if (mode === "signup" && !selectedRole) {
        alert("Please select your role first")
        return
      }

      const userData = {
        role: selectedRole || ("donor" as "donor" | "ngo" | "biogas"),
        name: payload.name || payload.given_name + " " + payload.family_name,
        email: payload.email,
        authMethod: "google",
      }

      console.log("User authenticated with Google:", userData)
      onSuccess(userData)
    } catch (error) {
      console.error("Google authentication error:", error)
      alert("Google authentication failed. Please try again.")
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      console.log("Google authentication triggered with role:", selectedRole)

      if (mode === "signup" && !selectedRole) {
        alert("Please select your role first")
        setIsLoading(false)
        return
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

      if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
        // Enhanced simulation - show Google account picker
        const simulatedAccounts = [
          {
            name: "Chanchal Teotia",
            email: "chanchalteotia390@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
          {
            name: "John Smith",
            email: "john.smith@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
          {
            name: "Sarah Wilson",
            email: "sarah.wilson@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
          {
            name: "Mike Johnson",
            email: "mike.johnson@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
          {
            name: "Emma Davis",
            email: "emma.davis@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
          {
            name: "Alex Kumar",
            email: "alex.kumar@gmail.com",
            picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
        ]

        setAvailableAccounts(simulatedAccounts)
        setShowGoogleAccounts(true)
        setIsLoading(false)
        return
      }

      // Use real Google Sign-In
      if (window.google && window.google.accounts) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to popup if prompt is not displayed
            window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
              theme: "outline",
              size: "large",
              width: "100%",
            })
          }
        })
      } else {
        alert("Google authentication is not available. Please use email authentication.")
      }
    } catch (error) {
      console.error("Google authentication error:", error)
      alert("Google authentication failed. Please try again or use email authentication.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccountSelection = async (account: { name: string; email: string; picture?: string }) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate authentication

      const userData = {
        role: selectedRole || ("donor" as "donor" | "ngo" | "biogas"),
        name: account.name,
        email: account.email,
        authMethod: "google",
      }

      console.log("Google account selected:", userData)
      onSuccess(userData)
    } catch (error) {
      console.error("Account selection error:", error)
    } finally {
      setIsLoading(false)
      setShowGoogleAccounts(false)
    }
  }

  if (showGoogleAccounts) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="relative">
            <button
              onClick={() => {
                setShowGoogleAccounts(false)
                setIsLoading(false)
              }}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-lg font-medium">Sign in with Google</span>
            </div>
            <CardTitle className="text-lg text-center">Choose an account</CardTitle>
            <p className="text-center text-gray-600 text-sm">to continue to RefedConnect</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {availableAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleAccountSelection(account)}
                disabled={isLoading}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {account.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-600">{account.email}</p>
                  </div>
                </div>
              </button>
            ))}

            <div className="pt-4 border-t">
              <button
                onClick={() => setShowGoogleAccounts(false)}
                className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Use another account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "signup" && step === "role") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="relative">
            <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
              <X className="h-4 w-4" />
            </button>
            <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
            <p className="text-center text-gray-600 text-sm">Select how you'd like to contribute to RefedConnect</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <button
                onClick={() => setSelectedRole("donor")}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === "donor" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Donor</h3>
                    <p className="text-sm text-gray-600">Share excess food with those in need</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("ngo")}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === "ngo" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">NGO Agent</h3>
                    <p className="text-sm text-gray-600">Manage food distribution to communities</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("biogas")}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === "biogas" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Biogas Agent</h3>
                    <p className="text-sm text-gray-600">Convert organic waste into renewable energy</p>
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={() => setStep("auth")}
              disabled={!selectedRole}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>

            <div className="text-center text-sm">
              <p>
                Already have an account?{" "}
                <button onClick={() => onSwitchMode("login")} className="text-green-600 hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
            <X className="h-4 w-4" />
          </button>
          <CardTitle className="text-2xl text-center">
            {mode === "login" ? "Welcome Back" : "Join RefedConnect"}
          </CardTitle>
          {mode === "signup" && selectedRole && (
            <p className="text-center text-sm text-gray-600">
              Signing up as:{" "}
              <span className="font-semibold capitalize">
                {selectedRole === "ngo" ? "NGO Agent" : selectedRole === "biogas" ? "Biogas Agent" : "Donor"}
              </span>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div id="google-signin-button">
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button onClick={() => onSwitchMode("signup")} className="text-green-600 hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => onSwitchMode("login")} className="text-green-600 hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div className="text-center">
              <button onClick={() => setStep("role")} className="text-sm text-gray-600 hover:text-gray-800">
                ← Change role selection
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
