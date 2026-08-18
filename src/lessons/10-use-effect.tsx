import { Zap, Search, XCircle, RefreshCw, Ban } from "lucide-react"
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

const titleExample = `
function TitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = "Clicked " + count + " times";
  }, [count]);

  return (
    <div>
      <p>Check your browser tab title!</p>
      <button onClick={() => setCount(count + 1)}>Click me ({count})</button>
    </div>
  );
}

render(<TitleUpdater />);
`

const clockExample = `
function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>Seconds elapsed: {seconds}</p>;
}

render(<Clock />);
`

const challengeStarter = `
function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    // TODO: this effect never cleans up its interval!
  }, []);

  return <p>Seconds elapsed: {seconds}</p>;
}

render(<Clock />);
`

const lifecycleCode = [
  "const [count, setCount] = useState(0);",
  "",
  "useEffect(() => {",
  '  document.title = "Clicked " + count;',
  "}, [count]);",
  "",
  "<button onClick={...}>",
  "  Click me ({count})",
  "</button>",
]

const lifecycleSteps: FlowStep[] = [
  { id: "mount", label: "1. Component mounts", detail: "React renders the component for the first time and paints the screen.", icon: Zap, codeLine: 1 },
  { id: "effect", label: "2. Effect runs", detail: "After the paint, React runs the function passed to useEffect.", icon: RefreshCw, codeLine: 3 },
  { id: "sync", label: "3. document.title is set", detail: "The effect reaches outside React to update something the DOM owns, not React.", icon: Search, codeLine: 4 },
  { id: "click", label: "4. User clicks the button", detail: "The onClick handler calls setCount, updating state.", icon: Zap, codeLine: 7 },
  { id: "rerender", label: "5. Component re-renders", detail: "React re-runs the component function with the new count.", icon: RefreshCw, codeLine: 1 },
  { id: "recheck", label: "6. Dependency changed → effect runs again", detail: "count is listed in [count], and it changed, so useEffect runs once more.", icon: Search, codeLine: 5, tone: "success" },
]

const changedSteps: FlowStep[] = [
  { id: "c1", label: "Component renders", detail: "Render happens for any reason — state, props, or a parent re-rendering.", icon: RefreshCw },
  { id: "c2", label: "React checks the dependency array", detail: "It compares each value in [ ] against its value from the previous render.", icon: Search },
  { id: "c3", label: "A value changed", detail: "At least one dependency is different from last time.", icon: Zap, tone: "warning" },
  { id: "c4", label: "Effect runs", detail: "React runs your effect function again, using the latest values.", icon: RefreshCw, tone: "success" },
]

const unchangedSteps: FlowStep[] = [
  { id: "u1", label: "Component renders", detail: "Render happens for any reason — state, props, or a parent re-rendering.", icon: RefreshCw },
  { id: "u2", label: "React checks the dependency array", detail: "It compares each value in [ ] against its value from the previous render.", icon: Search },
  { id: "u3", label: "Nothing changed", detail: "Every dependency is exactly the same as last render.", icon: Ban },
  { id: "u4", label: "Effect is skipped", detail: "React leaves the previous effect's result alone — no extra work.", icon: XCircle },
]

