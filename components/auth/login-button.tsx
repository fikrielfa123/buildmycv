"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase"
import { LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginButtonProps {
  redirectTo?: string
  children?: React.ReactNode
}

export default function LoginButton({ redirectTo = "/builder", children }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <LogIn className="h-4 w-4 mr-2" />
      )}
      {children || "Sign in with Google"}
    </Button>
  )
}
