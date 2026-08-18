import { ArrowDown, ArrowUp } from "lucide-react"

export function StateMemoryDiagram({ count = 0 }: { count?: number }) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">
        A component and its memory
      </div>
      <div className="flex flex-col items-center gap-1.5 p-6">
        <div className="w-full max-w-xs rounded-xl border-2 border-primary/40 p-4 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">Component</p>
          <div className="mt-2 rounded-lg bg-primary/10 py-3 text-sm font-medium text-foreground">
            UI shows: <span className="font-mono-code">Count: {count}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 py-1 text-muted-foreground">
          <div className="flex flex-col items-center gap-0.5">
            <ArrowDown className="size-4" aria-hidden="true" />
            <span className="text-[11px]">reads</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <ArrowUp className="size-4 text-primary" aria-hidden="true" />
            <span className="text-[11px] text-primary">setCount(...)</span>
          </div>
        </div>

        <div className="w-full max-w-xs rounded-xl border-2 border-dashed border-muted-foreground/40 p-4 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">State memory</p>
          <div className="mt-2 rounded-lg bg-muted py-3 font-mono-code text-sm text-foreground">count = {count}</div>
        </div>
      </div>
      <p className="border-t px-5 py-3 text-center text-sm text-muted-foreground">
        State is information React <strong className="text-foreground">remembers</strong> for this component,
        separately from the UI itself.
      </p>
    </div>
  )
}
