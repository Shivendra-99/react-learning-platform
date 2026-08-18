import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { lessons } from "@/lib/lessons-data"

interface ProgressContextValue {
  completedSlugs: Set<string>
  isComplete: (slug: string) => boolean
  toggleComplete: (slug: string) => void
  completedCount: number
  totalCount: number
}

const STORAGE_KEY = "react-learn:progress"

const ProgressContext = createContext<ProgressContextValue | null>(null)

function loadCompleted(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed.filter((v): v is string => typeof v === "string")) : new Set()
  } catch {
    return new Set()
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(loadCompleted)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSlugs]))
  }, [completedSlugs])

  const toggleComplete = (slug: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const isComplete = (slug: string) => completedSlugs.has(slug)

  return (
    <ProgressContext.Provider
      value={{
        completedSlugs,
        isComplete,
        toggleComplete,
        completedCount: completedSlugs.size,
        totalCount: lessons.length,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider")
  return ctx
}
