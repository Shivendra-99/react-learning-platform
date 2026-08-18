import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

interface FanOutDiagramProps {
  title?: string
  rootLabel: string
  consumers: string[]
  description: ReactNode
}

export function FanOutDiagram({ title = "One source, many direct consumers", rootLabel, consumers, description }: FanOutDiagramProps) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">{title}</div>
      <div className="flex flex-col items-center gap-1.5 p-6">
        <div className="rounded-xl border-2 border-primary/40 bg-primary/10 px-5 py-2.5 font-mono-code text-sm font-medium text-primary">
          {rootLabel}
        </div>

        <ChevronDown className="size-5 text-muted-foreground" aria-hidden="true" />

        <div className="flex flex-wrap justify-center gap-3">
          {consumers.map((name) => (
            <div key={name} className="rounded-lg border px-3.5 py-2 text-sm font-medium text-foreground">
              {name}
            </div>
          ))}
        </div>

        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
