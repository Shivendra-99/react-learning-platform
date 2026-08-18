import { BookOpen, Download, Hourglass, PackageCheck } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"

const suspenseExample = `
// React.lazy just needs a function that returns a Promise
// resolving to { default: SomeComponent } — normally that's
// import("./SomeFile"), but any promise shaped like that works,
// which is what lets this example run live, right here.
const SlowWidget = React.lazy(() => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      default: () => <p>✅ Loaded after a real delay!</p>,
    });
  }, 1500);
}));

function App() {
  return (
    <Suspense fallback={<p>⏳ Loading widget...</p>}>
      <SlowWidget />
    </Suspense>
  );
}

render(<App />);
`

const challengeStarter = `
const WidgetA = React.lazy(() => new Promise((resolve) => {
  setTimeout(() => resolve({ default: () => <p>Widget A loaded</p> }), 1000);
}));

const WidgetB = React.lazy(() => new Promise((resolve) => {
  setTimeout(() => resolve({ default: () => <p>Widget B loaded</p> }), 2000);
}));

function App() {
  return (
    <Suspense fallback={<p>⏳ Loading...</p>}>
      <WidgetA />
      {/* TODO: render WidgetB here too, inside the same Suspense */}
    </Suspense>
  );
}

render(<App />);
`

const flowSteps: FlowStep[] = [
  { id: "request", label: "1. User navigates to a route", detail: "Say, from the homepage to a settings page they've never visited this session.", icon: BookOpen },
  { id: "fallback", label: "2. React shows the Suspense fallback", detail: "Instantly — while the real code is still on its way.", icon: Hourglass },
  { id: "download", label: "3. The browser downloads that route's chunk", detail: "A separate, smaller JS file — not part of the initial bundle.", icon: Download },
  { id: "swap", label: "4. React swaps the fallback for the real component", detail: "As soon as the chunk finishes loading and evaluating.", icon: PackageCheck, tone: "success" },
]

export default function CodeSplittingLesson() {
  return (
    <>
      <p>
        Every component you've built in this course gets bundled into JavaScript the browser has
        to download before your app can run. A small app, that's fine. A large one, and users end
        up waiting to download code for screens they may never even visit.
      </p>

      <AnalogyCard title="Code splitting is handing over one recipe, not the whole cookbook.">
        You don't need to read every recipe in a cookbook before making breakfast — just the one
        you're using right now. Code splitting works the same way: instead of shipping your
        entire app as one giant file, each route or heavy feature becomes its own small file,
        downloaded only when someone actually navigates there.
      </AnalogyCard>

      <Callout variant="tip" title="You're already using it">
        Every single lesson in this course — this one included — is loaded with{" "}
        <code>React.lazy()</code>, exactly the technique this lesson teaches. Open your browser's
        network tab and switch lessons; you'll see a small new file requested each time.
      </Callout>

      <h2>What happens on navigation</h2>
      <StepFlowDiagram title="Loading a route's code on demand" steps={flowSteps} autoPlayMs={1400} />

      <h2>The two pieces</h2>
      <p>
        <code>React.lazy(loader)</code> takes a function returning a promise for the component.
        Since React doesn't have it yet, it needs to know what to show <em>while</em> waiting —
        that's <code>&lt;Suspense fallback={"{...}"}&gt;</code>.
      </p>
      <p>
        In real apps, the loader is almost always <code>{'() => import("./SomeFile")'}</code>,
        which Vite or webpack automatically turns into a separate downloadable chunk. This example
        uses a manually delayed promise instead, purely so the loading delay is visible and
        editable right here — the <code>React.lazy</code> and <code>Suspense</code> usage itself
        is the real API.
      </p>
      <LiveCodeBlock code={suspenseExample} />

      <h2>Common mistake</h2>
      <CommonMistake
        title="forgetting the Suspense boundary"
        wrong={`const SlowWidget = React.lazy(() => import("./SlowWidget"));\n\nfunction App() {\n  return <SlowWidget />;\n  // no Suspense above it — React throws:\n  // "A component suspended while responding to synchronous input"\n}`}
        right={`function App() {\n  return (\n    <Suspense fallback={<p>Loading...</p>}>\n      <SlowWidget />\n    </Suspense>\n  );\n}`}
        explanation={
          <p>
            A lazy component needs a <code>Suspense</code> boundary somewhere <em>above</em> it in
            the tree — that's what catches the "still loading" signal and shows a fallback instead
            of crashing.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What does a component wrapped in React.lazy need above it in the tree?"
        options={[
          { id: "a", text: "Nothing extra — React.lazy works on its own" },
          { id: "b", text: "A <Suspense> boundary with a fallback" },
          { id: "c", text: "An ErrorBoundary specifically" },
          { id: "d", text: "A Redux Provider" },
        ]}
        correctId="b"
        explanation="React.lazy components render nothing until their code has loaded — Suspense is what catches that waiting state and shows a fallback in the meantime."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Load two widgets under one boundary"
        hint={<p>Add <code>{"<WidgetB />"}</code> right below <code>{"<WidgetA />"}</code>, still inside the same <code>{"<Suspense>"}</code>.</p>}
      >
        Add <code>WidgetB</code> to the same Suspense boundary as <code>WidgetA</code>. Notice the
        fallback stays until <strong>both</strong> are ready — that's one boundary covering
        multiple lazy components.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why does code splitting improve initial load time, and what's the tradeoff?"
        answer={
          <p>
            Without splitting, the browser must download, parse, and execute one large bundle
            containing every route and feature before the app can render anything — including
            code for screens the user may never visit in that session. Splitting breaks the bundle
            into smaller chunks loaded on demand, so the initial download only contains what's
            needed for the first screen, directly improving metrics like Time to Interactive. The
            tradeoff is that navigating to a not-yet-loaded chunk introduces a network request the
            user has to wait on — usually brief and hidden behind a Suspense fallback, but it's a
            real cost that didn't exist with one big upfront bundle, so it's worth splitting along
            boundaries users won't hit immediately (secondary routes, rarely-used heavy features)
            rather than everything.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "React.lazy(loader) defers loading a component's code until it's actually needed.",
          "Suspense catches that waiting state and shows a fallback until the component is ready.",
          "In real apps, the loader is usually import(\"./File\") — bundlers turn that into a separate chunk automatically.",
          "One Suspense boundary can cover multiple lazy components; it waits for all of them together.",
        ]}
      />
    </>
  )
}
