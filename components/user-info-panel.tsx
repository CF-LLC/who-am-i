"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe, Cpu, Monitor, Clock, Wifi, Battery, Info, MapPin, Shield } from "lucide-react"

interface UserInfo {
  ip?: string
  location?: {
    city?: string
    region?: string
    country?: string
    latitude?: number
    longitude?: number
  }
  browser?: {
    name?: string
    version?: string
    userAgent?: string
    language?: string
    cookiesEnabled?: boolean
  }
  system?: {
    os?: string
    platform?: string
    cores?: number
    memory?: number
    screenResolution?: string
    pixelRatio?: number
    timeZone?: string
    timeZoneOffset?: number
  }
  network?: {
    connectionType?: string
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }
  battery?: {
    level?: number
    charging?: boolean
    chargingTime?: number
    dischargingTime?: number
  }
}

export default function UserInfoPanel() {
  const [userInfo, setUserInfo] = useState<UserInfo>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch IP and location data
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        const ipData = await ipResponse.json()

        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
        const geoData = await geoResponse.json()

        // Collect browser information
        const browserInfo = {
          name: getBrowserName(navigator.userAgent),
          version: getBrowserVersion(navigator.userAgent),
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
        }

        // Collect system information
        const systemInfo = {
          os: getOperatingSystem(navigator.userAgent),
          platform: navigator.platform,
          cores: navigator.hardwareConcurrency || 0,
          memory: (navigator.deviceMemory as number) || 0,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          pixelRatio: window.devicePixelRatio,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timeZoneOffset: new Date().getTimezoneOffset(),
        }

        // Collect network information if available
        let networkInfo = {}
        if ("connection" in navigator) {
          const connection = (navigator as any).connection
          networkInfo = {
            connectionType: connection?.type || "unknown",
            effectiveType: connection?.effectiveType || "unknown",
            downlink: connection?.downlink || 0,
            rtt: connection?.rtt || 0,
            saveData: connection?.saveData || false,
          }
        }

        // Collect battery information if available
        let batteryInfo = {}
        if ("getBattery" in navigator) {
          try {
            const battery = await (navigator as any).getBattery()
            batteryInfo = {
              level: battery.level * 100,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
            }
          } catch (e) {
            console.error("Battery API error:", e)
          }
        }

        setUserInfo({
          ip: ipData.ip,
          location: {
            city: geoData.city,
            region: geoData.region,
            country: geoData.country_name,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
          },
          browser: browserInfo,
          system: systemInfo,
          network: networkInfo as UserInfo["network"],
          battery: batteryInfo as UserInfo["battery"],
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching user info:", err)
        setError("Failed to fetch user information. Please try again later.")
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // Helper functions to parse user agent
  function getBrowserName(userAgent: string): string {
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("SamsungBrowser")) return "Samsung Browser"
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera"
    if (userAgent.includes("Trident")) return "Internet Explorer"
    if (userAgent.includes("Edge")) return "Edge"
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Safari")) return "Safari"
    return "Unknown"
  }

  function getBrowserVersion(userAgent: string): string {
    const browser = getBrowserName(userAgent)
    let version = "Unknown"

    if (browser === "Firefox") {
      const match = userAgent.match(/Firefox\/([0-9.]+)/)
      if (match) version = match[1]
    } else if (browser === "Chrome") {
      const match = userAgent.match(/Chrome\/([0-9.]+)/)
      if (match) version = match[1]
    } else if (browser === "Safari") {
      const match = userAgent.match(/Version\/([0-9.]+)/)
      if (match) version = match[1]
    } else if (browser === "Edge") {
      const match = userAgent.match(/Edge\/([0-9.]+)/)
      if (match) version = match[1]
    }

    return version
  }

  function getOperatingSystem(userAgent: string): string {
    if (userAgent.includes("Windows NT 10.0")) return "Windows 10"
    if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1"
    if (userAgent.includes("Windows NT 6.2")) return "Windows 8"
    if (userAgent.includes("Windows NT 6.1")) return "Windows 7"
    if (userAgent.includes("Windows NT 6.0")) return "Windows Vista"
    if (userAgent.includes("Windows NT 5.1")) return "Windows XP"
    if (userAgent.includes("Windows NT 5.0")) return "Windows 2000"
    if (userAgent.includes("Mac")) return "macOS"
    if (userAgent.includes("Android")) return "Android"
    if (userAgent.includes("iOS")) return "iOS"
    if (userAgent.includes("Linux")) return "Linux"
    return "Unknown"
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl bg-black/70 backdrop-blur-md border-gray-800 text-white min-h-[600px]">
        <CardHeader>
          <CardTitle className="text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl bg-black/70 backdrop-blur-md border-gray-800 text-white overflow-auto min-h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Info className="h-6 w-6" /> User Information Dashboard
        </CardTitle>
        <CardDescription className="text-gray-400">
          Displaying all available information about your current session
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="location" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 mb-4 bg-gray-900">
            <TabsTrigger value="location" className="data-[state=active]:bg-gray-800">
              <Globe className="h-4 w-4 mr-2" /> Location
            </TabsTrigger>
            <TabsTrigger value="browser" className="data-[state=active]:bg-gray-800">
              <Monitor className="h-4 w-4 mr-2" /> Browser
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-800">
              <Cpu className="h-4 w-4 mr-2" /> System
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-gray-800">
              <Wifi className="h-4 w-4 mr-2" /> Network
            </TabsTrigger>
            <TabsTrigger value="battery" className="data-[state=active]:bg-gray-800">
              <Battery className="h-4 w-4 mr-2" /> Battery
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex flex-col">
            <TabsContent value="location" className="space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<Shield className="h-5 w-5 text-blue-400" />}
                  title="IP Address"
                  value={loading ? <Skeleton className="h-6 w-32 bg-gray-700" /> : userInfo.ip || "Not available"}
                />
                <InfoCard
                  icon={<MapPin className="h-5 w-5 text-red-400" />}
                  title="Location"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.location?.city && userInfo.location?.country ? (
                      `${userInfo.location.city}, ${userInfo.location.country}`
                    ) : (
                      "Not available"
                    )
                  }
                />
              </div>

              {!loading && userInfo.location?.latitude && userInfo.location?.longitude && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-400">Location Coordinates</h3>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${userInfo.location.latitude},${userInfo.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View on Google Maps
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-red-400" />
                      <span className="text-white text-lg">
                        {userInfo.location.latitude}, {userInfo.location.longitude}
                      </span>
                    </div>
                    {userInfo.location.city && userInfo.location.country && (
                      <p className="text-gray-400 text-md mt-2 pl-9">
                        {userInfo.location.city}, {userInfo.location.region && `${userInfo.location.region}, `}
                        {userInfo.location.country}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InfoCard
                  title="Region"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.location?.region || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Coordinates"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.location?.latitude && userInfo.location?.longitude ? (
                      `${userInfo.location.latitude}, ${userInfo.location.longitude}`
                    ) : (
                      "Not available"
                    )
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="browser" className="space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Browser"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.browser?.name && userInfo.browser?.version ? (
                      `${userInfo.browser.name} ${userInfo.browser.version}`
                    ) : (
                      "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Language"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.browser?.language || "Not available"
                    )
                  }
                />
              </div>
              <InfoCard
                title="User Agent"
                value={
                  loading ? (
                    <Skeleton className="h-6 w-full bg-gray-700" />
                  ) : (
                    userInfo.browser?.userAgent || "Not available"
                  )
                }
              />
              <InfoCard
                title="Cookies Enabled"
                value={
                  loading ? (
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                  ) : userInfo.browser?.cookiesEnabled !== undefined ? (
                    userInfo.browser.cookiesEnabled ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    "Not available"
                  )
                }
              />
            </TabsContent>

            <TabsContent value="system" className="space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Operating System"
                  value={
                    loading ? <Skeleton className="h-6 w-32 bg-gray-700" /> : userInfo.system?.os || "Not available"
                  }
                />
                <InfoCard
                  title="Platform"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.system?.platform || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="CPU Cores"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                    ) : userInfo.system?.cores !== undefined ? (
                      userInfo.system.cores.toString()
                    ) : (
                      "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Memory"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                    ) : userInfo.system?.memory !== undefined ? (
                      `${userInfo.system.memory} GB`
                    ) : (
                      "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Screen Resolution"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.system?.screenResolution || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Pixel Ratio"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                    ) : userInfo.system?.pixelRatio !== undefined ? (
                      userInfo.system.pixelRatio.toString()
                    ) : (
                      "Not available"
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={<Clock className="h-5 w-5 text-yellow-400" />}
                  title="Time Zone"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.system?.timeZone || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Time Zone Offset"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.system?.timeZoneOffset !== undefined ? (
                      `UTC${userInfo.system.timeZoneOffset <= 0 ? "+" : "-"}${Math.abs(userInfo.system.timeZoneOffset / 60)}`
                    ) : (
                      "Not available"
                    )
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  title="Connection Type"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.network?.connectionType || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Effective Type"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : (
                      userInfo.network?.effectiveType || "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Downlink"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.network?.downlink !== undefined ? (
                      `${userInfo.network.downlink} Mbps`
                    ) : (
                      "Not available"
                    )
                  }
                />
                <InfoCard
                  title="Round Trip Time"
                  value={
                    loading ? (
                      <Skeleton className="h-6 w-32 bg-gray-700" />
                    ) : userInfo.network?.rtt !== undefined ? (
                      `${userInfo.network.rtt} ms`
                    ) : (
                      "Not available"
                    )
                  }
                />
              </div>
              <InfoCard
                title="Data Saver"
                value={
                  loading ? (
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                  ) : userInfo.network?.saveData !== undefined ? (
                    userInfo.network.saveData ? (
                      "Enabled"
                    ) : (
                      "Disabled"
                    )
                  ) : (
                    "Not available"
                  )
                }
              />
            </TabsContent>

            <TabsContent value="battery" className="space-y-5 flex-1">
              {!loading && (!userInfo.battery || Object.keys(userInfo.battery).length === 0) ? (
                <div className="p-6 bg-gray-900 rounded-lg">
                  <p className="text-gray-400">Battery information is not available on this device or browser.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    title="Battery Level"
                    value={
                      loading ? (
                        <Skeleton className="h-6 w-32 bg-gray-700" />
                      ) : userInfo.battery?.level !== undefined ? (
                        `${Math.round(userInfo.battery.level)}%`
                      ) : (
                        "Not available"
                      )
                    }
                  />
                  <InfoCard
                    title="Charging Status"
                    value={
                      loading ? (
                        <Skeleton className="h-6 w-32 bg-gray-700" />
                      ) : userInfo.battery?.charging !== undefined ? (
                        userInfo.battery.charging ? (
                          "Charging"
                        ) : (
                          "Not Charging"
                        )
                      ) : (
                        "Not available"
                      )
                    }
                  />
                  <InfoCard
                    title="Time Until Charged"
                    value={
                      loading ? (
                        <Skeleton className="h-6 w-32 bg-gray-700" />
                      ) : userInfo.battery?.chargingTime !== undefined &&
                        userInfo.battery.chargingTime !== Number.POSITIVE_INFINITY ? (
                        `${Math.round(userInfo.battery.chargingTime / 60)} minutes`
                      ) : (
                        "Not available"
                      )
                    }
                  />
                  <InfoCard
                    title="Time Until Discharged"
                    value={
                      loading ? (
                        <Skeleton className="h-6 w-32 bg-gray-700" />
                      ) : userInfo.battery?.dischargingTime !== undefined &&
                        userInfo.battery.dischargingTime !== Number.POSITIVE_INFINITY ? (
                        `${Math.round(userInfo.battery.dischargingTime / 60)} minutes`
                      ) : (
                        "Not available"
                      )
                    }
                  />
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            This information is collected from your browser and device. No data is stored on our servers.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface InfoCardProps {
  icon?: React.ReactNode
  title: string
  value: React.ReactNode
}

function InfoCard({ icon, title, value }: InfoCardProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      </div>
      <div className="text-white font-medium break-words">
        {typeof value === "string" && value === "Not available" ? (
          <Badge variant="outline" className="bg-transparent text-gray-500">
            Not available
          </Badge>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
