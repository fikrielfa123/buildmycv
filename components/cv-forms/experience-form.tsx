"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Plus, Trash2 } from "lucide-react"

interface ExperienceFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

export default function ExperienceForm({ data, onUpdate }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState(data.experience || [])

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    const updated = [...experiences, newExperience]
    setExperiences(updated)
    onUpdate("experience", updated)
  }

  const updateExperience = (id: number, field: string, value: any) => {
    const updated = experiences.map((exp: any) => (exp.id === id ? { ...exp, [field]: value } : exp))
    setExperiences(updated)
    onUpdate("experience", updated)
  }

  const removeExperience = (id: number) => {
    const updated = experiences.filter((exp: any) => exp.id !== id)
    setExperiences(updated)
    onUpdate("experience", updated)
  }

  const generateDescription = (jobTitle: string, company: string) => {
    const suggestions = [
      `Led cross-functional teams to deliver high-impact projects at ${company}, resulting in improved operational efficiency.`,
      `Developed and implemented strategic initiatives as ${jobTitle}, contributing to company growth and success.`,
      `Collaborated with stakeholders to optimize processes and drive innovation in ${jobTitle} role.`,
    ]
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            <Button onClick={addExperience} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {experiences.map((experience: any, index: number) => (
        <Card key={experience.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Experience {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(experience.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`jobTitle-${experience.id}`}>Job Title *</Label>
                <Input
                  id={`jobTitle-${experience.id}`}
                  value={experience.jobTitle}
                  onChange={(e) => updateExperience(experience.id, "jobTitle", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                <Input
                  id={`company-${experience.id}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`location-${experience.id}`}>Location</Label>
              <Input
                id={`location-${experience.id}`}
                value={experience.location}
                onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${experience.id}`}>Start Date *</Label>
                <Input
                  id={`startDate-${experience.id}`}
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                <Input
                  id={`endDate-${experience.id}`}
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                  disabled={experience.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) => updateExperience(experience.id, "current", checked)}
              />
              <Label htmlFor={`current-${experience.id}`} className="text-sm">
                I currently work here
              </Label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`description-${experience.id}`}>Job Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const suggestion = generateDescription(experience.jobTitle, experience.company)
                    updateExperience(experience.id, "description", suggestion)
                  }}
                  className="text-xs"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  AI Suggest
                </Button>
              </div>
              <Textarea
                id={`description-${experience.id}`}
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                placeholder="Describe your key responsibilities and achievements..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
