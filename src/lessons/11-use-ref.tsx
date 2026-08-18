import { Pin, Zap, EyeOff, MonitorSmartphone, RefreshCw } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const focusExample = `
function FocusInput() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Click the button to focus me" />
      <button onClick={handleClick}>Focus the input</button>
    </div>
  );
}

render(<FocusInput />);
`

const refVsRenderExample = `
function RefVsState() {
  const [renders, setRenders] = useState(0);
  const clicksRef = useRef(0);

  function handleRefClick() {
    clicksRef.current = clicksRef.current + 1;
    // the number below will NOT update yet — no re-render happened
  }

  return (
    <div>
      <p>Ref value (only shown as of the last render): {clicksRef.current}</p>
      <button onClick={handleRefClick}>Increment ref</button>
      <button onClick={() => setRenders(renders + 1)}>Force a re-render</button>
    </div>
  );
}

render(<RefVsState />);
`

const challengeStarter = `
function FocusInput() {
  const inputRef = useRef(null);

  function handleFocus() {
    inputRef.current.focus();
  }

  return (
    <div>
      <input ref={inputRef} defaultValue="Select me!" />
      <button onClick={handleFocus}>Focus</button>
      {/* TODO: add a button that selects all the text using inputRef.current.select() */}
    </div>
  );
}

render(<FocusInput />);
`

const stateSteps: FlowStep[] = [
  { id: "s1", label: "setValue(x) is called", detail: "You call the state setter with a new value.", icon: Zap },
  { id: "s2", label: "React schedules a re-render", detail: "React marks this component as needing to run again.", icon: RefreshCw },
  { id: "s3", label: "Component function runs again", detail: "React re-executes your component with the new value.", icon: RefreshCw },
  { id: "s4", label: "UI updates", detail: "The new value flows into your JSX, and the screen changes.", icon: MonitorSmartphone, tone: "success" },
]

const refSteps: FlowStep[] = [
  { id: "r1", label: "ref.current = x", detail: "You mutate the ref's current property directly.", icon: Pin },
  { id: "r2", label: "The value changes immediately, in place", detail: "No React machinery is involved — it's a plain object mutation.", icon: Zap },
  { id: "r3", label: "React is never notified", detail: "Nothing schedules a re-render. React has no idea this happened.", icon: EyeOff, tone: "warning" },
  { id: "r4", label: "UI stays exactly the same", detail: "...until something else causes a re-render, at which point it reflects the new value.", icon: MonitorSmartphone, tone: "warning" },
]

export default function UseRefLesson() {
  return (
    <>
      <p>
        Sometimes you need to remember a value across renders, or reach directly into the DOM —
        without triggering a re-render every time it changes. That's exactly what{" "}
        <code>useRef</code> is for.
      </p>

      <AnalogyCard title="useRef is a sticky note on your desk.">
        You can write on it and read it anytime, and it stays put between visits. But writing on
        it doesn't make an announcement — nobody in the office finds out just because the note
        changed. Compare that to state, which is like updating a shared whiteboard: the moment you
        change it, everyone (React) is notified and reacts.
      </AnalogyCard>

      <h2>Two things useRef is used for</h2>
      <ol>
        <li>
          <strong>A direct handle to a DOM element</strong> — focus an input, measure an element,
          scroll something into view.
        </li>
        <li>
          <strong>A mutable value that survives across renders</strong> without ever causing a
          re-render itself — a timer ID, a previous value, a flag only your logic cares about.
        </li>
      </ol>

      <h2>Reaching into the DOM</h2>
      <p>
        Pass a ref to an element's <code>ref</code> attribute, and <code>inputRef.current</code>{" "}
        becomes the actual DOM node — with all its native methods, like <code>.focus()</code>.
      </p>
      <LiveCodeBlock code={focusExample} />

      <h2>useState vs useRef</h2>
      <p>Both persist a value between renders. Only one of them tells React to redraw the screen.</p>
      <div className="not-prose">
        <Tabs defaultValue="state">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="state">useState</TabsTrigger>
            <TabsTrigger value="ref">useRef</TabsTrigger>
          </TabsList>
          <TabsContent value="state" className="mt-3">
            <StepFlowDiagram title="setValue(x)" steps={stateSteps} autoPlayMs={1100} />
          </TabsContent>
          <TabsContent value="ref" className="mt-3">
            <StepFlowDiagram title="ref.current = x" steps={refSteps} autoPlayMs={1100} />
          </TabsContent>
        </Tabs>
      </div>

      <h2>See it for yourself</h2>
      <p>
        Click "Increment ref" a few times — notice the number on screen doesn't move. Then click
        "Force a re-render" and watch it jump to the real value all at once.
      </p>
      <LiveCodeBlock code={refVsRenderExample} />

      <Callout variant="tip">
        This isn't a bug — it's the entire point of <code>useRef</code>. It lets you keep data
        around without paying the cost of a re-render every time it changes.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="using a ref for something the UI needs to show"
        wrong={`const countRef = useRef(0);\nfunction handleClick() {\n  countRef.current++;\n}\n// UI never updates on click\nreturn <button onClick={handleClick}>{countRef.current}</button>;`}
        right={`const [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n}\n// UI updates because setCount schedules a re-render\nreturn <button onClick={handleClick}>{count}</button>;`}
        explanation={
          <p>
            Refs are intentionally invisible to React's rendering system. Use state for any value
            the user should see change on screen; use a ref only for values that live "behind the
            scenes."
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Does changing myRef.current cause the component to re-render?"
        options={[
          { id: "a", text: "Yes, immediately" },
          { id: "b", text: "No, never by itself" },
          { id: "c", text: "Only if the ref holds a number" },
          { id: "d", text: "Only inside useEffect" },
        ]}
        correctId="b"
        explanation="Refs are designed specifically to NOT trigger re-renders when they change. That's what makes them useful for values you want to keep across renders — like a timer ID or a DOM node — without paying for a redraw every time."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Add a Select all button"
        hint={<p>Add <code>{"<button onClick={() => inputRef.current.select()}>Select all</button>"}</code> right after the Focus button.</p>}
      >
        Add a second button that selects all the text in the input, using{" "}
        <code>inputRef.current.select()</code>.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What's the difference between useState and useRef, and when would you choose one over the other?"
        answer={
          <p>
            Both persist a value across renders, but updating state via its setter schedules a
            re-render so the UI reflects the new value, while mutating a ref's{" "}
            <code>.current</code> does not trigger any re-render — React isn't even aware it
            happened. Use state for anything the rendered UI depends on. Use a ref for values you
            need to keep around between renders that should <strong>never</strong> by themselves
            cause a redraw — a DOM node handle, a timer ID, a "previous value" for comparison, or
            any mutable value only read inside event handlers or effects.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useRef returns an object with one mutable property, .current, that persists across renders.",
          "Changing ref.current never triggers a re-render — refs are invisible to React's rendering system.",
          "Pass a ref to an element's ref attribute to get a direct handle to the real DOM node.",
          "Use state when the UI needs to reflect a change; use a ref for values that live behind the scenes.",
        ]}
      />
    </>
  )
}
