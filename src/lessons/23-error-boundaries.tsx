import { Zap, ShieldOff, ShieldCheck, MonitorCheck } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"

const boundaryExample = `
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>⚠️ Something broke here. The rest of the page is fine.</p>;
    }
    return this.props.children;
  }
}

function Bomb() {
  throw new Error("💥 Boom!");
}

function App() {
  const [broken, setBroken] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div>
      <p>This text is outside the boundary — watch it survive.</p>
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <button onClick={() => setBroken(true)}>Break it</button>
        <button onClick={() => { setBroken(false); setResetKey(resetKey + 1); }}>
          Reset
        </button>
      </div>
      <ErrorBoundary key={resetKey}>
        {broken ? <Bomb /> : <p>Everything is fine 🙂</p>}
      </ErrorBoundary>
    </div>
  );
}

render(<App />);
`

const challengeStarter = `
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <p>⚠️ This widget crashed, but the rest of the page is fine.</p>;
    }
    return this.props.children;
  }
}

function Weather() {
  throw new Error("API key missing!");
}

function App() {
  return (
    <div>
      <h4>Dashboard</h4>
      <p>Sales: $4,200</p>
      {/* TODO: wrap Weather in <ErrorBoundary> so it doesn't take down the dashboard */}
      <Weather />
    </div>
  );
}

render(<App />);
`

const flowSteps: FlowStep[] = [
  { id: "throw", label: "1. A component throws during render", detail: "A bug, missing data, anything that crashes the render function.", icon: Zap, tone: "warning" },
  { id: "propagate", label: "2. React looks for the nearest Error Boundary above it", detail: "Walking up the tree from where the error happened.", icon: ShieldOff },
  { id: "catch", label: "3. That boundary catches it", detail: "getDerivedStateFromError runs, marking the boundary as \"has an error.\"", icon: ShieldCheck, tone: "success" },
  { id: "fallback", label: "4. The boundary renders its fallback UI instead", detail: "Replacing only the broken subtree — not the whole app.", icon: MonitorCheck, tone: "success" },
]

export default function ErrorBoundariesLesson() {
  return (
    <>
      <p>
        Without anything special, a single thrown error anywhere in your component tree unmounts
        the <strong>entire</strong> app, leaving the user staring at a blank white screen. Error
        boundaries contain the damage.
      </p>

      <AnalogyCard title="An error boundary is a circuit breaker, not a fuse for the whole house.">
        When one appliance short-circuits, you don't want the entire house to lose power — you
        want just that one breaker to trip, while every other room keeps working normally. An
        error boundary does exactly that for a piece of your UI: it contains the crash to the
        part that broke.
      </AnalogyCard>

      <h2>What happens when something throws</h2>
      <StepFlowDiagram title="Catching a render error" steps={flowSteps} autoPlayMs={1400} />

      <h2>Try it — a real, contained crash</h2>
      <p>
        Click "Break it." The bomb genuinely throws a real JavaScript error during render — watch
        it take down only the boundary's contents, not the paragraph above it.
      </p>
      <LiveCodeBlock code={boundaryExample} />

      <Callout variant="warning">
        Error boundaries can only be written as <strong>class components</strong> — there's no
        Hook equivalent for <code>getDerivedStateFromError</code> yet. This is one of the few
        places modern React still reaches for a class.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="expecting an error boundary to catch event handler errors"
        wrong={`function Button() {\n  function handleClick() {\n    throw new Error("Oops");\n    // an ErrorBoundary around this will NOT catch it\n  }\n  return <button onClick={handleClick}>Click</button>;\n}`}
        right={`function Button() {\n  function handleClick() {\n    try {\n      riskyOperation();\n    } catch (error) {\n      console.error(error);\n      // handle it right here instead\n    }\n  }\n  return <button onClick={handleClick}>Click</button>;\n}`}
        explanation={
          <p>
            Error boundaries only catch errors thrown while React is rendering — not errors inside
            event handlers, async code (like inside a <code>.then()</code> or after an{" "}
            <code>await</code>), or server-side rendering. Event handlers need their own{" "}
            <code>try/catch</code>.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Which of these will an Error Boundary NOT catch?"
        options={[
          { id: "a", text: "An error thrown while a child component renders" },
          { id: "b", text: "An error thrown inside a button's onClick handler" },
          { id: "c", text: "An error thrown in a component's constructor" },
          { id: "d", text: "An error thrown by a grandchild deep in the tree" },
        ]}
        correctId="b"
        explanation="Error boundaries only catch errors during rendering, lifecycle methods, and constructors of the tree below them — event handlers run outside of React's render cycle entirely, so they need their own try/catch."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Contain the crash"
        hint={<p>Wrap it as: <code>{"<ErrorBoundary><Weather /></ErrorBoundary>"}</code></p>}
      >
        <code>Weather</code> throws, currently taking the whole dashboard down with it. Wrap just
        that component in <code>ErrorBoundary</code> so "Sales: $4,200" survives.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why must error boundaries be class components, and what exactly do they catch?"
        answer={
          <p>
            Error boundaries rely on two specific class component lifecycle APIs —{" "}
            <code>static getDerivedStateFromError()</code>, which updates state so the next render
            shows a fallback, and <code>componentDidCatch()</code>, typically used for logging.
            Neither has a Hook equivalent in React today, so a boundary can't be written as a
            function component. They catch errors thrown during rendering, in lifecycle methods,
            and in constructors of the component tree <em>below</em> them — deliberately excluding
            event handlers, asynchronous code, and errors in the boundary component itself, since
            those don't happen during React's render phase and need to be handled with ordinary{" "}
            <code>try/catch</code> instead.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Without an error boundary, one thrown error unmounts the entire React app.",
          "An error boundary catches render-phase errors in the tree below it and shows a fallback instead.",
          "Error boundaries must be class components — there's no Hook equivalent yet.",
          "They do NOT catch errors in event handlers or async code — those still need their own try/catch.",
        ]}
      />
    </>
  )
}
