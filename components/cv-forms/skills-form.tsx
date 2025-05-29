"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Plus, X } from "lucide-react"

interface SkillsFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

export default function SkillsForm({ data, onUpdate }: SkillsFormProps) {
  const [skills, setSkills] = useState(data.skills || [])
  const [newSkill, setNewSkill] = useState("")
  const [skillLevel, setSkillLevel] = useState("intermediate")

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill.trim(),
        level: skillLevel,
      }
      const updated = [...skills, skill]
      setSkills(updated)
      onUpdate("skills", updated)
      setNewSkill("")
    }
  }

  const removeSkill = (id: number) => {
    const updated = skills.filter((skill: any) => skill.id !== id)
    setSkills(updated)
    onUpdate("skills", updated)
  }

  const suggestSkills = () => {
    const commonSkills = [
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "SQL",
      "Git",
      "Project Management",
      "Communication",
      "Problem Solving",
      "Leadership",
      "Teamwork",
      "Critical Thinking",
    ]

    const suggestions = commonSkills
      .filter((skill) => !skills.some((s: any) => s.name.toLowerCase() === skill.toLowerCase()))
      .slice(0, 6)
      .map((skill) => ({
        id: Date.now() + Math.random(),
        name: skill,
        level: "intermediate",
      }))

    const updated = [...skills, ...suggestions]
    setSkills(updated)
    onUpdate("skills", updated)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-yellow-100 text-yellow-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-green-100 text-green-800"
      case "expert":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={suggestSkills} size="sm" variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          AI Suggest
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Skill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="newSkill">Skill Name</Label>
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., JavaScript, Project Management"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
            </div>
            <div>
              <Label htmlFor="skillLevel">Proficiency Level</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addSkill} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Skills ({skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className={`${getLevelColor(skill.level)} flex items-center gap-2 px-3 py-1`}
                >
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-75">({skill.level})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {skills.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No skills added yet</p>
            <p className="text-sm text-gray-400 text-center">
              Add your technical and soft skills to showcase your expertise
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
