"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface EducationFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

export default function EducationForm({ data, onUpdate }: EducationFormProps) {
  const [education, setEducation] = useState(data.education || [])

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      field: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
    }
    const updated = [...education, newEducation]
    setEducation(updated)
    onUpdate("education", updated)
  }

  const updateEducation = (id: number, field: string, value: string) => {
    const updated = education.map((edu: any) => (edu.id === id ? { ...edu, [field]: value } : edu))
    setEducation(updated)
    onUpdate("education", updated)
  }

  const removeEducation = (id: number) => {
    const updated = education.filter((edu: any) => edu.id !== id)
    setEducation(updated)
    onUpdate("education", updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No education added yet</p>
            <Button onClick={addEducation} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Education
            </Button>
          </CardContent>
        </Card>
      )}

      {education.map((edu: any, index: number) => (
        <Card key={edu.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Education {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`degree-${edu.id}`}>Degree *</Label>
                <Select onValueChange={(value) => updateEducation(edu.id, "degree", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`field-${edu.id}`}>Field of Study *</Label>
                <Input
                  id={`field-${edu.id}`}
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`school-${edu.id}`}>School/University *</Label>
                <Input
                  id={`school-${edu.id}`}
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                  placeholder="University of Technology"
                />
              </div>
              <div>
                <Label htmlFor={`location-${edu.id}`}>Location</Label>
                <Input
                  id={`location-${edu.id}`}
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  placeholder="Boston, MA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`graduationDate-${edu.id}`}>Graduation Date</Label>
                <Input
                  id={`graduationDate-${edu.id}`}
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`gpa-${edu.id}`}>GPA (Optional)</Label>
                <Input
                  id={`gpa-${edu.id}`}
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
