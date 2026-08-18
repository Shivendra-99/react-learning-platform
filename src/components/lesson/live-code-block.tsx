import * as React from "react"
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live"
import { themes } from "prism-react-renderer"
import { RotateCcw, SquareCode } from "lucide-react"
import { create as createZustandStore } from "zustand"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context"

interface LiveCodeBlockProps {
  code: string
}

// Deliberately excludes react-router's Router components: rendering a
// <MemoryRouter> here would nest inside the app's own <BrowserRouter> and
// React Router hard-errors on nested routers. Router demos use
// LiveDemoBlock + IsolatedPreview instead, which mount in a separate root.
const scope = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useCallback: React.useCallback,
  useContext: React.useContext,
  createContext: React.createContext,
  useReducer: React.useReducer,
  create: createZustandStore,
  lazy: React.lazy,
  Suspense: React.Suspense,
}

export function LiveCodeBlock({ code: initialCode }: LiveCodeBlockProps) {
  const { theme } = useTheme()
  const trimmed = React.useMemo(() => initialCode.trim(), [initialCode])
  const [code, setCode] = React.useState(trimmed)

  return (
    <LiveProvider code={code} scope={scope} noInline theme={theme === "dark" ? themes.vsDark : themes.github}>
      <div className="not-prose overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <SquareCode className="size-3.5" aria-hidden="true" />
            Editable example — change the code and watch it update
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground"
            onClick={() => setCode(trimmed)}
            disabled={code === trimmed}
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </Button>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="overflow-x-auto bg-[#1e1e1e] p-4 text-[13px] leading-relaxed dark:bg-[#0d1117]">
            <LiveEditor onChange={setCode} className="font-mono-code" />
          </div>
          <div className="flex min-h-[96px] items-center justify-center border-t bg-background p-5 md:border-t-0 md:border-l">
            <LivePreview />
          </div>
        </div>
        <LiveError className="border-t bg-destructive/10 p-3 font-mono-code text-xs whitespace-pre-wrap text-destructive" />
      </div>
    </LiveProvider>
  )
}
