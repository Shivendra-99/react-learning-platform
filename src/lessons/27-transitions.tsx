import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const transitionCode = `function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const next = event.target.value;

    setQuery(next);

    startTransition(() => {
      setResults(searchHugeList(next));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList items={results} />
    </>
  );
}`

const transitionSteps: WalkthroughStep[] = [
  {
    id: "t1",
    label: "Two updates, two priorities",
    detail:
      "Typing changes two things: the text in the box, and the expensive list below it. They should NOT be treated the same way.",
    range: [2, 3],
  },
  {
    id: "t2",
    label: "useTransition gives you a flag and a wrapper",
    detail:
      "isPending tells you a low-priority update is still in flight. startTransition is how you mark updates as interruptible.",
    lines: 4,
  },
  {
    id: "t3",
    label: "The urgent update stays outside",
    detail:
      "setQuery runs at normal priority, so the input updates on the very next frame. The cursor never lags — this is what the user feels.",
    lines: 9,
  },
  {
    id: "t4",
    label: "The expensive update goes inside",
    detail:
      "React may pause, abandon, and restart this work if another keystroke arrives. Half-finished renders are simply thrown away.",
    range: [11, 13],
  },
  {
    id: "t5",
    label: "isPending drives the loading affordance",
    detail:
      "Rather than freezing, you show the stale list plus a spinner. The UI stays honest AND responsive while the new results are computed.",
    lines: 19,
  },
]

const laggyDemo = `
function slowList(query) {
  const items = [];
  for (let i = 0; i < 180; i++) {
    // Deliberately expensive work per item
    const start = performance.now();
    while (performance.now() - start < 0.35) {}
    items.push(query + " result #" + (i + 1));
  }
  return items;
}

function WithoutTransition() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  function handleChange(e) {
    setQuery(e.target.value);
    setItems(slowList(e.target.value));
  }

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        Type fast — the input itself stutters.
      </p>
      <input value={query} onChange={handleChange} placeholder="Search…" />
      <p style={{ fontSize: 12 }}>{items.length} results</p>
    </div>
  );
}

render(<WithoutTransition />);
`

const smoothDemo = `
function slowList(query) {
  const items = [];
  for (let i = 0; i < 180; i++) {
    const start = performance.now();
    while (performance.now() - start < 0.35) {}
    items.push(query + " result #" + (i + 1));
  }
  return items;
}

function WithTransition() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const next = e.target.value;
    setQuery(next);
    startTransition(() => {
      setItems(slowList(next));
    });
  }

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        Same work — but typing stays smooth.
      </p>
      <input value={query} onChange={handleChange} placeholder="Search…" />
      <p style={{ fontSize: 12, opacity: isPending ? 0.5 : 1 }}>
        {items.length} results {isPending ? "(updating…)" : ""}
      </p>
    </div>
  );
}

render(<WithTransition />);
`

const deferredDemo = `
function slowList(query) {
  const items = [];
  for (let i = 0; i < 150; i++) {
    const start = performance.now();
    while (performance.now() - start < 0.35) {}
    items.push(query + " row " + (i + 1));
  }
  return items;
}

function Results({ query }) {
  const items = slowList(query);
  return <p style={{ fontSize: 12 }}>{items.length} rows for "{query}"</p>;
}

function Demo() {
  const [query, setQuery] = useState("");
  // The input reads query; the expensive child reads the DEFERRED value
  const deferred = useDeferredValue(query);
  const stale = query !== deferred;

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type here…"
      />
      <div style={{ opacity: stale ? 0.5 : 1 }}>
        <Results query={deferred} />
      </div>
    </div>
  );
}

render(<Demo />);
`

const challengeStarter = `
function slowList(query) {
  const items = [];
  for (let i = 0; i < 160; i++) {
    const start = performance.now();
    while (performance.now() - start < 0.35) {}
    items.push(query + " #" + (i + 1));
  }
  return items;
}

function Demo() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  // TODO: pull in useTransition and wrap the expensive setItems call

  function handleChange(e) {
    const next = e.target.value;
    setQuery(next);
    setItems(slowList(next));
  }

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <input value={query} onChange={handleChange} placeholder="Search…" />
      <p style={{ fontSize: 12 }}>{items.length} results</p>
    </div>
  );
}

render(<Demo />);
`

