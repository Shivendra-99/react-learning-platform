import { Inbox, ClipboardCheck, BookLock, RefreshCw, MonitorSmartphone } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"
import { FanOutDiagram } from "@/components/diagram/fan-out-diagram"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const reducerExample = `
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => dispatch({ type: "increment" })}>+1</button>
        <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
        <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>
    </div>
  );
}

render(<Counter />);
`

const flowSteps: FlowStep[] = [
  { id: "action", label: "1. User action", detail: "A click, a form submit — something happens.", icon: Inbox },
  { id: "dispatch", label: "2. dispatch(action)", detail: "A plain object describing what happened is sent to the store, e.g. { type: \"increment\" }.", icon: ClipboardCheck },
  { id: "reducer", label: "3. The reducer computes new state", detail: "A pure function: (currentState, action) => newState. Always the same rule for the same action.", icon: BookLock },
  { id: "update", label: "4. The store updates", detail: "The new state replaces the old — the store never mutates it in place.", icon: RefreshCw },
  { id: "render", label: "5. Subscribed components re-render", detail: "Only the components reading the piece of state that changed.", icon: MonitorSmartphone, tone: "success" },
]

// The exact code the walkthrough below narrates line by line.
const rtkCode = `const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => {
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

const { incremented, decremented, reset } = counterSlice.actions;

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

function CounterDisplay() {
  const count = useSelector((state) => state.counter.value);
  return <p>Count: {count}</p>;
}

function CounterButtons() {
  const dispatch = useDispatch();
  return (
    <>
      <button onClick={() => dispatch(incremented())}>+1</button>
      <button onClick={() => dispatch(decremented())}>-1</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <CounterDisplay />
      <CounterButtons />
    </Provider>
  );
}`

const rtkSteps: WalkthroughStep[] = [
  {
    id: "rtk1",
    label: "createSlice replaces the switch statement",
    detail:
      "One call generates the reducer AND the matching action creators together, keyed by a name you give this piece of state — so they can never drift out of sync the way hand-written action types and cases can.",
    range: [1, 15],
  },
  {
    id: "rtk2",
    label: "This looks like mutation — it isn't",
    detail:
      "state.value += 1 inside a slice reducer looks like exactly the mistake the Common Mistake box below warns about. It's safe here ONLY because Redux Toolkit wraps every slice reducer in Immer, which records these writes and produces a real new object behind the scenes.",
    range: [5, 7],
    icon: BookLock,
  },
  {
    id: "rtk3",
    label: "Action creators come out the other side",
    detail:
      "counterSlice.actions.incremented is a function that returns { type: \"counter/incremented\" }. You never type an action-type string by hand, and never risk a typo between the reducer's case and the dispatch call.",
    lines: 17,
  },
  {
    id: "rtk4",
    label: "configureStore assembles the store",
    detail:
      "One store per app, built from a map of slice reducers. This also wires up Redux DevTools and a default set of middleware for you — configuring both by hand is most of what old-style Redux setup was.",
    range: [19, 21],
  },
  {
    id: "rtk5",
    label: "useSelector reads one slice of state",
    detail:
      "This component re-renders ONLY when the value returned by this exact selector changes — not on every store update, unlike a context consumer.",
    range: [23, 26],
    icon: MonitorSmartphone,
  },
  {
    id: "rtk6",
    label: "useDispatch sends an action, nothing else",
    detail:
      "This component calls useDispatch but never useSelector, so it isn't subscribed to any store value and never re-renders when the count changes. Reading and dispatching are two completely separate subscriptions.",
    range: [28, 37],
  },
  {
    id: "rtk7",
    label: "Provider makes the store available below it",
    detail:
      "Every useSelector and useDispatch call anywhere under this Provider reaches the same single store — exactly like Context, but with the selective re-rendering Context doesn't have.",
    range: [39, 46],
  },
]

const zustandExample = `
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// No <Provider> anywhere — these two components aren't
// related to each other at all, yet they share one store.
function CounterDisplay() {
  const count = useCounterStore((state) => state.count);
  return <p>Count: {count}</p>;
}

function CounterButtons() {
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <CounterDisplay />
      <CounterButtons />
    </div>
  );
}

render(<App />);
`

