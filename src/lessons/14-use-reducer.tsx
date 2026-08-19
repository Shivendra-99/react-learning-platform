import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const reducerCode = `function reducer(state, action) {
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
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}`

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "r1",
    label: "The reducer is a plain function",
    detail:
      "It lives outside the component and takes the current state plus an action, then returns the next state. No hooks, no React — just data in, data out.",
    lines: 1,
  },
  {
    id: "r2",
    label: "Each action type is one case",
    detail:
      "Every way your state can change gets its own branch. Reading this switch tells you the complete list of things that can happen to count.",
    range: [2, 9],
  },
  {
    id: "r3",
    label: "Always return a NEW object",
    detail:
      "Notice `{ count: state.count + 1 }` — a fresh object, not a mutation of the old one. React compares references to decide whether to re-render.",
    lines: [4, 6],
  },
  {
    id: "r4",
    label: "Unknown actions return state unchanged",
    detail:
      "The default case is your safety net. Returning the same state object means React sees no change and skips the re-render.",
    range: [10, 11],
  },
  {
    id: "r5",
    label: "useReducer wires it to the component",
    detail:
      "You hand it the reducer and the initial state. Back comes the current state and a dispatch function — the only way to change that state.",
    lines: 16,
  },
  {
    id: "r6",
    label: "Components dispatch, they don't calculate",
    detail:
      "The button says WHAT happened (\"increment\"), not HOW to compute it. All the logic stays in one place — the reducer.",
    range: [21, 23],
  },
]

const counterDemo = `
function reducer(state, action) {
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
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p style={{ fontSize: 24, fontWeight: 600 }}>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>{" "}
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>{" "}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}

render(<Counter />);
`

const cartDemo = `
function cartReducer(cart, action) {
  switch (action.type) {
    case "add": {
      const existing = cart.find((item) => item.id === action.id);
      if (existing) {
        return cart.map((item) =>
          item.id === action.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...cart, { id: action.id, name: action.name, qty: 1 }];
    }
    case "remove":
      return cart.filter((item) => item.id !== action.id);
    case "clear":
      return [];
    default:
      return cart;
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ textAlign: "left", minWidth: 220 }}>
      <button onClick={() => dispatch({ type: "add", id: 1, name: "Apple" })}>
        Add Apple
      </button>{" "}
      <button onClick={() => dispatch({ type: "add", id: 2, name: "Bread" })}>
        Add Bread
      </button>{" "}
      <button onClick={() => dispatch({ type: "clear" })}>Clear</button>

      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} x{item.qty}{" "}
            <button onClick={() => dispatch({ type: "remove", id: item.id })}>
              remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total items: {total}</p>
    </div>
  );
}

render(<Cart />);
`

const challengeStarter = `
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    // TODO: add a "double" case that doubles the count
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 1 });

  return (
    <div>
      <p style={{ fontSize: 24 }}>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>{" "}
      <button onClick={() => dispatch({ type: "double" })}>Double</button>
    </div>
  );
}

render(<Counter />);
`

