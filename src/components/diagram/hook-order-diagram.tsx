import { Fragment } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SlotRow {
  slot: number
  render1: string
  render2: string
  mismatch?: boolean
}

const CONSISTENT: SlotRow[] = [
  { slot: 0, render1: 'useState → count = 0', render2: 'useState → count = 0' },
  { slot: 1, render1: 'useState → name = ""', render2: 'useState → name = ""' },
  { slot: 2, render1: "useEffect", render2: "useEffect" },
]

const CONDITIONAL: SlotRow[] = [
  { slot: 0, render1: "useState → count = 0", render2: "useState → count = 0" },
  { slot: 1, render1: "useEffect", render2: 'useState → name = "" (new!)', mismatch: true },
  { slot: 2, render1: "(nothing)", render2: "useEffect", mismatch: true },
]

export function HookOrderDiagram({ variant }: { variant: "consistent" | "conditional" }) {
  const rows = variant === "consistent" ? CONSISTENT : CONDITIONAL

  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">
        React tracks Hooks by call order, per component
      </div>
      <div className="grid gap-x-3 gap-y-1.5 p-5 text-sm" style={{ gridTemplateColumns: "auto 1fr 1fr" }}>
        <span className="text-xs font-semibold text-muted-foreground uppercase">Slot</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase">Render 1</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase">Render 2</span>
        {rows.map((row) => (
          <Fragment key={row.slot}>
            <span className="font-mono-code text-muted-foreground">#{row.slot}</span>
            <span
              className={cn("rounded-md px-2 py-1 font-mono-code text-xs", row.mismatch ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground")}
            >
              {row.render1}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 font-mono-code text-xs",
                row.mismatch ? "bg-destructive/10 text-destructive" : "bg-success/10 text-foreground",
              )}
            >
              {row.mismatch ? <X className="size-3 shrink-0" aria-hidden="true" /> : <Check className="size-3 shrink-0 text-success" aria-hidden="true" />}
              {row.render2}
            </span>
          </Fragment>
        ))}
      </div>
      <p className={cn("border-t px-4 py-3 text-sm", variant === "conditional" ? "text-destructive" : "text-muted-foreground")}>
        {variant === "consistent"
          ? "Every slot lines up between renders — React matches each Hook call to the right stored data."
          : "Slot #1 held useEffect's data, but render 2 asks for useState's data instead — React hands back the wrong stored value."}
      </p>
    </div>
  )
}
