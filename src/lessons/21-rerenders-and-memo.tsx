import { RefreshCw, ShieldCheck, XCircle, CheckCircle2 } from "lucide-react"
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

const withoutMemo = `
function Child({ label }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return <p>{label} rendered {renderCount.current} times</p>;
}

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Parent count: {count}
      </button>
      <Child label="Plain child" />
    </div>
  );
}

render(<Parent />);
`

const withMemo = `
const Child = React.memo(function Child({ label }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return <p>{label} rendered {renderCount.current} times</p>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Parent count: {count}
      </button>
      <Child label="Memoized child" />
    </div>
  );
}

render(<Parent />);
`

const challengeStarter = `
function ExpensiveItem({ name }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return <li>{name} — rendered {renderCount.current} times</li>;
}
// TODO: wrap ExpensiveItem in React.memo so it stops
// re-rendering every time the unrelated counter changes

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Unrelated count: {count}
      </button>
      <ul>
        <ExpensiveItem name="Item A" />
        <ExpensiveItem name="Item B" />
      </ul>
    </div>
  );
}

render(<App />);
`

const renderSteps: FlowStep[] = [
  { id: "state", label: "1. Parent's state changes", detail: "Something inside Parent calls a setter function.", icon: RefreshCw },
  { id: "rerender", label: "2. Parent re-renders", detail: "React re-runs the Parent component function.", icon: RefreshCw },
  { id: "cascade", label: "3. Every child re-renders too, by default", detail: "React re-renders the whole subtree below Parent — even children whose own props never changed.", icon: XCircle, tone: "warning" },
  { id: "memo", label: "4. …unless a child is wrapped in React.memo", detail: "React first checks: are this child's props shallow-equal to last time?", icon: ShieldCheck },
  { id: "skip", label: "5. Equal props → re-render is skipped", detail: "React reuses the previous render's output entirely.", icon: CheckCircle2, tone: "success" },
]

export default function RerendersAndMemoLesson() {
  return (
    <>
      <p>
        You already know a component re-renders when its own state changes. Here's the part that
        catches people off guard: when a component re-renders, <strong>every component below it
        re-renders too</strong> — by default, regardless of whether their own props changed at
        all.
      </p>

      <AnalogyCard title="Re-rendering by default is like re-tasting the whole dish for one new spice.">
        A cautious chef re-tastes the entire dish every time a single ingredient changes,
        including parts that couldn't possibly be affected. <code>React.memo</code> is training
        that chef to first check "did anything I actually care about change?" — and only re-taste
        if the answer is yes.
      </AnalogyCard>

      <h2>The default: everything below re-renders</h2>
      <StepFlowDiagram title="What happens when Parent re-renders" steps={renderSteps} autoPlayMs={1400} />

      <h2>See it happen</h2>
      <p>
        Click "Parent count" a few times in each tab and watch the child's own render counter.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="without">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="without">Without React.memo</TabsTrigger>
            <TabsTrigger value="with">With React.memo</TabsTrigger>
          </TabsList>
          <TabsContent value="without" className="mt-3">
            <LiveCodeBlock code={withoutMemo} />
          </TabsContent>
          <TabsContent value="with" className="mt-3">
            <LiveCodeBlock code={withMemo} />
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="info">
        <code>Child</code>'s only prop, <code>label</code>, never changes in either tab. Without{" "}
        <code>React.memo</code> it re-renders anyway, every time, just because its parent did.
        With it, React compares the previous props to the new ones and skips the re-render when
        they're the same.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="expecting React.memo to work with object or function props"
        wrong={`const Child = React.memo(function Child({ config }) { ... });\n\nfunction Parent() {\n  return <Child config={{ theme: "dark" }} />;\n  // a NEW object every render — memo still re-renders\n}`}
        right={`const config = useMemo(() => ({ theme: "dark" }), []);\nreturn <Child config={config} />;\n// same object reference — memo actually skips the re-render`}
        explanation={
          <p>
            <code>React.memo</code> compares props with a shallow, reference-based check — the
            same rule Context and <code>useMemo</code>/<code>useCallback</code> use. An inline
            object or function literal is a new reference on every render, so the comparison
            always sees "different props," no matter how memoized the child is.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="By default, what happens to a child component when its parent re-renders?"
        options={[
          { id: "a", text: "The child only re-renders if its own props changed" },
          { id: "b", text: "The child re-renders too, even if its own props didn't change" },
          { id: "c", text: "Nothing — children never re-render automatically" },
          { id: "d", text: "Only children with their own state re-render" },
        ]}
        correctId="b"
        explanation="React re-renders an entire subtree by default whenever a component re-renders — child props being unchanged doesn't stop it. React.memo is what adds that check."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Stop the unrelated re-renders"
        hint={<p>Wrap the function in <code>React.memo(...)</code>: <code>{"const ExpensiveItem = React.memo(function ExpensiveItem({ name }) { ... });"}</code></p>}
      >
        Clicking the counter re-renders both list items, even though <code>name</code> never
        changes for either. Fix it with <code>React.memo</code>.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What does React.memo actually check, and when does it not help?"
        answer={
          <p>
            <code>React.memo</code> wraps a component so that, before re-rendering it, React does
            a <strong>shallow comparison</strong> of its new props against its previous props —
            one level deep, using <code>Object.is</code> per prop. If every prop is equal, React
            reuses the last render's output instead of calling the component again. It doesn't
            help when a prop is an object, array, or function created fresh on every parent
            render, since those are never reference-equal even when their contents are identical
            — those need to be memoized themselves (with <code>useMemo</code>/<code>useCallback</code>)
            for <code>React.memo</code> to have anything stable to compare against. It also isn't
            free: React still has to run the comparison itself, so wrapping components that
            re-render cheaply anyway can cost more than it saves.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "When a component re-renders, every component below it re-renders too, by default.",
          "React.memo makes a component skip re-rendering when its props are shallow-equal to last time.",
          "Shallow equality means object/array/function props need to be memoized too, or the comparison always fails.",
          "React.memo isn't free — reserve it for children that are genuinely expensive to re-render.",
        ]}
      />
    </>
  )
}
