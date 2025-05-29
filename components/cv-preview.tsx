"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Eye,
  Share,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Heart,
  Camera,
  Plane,
  Book,
  Music,
  Gamepad2,
  Upload,
  Palette,
  Type,
  Settings,
} from "lucide-react"

interface CVPreviewProps {
  data: any
}

const colorThemes = [
  { name: "Classic Blue", primary: "bg-slate-700", secondary: "text-blue-600" },
  { name: "Professional Navy", primary: "bg-blue-900", secondary: "text-blue-700" },
  { name: "Modern Teal", primary: "bg-teal-700", secondary: "text-teal-600" },
  { name: "Corporate Gray", primary: "bg-gray-700", secondary: "text-gray-600" },
  { name: "Creative Purple", primary: "bg-purple-700", secondary: "text-purple-600" },
  { name: "Fresh Green", primary: "bg-green-700", secondary: "text-green-600" },
  { name: "Elegant Black", primary: "bg-black", secondary: "text-gray-800" },
  { name: "Warm Orange", primary: "bg-orange-700", secondary: "text-orange-600" },
]

const fontFamilies = [
  { name: "Inter", value: "font-sans" },
  { name: "Roboto", value: "font-mono" },
  { name: "Times New Roman", value: "font-serif" },
  { name: "Arial", value: "font-sans" },
  { name: "Georgia", value: "font-serif" },
  { name: "Helvetica", value: "font-sans" },
]

const fontWeights = [
  { name: "Light", value: "font-light" },
  { name: "Normal", value: "font-normal" },
  { name: "Medium", value: "font-medium" },
  { name: "Semibold", value: "font-semibold" },
  { name: "Bold", value: "font-bold" },
  { name: "Extrabold", value: "font-extrabold" },
]

