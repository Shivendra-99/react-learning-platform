import { Fingerprint, RefreshCw, ShieldCheck, XCircle, CheckCircle2 } from "lucide-react"
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

const withoutCallback = `
const Child = React.memo(function Child({ onClick }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return (
    <div>
      <p>Child rendered {renderCount.current} times</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  // A NEW function is created every render
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <p>Parent state: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Update parent (unrelated to child)
      </button>
      <Child onClick={handleClick} />
    </div>
  );
}

render(<Parent />);
`

const withCallback = `
const Child = React.memo(function Child({ onClick }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return (
    <div>
      <p>Child rendered {renderCount.current} times</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  // The SAME function reference is reused across renders
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <p>Parent state: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Update parent (unrelated to child)
      </button>
      <Child onClick={handleClick} />
    </div>
  );
}

render(<Parent />);
`

const challengeStarter = `
const Child = React.memo(function Child({ onClick }) {
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return (
    <div>
      <p>Child rendered {renderCount.current} times</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  // TODO: wrap this in useCallback with an empty dependency array
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <p>Parent state: {count}</p>
      <button onClick={() => setCount(count + 1)}>Update parent</button>
      <Child onClick={handleClick} />
    </div>
  );
}

render(<Parent />);
`

const withoutSteps: FlowStep[] = [
  { id: "w1", label: "Parent re-renders", detail: "For any reason, like its own state changing.", icon: RefreshCw },
  { id: "w2", label: "A new function is created", detail: "Every render defines a brand-new function object, even if the code looks identical.", icon: Fingerprint },
  { id: "w3", label: "React.memo compares props", detail: "It checks whether onClick is the same reference as last time.", icon: ShieldCheck },
  { id: "w4", label: "The reference is different", detail: "A new function was created, so it fails the comparison.", icon: XCircle, tone: "warning" },
  { id: "w5", label: "Child re-renders too", detail: "Even though nothing it actually displays changed.", icon: RefreshCw, tone: "warning" },
]

const withSteps: FlowStep[] = [
  { id: "s1", label: "Parent re-renders", detail: "For any reason, like its own state changing.", icon: RefreshCw },
  { id: "s2", label: "useCallback returns the cached function", detail: "Since its dependency array is empty, the same function object is reused.", icon: Fingerprint },
  { id: "s3", label: "React.memo compares props", detail: "It checks whether onClick is the same reference as last time.", icon: ShieldCheck },
  { id: "s4", label: "The reference is identical", detail: "Same function object as before — it passes the comparison.", icon: CheckCircle2, tone: "success" },
  { id: "s5", label: "Child re-render is skipped", detail: "React.memo bails out early — no wasted work.", icon: CheckCircle2, tone: "success" },
]

export default function UseCallbackLesson() {
  return (
    <>
      <p>
        Every time a component re-renders, any function you define inside it is recreated from
        scratch — a brand-new object in memory, even if the code is identical. Usually that's
        harmless. Sometimes it quietly defeats an optimization. <code>useCallback</code> fixes
        that.
      </p>

      <AnalogyCard title="useCallback hands out the same phone number every time.">
        Imagine introducing yourself with a different phone number every single time someone
        meets you — technically it's still "you," but nobody can tell, because the number itself
        looks brand new each time. <code>useCallback</code> makes sure you hand out the{" "}
        <em>same</em> number every time, so anything checking "is this the same contact as
        before?" can actually recognize you.
      </AnalogyCard>

      <h2>Why function identity matters</h2>
      <p>
        <code>React.memo</code> lets a component skip re-rendering when its props haven't
        changed. But "changed" is checked with a simple reference comparison — and a freshly
        created function is <em>never</em> equal to the previous one, even if it does the exact
        same thing.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="without">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="without">Without useCallback</TabsTrigger>
            <TabsTrigger value="with">With useCallback</TabsTrigger>
          </TabsList>
          <TabsContent value="without" className="mt-3">
            <StepFlowDiagram title="new function every render" steps={withoutSteps} autoPlayMs={1200} />
          </TabsContent>
          <TabsContent value="with" className="mt-3">
            <StepFlowDiagram title="stable function reference" steps={withSteps} autoPlayMs={1200} />
          </TabsContent>
        </Tabs>
      </div>

      <h2>See the difference</h2>
      <p>
        Both examples render a memoized <code>Child</code> and count how many times it actually
        renders. Click "Update parent" a few times in each.
      </p>
      <p className="text-sm font-medium text-foreground">Without useCallback — child re-renders every time</p>
      <LiveCodeBlock code={withoutCallback} />
      <p className="text-sm font-medium text-foreground">With useCallback — child render is skipped</p>
      <LiveCodeBlock code={withCallback} />

      <Callout variant="info">
        <code>useCallback(fn, deps)</code> is really just <code>useMemo(() =&gt; fn, deps)</code> —
        the same caching mechanism, except what's cached is the function itself, not a computed
        value.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="using useCallback without React.memo on the child"
        wrong={`function Child({ onClick }) {\n  // NOT wrapped in React.memo\n  return <button onClick={onClick}>Click</button>;\n}\n// Child re-renders anyway whenever Parent does —\n// useCallback alone changes nothing here`}
        right={`const Child = React.memo(function Child({ onClick }) {\n  return <button onClick={onClick}>Click</button>;\n});\n// NOW the stable reference actually prevents\n// an unnecessary Child re-render`}
        explanation={
          <p>
            <code>useCallback</code> only stabilizes a function's identity — it does nothing to
            stop a re-render by itself. It only pays off when the component receiving that
            function also skips re-rendering for unchanged props, typically via{" "}
            <code>React.memo</code>. Without that pairing, it's pure overhead.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="By itself, what does useCallback actually prevent?"
        options={[
          { id: "a", text: "The parent component from re-rendering" },
          { id: "b", text: "A new function reference from being created on every render" },
          { id: "c", text: "The child component from ever re-rendering" },
          { id: "d", text: "State updates from batching" },
        ]}
        correctId="b"
        explanation="useCallback only controls whether a NEW function object is created each render. Whether that matters for performance depends entirely on what receives the function — usually a React.memo-wrapped child, or a dependency array elsewhere."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Stop the unnecessary child re-render"
        hint={<p>Change it to: <code>{"const handleClick = useCallback(() => { console.log('clicked'); }, []);"}</code></p>}
      >
        <code>Child</code> is already wrapped in <code>React.memo</code>, but it still re-renders
        every time you click "Update parent." Wrap <code>handleClick</code> in{" "}
        <code>useCallback</code> to fix it.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What's the difference between useMemo and useCallback?"
        answer={
          <p>
            Both accept a function and a dependency array, and both cache something across
            renders — but <code>useMemo</code> caches the <strong>return value</strong> of calling
            the function, while <code>useCallback</code> caches the{" "}
            <strong>function itself</strong> (its reference), without ever calling it. In fact,{" "}
            <code>useCallback(fn, deps)</code> is equivalent to <code>useMemo(() =&gt; fn, deps)</code>.
            Reach for <code>useCallback</code> when you need a stable function reference — usually
            to avoid breaking a dependency array elsewhere, or to avoid re-rendering a{" "}
            <code>React.memo</code>-wrapped child that receives that function as a prop.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Every render creates brand-new function objects, even if the code inside looks identical.",
          "useCallback returns the SAME function reference across renders, as long as its dependencies haven't changed.",
          "By itself, useCallback prevents nothing — it only helps when paired with something that checks reference equality, like React.memo.",
          "useCallback(fn, deps) is really just useMemo(() => fn, deps) with a different result cached.",
        ]}
      />
    </>
  )
}