export default function TransitionsLesson() {
  return (
    <>
      <p>
        Not every state update deserves the same urgency. When you type into a search box, the
        letters appearing is urgent — you'd notice a 200ms delay instantly. Re-filtering ten
        thousand rows is not; nobody minds if that lands a moment later. Before React 18 you had
        no way to say so, and the expensive work blocked the keystrokes. Transitions are how you
        tell React which is which.
      </p>

      <AnalogyCard title="Transitions are a hospital triage desk.">
        Everyone who walks in gets treated, but not in arrival order — the nurse decides who
        can't wait and who can sit down for a bit. <code>startTransition</code> is you telling
        React "this one can sit down," which frees the doctor to handle the urgent case that just
        came through the door.
      </AnalogyCard>

      <h2>Marking an update as non-urgent</h2>
      <div className="not-prose">
        <CodeWalkthrough
          title="A responsive search box"
          filename="SearchPage.jsx"
          code={transitionCode}
          steps={transitionSteps}
        />
      </div>

      <h2>Feel the difference</h2>
      <p>
        Both demos do <em>identical</em> work — the same deliberately slow list build on every
        keystroke. The only difference is whether that work is wrapped in a transition. Type
        quickly in the first one, then the second.
      </p>
      <p className="text-sm font-medium text-foreground">Without a transition — the input itself stutters</p>
      <LiveCodeBlock code={laggyDemo} />
      <p className="text-sm font-medium text-foreground">With a transition — typing stays responsive</p>
      <LiveCodeBlock code={smoothDemo} />

      <Callout variant="info" title="Transitions don't make anything faster">
        The slow function takes exactly as long either way. What changes is <em>schedulability</em>:
        React can now interrupt that render when a keystroke arrives, throw away the partial
        work, and start again with the newer value. You trade slightly staler results for a UI
        that never blocks.
      </Callout>

      <h2>useDeferredValue: the same idea, from the other end</h2>
      <p>
        <code>useTransition</code> wraps the <em>update</em>. <code>useDeferredValue</code> wraps
        the <em>value</em> — useful when the expensive work lives in a child component and you
        don't control the <code>setState</code> call, for instance when the value arrives as a
        prop.
      </p>
      <LiveCodeBlock code={deferredDemo} />

      <Callout variant="tip">
        Rule of thumb: if you own the state update, use <code>useTransition</code>. If you only
        receive a value and something downstream is expensive, use{" "}
        <code>useDeferredValue</code>. Comparing <code>value !== deferredValue</code> gives you
        the same "is it stale?" signal that <code>isPending</code> provides.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="putting the urgent update inside the transition"
        wrong={`function handleChange(e) {\n  const next = e.target.value;\n\n  startTransition(() => {\n    setQuery(next);       // ❌ urgent!\n    setResults(search(next));\n  });\n}\n\n// The input value is now low-priority too,\n// so typing feels laggy again`}
        right={`function handleChange(e) {\n  const next = e.target.value;\n\n  setQuery(next);         // ✅ urgent\n\n  startTransition(() => {\n    setResults(search(next));\n  });\n}\n\n// Only the expensive part is\n// interruptible`}
        explanation={
          <p>
            Anything inside <code>startTransition</code> becomes interruptible — including the
            controlled input's own value. Since React may delay that update, the character you
            typed can visibly lag behind your keystroke. Keep the update that reflects direct
            user input outside the transition, always.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What does wrapping a state update in startTransition actually change?"
        options={[
          { id: "a", text: "It makes the update run faster by using a background thread" },
          { id: "b", text: "It debounces the update by a fixed number of milliseconds" },
          { id: "c", text: "It marks the update as interruptible, so urgent updates can cut ahead of it" },
          { id: "d", text: "It skips the update entirely if the component re-renders first" },
        ]}
        correctId="c"
        explanation="Transitions don't speed anything up or add a delay — JavaScript is still single-threaded. They change scheduling priority: React can pause a transition render, handle an urgent update like a keystroke, discard the partial work, and restart."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Make the laggy search responsive"
        hint={
          <p>
            Add <code>{"const [isPending, startTransition] = useTransition();"}</code> then move
            only the <code>setItems(...)</code> call inside{" "}
            <code>{"startTransition(() => { … })"}</code>.
          </p>
        }
      >
        Typing in this box stutters because the expensive list is rebuilt at urgent priority.
        Wrap the <code>setItems</code> call in a transition — but leave{" "}
        <code>setQuery</code> where it is.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What's the difference between useTransition and debouncing?"
        answer={
          <p>
            Debouncing delays <em>starting</em> the work by a fixed timeout you guessed at — so
            on a fast machine you've added latency for no reason, and on a slow one the work
            still blocks the main thread once it finally runs. A transition starts the work
            immediately but marks it interruptible: React renders it in the background and, if an
            urgent update like a keystroke arrives, abandons the partial render and restarts with
            the new input. Nothing is ever thrown away on the screen, no arbitrary delay is
            introduced, and the results are as fresh as the device can manage. You also get{" "}
            <code>isPending</code> for free, which is a genuine "work in flight" signal rather
            than a timer. They're not mutually exclusive — debouncing an actual network request
            still makes sense — but for expensive <em>rendering</em>, transitions are strictly
            better.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "startTransition marks a state update as non-urgent, letting React interrupt it to handle urgent updates like typing.",
          "Keep updates that reflect direct user input (controlled inputs) OUTSIDE the transition, or they lag too.",
          "isPending lets you show a spinner or dim stale content instead of freezing the page.",
          "useDeferredValue is the same idea applied to a value rather than an update — use it when the expensive work is downstream.",
          "Transitions don't make work faster; they make it interruptible, which is why they beat debouncing for expensive renders.",
        ]}
      />
    </>
  )
}