const rtkLiveDemo = `
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => { state.value += 1; },
    decremented: (state) => { state.value -= 1; },
    reset: (state) => { state.value = 0; },
  },
});

const { incremented, decremented, reset } = counterSlice.actions;

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

function CounterDisplay() {
  const count = useSelector((state) => state.counter.value);
  const renderCount = useRef(0);
  renderCount.current += 1;
  return (
    <div>
      <p style={{ fontSize: 24, fontWeight: 600 }}>Count: {count}</p>
      <p style={{ fontSize: 12, opacity: 0.6 }}>
        CounterDisplay renders: {renderCount.current}
      </p>
    </div>
  );
}

// Dispatch-only — never calls useSelector, so it's not subscribed to the
// store at all. Its render count should stay flat while the count changes.
function CounterButtons() {
  const dispatch = useDispatch();
  const renderCount = useRef(0);
  renderCount.current += 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => dispatch(incremented())}>+1</button>
      <button onClick={() => dispatch(decremented())}>-1</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <span style={{ fontSize: 12, opacity: 0.6 }}>
        CounterButtons renders: {renderCount.current}
      </span>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <CounterDisplay />
      <CounterButtons />
    </Provider>
  );
}

render(<App />);
`

const rtkChallengeStarter = `
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => { state.value += 1; },
    // TODO: add an "incrementedByAmount" reducer that takes the
    // amount to add from action.payload
  },
});

const { incremented } = counterSlice.actions;
// TODO: also pull "incrementedByAmount" out of counterSlice.actions

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

function CounterDisplay() {
  const count = useSelector((state) => state.counter.value);
  return <p style={{ fontSize: 24 }}>Count: {count}</p>;
}

function CounterButtons() {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => dispatch(incremented())}>+1</button>
      {/* TODO: add a button that dispatches incrementedByAmount(5) */}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <CounterDisplay />
      <CounterButtons />
    </Provider>
  );
}

render(<App />);
`

const challengeStarter = `
const useCounterStore = create((set) => ({
  count: 1,
  increment: () => set((state) => ({ count: state.count + 1 })),
  // TODO: add a "double" method that doubles the current count
}));

function App() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      {/* TODO: add a button that calls the double method */}
    </div>
  );
}

render(<App />);
`