export default function UseEffectLesson() {
  return (
    <>
      <p>
        Everything you've built so far has stayed inside React — state, props, JSX. Real apps
        also need to talk to things <strong>outside</strong> React: fetching data, starting a
        timer, reading the browser's title, listening for a keypress. That's what{" "}
        <code>useEffect</code> is for.
      </p>

      <AnalogyCard title="useEffect is an automatic worker reacting to changes.">
        Imagine hiring an assistant whose only job is to watch a few specific values on a
        whiteboard. Every time the board is updated, the assistant checks: "did any of the values
        I care about actually change?" If yes, they spring into action and do their task — set a
        timer, send a request, update something outside the board. If nothing they care about
        changed, they do nothing and go back to waiting.
      </AnalogyCard>

      <h2>The dependency array decides everything</h2>
      <p>
        <code>useEffect</code> takes a function, and an optional array of dependencies. That
        array is the entire mechanism — toggle between the two tabs to see both outcomes.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="changed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="changed">A dependency changed</TabsTrigger>
            <TabsTrigger value="unchanged">Nothing changed</TabsTrigger>
          </TabsList>
          <TabsContent value="changed" className="mt-3">
            <StepFlowDiagram title="useEffect(fn, [value])" steps={changedSteps} autoPlayMs={1100} />
          </TabsContent>
          <TabsContent value="unchanged" className="mt-3">
            <StepFlowDiagram title="useEffect(fn, [value])" steps={unchangedSteps} autoPlayMs={1100} />
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="info">
        Three ways to use the dependency array: omit it entirely (runs after <strong>every</strong>{" "}
        render), pass <code>[]</code> (runs <strong>once</strong>, right after the first render),
        or list specific values (runs whenever <strong>any of them</strong> change).
      </Callout>

      <h2>Try it — sync with something outside React</h2>
      <p>
        This effect keeps the browser tab's title in sync with a piece of state. Click the
        button, then look at your browser tab.
      </p>
      <LiveCodeBlock code={titleExample} />

      <h2>What actually happens, step by step</h2>
      <StepFlowDiagram title="useEffect lifecycle" steps={lifecycleSteps} code={lifecycleCode} autoPlayMs={1500} />

      <h2>Cleaning up after yourself</h2>
      <p>
        Some effects start something ongoing — a timer, a subscription, an event listener. If you
        return a function from your effect, React calls it right before the effect runs again,
        and once more when the component unmounts. This is your chance to undo whatever the
        effect started.
      </p>
      <LiveCodeBlock code={clockExample} />

      <h2>Common mistakes</h2>
      <CommonMistake
        title="forgetting the dependency array"
        wrong={`useEffect(() => {\n  setCount(count + 1);\n});\n// no array — runs after EVERY render,\n// including the one it just caused`}
        right={`useEffect(() => {\n  setCount(count + 1);\n}, []);\n// runs once, right after the first render`}
        explanation={
          <p>
            With no dependency array, the effect runs after every single render. If that effect
            also updates state, it triggers another render, which runs the effect again — an
            infinite loop. Always be intentional about the array.
          </p>
        }
      />
      <CommonMistake
        title="skipping the cleanup function"
        wrong={`useEffect(() => {\n  const id = setInterval(tick, 1000);\n  // no cleanup — a new interval starts\n  // every time, old ones keep running\n}, []);`}
        right={`useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);`}
        explanation={
          <p>
            Anything you start inside an effect should be stopped in its cleanup function, or you
            accumulate more and more running timers, listeners, or subscriptions every time the
            effect re-runs.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="When does useEffect(() => { ... }, []) run?"
        options={[
          { id: "a", text: "On every single render" },
          { id: "b", text: "Only once, right after the first render" },
          { id: "c", text: "Never — an empty array disables the effect" },
          { id: "d", text: "Only when the component unmounts" },
        ]}
        correctId="b"
        explanation="An empty dependency array means there's nothing that can ever be 'different' on a later render, so React only runs the effect once, right after the component's first render — the classic mount-only pattern."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Fix the leaking timer"
        hint={<p>Add <code>return () =&gt; clearInterval(id);</code> as the last line inside the effect, before the closing <code>{"}, []);"}</code>.</p>}
      >
        The clock below is missing its cleanup function. Add one so the interval is properly
        cleared.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why does useEffect need a cleanup function, and when exactly does React call it?"
        answer={
          <p>
            React calls an effect's cleanup function in two situations: right before running that
            effect again (because a dependency changed), and once more when the component
            unmounts. This exists so effects that set up something ongoing — timers,
            subscriptions, event listeners, network connections — can tear the old one down before
            a new one starts, preventing duplicate timers, memory leaks, or stale listeners from
            piling up across renders.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useEffect lets a component synchronize with something outside React — the DOM, a timer, an API, a subscription.",
          "The dependency array controls when it re-runs: omit it for every render, [] for once, or list values to watch.",
          "Return a cleanup function to undo whatever the effect started, before it runs again and on unmount.",
          "A missing dependency array plus a state update inside the effect is the #1 cause of infinite loops.",
        ]}
      />
    </>
  )
}
