import { lazy, type ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Sparkles,
  Puzzle,
  ToggleLeft,
  MousePointerClick,
  GitBranch,
  ListOrdered,
  FormInput,
  Code2,
  Blocks,
  Waves,
  Crosshair,
  Receipt,
  Fingerprint,
  Wrench,
  ListChecks,
  Globe,
  Signpost,
  Route,
  Radio,
  Boxes,
  Gauge,
  PackageOpen,
  ShieldAlert,
  Workflow,
  Hourglass,
  DoorOpen,
  Zap,
  Send,
  Braces,
  FlaskConical,
  Palette,
  Layers,
  ServerCog,
  Accessibility,
  Rocket,
} from "lucide-react"

export type Section =
  | "fundamentals"
  | "hooks"
  | "real-apps"
  | "state-management"
  | "advanced"
  | "production"

export const SECTIONS: Record<Section, string> = {
  fundamentals: "Fundamentals",
  hooks: "Hooks",
  "real-apps": "Real Applications",
  "state-management": "State Management",
  advanced: "Advanced React",
  production: "Production Ready",
}

interface LessonDefinition {
  slug: string
  order: number
  section: Section
  title: string
  shortTitle: string
  description: string
  icon: LucideIcon
  minutes: number
  /**
   * The raw dynamic import. Kept separate from `component` so it can also be
   * called on its own to warm the chunk before navigation — see prefetchLesson.
   */
  load: () => Promise<{ default: ComponentType }>
}

export interface Lesson extends LessonDefinition {
  component: ComponentType
}