export default function UseReducerLesson() {
  return (
    <>
      <p>
        <code>useState</code> is perfect until it isn't. Once a component has five pieces of
        related state, and updating one usually means updating two others, you end up with
        scattered <code>setX</code> calls that are easy to get out of sync.{" "}
        <code>useReducer</code> collects all of those transitions into one function you can read
        top to bottom.
      </p>

      <AnalogyCard title="A reducer is a vending machine.">
        You don't reach inside and rearrange the snacks. You press a labelled button — "B4" — and
        the machine decides what that means and what comes out. Your component presses buttons
        (<code>dispatch</code>); the reducer is the machinery that knows what each button does.
        Anyone can read the button labels to learn everything the machine can do.
      </AnalogyCard>

      <h2>How the pieces fit together</h2>
      <p>
        Step through the walkthrough below. The left side explains what each part is for, and the
        matching lines light up on the right.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="Anatomy of a reducer"
          filename="Counter.jsx"
          code={reducerCode}
          steps={walkthroughSteps}
        />
      </div>

      <h2>Try it</h2>
      <p>
        Every button dispatches an action. Notice that no button computes the next count itself —
        they only announce what happened.
      </p>
      <LiveCodeBlock code={counterDemo} />

      <Callout variant="info">
        <code>useReducer</code> returns exactly two things:{" "}
        <code>[state, dispatch]</code>. Unlike <code>useState</code>'s setter,{" "}
        <code>dispatch</code> is guaranteed stable across renders — React never recreates it — so
        it's safe to leave out of dependency arrays and safe to pass to memoized children.
      </Callout>

      <h2>Where it really pays off</h2>
      <p>
        A counter is a fine way to learn the shape, but it's not a reason to reach for a reducer.
        This shopping cart is: adding an item means "increment if it's already there, otherwise
        append," and that rule lives in exactly one place.
      </p>
      <LiveCodeBlock code={cartDemo} />

      <h2>Common mistake</h2>
      <CommonMistake
        title="mutating state inside the reducer"
        wrong={`function reducer(state, action) {\n  switch (action.type) {\n    case "increment":\n      state.count = state.count + 1;\n      return state; // same object!\n    default:\n      return state;\n  }\n}\n// The UI never updates — React sees\n// the identical reference and bails out`}
        right={`function reducer(state, action) {\n  switch (action.type) {\n    case "increment":\n      return { count: state.count + 1 };\n    default:\n      return state;\n  }\n}\n// A new object every time state actually\n// changes — React re-renders`}
        explanation={
          <p>
            React decides whether to re-render by comparing the old state to the new one by
            reference. If you mutate the existing object and hand the same reference back, that
            check says "nothing changed" and your UI silently goes stale. Always build and return
            a new object or array — spread the old one, then override what changed.
          </p>
        }
      />

      <h2>useState or useReducer?</h2>
      <p>
        Neither is more advanced than the other — they solve different shapes of problem. Reach
        for <code>useReducer</code> when the next state depends on the previous one in
        non-trivial ways, when several values always change together, or when the same update
        logic is triggered from many places.
      </p>
      <Callout variant="tip" title="A quick rule of thumb">
        If you find yourself calling two or three <code>setX</code> functions inside a single
        event handler, that's the signal. Those values belong to one state object, and the
        handler is doing work a reducer should own.
      </Callout>

      <h2>Quick quiz</h2>
      <Quiz
        question="Why must a reducer return a new object instead of modifying the existing state?"
        options={[
          { id: "a", text: "Because mutating objects is slower in JavaScript" },
          { id: "b", text: "Because React compares state by reference to decide whether to re-render" },
          { id: "c", text: "Because reducers are not allowed to read the previous state" },
          { id: "d", text: "Because dispatch would throw an error otherwise" },
        ]}
        correctId="b"
        explanation="React checks whether the new state is the same object as the old one. Mutating and returning the same reference looks like 'no change', so the component never re-renders — the data is updated but the screen isn't."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Add a 'double' action"
        hint={
          <p>
            Add another case before <code>default</code>:{" "}
            <code>{'case "double": return { count: state.count * 2 };'}</code>
          </p>
        }
      >
        The "Double" button already dispatches <code>{'{ type: "double" }'}</code>, but the
        reducer has no case for it — so it falls through to <code>default</code> and nothing
        happens. Add the missing case.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="When would you choose useReducer over useState?"
        answer={
          <p>
            When state transitions get complex enough that scattering them across handlers
            becomes a liability. Concretely: when the next state depends on the previous one,
            when multiple values must change together atomically, or when the same transition is
            triggered from several places in the tree. A reducer centralises every transition in
            one pure function, which makes the full set of possible updates readable in one
            place and trivially unit-testable without rendering anything. It also gives you a
            stable <code>dispatch</code> reference, which avoids invalidating memoized children
            or dependency arrays — a common problem when passing setter callbacks down. For a
            single independent value, <code>useState</code> is simpler and should stay the
            default.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "A reducer is a plain function: (state, action) => newState. It lives outside the component and never touches React.",
          "Components dispatch actions describing WHAT happened; the reducer decides HOW state changes.",
          "Always return a new object or array — mutating and returning the same reference means React skips the re-render.",
          "The dispatch function is stable across renders, so it's safe in dependency arrays and with memoized children.",
          "Reach for useReducer when values change together or the next state depends on the previous one; useState stays the default for single independent values.",
        ]}
      />
    </>
  )
}
