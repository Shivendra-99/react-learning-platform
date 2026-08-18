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

const rtkReference = `// What this looks like with real Redux Toolkit
// (reference only — same store/actions/reducer idea)

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => { state.count += 1; }, // ok here — RTK uses Immer
    decrement: (state) => { state.count -= 1; },
    reset: (state) => { state.count = 0; },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// <Provider store={store}><App /></Provider>
// const count = useSelector((state) => state.counter.count);
// const dispatch = useDispatch();
// dispatch(counterSlice.actions.increment());`

const flowSteps: FlowStep[] = [
  { id: "action", label: "1. User action", detail: "A click, a form submit — something happens.", icon: Inbox },
  { id: "dispatch", label: "2. dispatch(action)", detail: "A plain object describing what happened is sent to the store, e.g. { type: \"increment\" }.", icon: ClipboardCheck },
  { id: "reducer", label: "3. The reducer computes new state", detail: "A pure function: (currentState, action) => newState. Always the same rule for the same action.", icon: BookLock },
  { id: "update", label: "4. The store updates", detail: "The new state replaces the old — the store never mutates it in place.", icon: RefreshCw },
  { id: "render", label: "5. Subscribed components re-render", detail: "Only the components reading the piece of state that changed.", icon: MonitorSmartphone, tone: "success" },
]

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
        implements some version of this same loop.
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

      <h2>Zustand — the minimal version</h2>
      <p>
        This is real, running Zustand — genuinely installed in this course, not a simulation.
        Notice what's missing compared to Context: no Provider, no wrapping component. Just a
        hook you call from anywhere.
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

      <h2>Redux Toolkit, for reference</h2>
      <p>
        Modern Redux uses <strong>Redux Toolkit</strong> (RTK), not the older hand-written{" "}
        <code>switch</code> statements you may see in older tutorials. The concepts are identical
        — store, actions, a reducer — RTK just removes the boilerplate.
      </p>
      <pre className="not-prose overflow-x-auto rounded-xl border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed whitespace-pre text-gray-300">
        {rtkReference}
      </pre>

      <h2>Common mistake</h2>
      <CommonMistake
        title="mutating state directly in a reducer"
        wrong={`function reducer(state, action) {\n  if (action.type === "increment") {\n    state.count = state.count + 1; // mutates in place!\n    return state;\n  }\n  return state;\n}`}
        right={`function reducer(state, action) {\n  if (action.type === "increment") {\n    return { ...state, count: state.count + 1 }; // new object\n  }\n  return state;\n}`}
        explanation={
          <p>
            State changes are detected by comparing object references. Mutate the existing object
            and hand back the same reference, and nothing looks different to React (or to Redux
            DevTools' time-travel debugging, which relies on each past state being an untouched
            snapshot) — always return a brand-new object.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why must a reducer never mutate the existing state object?"
        options={[
          { id: "a", text: "It's just a style convention with no real effect" },
          { id: "b", text: "State changes are detected by comparing object references — mutating in place means nothing looks different" },
          { id: "c", text: "Mutating objects is actually faster and preferred in reducers" },
          { id: "d", text: "JavaScript doesn't allow mutating objects inside functions" },
        ]}
        correctId="b"
        explanation="Subscribers compare the previous and next state by reference (===), which is fast. Mutating the same object in place means the reference never changes, so that check reports 'nothing happened' even though it did."
      />

      <h2>Mini challenge</h2>
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
            <strong>selective subscriptions</strong> (a component using <code>useCounterStore((s) =&gt; s.count)</code>{" "}
            only re-renders when <code>count</code> changes, not when unrelated store fields do),
            and a <strong>structured, traceable update mechanism</strong> — every change flows
            through an action and a pure reducer, which makes state changes debuggable (Redux
            DevTools can literally replay every action) and testable independent of any component.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "State libraries add two things Context lacks: selective re-rendering and a structured, traceable way state changes.",
          "The core pattern — store, actions describing what happened, a reducer that computes new state — is the same idea as useReducer, just shared globally.",
          "Reducers must be pure: never mutate state, always return a new object.",
          "Zustand offers the same subscription benefits as Redux with almost no boilerplate — no Provider, no action types, just a hook.",
        ]}
      />
    </>
  )
}
