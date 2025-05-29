"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Globe } from "lucide-react"

interface LanguagesFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

const proficiencyLevels = [
  { value: "native", label: "Native", dots: 5 },
  { value: "fluent", label: "Fluent", dots: 5 },
  { value: "advanced", label: "Advanced", dots: 4 },
  { value: "intermediate", label: "Intermediate", dots: 3 },
  { value: "beginner", label: "Beginner", dots: 2 },
]

const commonLanguages = [
  "English",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Dutch",
]

export default function LanguagesForm({ data, onUpdate }: LanguagesFormProps) {
  const [languages, setLanguages] = useState(data.languages || [])
  const [newLanguage, setNewLanguage] = useState("")
  const [proficiency, setProficiency] = useState("intermediate")

  const addLanguage = () => {
    if (newLanguage.trim()) {
      const language = {
        id: Date.now(),
        name: newLanguage.trim(),
        proficiency: proficiency,
      }
      const updated = [...languages, language]
      setLanguages(updated)
      onUpdate("languages", updated)
      setNewLanguage("")
    }
  }

  const removeLanguage = (id: number) => {
    const updated = languages.filter((lang: any) => lang.id !== id)
    setLanguages(updated)
    onUpdate("languages", updated)
  }

  const addCommonLanguage = (langName: string) => {
    if (!languages.some((lang: any) => lang.name.toLowerCase() === langName.toLowerCase())) {
      const language = {
        id: Date.now(),
        name: langName,
        proficiency: "intermediate",
      }
      const updated = [...languages, language]
      setLanguages(updated)
      onUpdate("languages", updated)
    }
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case "native":
      case "fluent":
        return "bg-green-100 text-green-800"
      case "advanced":
        return "bg-blue-100 text-blue-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "beginner":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Languages
        </h3>
      </div>

      {/* Add New Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="newLanguage">Language</Label>
              <Input
                id="newLanguage"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="e.g., English, French, Spanish"
                onKeyPress={(e) => e.key === "Enter" && addLanguage()}
              />
            </div>
            <div>
              <Label htmlFor="proficiency">Proficiency Level</Label>
              <Select value={proficiency} onValueChange={setProficiency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addLanguage} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardContent>
      </Card>

      {/* Quick Add Common Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Add</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonLanguages.map((lang) => (
              <Button
                key={lang}
                variant="outline"
                size="sm"
                onClick={() => addCommonLanguage(lang)}
                disabled={languages.some((l: any) => l.name.toLowerCase() === lang.toLowerCase())}
              >
                {lang}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Languages */}
      {languages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Languages ({languages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languages.map((language: any) => (
                <div key={language.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{language.name}</span>
                    <Badge className={getProficiencyColor(language.proficiency)}>
                      {proficiencyLevels.find((p) => p.value === language.proficiency)?.label}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {languages.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No languages added yet</p>
            <p className="text-sm text-gray-400 text-center">
              Add the languages you speak to showcase your communication skills
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
