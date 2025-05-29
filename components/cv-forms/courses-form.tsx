"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Award } from "lucide-react"

interface CoursesFormProps {
  data: any
  onUpdate: (section: string, data: any) => void
}

const courseProviders = [
  "Coursera",
  "edX",
  "Udemy",
  "LinkedIn Learning",
  "Pluralsight",
  "FreeCodeCamp",
  "Khan Academy",
  "MIT OpenCourseWare",
  "Google",
  "Microsoft",
  "Amazon",
  "IBM",
  "Other",
]

export default function CoursesForm({ data, onUpdate }: CoursesFormProps) {
  const [courses, setCourses] = useState(data.courses || [])

  const addCourse = () => {
    const newCourse = {
      id: Date.now(),
      title: "",
      provider: "",
      completionDate: "",
      certificateUrl: "",
      skills: [],
    }
    const updated = [...courses, newCourse]
    setCourses(updated)
    onUpdate("courses", updated)
  }

  const updateCourse = (id: number, field: string, value: any) => {
    const updated = courses.map((course: any) => (course.id === id ? { ...course, [field]: value } : course))
    setCourses(updated)
    onUpdate("courses", updated)
  }

  const removeCourse = (id: number) => {
    const updated = courses.filter((course: any) => course.id !== id)
    setCourses(updated)
    onUpdate("courses", updated)
  }

  const addSkillToCourse = (courseId: number, skill: string) => {
    if (skill.trim()) {
      const updated = courses.map((course: any) => {
        if (course.id === courseId) {
          const skills = [...(course.skills || []), skill.trim()]
          return { ...course, skills }
        }
        return course
      })
      setCourses(updated)
      onUpdate("courses", updated)
    }
  }

  const removeSkillFromCourse = (courseId: number, skillIndex: number) => {
    const updated = courses.map((course: any) => {
      if (course.id === courseId) {
        const skills = course.skills.filter((_: any, index: number) => index !== skillIndex)
        return { ...course, skills }
      }
      return course
    })
    setCourses(updated)
    onUpdate("courses", updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Courses & Certifications
        </h3>
        <Button onClick={addCourse} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {courses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No courses added yet</p>
            <Button onClick={addCourse} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {courses.map((course: any, index: number) => (
        <Card key={course.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Course {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCourse(course.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`title-${course.id}`}>Course Title *</Label>
                <Input
                  id={`title-${course.id}`}
                  value={course.title}
                  onChange={(e) => updateCourse(course.id, "title", e.target.value)}
                  placeholder="e.g., React - The Complete Guide"
                />
              </div>
              <div>
                <Label htmlFor={`provider-${course.id}`}>Provider *</Label>
                <Select value={course.provider} onValueChange={(value) => updateCourse(course.id, "provider", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`completionDate-${course.id}`}>Completion Date</Label>
                <Input
                  id={`completionDate-${course.id}`}
                  type="month"
                  value={course.completionDate}
                  onChange={(e) => updateCourse(course.id, "completionDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`certificateUrl-${course.id}`}>Certificate URL (Optional)</Label>
                <Input
                  id={`certificateUrl-${course.id}`}
                  value={course.certificateUrl}
                  onChange={(e) => updateCourse(course.id, "certificateUrl", e.target.value)}
                  placeholder="https://certificate-url.com"
                />
              </div>
            </div>

            {/* Skills learned */}
            <div>
              <Label>Skills Learned</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {course.skills?.map((skill: string, skillIndex: number) => (
                  <Badge key={skillIndex} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkillFromCourse(course.id, skillIndex)}
                      className="h-3 w-3 p-0 hover:bg-transparent"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill learned"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkillToCourse(course.id, e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addSkillToCourse(course.id, input.value)
                    input.value = ""
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
