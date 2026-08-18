import { Variable, MousePointerClick, Zap, Timer, Atom, MonitorSmartphone } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { DifficultyLevels } from "@/components/lesson/difficulty-levels"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { LiveCounterDemo } from "@/components/lesson/live-counter-demo"
import { ReactLoopDiagram } from "@/components/diagram/react-loop-diagram"
import { StateMemoryDiagram } from "@/components/diagram/state-memory-diagram"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const basicCounter = `
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

render(<Counter />);
`

const challengeStarter = `
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 28, margin: "0 0 8px" }}>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      {/* TODO: add a -1 button */}
      {/* TODO: add a Reset button */}
    </div>
  );
}

render(<Counter />);
`

const independentInstances = `
function Toggle({ label }) {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>
      {label}: {on ? "ON" : "OFF"}
    </button>
  );
}

render(
  <div style={{ display: "flex", gap: 8 }}>
    <Toggle label="WiFi" />
    <Toggle label="Bluetooth" />
  </div>
);
`

const lifecycleCode = [
  "const [count, setCount] = useState(0);",
  "",
  "function increment() {",
  "  setCount(count + 1);",
  "}",
  "",
  "<button onClick={increment}>+1</button>",
  "<p>Count: {count}</p>",
]

const lifecycleSteps: FlowStep[] = [
  {
    id: "init",
    label: "1. Initial render",
    detail: "React calls useState(0). count starts at 0, and the UI shows Count: 0.",
    icon: Variable,
    codeLine: 1,
  },
  {
    id: "click",
    label: "2. User clicks the button",
    detail: "The onClick handler you wrote (increment) is triggered.",
    icon: MousePointerClick,
    codeLine: 7,
  },
  {
    id: "setstate",
    label: "3. setCount runs",
    detail: "increment() calls setCount(count + 1) — this tells React \"please update this component's memory.\"",
    icon: Zap,
    codeLine: 4,
  },
  {
    id: "schedule",
    label: "4. React schedules an update",
    detail: "React marks the component as needing to re-render. This does not happen instantly inside your function — it happens right after.",
    icon: Timer,
    codeLine: 1,
    tone: "warning",
  },
  {
    id: "rerender",
    label: "5. Component function runs again",
    detail: "React calls your component function a second time. This time useState(0) returns the new value.",
    icon: Atom,
    codeLine: 1,
  },
  {
    id: "ui",
    label: "6. UI updates",
    detail: "React updates only the part of the page that changed — the number inside <p>Count: {count}</p>.",
    icon: MonitorSmartphone,
    codeLine: 8,
    tone: "success",
  },
]

const variableSteps: FlowStep[] = [
  { id: "v1", label: "let count = 0", detail: "A normal JavaScript variable, created fresh every time the function runs.", icon: Variable },
  { id: "v2", label: "count = 1", detail: "You reassign it. The variable's value changes — inside that one function call.", icon: Zap },
  {
    id: "v3",
    label: "React has no idea",
    detail: "React never watches plain variables. Nothing tells it that anything happened.",
    icon: Timer,
    tone: "warning",
  },
  { id: "v4", label: "Component doesn't re-render", detail: "The function isn't called again, so nothing new is computed.", icon: Atom, tone: "warning" },
  { id: "v5", label: "UI stays exactly the same", detail: "Even though the code technically ran, the screen never changes.", icon: MonitorSmartphone, tone: "warning" },
]

const stateSteps: FlowStep[] = [
  { id: "s1", label: "useState(0)", detail: "React creates a piece of memory for this component and hands you a getter + setter.", icon: Variable },
  { id: "s2", label: "setCount(1)", detail: "You call the setter — the only correct way to change state.", icon: Zap },
  { id: "s3", label: "React knows state changed", detail: "Because you used the setter, React is explicitly notified.", icon: Timer, tone: "success" },
  { id: "s4", label: "Component renders again", detail: "React re-runs your component function with the new state value.", icon: Atom },
  { id: "s5", label: "UI updates", detail: "The new value flows into the JSX you return, and the screen updates.", icon: MonitorSmartphone, tone: "success" },
]