const lessonDefinitions: LessonDefinition[] = [
  {
    slug: "what-is-react",
    order: 1,
    section: "fundamentals",
    title: "What is React?",
    shortTitle: "What is React?",
    description: "Understand what React is, why it exists, and how it thinks about UI.",
    icon: Sparkles,
    minutes: 6,
    load: () => import("@/lessons/01-what-is-react"),
  },
  {
    slug: "jsx-basics",
    order: 2,
    section: "fundamentals",
    title: "JSX Basics",
    shortTitle: "JSX Basics",
    description: "Write UI with JSX — HTML-like syntax that compiles to JavaScript.",
    icon: Code2,
    minutes: 8,
    load: () => import("@/lessons/02-jsx-basics"),
  },
  {
    slug: "components-props",
    order: 3,
    section: "fundamentals",
    title: "Components & Props",
    shortTitle: "Components & Props",
    description: "Break UI into reusable components and pass data to them with props.",
    icon: Puzzle,
    minutes: 10,
    load: () => import("@/lessons/03-components-props"),
  },
  {
    slug: "state",
    order: 4,
    section: "fundamentals",
    title: "State with useState",
    shortTitle: "State (useState)",
    description: "Give components memory so the UI can change over time.",
    icon: ToggleLeft,
    minutes: 10,
    load: () => import("@/lessons/04-state"),
  },
  {
    slug: "events",
    order: 5,
    section: "fundamentals",
    title: "Handling Events",
    shortTitle: "Handling Events",
    description: "Respond to clicks, typing, and other user interaction.",
    icon: MousePointerClick,
    minutes: 7,
    load: () => import("@/lessons/05-events"),
  },
  {
    slug: "conditional-rendering",
    order: 6,
    section: "fundamentals",
    title: "Conditional Rendering",
    shortTitle: "Conditional Rendering",
    description: "Show or hide UI depending on state, with clean patterns.",
    icon: GitBranch,
    minutes: 8,
    load: () => import("@/lessons/06-conditional-rendering"),
  },
  {
    slug: "lists-and-keys",
    order: 7,
    section: "fundamentals",
    title: "Rendering Lists & Keys",
    shortTitle: "Lists & Keys",
    description: "Turn arrays of data into repeated UI, the right way.",
    icon: ListOrdered,
    minutes: 8,
    load: () => import("@/lessons/07-lists-and-keys"),
  },
  {
    slug: "forms",
    order: 8,
    section: "fundamentals",
    title: "Forms & Controlled Inputs",
    shortTitle: "Forms",
    description: "Capture user input with controlled form elements.",
    icon: FormInput,
    minutes: 10,
    load: () => import("@/lessons/08-forms"),
  },
  {
    slug: "styling-react",
    order: 9,
    section: "fundamentals",
    title: "Styling React Components",
    shortTitle: "Styling",
    description: "CSS Modules, Tailwind, and CSS-in-JS — what each trades off, and how to pick.",
    icon: Palette,
    minutes: 11,
    load: () => import("@/lessons/09-styling-react"),
  },
  {
    slug: "hooks-overview",
    order: 10,
    section: "hooks",
    title: "Hooks: The Big Picture",
    shortTitle: "Hooks Overview",
    description: "What Hooks are, why they exist, and a map of the ones worth knowing.",
    icon: Blocks,
    minutes: 6,
    load: () => import("@/lessons/09-hooks-overview"),
  },
  {
    slug: "use-effect",
    order: 11,
    section: "hooks",
    title: "useEffect",
    shortTitle: "useEffect",
    description: "Sync a component with something outside React, like a timer or an API.",
    icon: Waves,
    minutes: 12,
    load: () => import("@/lessons/10-use-effect"),
  },
  {
    slug: "use-layout-effect",
    order: 12,
    section: "hooks",
    title: "useLayoutEffect",
    shortTitle: "useLayoutEffect",
    description: "The one useEffect runs after the screen updates — this runs before, to stop a flicker.",
    icon: Layers,
    minutes: 8,
    load: () => import("@/lessons/12-use-layout-effect"),
  },
  {
    slug: "use-ref",
    order: 13,
    section: "hooks",
    title: "useRef",
    shortTitle: "useRef",
    description: "Reach into the DOM directly, or remember a value without re-rendering.",
    icon: Crosshair,
    minutes: 9,
    load: () => import("@/lessons/11-use-ref"),
  },
  {
    slug: "use-memo",
    order: 14,
    section: "hooks",
    title: "useMemo",
    shortTitle: "useMemo",
    description: "Skip re-running an expensive calculation when nothing it depends on changed.",
    icon: Receipt,
    minutes: 9,
    load: () => import("@/lessons/12-use-memo"),
  },
  {
    slug: "use-callback",
    order: 15,
    section: "hooks",
    title: "useCallback",
    shortTitle: "useCallback",
    description: "Keep a function's identity stable across renders.",
    icon: Fingerprint,
    minutes: 9,
    load: () => import("@/lessons/13-use-callback"),
  },
  {
    slug: "use-reducer",
    order: 16,
    section: "hooks",
    title: "State with useReducer",
    shortTitle: "useReducer",
    description: "Collect related state transitions into one function you can read top to bottom.",
    icon: Workflow,
    minutes: 12,
    load: () => import("@/lessons/14-use-reducer"),
  },
  {
    slug: "custom-hooks",
    order: 17,
    section: "hooks",
    title: "Custom Hooks",
    shortTitle: "Custom Hooks",
    description: "Extract and reuse stateful logic between components.",
    icon: Wrench,
    minutes: 10,
    load: () => import("@/lessons/14-custom-hooks"),
  },
  {
    slug: "rules-of-hooks",
    order: 18,
    section: "hooks",
    title: "The Rules of Hooks",
    shortTitle: "Rules of Hooks",
    description: "Why Hooks must be called the same way on every render.",
    icon: ListChecks,
    minutes: 8,
    load: () => import("@/lessons/15-rules-of-hooks"),
  },
  {
    slug: "fetching-data",
    order: 19,
    section: "real-apps",
    title: "Fetching Data",
    shortTitle: "Fetching Data",
    description: "Load data from an API and handle loading, success, and error states.",
    icon: Globe,
    minutes: 12,
    load: () => import("@/lessons/16-fetching-data"),
  },
  {
    slug: "react-router-basics",
    order: 20,
    section: "real-apps",
    title: "React Router Basics",
    shortTitle: "React Router",
    description: "Show different UI for different URLs, without full page reloads.",
    icon: Signpost,
    minutes: 10,
    load: () => import("@/lessons/17-react-router-basics"),
  },
  {
    slug: "route-parameters",
    order: 21,
    section: "real-apps",
    title: "Route Parameters",
    shortTitle: "Route Parameters",
    description: "Read dynamic segments from the URL and fetch data to match.",
    icon: Route,
    minutes: 10,
    load: () => import("@/lessons/18-route-parameters"),
  },
  {
    slug: "context-api",
    order: 22,
    section: "state-management",
    title: "The Context API",
    shortTitle: "Context API",
    description: "Share a value with an entire subtree, without passing it through every level.",
    icon: Radio,
    minutes: 12,
    load: () => import("@/lessons/19-context-api"),
  },
  {
    slug: "redux-zustand",
    order: 23,
    section: "state-management",
    title: "Redux & Zustand",
    shortTitle: "Redux & Zustand",
    description: "The store-and-actions pattern for state too big or too shared for Context.",
    icon: Boxes,
    minutes: 14,
    load: () => import("@/lessons/20-redux-zustand"),
  },
  {
    slug: "rerenders-and-memo",
    order: 24,
    section: "advanced",
    title: "Re-renders & React.memo",
    shortTitle: "Re-renders & memo",
    description: "Why a child re-renders when its parent does, and how to stop it.",
    icon: Gauge,
    minutes: 11,
    load: () => import("@/lessons/21-rerenders-and-memo"),
  },
  {
    slug: "code-splitting",
    order: 25,
    section: "advanced",
    title: "Code Splitting with lazy & Suspense",
    shortTitle: "Code Splitting",
    description: "Load only the code a screen actually needs, exactly when it needs it.",
    icon: PackageOpen,
    minutes: 11,
    load: () => import("@/lessons/22-code-splitting"),
  },
  {
    slug: "suspense",
    order: 26,
    section: "advanced",
    title: "Suspense & Loading States",
    shortTitle: "Suspense",
    description: "Decide what the user sees while part of the page isn't ready yet.",
    icon: Hourglass,
    minutes: 12,
    load: () => import("@/lessons/24-suspense"),
  },
  {
    slug: "error-boundaries",
    order: 27,
    section: "advanced",
    title: "Error Boundaries",
    shortTitle: "Error Boundaries",
    description: "Contain a crash to one part of the UI instead of a blank white screen.",
    icon: ShieldAlert,
    minutes: 10,
    load: () => import("@/lessons/23-error-boundaries"),
  },
  {
    slug: "portals",
    order: 28,
    section: "advanced",
    title: "Portals",
    shortTitle: "Portals",
    description: "Render a modal or dropdown outside its parent's DOM, without leaving the React tree.",
    icon: DoorOpen,
    minutes: 11,
    load: () => import("@/lessons/26-portals"),
  },
  {
    slug: "transitions",
    order: 29,
    section: "advanced",
    title: "Transitions & Concurrent UI",
    shortTitle: "Transitions",
    description: "Mark expensive updates as interruptible so typing never stutters.",
    icon: Zap,
    minutes: 12,
    load: () => import("@/lessons/27-transitions"),
  },
  {
    slug: "actions-and-optimistic",
    order: 30,
    section: "advanced",
    title: "React 19 Actions & Optimistic UI",
    shortTitle: "Actions & Optimistic",
    description: "Forms without the boilerplate, and UI that updates before the server replies.",
    icon: Send,
    minutes: 14,
    load: () => import("@/lessons/28-actions-and-optimistic"),
  },
  {
    slug: "server-components",
    order: 31,
    section: "advanced",
    title: "Server Components, Briefly",
    shortTitle: "Server Components",
    description: "What changes once part of your tree runs only on the server, not in the browser.",
    icon: ServerCog,
    minutes: 10,
    load: () => import("@/lessons/31-server-components"),
  },
  {
    slug: "safer-props",
    order: 32,
    section: "production",
    title: "Safer Props in Plain JavaScript",
    shortTitle: "Safer Props",
    description: "Catch prop mistakes with JSDoc and runtime guards — no TypeScript required.",
    icon: Braces,
    minutes: 13,
    load: () => import("@/lessons/29-safer-props"),
  },
  {
    slug: "accessibility",
    order: 33,
    section: "production",
    title: "Accessibility (a11y)",
    shortTitle: "Accessibility",
    description: "Semantic HTML, focus, and keyboard support — so React apps work for everyone.",
    icon: Accessibility,
    minutes: 12,
    load: () => import("@/lessons/33-accessibility"),
  },
  {
    slug: "testing-react",
    order: 34,
    section: "production",
    title: "Testing React Components",
    shortTitle: "Testing",
    description: "Write tests that fail when the app breaks and stay quiet when you refactor.",
    icon: FlaskConical,
    minutes: 13,
    load: () => import("@/lessons/30-testing-react"),
  },
  {
    slug: "deployment",
    order: 35,
    section: "production",
    title: "Building & Deploying",
    shortTitle: "Deployment",
    description: "Environment variables, the production build, and what actually ships to users.",
    icon: Rocket,
    minutes: 11,
    load: () => import("@/lessons/35-deployment"),
  },
]

export const lessons: Lesson[] = lessonDefinitions.map((definition) => ({
  ...definition,
  component: lazy(definition.load),
}))

const prefetched = new Set<string>()

/**
 * Warms a lesson's chunk ahead of navigation, e.g. on link hover. The module
 * registry dedupes the import, so the lazy() component later resolves from the
 * already-fetched module instead of waiting on a fresh network round trip.
 */
export function prefetchLesson(slug: string) {
  if (prefetched.has(slug)) return
  const lesson = lessons.find((item) => item.slug === slug)
  if (!lesson) return
  prefetched.add(slug)
  // A failed prefetch is not worth surfacing — navigation will retry the import
  // and show the real error through Suspense.
  void lesson.load().catch(() => prefetched.delete(slug))
}

export function getLessonBySlug(slug: string | undefined) {
  return lessons.find((lesson) => lesson.slug === slug)
}

export function getAdjacentLessons(slug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === slug)
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  }
}

export function getLessonsBySection() {
  return (Object.keys(SECTIONS) as Section[]).map((section) => ({
    section,
    label: SECTIONS[section],
    lessons: lessons.filter((lesson) => lesson.section === section),
  }))
}
