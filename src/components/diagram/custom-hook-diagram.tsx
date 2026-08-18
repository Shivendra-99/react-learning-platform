import { ChevronDown } from "lucide-react"

const COMPONENTS = ["Component A", "Component B", "Component C"]

export function CustomHookDiagram({ hookName = "useToggle()" }: { hookName?: string }) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">
        Sharing logic, not state
      </div>
      <div className="flex flex-col items-center gap-1.5 p-6">
        <div className="flex flex-wrap justify-center gap-3">
          {COMPONENTS.map((name) => (
            <div key={name} className="rounded-lg border px-3.5 py-2 text-sm font-medium text-foreground">
              {name}
            </div>
          ))}
        </div>

        <ChevronDown className="size-5 text-muted-foreground" aria-hidden="true" />

        <div className="rounded-xl border-2 border-primary/40 bg-primary/10 px-5 py-2.5 font-mono-code text-sm font-medium text-primary">
          {hookName}
        </div>

        <ChevronDown className="size-5 text-muted-foreground" aria-hidden="true" />

        <div className="max-w-xs rounded-lg border-2 border-dashed border-success/40 bg-success/10 px-4 py-3 text-center text-sm text-foreground">
          Each component gets its <strong>own</strong> independent state — only the logic is
          shared.
        </div>
      </div>
    </div>
  )
}