export default function StateLesson() {
  return (
    <>
      <p>
        Props let data flow <em>into</em> a component, but they can't change on their own. This lesson is about the
        piece that lets a component change over time — its <strong>state</strong>.
      </p>

      <h2>First, the big picture</h2>
      <p>
        Every interactive React app follows the same loop: something happens, state changes, React re-renders, and
        the screen updates. Press play below, or click a step to jump to it.
      </p>
      <ReactLoopDiagram />

      <h2>What is state?</h2>
      <AnalogyCard title="State is a component's short-term memory.">
        Think of a component like a person filling out a form. Props are instructions someone handed them on a piece
        of paper — they can read them, but they can't change what's written. State is their own notebook: they can
        write in it, cross things out, and update it as things happen, entirely on their own.
      </AnalogyCard>

      <DifficultyLevels
        simple={<p>State is a component's memory. When the memory changes, React updates the screen.</p>}
        developer={
          <p>
            State is data that a component owns and controls, created with the <code>useState</code> Hook. Unlike a
            regular variable, updating state through its setter function tells React to re-run the component and
            reconcile the returned JSX against the DOM, updating only what changed.
          </p>
        }
        interview={
          <p>
            <code>useState</code> returns a stateful value and a function to update it. React persists this value
            between renders outside of the component function's own scope (conceptually, on a per-component fiber).
            Calling the setter enqueues a re-render; React batches updates and applies them before the next paint,
            so state does not change synchronously inside the same event handler call.
          </p>
        }
      />

      <h2>Where does that memory live?</h2>
      <StateMemoryDiagram />

      <h2>Why can't a normal variable do this?</h2>
      <p>
        This is the single most important thing to understand before <code>useState</code> clicks. Toggle between
        the two tabs below and compare what happens.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="variable">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="variable">Normal variable</TabsTrigger>
            <TabsTrigger value="state">React state</TabsTrigger>
          </TabsList>
          <TabsContent value="variable" className="mt-3">
            <StepFlowDiagram title="let count = 0" steps={variableSteps} autoPlayMs={1100} />
          </TabsContent>
          <TabsContent value="state" className="mt-3">
            <StepFlowDiagram title="useState(0)" steps={stateSteps} autoPlayMs={1100} />
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="info">
        Reassigning a variable never tells React anything. The <strong>only</strong> way to make React re-render a
        component is to update state through its setter function (or receive new props, or a parent re-renders).
      </Callout>

      <h2>How do you write it?</h2>
      <p>
        <code>useState</code> is a <strong>Hook</strong> — a special function that gives function components React
        features. Call it with a starting value, and it hands back an array: the current value, and a function to
        update it.
      </p>
      <LiveCodeBlock code={basicCounter} />

      <h2>Try it yourself</h2>
      <p>
        This is the exact same counter, but now watch the pipeline on the right light up, step by step, every time
        you click the real button.
      </p>
      <LiveCounterDemo />

      <h2>What actually happens, step by step</h2>
      <p>Here's the same sequence again, matched line-by-line against the code that produces it.</p>
      <StepFlowDiagram title="useState lifecycle" steps={lifecycleSteps} code={lifecycleCode} autoPlayMs={1500} />

      <Callout variant="tip" title="Each component instance has its own memory">
        Render the same component twice and each copy gets a completely independent state — changing one never
        affects the other.
      </Callout>
      <LiveCodeBlock code={independentInstances} />

      <h2>Common mistakes</h2>
      <CommonMistake
        title="mutating state directly"
        wrong={`count = count + 1;\n// UI never updates`}
        right={`setCount(count + 1);\n// tells React to re-render`}
        explanation={
          <p>
            Reassigning a variable changes the variable — React never finds out. Calling <code>setCount</code> is
            the only way to tell React "something changed, please re-render."
          </p>
        }
      />
      <CommonMistake
        title="reading state right after setting it"
        wrong={`setCount(count + 1);\nconsole.log(count); // still the OLD value`}
        right={`setCount(count + 1);\n// the new value shows up on the\n// NEXT render, not the next line`}
        explanation={
          <p>
            Calling the setter <strong>schedules</strong> a re-render — it doesn't rewrite <code>count</code> inside
            the function that's currently running. You'll see the new value the next time the component renders.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What happens right after you call setCount(5)?"
        options={[
          { id: "a", text: "The browser reloads the page" },
          { id: "b", text: "React updates the state and schedules a re-render" },
          { id: "c", text: "JavaScript stops running" },
          { id: "d", text: "The component is deleted and recreated" },
        ]}
        correctId="b"
        explanation="setCount(5) doesn't touch the screen directly. It tells React the state should become 5, and React schedules a re-render so your component function runs again with the new value."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Build a complete counter"
        hint={
          <p>
            For −1: <code>onClick={"{() => setCount(count - 1)}"}</code>. For Reset:{" "}
            <code>onClick={"{() => setCount(0)}"}</code>.
          </p>
        }
      >
        The counter below only has a +1 button. Add a −1 button and a Reset button, both using{" "}
        <code>setCount</code>.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why can't we just use a normal variable instead of useState?"
        answer={
          <p>
            Two separate reasons. First, a <code>let</code> variable declared inside a component function is
            recreated from scratch every time that function runs — there's nowhere for it to "remember" its value
            between renders. <code>useState</code> stores the value outside the function's own scope, tied to that
            component instance, so it survives across renders. Second, even if the value could persist, React has no
            way to detect a plain assignment. Calling the <strong>setter function</strong> is what explicitly
            notifies React that a re-render is needed — that's the whole mechanism, not a side effect of the value
            changing.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "State is data a component remembers across renders.",
          "useState(initialValue) returns [value, setterFunction].",
          "Update state by calling the setter — never reassign the state variable directly.",
          "Calling the setter schedules a re-render; the value doesn't change instantly inside the same function call.",
          "Each component instance keeps its own independent state.",
        ]}
      />
    </>
  )
}
