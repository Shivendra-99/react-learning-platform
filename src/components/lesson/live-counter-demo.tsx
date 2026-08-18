import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { MousePointerClick, Zap, Brain, Atom, MonitorSmartphone, RotateCcw } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PipelineStep {
  id: string
  label: string
  icon: LucideIcon
  render: (prev: number, next: number) => string
}

const PIPELINE: PipelineStep[] = [
  { id: "user", label: "User", icon: MousePointerClick, render: () => "You click the button" },
  { id: "handler", label: "Event handler", icon: Zap, render: (_p, n) => `onClick runs → setCount(${n})` },
  { id: "state", label: "React state", icon: Brain, render: (p, n) => `count: ${p} → ${n}` },
  { id: "render", label: "Re-render", icon: Atom, render: () => "Component function runs again" },
  { id: "ui", label: "Screen updates", icon: MonitorSmartphone, render: (_p, n) => `Count: ${n}` },
]

export function LiveCounterDemo() {
  const [count, setCount] = useState(0)
  const [pulse, setPulse] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  // Tracks the count as of the last commit. During the render that shows a
  // NEW count, this still holds the previous value — the effect only
  // catches up after that render is painted, which also means rapid clicks
  // that React batches into one render correctly show one combined jump
  // instead of a stale intermediate value.
  const prevCountRef = useRef(count)
  useEffect(() => {
    prevCountRef.current = count
  }, [count])
  const prevCount = prevCountRef.current

  function change(delta: number) {
    setCount((c) => Math.max(0, c + delta))
    setPulse((p) => p + 1)
  }

  function reset() {
    setCount(0)
    setPulse((p) => p + 1)
  }

  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">
        Try it — click the real button below
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={prefersReducedMotion ? false : { y: prevCount < count ? 16 : -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { y: prevCount < count ? -16 : 16, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute text-3xl font-semibold tabular-nums text-foreground"
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Count: {count}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => change(-1)} disabled={count === 0} aria-label="Decrease count">
              -1
            </Button>
            <Button type="button" size="sm" onClick={() => change(1)} aria-label="Increase count">
              +1
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" onClick={reset} aria-label="Reset count">
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {PIPELINE.map((step, i) => (
            <motion.div
              key={`${step.id}-${pulse}`}
              initial={prefersReducedMotion ? false : { opacity: 0.3, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : i * 0.12 }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm",
                i === PIPELINE.length - 1 ? "border-success/40 bg-success/10" : "border-border bg-muted/30",
              )}
            >
              <step.icon className={cn("size-4 shrink-0", i === PIPELINE.length - 1 ? "text-success" : "text-primary")} aria-hidden="true" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{step.label}:</span> {step.render(prevCount, count)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
