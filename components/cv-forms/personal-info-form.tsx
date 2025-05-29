"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"

interface PersonalInfoFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

export default function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    ...data.personalInfo,
  })

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onUpdate("personalInfo", newData)
  }

  const generateSummary = () => {
    // AI suggestion simulation
    const suggestions = [
      "Experienced professional with a proven track record of delivering exceptional results in dynamic environments.",
      "Results-driven individual with strong analytical skills and a passion for innovation and continuous improvement.",
      "Dedicated team player with excellent communication skills and the ability to work effectively under pressure.",
    ]
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    handleChange("summary", randomSuggestion)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button type="button" variant="outline" size="sm" onClick={generateSummary} className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI Suggest
          </Button>
        </div>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Write a brief summary of your professional background and key achievements..."
          rows={4}
        />
      </div>

      {/* AI Suggestions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center text-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Keep your summary concise (2-3 sentences)</li>
            <li>• Highlight your most relevant skills and experience</li>
            <li>• Use action words and quantify achievements when possible</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
