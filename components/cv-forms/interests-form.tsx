"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  X,
  Heart,
  Camera,
  Plane,
  Book,
  Music,
  Gamepad2,
  Palette,
  Dumbbell,
  Code,
  Coffee,
  Mountain,
  Film,
} from "lucide-react"

interface InterestsFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

const interestCategories = [
  { name: "Technology", icon: Code, interests: ["Programming", "AI/ML", "Cybersecurity", "Gaming", "Gadgets"] },
  { name: "Creative", icon: Palette, interests: ["Photography", "Design", "Writing", "Music", "Art"] },
  { name: "Sports & Fitness", icon: Dumbbell, interests: ["Running", "Gym", "Swimming", "Cycling", "Yoga"] },
  { name: "Travel & Culture", icon: Plane, interests: ["Travel", "Languages", "Cooking", "History", "Museums"] },
  { name: "Entertainment", icon: Film, interests: ["Movies", "Reading", "Podcasts", "Theater", "Concerts"] },
  { name: "Outdoor", icon: Mountain, interests: ["Hiking", "Camping", "Gardening", "Nature", "Adventure"] },
]

export default function InterestsForm({ data, onUpdate }: InterestsFormProps) {
  const [interests, setInterests] = useState(data.interests || [])
  const [newInterest, setNewInterest] = useState("")

  const addInterest = (interestName?: string) => {
    const name = interestName || newInterest.trim()
    if (name && !interests.some((interest: any) => interest.name.toLowerCase() === name.toLowerCase())) {
      const interest = {
        id: Date.now(),
        name: name,
        category: getCategoryForInterest(name),
      }
      const updated = [...interests, interest]
      setInterests(updated)
      onUpdate("interests", updated)
      if (!interestName) setNewInterest("")
    }
  }

  const removeInterest = (id: number) => {
    const updated = interests.filter((interest: any) => interest.id !== id)
    setInterests(updated)
    onUpdate("interests", updated)
  }

  const getCategoryForInterest = (interestName: string) => {
    for (const category of interestCategories) {
      if (category.interests.some((i) => i.toLowerCase() === interestName.toLowerCase())) {
        return category.name
      }
    }
    return "Other"
  }

  const getInterestIcon = (interestName: string) => {
    const lowerName = interestName.toLowerCase()
    if (lowerName.includes("photo")) return Camera
    if (lowerName.includes("travel")) return Plane
    if (lowerName.includes("read") || lowerName.includes("book")) return Book
    if (lowerName.includes("music")) return Music
    if (lowerName.includes("game") || lowerName.includes("gaming")) return Gamepad2
    if (lowerName.includes("art") || lowerName.includes("design")) return Palette
    if (lowerName.includes("sport") || lowerName.includes("gym") || lowerName.includes("fitness")) return Dumbbell
    if (lowerName.includes("code") || lowerName.includes("programming")) return Code
    if (lowerName.includes("coffee")) return Coffee
    if (lowerName.includes("mountain") || lowerName.includes("hiking")) return Mountain
    if (lowerName.includes("film") || lowerName.includes("movie")) return Film
    return Heart
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Interests & Hobbies
        </h3>
      </div>

      {/* Add Custom Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Custom Interest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g., Rock Climbing, Chess, Volunteering"
              onKeyPress={(e) => e.key === "Enter" && addInterest()}
              className="flex-1"
            />
            <Button onClick={() => addInterest()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interest Categories */}
      <div className="grid gap-4">
        {interestCategories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {category.interests.map((interest) => (
                    <Button
                      key={interest}
                      variant="outline"
                      size="sm"
                      onClick={() => addInterest(interest)}
                      disabled={interests.some((i: any) => i.name.toLowerCase() === interest.toLowerCase())}
                      className="text-xs"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Interests */}
      {interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Interests ({interests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest: any) => {
                const IconComponent = getInterestIcon(interest.name)
                return (
                  <Badge key={interest.id} variant="secondary" className="flex items-center gap-2 px-3 py-2">
                    <IconComponent className="h-3 w-3" />
                    <span>{interest.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInterest(interest.id)}
                      className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {interests.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No interests added yet</p>
            <p className="text-sm text-gray-400 text-center">
              Add your hobbies and interests to show your personality and cultural fit
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
