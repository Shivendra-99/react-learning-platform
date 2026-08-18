import { useEffect, useRef, type ComponentType } from "react"
import { createRoot, type Root } from "react-dom/client"

/**
 * Mounts Component in its own, separate React root instead of reconciling it
 * into the surrounding tree. Some demos (anything using react-router's
 * <MemoryRouter>) cannot render inside the app's own <BrowserRouter> — React
 * Router throws on nested routers regardless of type. A fresh root has no
 * ambient context at all, so it's the only way to preview them live here.
 *
 * Creation is deferred a tick so StrictMode's dev-only mount→cleanup→mount
 * double-invoke cancels the first (throwaway) pass before a root is ever
 * created, instead of racing two roots against the same DOM node.
 */
export function IsolatedPreview({ Component }: { Component: ComponentType }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    let cancelled = false
    let root: Root | null = null

    const timer = setTimeout(() => {
      if (cancelled) return
      root = createRoot(node)
      root.render(<Component />)
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (root) {
        const toUnmount = root
        setTimeout(() => toUnmount.unmount(), 0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} />
}
