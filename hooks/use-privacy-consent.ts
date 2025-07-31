"use client"

import { useState, useEffect } from "react"

const CONSENT_STORAGE_KEY = "yaksock_privacy_consent"

export function usePrivacyConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      try {
        const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY)
        const consentData = storedConsent ? JSON.parse(storedConsent) : null

        if (consentData && consentData.hasConsented && consentData.timestamp) {
          // Check if consent is still valid (optional: you can add expiration logic here)
          setHasConsented(true)
        } else {
          setHasConsented(false)
        }
      } catch (error) {
        console.error("Error reading privacy consent from localStorage:", error)
        setHasConsented(false)
      }
    }
    setIsLoading(false)
  }, [])

  const giveConsent = () => {
    try {
      const consentData = {
        hasConsented: true,
        timestamp: new Date().toISOString(),
        version: "1.0", // You can use this to handle consent version changes
      }

      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
      setHasConsented(true)
    } catch (error) {
      console.error("Error saving privacy consent to localStorage:", error)
    }
  }

  const revokeConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
      setHasConsented(false)
    } catch (error) {
      console.error("Error removing privacy consent from localStorage:", error)
    }
  }

  return {
    hasConsented,
    isLoading,
    giveConsent,
    revokeConsent,
  }
}
