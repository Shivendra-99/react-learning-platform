import type { ComponentType } from "react"
import { SquareCode } from "lucide-react"
import { IsolatedPreview } from "@/components/lesson/isolated-preview"

interface LiveDemoBlockProps {
  code: string
  Component: ComponentType
  label?: string
}

export function LiveDemoBlock({ code, Component, label = "Live demo — real navigation, no page reload" }: LiveDemoBlockProps) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2 text-xs font-medium text-muted-foreground">
        <SquareCode className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="grid md:grid-cols-2">
        <pre className="overflow-x-auto bg-[#1e1e1e] p-4 font-mono-code text-[13px] leading-relaxed whitespace-pre text-gray-300 dark:bg-[#0d1117]">
          {code.trim()}
        </pre>
        <div className="flex min-h-[96px] items-center justify-center border-t bg-background p-5 md:border-t-0 md:border-l">
          <IsolatedPreview Component={Component} />
        </div>
      </div>
    </div>
  )
}
