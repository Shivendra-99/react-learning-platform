import { Search, RefreshCw, Ban, CheckCircle2 } from "lucide-react"
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
const items = ["Banana", "Apple", "Cherry", "Date"];

function WithoutMemo() {
  const [clicks, setClicks] = useState(0);
  const computeCount = useRef(0);

  const sorted = [...items].sort();
  computeCount.current = computeCount.current + 1;

  return (
    <div>
      <p>Sort ran {computeCount.current} times</p>
      <p>{sorted.join(", ")}</p>
      <button onClick={() => setClicks(clicks + 1)}>
        Unrelated click ({clicks})
      </button>
    </div>
  );
}

render(<WithoutMemo />);
`

const withMemo = `
const items = ["Banana", "Apple", "Cherry", "Date"];

function WithMemo() {
  const [clicks, setClicks] = useState(0);
  const computeCount = useRef(0);

  const sorted = useMemo(() => {
    computeCount.current = computeCount.current + 1;
    return [...items].sort();
  }, [items]);

  return (
    <div>
      <p>Sort ran {computeCount.current} times</p>
      <p>{sorted.join(", ")}</p>
      <button onClick={() => setClicks(clicks + 1)}>
        Unrelated click ({clicks})
      </button>
    </div>
  );
}

render(<WithMemo />);
`

const challengeStarter = `
const products = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

function FilteredList() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("light");

  // TODO: wrap this in useMemo so it only re-filters when "query" changes
  const filtered = products.filter((p) =>
    p.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme ({theme})
      </button>
      <p>{filtered.join(", ")}</p>
    </div>
  );
}

render(<FilteredList />);
`

const recomputeSteps: FlowStep[] = [
  { id: "r1", label: "Component renders", detail: "For any reason — state, props, or a parent re-rendering.", icon: RefreshCw },
  { id: "r2", label: "React checks the dependency array", detail: "It compares each value against its value from the previous render.", icon: Search },
  { id: "r3", label: "A dependency changed", detail: "At least one value is different from last time.", icon: Search, tone: "warning" },
  { id: "r4", label: "The calculation runs again", detail: "React calls your function and stores the fresh result.", icon: RefreshCw, tone: "warning" },
]

const cachedSteps: FlowStep[] = [
  { id: "c1", label: "Component renders", detail: "For any reason — state, props, or a parent re-rendering.", icon: RefreshCw },
  { id: "c2", label: "React checks the dependency array", detail: "It compares each value against its value from the previous render.", icon: Search },
  { id: "c3", label: "Nothing changed", detail: "Every dependency is exactly the same as last render.", icon: Ban },
  { id: "c4", label: "The cached value is reused", detail: "Your calculation function does not run again.", icon: CheckCircle2, tone: "success" },
]

export default function UseMemoLesson() {
  return (
    <>
      <p>
        Some calculations are expensive — sorting a long list, filtering a big array, heavy math.
        Doing that work on every single render, even when the inputs haven't changed, wastes
        effort. <code>useMemo</code> lets you skip it.
      </p>

      <AnalogyCard title="useMemo is a cached receipt for a calculation.">
        Imagine doing a big math problem and writing the answer on a receipt. Next time someone
        asks for the answer, you first check: "are the numbers the same as last time?" If yes, you
        just hand over the same receipt instead of redoing the math. Only when the numbers
        actually change do you redo the calculation and print a new receipt.
      </AnalogyCard>

      <h2>Recompute vs. reuse</h2>
      <p>
        <code>useMemo(calculateValue, dependencies)</code> works exactly like{" "}
        <code>useEffect</code>'s dependency array, but instead of running a side effect, it caches
        and returns a <strong>value</strong>.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="changed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="changed">Dependency changed</TabsTrigger>
            <TabsTrigger value="same">Dependency unchanged</TabsTrigger>
          </TabsList>
          <TabsContent value="changed" className="mt-3">
            <StepFlowDiagram title="useMemo(fn, [value])" steps={recomputeSteps} autoPlayMs={1100} />
          </TabsContent>
          <TabsContent value="same" className="mt-3">
            <StepFlowDiagram title="useMemo(fn, [value])" steps={cachedSteps} autoPlayMs={1100} />
          </TabsContent>
        </Tabs>
      </div>

      <h2>See the difference</h2>
      <p>
        Both examples below sort the same list and count how many times the sort actually runs.
        Click the unrelated button a few times in each and compare the two counters.
      </p>
      <p className="text-sm font-medium text-foreground">Without useMemo — recalculates every render</p>
      <LiveCodeBlock code={withoutMemo} />
      <p className="text-sm font-medium text-foreground">With useMemo — only recalculates when needed</p>
      <LiveCodeBlock code={withMemo} />

      <Callout variant="info">
        In the first example, the count keeps climbing with every click. In the second,{" "}
        <code>items</code> never changes, so the dependency array <code>[items]</code> never
        changes either — the count stays flat no matter how many times you click, because the
        sort doesn't re-run for unrelated re-renders.{" "}
        <span className="text-xs">
          (You may see it start at 2 instead of 1 — React's development mode intentionally runs
          new calculations twice on the first render to help catch bugs; what matters is that it
          stops climbing.)
        </span>
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="memoizing everything"
        wrong={`const doubled = useMemo(() => count * 2, [count]);\n// pointless — multiplying a number\n// is already instant`}
        right={`const doubled = count * 2;\n// just compute it directly`}
        explanation={
          <p>
            <code>useMemo</code> isn't free — it costs memory to store the cached value and time
            to compare dependencies on every render. Reserve it for calculations that are
            genuinely expensive; for cheap ones, the memoization overhead can cost more than just
            recalculating.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What does useMemo's dependency array actually control?"
        options={[
          { id: "a", text: "How often the component re-renders" },
          { id: "b", text: "When the cached value is thrown away and recalculated" },
          { id: "c", text: "Whether the component uses React.memo" },
          { id: "d", text: "The order Hooks are called in" },
        ]}
        correctId="b"
        explanation="useMemo caches the RESULT of a calculation. The dependency array is what decides whether React reuses that cached result or reruns the function to compute a fresh one."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Stop re-filtering on every click"
        hint={<p>Wrap it as: <code>{"useMemo(() => products.filter(...), [query])"}</code></p>}
      >
        Right now, toggling the theme button also re-runs the filter, even though the search
        query didn't change. Wrap <code>filtered</code> in <code>useMemo</code> so it only
        recalculates when <code>query</code> changes.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="When should you actually reach for useMemo, and what's the risk of overusing it?"
        answer={
          <p>
            Reserve <code>useMemo</code> for calculations that are measurably expensive — sorting
            or filtering large datasets, heavy math, building derived data structures — or where
            you need to preserve <strong>reference equality</strong> of an object/array (for
            example, so it doesn't break another Hook's dependency array or unnecessarily
            re-render a memoized child). Wrapping cheap calculations in it adds its own overhead —
            storing the cached value and diffing dependencies every render — which can outweigh
            the calculation itself, plus it adds a layer of indirection. The rule of thumb:
            measure first, and memoize only where profiling shows an actual cost.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useMemo caches the RESULT of a calculation between renders.",
          "It only recomputes when a value in its dependency array changes.",
          "It's for expensive calculations — using it on cheap ones can cost more than it saves.",
          "It's also useful to preserve reference equality for values passed to other hooks or memoized children.",
        ]}
      />
    </>
  )
}
