"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, FileText, Database, LogIn } from "lucide-react"
import { createBrowserClient, isSupabaseConfigured, createMockSupabaseClient } from "@/lib/supabase"
import PersonalInfoForm from "./cv-forms/personal-info-form"
import ExperienceForm from "./cv-forms/experience-form"
import EducationForm from "./cv-forms/education-form"
import SkillsForm from "./cv-forms/skills-form"
import LanguagesForm from "./cv-forms/languages-form"
import InterestsForm from "./cv-forms/interests-form"
import CoursesForm from "./cv-forms/courses-form"
import CVPreview from "./cv-preview"

const steps = [
  { id: 1, title: "Personal Info", component: PersonalInfoForm },
  { id: 2, title: "Experience", component: ExperienceForm },
  { id: 3, title: "Education", component: EducationForm },
  { id: 4, title: "Skills", component: SkillsForm },
  { id: 5, title: "Languages", component: LanguagesForm },
  { id: 6, title: "Interests", component: InterestsForm },
  { id: 7, title: "Courses", component: CoursesForm },
]

export default function CVBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [cvData, setCvData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
    courses: [],
  })
  const [currentCvId, setCurrentCvId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLocalMode, setIsLocalMode] = useState(true) // Default to local mode
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  const supabase = isSupabaseConfigured() ? createBrowserClient() : createMockSupabaseClient()
  const progress = (currentStep / steps.length) * 100
  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  // Check Supabase configuration on mount
  useEffect(() => {
    // Since we have Supabase environment variables available, set configured to true
    const configured = true // We know Supabase is available from the environment variables list
    setSupabaseConfigured(configured)
    setIsLocalMode(false) // Start in cloud mode since Supabase is available

    // Proceed with authentication
    checkUser()
  }, [])

  // Check authentication status (only if Supabase is configured)
  const checkUser = async () => {
    if (!supabase || !isSupabaseConfigured()) return

    setIsLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        setIsLocalMode(false)
        await initializeCV(session.user.id)
      } else {
        setIsLocalMode(true)
        // Load from localStorage
        const savedData = localStorage.getItem("cv-data")
        if (savedData) {
          try {
            setCvData(JSON.parse(savedData))
          } catch (e) {
            console.error("Error parsing saved CV data:", e)
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      setIsLocalMode(true)
    } finally {
      setIsLoading(false)
    }

    // Set up auth state change listener
    if (supabase?.auth?.onAuthStateChange) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          setIsLocalMode(false)
          await initializeCV(session.user.id)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setIsLocalMode(true)
          setCurrentCvId(null)
        }
      })

      return () => {
        subscription?.unsubscribe()
      }
    }
  }

  // Auto-save functionality
  useEffect(() => {
    if (isLocalMode || !currentCvId || !user || !supabaseConfigured) {
      // Save to localStorage in local mode
      if (isLocalMode) {
        localStorage.setItem("cv-data", JSON.stringify(cvData))
        setLastSaved(new Date())
      }
      return
    }

    const autoSave = setTimeout(() => {
      saveCVData()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSave)
  }, [cvData, currentCvId, isLocalMode, user, supabaseConfigured])

  const initializeCV = async (userId: string) => {
    if (!supabase || !isSupabaseConfigured()) return

    try {
      // First check if user has any existing CVs
      const { data: existingCVs, error: fetchError } = await supabase
        .from("cvs")
        .select("id")
        .eq("user_id", userId)
        .limit(1)

      if (fetchError) throw fetchError

      // If user has an existing CV, use it
      if (existingCVs && existingCVs.length > 0) {
        setCurrentCvId(existingCVs[0].id)

        // Load CV data
        const { data: cvData, error: dataError } = await supabase
          .from("cv_data")
          .select("*")
          .eq("cv_id", existingCVs[0].id)
          .single()

        if (dataError) throw dataError

        if (cvData) {
          setCvData({
            personalInfo: cvData.personal_info || {},
            experience: cvData.experience || [],
            education: cvData.education || [],
            skills: cvData.skills || [],
            languages: cvData.languages || [],
            interests: cvData.interests || [],
            courses: cvData.courses || [],
          })
        }

        return
      }

      // Otherwise create a new CV
      const { data: newCV, error } = await supabase
        .from("cvs")
        .insert([
          {
            title: "My CV",
            user_id: userId,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setCurrentCvId(newCV.id)

      // Create initial CV data entry
      await supabase.from("cv_data").insert([
        {
          cv_id: newCV.id,
          personal_info: {},
          experience: [],
          education: [],
          skills: [],
          languages: [],
          interests: [],
          courses: [],
          customization: {},
        },
      ])
    } catch (error: any) {
      console.error("Error initializing CV:", error)
    }
  }

  const saveCVData = async () => {
    if (isLocalMode || !currentCvId || !user || !supabase || !isSupabaseConfigured()) {
      // In local mode, just update the last saved timestamp
      if (isLocalMode) {
        localStorage.setItem("cv-data", JSON.stringify(cvData))
        setLastSaved(new Date())
      }
      return
    }

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("cv_data")
        .update({
          personal_info: cvData.personalInfo,
          experience: cvData.experience,
          education: cvData.education,
          skills: cvData.skills,
          languages: cvData.languages,
          interests: cvData.interests,
          courses: cvData.courses,
        })
        .eq("cv_id", currentCvId)

      if (error) throw error

      // Update CV last modified time
      await supabase.from("cvs").update({ updated_at: new Date().toISOString() }).eq("id", currentCvId)

      setLastSaved(new Date())
    } catch (error: any) {
      console.error("Error saving CV:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateCVData = (section: string, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleManualSave = async () => {
    if (isLocalMode || !supabaseConfigured) {
      localStorage.setItem("cv-data", JSON.stringify(cvData))
      setLastSaved(new Date())
    } else {
      await saveCVData()
    }
  }

  const handleLogin = async () => {
    if (!supabase || !isSupabaseConfigured()) return

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/builder`,
      },
    })

    if (error) {
      console.error("Login error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CV builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
                <p className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLocalMode && supabaseConfigured ? (
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Save
                </Button>
              ) : (
                <div className="text-xs text-gray-500">
                  {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleManualSave} disabled={isSaving}>
                <Database className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : isLocalMode ? "Save Locally" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {steps[currentStep - 1]?.title}
                  <span className="text-sm font-normal text-gray-500">
                    {currentStep}/{steps.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {CurrentStepComponent && <CurrentStepComponent data={cvData} onUpdate={updateCVData} />}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext} disabled={currentStep === steps.length}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <CVPreview data={cvData} />
          </div>
        </div>
      </div>
    </div>
  )
}