export default function CVPreview({ data }: CVPreviewProps) {
  const { personalInfo, experience, education, skills, languages, interests, courses } = data

  // Customization states
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0])
  const [fontFamily, setFontFamily] = useState(fontFamilies[0])
  const [fontSize, setFontSize] = useState([14])
  const [fontWeight, setFontWeight] = useState(fontWeights[2])
  const [showCustomization, setShowCustomization] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePreview = () => {
    window.open("/cv-preview-fullscreen", "_blank")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My CV",
        text: "Check out my professional CV",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleExport = () => {
    // Simulate PDF export
    const element = document.getElementById("cv-content")
    if (element) {
      window.print()
    }
  }

  const getSkillLevel = (level: string) => {
    switch (level) {
      case "beginner":
        return 2
      case "intermediate":
        return 3
      case "advanced":
        return 4
      case "expert":
        return 5
      default:
        return 3
    }
  }

  const getLanguageLevel = (proficiency: string) => {
    switch (proficiency) {
      case "beginner":
        return 2
      case "intermediate":
        return 3
      case "advanced":
        return 4
      case "fluent":
      case "native":
        return 5
      default:
        return 3
    }
  }

  const renderSkillDots = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`w-2 h-2 rounded-full ${i < level ? "bg-white" : "bg-white/30"}`} />
    ))
  }

  const defaultInterests = [
    { name: "Technology", icon: Gamepad2 },
    { name: "Travel", icon: Plane },
    { name: "Photography", icon: Camera },
    { name: "Reading", icon: Book },
    { name: "Music", icon: Music },
    { name: "Volunteering", icon: Heart },
  ]

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Preview</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowCustomization(!showCustomization)}>
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button size="sm" variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4 mr-2" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="photo">
                  <Camera className="h-4 w-4 mr-2" />
                  Photo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Color Theme</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorThemes.map((theme) => (
                      <Button
                        key={theme.name}
                        variant={selectedTheme.name === theme.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTheme(theme)}
                        className="text-xs"
                      >
                        <div className={`w-3 h-3 rounded-full ${theme.primary} mr-2`}></div>
                        {theme.name.split(" ")[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Font Family</Label>
                    <Select
                      value={fontFamily.name}
                      onValueChange={(value) => {
                        const font = fontFamilies.find((f) => f.name === value)
                        if (font) setFontFamily(font)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.name} value={font.name}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Font Weight</Label>
                    <Select
                      value={fontWeight.name}
                      onValueChange={(value) => {
                        const weight = fontWeights.find((w) => w.name === value)
                        if (weight) setFontWeight(weight)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight.name} value={weight.name}>
                            {weight.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Font Size: {fontSize[0]}px</Label>
                  <Slider value={fontSize} onValueChange={setFontSize} max={20} min={10} step={1} className="w-full" />
                </div>
              </TabsContent>

              <TabsContent value="photo" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {profileImage && (
                    <div className="mt-2">
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* CV Preview - EMPTY CONTENT */}
      <Card className="bg-white shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div
            id="cv-content"
            className={`flex min-h-[800px] ${fontFamily.value} ${fontWeight.value}`}
            style={{ fontSize: `${fontSize[0]}px` }}
          >
            {/* Left Sidebar */}
            <div className={`w-1/3 ${selectedTheme.primary} text-white p-8 relative`}>
              {/* Decorative wave */}
              <div className="absolute top-0 right-0 w-20 h-32 bg-white/10 rounded-bl-full"></div>

              {/* Name - Empty */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-wide text-white/60">VOTRE NOM</h1>
              </div>

              {/* Profile Photo - Empty */}
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white/60" />
                  )}
                </div>
              </div>

              {/* Personal Information - Empty */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-blue-200">Informations personnelles</h2>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-blue-300" />
                    <span>Votre nom complet</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-300" />
                    <span>votre.email@exemple.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-300" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span>Votre ville, Pays</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-300" />
                    <span>votre-site.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-blue-300" />
                    <span>linkedin.com/in/votre-profil</span>
                  </div>
                </div>
              </div>

              {/* Skills - Empty */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-blue-200">Compétences</h2>
                <div className="space-y-4 text-white/70">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">JavaScript</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(4)}</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">React</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(4)}</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Node.js</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(3)}</div>
                  </div>
                </div>
              </div>

              {/* Languages - Empty */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-blue-200">Langues</h2>
                <div className="space-y-3 text-white/70">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Français</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(5)}</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">English</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(4)}</div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">العربية</span>
                    </div>
                    <div className="flex gap-1">{renderSkillDots(5)}</div>
                  </div>
                </div>
              </div>

              {/* Interests - Empty */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-blue-200">Centres d'intérêt</h2>
                <div className="grid grid-cols-2 gap-3 text-white/70">
                  {defaultInterests.map((interest, index) => {
                    const IconComponent = interest.icon
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-blue-300" />
                        <span className="text-xs">{interest.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Content - Empty */}
            <div className="w-2/3 p-8">
              {/* Profile Section - Empty */}
              <div className="mb-8">
                <h2
                  className={`text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 ${selectedTheme.secondary}`}
                >
                  <User className="w-5 h-5 text-slate-600" />
                  Profil
                </h2>
                <p className="text-gray-500 leading-relaxed text-sm italic">
                  Votre résumé professionnel apparaîtra ici...
                </p>
              </div>

              {/* Education - Empty */}
              <div className="mb-8">
                <h2
                  className={`text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 ${selectedTheme.secondary}`}
                >
                  <GraduationCap className="w-5 h-5 text-slate-600" />
                  Formation
                </h2>
                <div className="border-l-2 border-slate-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-400">Votre diplôme</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Année</span>
                  </div>
                  <p className={`font-medium text-sm mb-2 text-slate-400`}>VOTRE UNIVERSITÉ</p>
                  <p className="text-gray-400 text-xs">Ville, Pays</p>
                </div>
              </div>

              {/* Experience - Empty */}
              <div className="mb-8">
                <h2
                  className={`text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 ${selectedTheme.secondary}`}
                >
                  <Briefcase className="w-5 h-5 text-slate-600" />
                  Expérience professionnelle
                </h2>
                <div className="border-l-2 border-slate-200 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-400">Votre poste</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Période</span>
                  </div>
                  <p className={`font-medium text-sm mb-2 text-slate-400`}>VOTRE ENTREPRISE, Ville</p>
                  <div className="text-gray-400 text-sm leading-relaxed">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Vos responsabilités et réalisations</li>
                      <li>Projets importants menés</li>
                      <li>Compétences développées</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Courses - Empty */}
              <div>
                <h2
                  className={`text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 ${selectedTheme.secondary}`}
                >
                  <Award className="w-5 h-5 text-slate-600" />
                  Cours
                </h2>
                <div className="space-y-2 text-slate-400">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Vos certifications</span>
                    <span className="text-xs">Année</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Formations suivies</span>
                    <span className="text-xs">Année</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