export default function ReduxZustandLesson() {
  return (
    <>
      <p>
        Context solves "how do I avoid passing this through ten components." It doesn't solve
        "how do I manage state that changes constantly, from many places, in a way I can debug."
        That's the gap Redux and Zustand fill.
      </p>

      <AnalogyCard title="A store is a suggestion box with one clerk who follows the rulebook.">
        Nobody gets to walk up and rewrite the ledger themselves. Instead, they drop a note in the
        box describing what happened — "customer bought a coffee." Exactly one clerk (the{" "}
        <strong>reducer</strong>) reads that note and updates the ledger, always following the
        exact same rule for the exact same kind of note. Anyone can walk up and read the current
        ledger any time they want.
      </AnalogyCard>

      <h2>The core pattern</h2>
      <p>
        Every state-management library — Redux, Zustand, even React's own built-in tools —
        implements some version of this same loop. Press play and watch a click travel through
        it.
      </p>
      <StepFlowDiagram title="Store → action → reducer → update" steps={flowSteps} autoPlayMs={1400} />

      <h2>You already know this pattern</h2>
      <p>
        <code>useReducer</code> is this exact same idea, just scoped to one component instead of
        shared globally. If this looks familiar, that's the point.
      </p>
      <LiveCodeBlock code={reducerExample} />

      <Callout variant="info">
        <code>state</code>, <code>action</code>, and a function that combines them into a{" "}
        <em>new</em> state — that's the whole idea. Redux and Zustand just make this pattern
        available to your <strong>entire app</strong>, not one component.
      </Callout>

      <h2>Redux Toolkit — walked through, line by line</h2>
      <p>
        Modern Redux is <strong>Redux Toolkit</strong> (RTK) — nobody hand-writes{" "}
        <code>switch</code> statements and string action types anymore. This is the exact code
        the live demo below runs, with every part explained as you step through it.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="A Redux Toolkit counter, explained"
          filename="counterSlice.js"
          code={rtkCode}
          steps={rtkSteps}
        />
      </div>

      <h2>Now run it</h2>
      <p>
        This is real, running Redux Toolkit and react-redux — genuinely installed in this course,
        not a simulation. Both components below count their own renders, so you can see the
        selector's whole point directly: click +1 a few times and watch{" "}
        <code>CounterDisplay</code>'s render count climb while <code>CounterButtons</code>'s stays
        exactly where it started — it never calls <code>useSelector</code>, so it isn't subscribed
        to the store at all.
      </p>
      <LiveCodeBlock code={rtkLiveDemo} />

      <Callout variant="warning" title="That += is not the mutation you were warned about">
        <code>state.value += 1</code> inside a slice reducer is safe only because Redux Toolkit
        wraps every slice reducer in <strong>Immer</strong>. Immer lets you write code that{" "}
        <em>looks like</em> a direct mutation, records what you touched, and produces a real,
        brand-new state object behind the scenes — your reducer never actually mutates anything.
        Outside a <code>createSlice</code> reducer — in <code>useReducer</code>, in Zustand's{" "}
        <code>set</code>, anywhere else — this exact line would be the real bug from the Common
        Mistake section below.
      </Callout>

      <h2>Zustand — the minimal version</h2>
      <p>
        This is also real, genuinely installed Zustand. Notice what's missing compared to the
        Redux Toolkit version above: no <code>Provider</code>, no wrapping component, no{" "}
        <code>configureStore</code>. Just a hook you call from anywhere.
      </p>
      <LiveCodeBlock code={zustandExample} />

      <FanOutDiagram
        title="Any component, anywhere, can subscribe"
        rootLabel="useCounterStore"
        consumers={["CounterDisplay", "CounterButtons", "AnyOtherComponent"]}
        description={
          <>
            These don't need to be related in the component tree at all — no shared parent, no
            Provider wrapping them. Each just calls the store hook directly.
          </>
        }
      />

      <h2>So which one do you reach for?</h2>
      <p>
        Both give you selective subscriptions and a traceable way state changes — the difference
        is how much structure you want enforced versus how little ceremony you want to write.
      </p>
      <div className="not-prose overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="border-b px-3 py-2 text-left text-xs font-semibold text-foreground">Redux Toolkit</th>
              <th className="border-b px-3 py-2 text-left text-xs font-semibold text-foreground">Zustand</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Provider required, store explicit in the tree</td>
              <td className="border-b px-3 py-2">No Provider — the store lives in module scope</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Actions are named, serializable objects</td>
              <td className="border-b px-3 py-2">Store methods are just functions you call</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Redux DevTools time-travel debugging built in</td>
              <td className="border-b px-3 py-2">DevTools available via a small middleware add-on</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">RTK Query for server-state caching, built in</td>
              <td className="border-b px-3 py-2">No built-in data-fetching layer — pair with TanStack Query</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Enforced conventions — consistent across a large team</td>
              <td className="border-b px-3 py-2">Almost no ceremony — faster for a small app or team</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout variant="tip">
        Redux's structure is exactly what makes it debuggable at scale: every state change is a
        named, loggable action, and DevTools can replay your entire session action by action.
        That's worth real ceremony on a large team where "what changed the state, and why" needs
        an answer months later. Zustand trades that structure for speed of writing — a completely
        reasonable trade for a smaller app.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="mutating state directly in a plain reducer"
        wrong={`function reducer(state, action) {\n  if (action.type === "increment") {\n    state.count = state.count + 1; // mutates in place!\n    return state;\n  }\n  return state;\n}`}
        right={`function reducer(state, action) {\n  if (action.type === "increment") {\n    return { ...state, count: state.count + 1 }; // new object\n  }\n  return state;\n}`}
        explanation={
          <p>
            State changes are detected by comparing object references. Mutate the existing object
            and hand back the same reference, and nothing looks different to React (or to Redux
            DevTools' time-travel debugging, which relies on each past state being an untouched
            snapshot) — always return a brand-new object. The one exception is a Redux Toolkit
            slice reducer, where Immer makes a mutating <em>style</em> safe by generating the new
            object for you — everywhere else, including plain <code>useReducer</code> and
            Zustand's <code>set</code>, this is a real bug.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why must a plain reducer never mutate the existing state object?"
        options={[
          { id: "a", text: "It's just a style convention with no real effect" },
          { id: "b", text: "State changes are detected by comparing object references — mutating in place means nothing looks different" },
          { id: "c", text: "Mutating objects is actually faster and preferred in reducers" },
          { id: "d", text: "JavaScript doesn't allow mutating objects inside functions" },
        ]}
        correctId="b"
        explanation="Subscribers compare the previous and next state by reference (===), which is fast. Mutating the same object in place means the reference never changes, so that check reports 'nothing happened' even though it did."
      />

      <Quiz
        id="q_rtk-immer-safety"
        question="Why is state.value += 1 safe inside a Redux Toolkit slice reducer, but not inside a plain useReducer reducer?"
        options={[
          { id: "a", text: "Redux Toolkit's reducers don't actually run — they're only type definitions" },
          { id: "b", text: "createSlice wraps each reducer in Immer, which turns mutating-looking writes into a real new object" },
          { id: "c", text: "React treats Redux state differently from component state" },
          { id: "d", text: "It isn't actually safe — it's a common bug in Redux Toolkit code" },
        ]}
        correctId="b"
        explanation="Redux Toolkit's createSlice runs every reducer through Immer under the hood. Immer lets you write code that reads like a direct mutation, tracks exactly what you touched, and produces a brand-new immutable object as the actual return value — so the underlying rule (never mutate, always return new state) is still being followed, just automatically."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Add an incrementedByAmount action"
        hint={
          <p>
            In the slice:{" "}
            <code>{"incrementedByAmount: (state, action) => { state.value += action.payload; },"}</code>.
            Pull it out alongside the others:{" "}
            <code>{"const { incremented, incrementedByAmount } = counterSlice.actions;"}</code>, then{" "}
            <code>{"<button onClick={() => dispatch(incrementedByAmount(5))}>+5</button>"}</code>.
          </p>
        }
      >
        Add an <code>incrementedByAmount</code> reducer to the slice that reads the amount to add
        from <code>action.payload</code>, then add a "+5" button that dispatches it.
      </Challenge>
      <LiveCodeBlock code={rtkChallengeStarter} />

      <h2>And the same idea in Zustand</h2>
      <Challenge
        title="Add a double method"
        hint={
          <p>
            In the store: <code>{"double: () => set((state) => ({ count: state.count * 2 })),"}</code>.
            In App: <code>{"const double = useCounterStore((state) => state.double);"}</code>, then{" "}
            <code>{'<button onClick={double}>Double</button>'}</code>.
          </p>
        }
      >
        Add a <code>double</code> method to the store that doubles the current count, and a button
        that calls it.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What problem does Redux or Zustand solve that Context doesn't?"
        answer={
          <p>
            Context is purely a <strong>delivery mechanism</strong> — it moves a value down the
            tree, with no opinion about how that value changes or how updates are optimized. Every
            consumer of a context re-renders on any change to its value, because Context has no
            concept of subscribing to just a slice of it. State libraries add two things on top:{" "}
            <strong>selective subscriptions</strong> (a component using{" "}
            <code>useSelector((s) =&gt; s.counter.value)</code> only re-renders when that exact
            value changes, not when unrelated store fields do), and a{" "}
            <strong>structured, traceable update mechanism</strong> — every change flows through
            an action and a reducer, which makes state changes debuggable (Redux DevTools can
            literally replay every action) and testable independent of any component.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "State libraries add two things Context lacks: selective re-rendering and a structured, traceable way state changes.",
          "The core pattern — store, actions describing what happened, a reducer that computes new state — is the same idea as useReducer, just shared globally.",
          "Redux Toolkit's createSlice generates matching reducers and action creators together, so they can't drift out of sync.",
          "Inside a slice reducer, writes like state.value += 1 are safe because Immer converts them into a real new object — that exception does not apply anywhere else.",
          "Zustand offers the same subscription benefits as Redux with almost no boilerplate — no Provider, no action types, just a hook.",
          "Reach for Redux Toolkit's enforced structure on a large team where changes need to be traceable months later; reach for Zustand when you want the benefits with minimal ceremony.",
        ]}
      />
    </>
  )
}
