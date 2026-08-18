import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { MousePointerClick, Zap, Brain, Atom, MonitorSmartphone, Pause, Play, RotateCcw } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoopNode {
  id: string
  label: string
  detail: string
  icon: LucideIcon
}

const NODES: LoopNode[] = [
  { id: "user", label: "USER", detail: "You click a button, type in a box, or load a page.", icon: MousePointerClick },
  { id: "event", label: "EVENT", detail: "The browser fires an event React is listening for.", icon: Zap },
  { id: "state", label: "STATE CHANGES", detail: "Your code calls a setter function, like setCount(1).", icon: Brain },
  { id: "react", label: "REACT", detail: "React re-runs your component function to figure out what changed.", icon: Atom },
  { id: "ui", label: "UI", detail: "React updates only the parts of the page that actually changed.", icon: MonitorSmartphone },
]

const SIZE = 340
const CENTER = SIZE / 2
const RADIUS = 122

function nodePosition(index: number) {
  const angle = (-90 + index * (360 / NODES.length)) * (Math.PI / 180)
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  }
}

export function ReactLoopDiagram({ autoPlayMs = 1300 }: { autoPlayMs?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(!prefersReducedMotion)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % NODES.length)
    }, autoPlayMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, autoPlayMs])

  const displayIndex = hoverIndex ?? index
  const active = NODES[displayIndex]

  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
        <p className="text-sm font-medium text-foreground">The React loop</p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause animation" : "Play animation"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              setPlaying(false)
              setIndex(0)
            }}
            aria-label="Restart"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="mx-auto max-w-full" role="img" aria-label="Diagram showing the React loop: user action, event, state change, React re-render, updated UI, back to user">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" strokeWidth="2" strokeDasharray="3 7" className="stroke-border" />
          {NODES.map((node, i) => {
            const from = nodePosition(i)
            const to = nodePosition((i + 1) % NODES.length)
            const traveled = i < index
            return (
              <line
                key={`edge-${node.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth="2"
                className={traveled ? "stroke-primary" : "stroke-border"}
                strokeDasharray={traveled ? undefined : "5 5"}
              />
            )
          })}
          {NODES.map((node, i) => {
            const pos = nodePosition(i)
            const isActive = i === displayIndex
            return (
              <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle
                  strokeWidth="2"
                  style={{ r: isActive ? 30 : 26 }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className={cn(
                    "cursor-pointer",
                    !prefersReducedMotion && "transition-[r] duration-200",
                    isActive ? "fill-primary stroke-primary" : "fill-card stroke-border",
                  )}
                />
                <foreignObject x={-12} y={-12} width={24} height={24} className="pointer-events-none">
                  <node.icon
                    className={cn("size-6", isActive ? "text-primary-foreground" : "text-muted-foreground")}
                    aria-hidden="true"
                  />
                </foreignObject>
              </g>
            )
          })}
        </svg>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="React loop steps">
            {NODES.map((node, i) => (
              <button
                key={node.id}
                type="button"
                role="tab"
                aria-selected={i === displayIndex}
                onClick={() => {
                  setPlaying(false)
                  setIndex(i)
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  i === displayIndex
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {node.label}
              </button>
            ))}
          </div>
          <p className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">{active.detail}</p>
        </div>
      </div>
    </div>
  )
}
