/**
 * The standalone interview question bank powering /interview-questions.
 *
 * `answer` is a plain string rather than JSX for two reasons: it doubles as the
 * text for the FAQPage structured data, and it stays searchable. Wrap an
 * identifier in backticks to have it rendered as inline code.
 *
 * `points`, `code`, and `table` are optional extras rendered below the prose —
 * use them where a list, a snippet, or a side-by-side comparison genuinely
 * explains more than another paragraph would.
 */

export type InterviewCategory =
  | "fundamentals"
  | "hooks"
  | "state"
  | "performance"
  | "advanced"
  | "react19"
  | "practical"
  | "coding"

export const INTERVIEW_CATEGORIES: Record<InterviewCategory, string> = {
  fundamentals: "Fundamentals",
  hooks: "Hooks",
  state: "State Management",
  performance: "Performance",
  advanced: "Advanced",
  react19: "React 19",
  practical: "Practical & Tooling",
  coding: "Coding Round",
}

export interface ComparisonTable {
  columns: [string, string]
  rows: Array<[string, string]>
}

export interface CodeSample {
  caption?: string
  snippet: string
}

export interface InterviewQuestionEntry {
  id: string
  category: InterviewCategory
  question: string
  /** the spoken answer — also used verbatim for FAQPage structured data */
  answer: string
  /** supporting bullets, shown under the prose */
  points?: string[]
  code?: CodeSample
  table?: ComparisonTable
  /** slug of the lesson that covers this in depth, if there is one */
  related?: string
}

export const interviewQuestions: InterviewQuestionEntry[] = [
  // ---------------------------------------------------------------- fundamentals
  {
    id: "what-is-react",
    category: "fundamentals",
    question: "What is React, and what problem does it actually solve?",
    answer:
      "React is a library for building user interfaces out of composable components. The problem it solves is keeping the DOM in sync with your data by hand — in a plain JavaScript app, every piece of state has to know every place in the page it affects, and forgetting one is a bug. React lets you describe the UI declaratively as a function of state, then works out the minimal set of DOM changes needed to match. That removes an entire category of 'forgot to update that bit' bugs and keeps UI code understandable as the app grows.",
    related: "what-is-react",
  },
  {
    id: "jsx",
    category: "fundamentals",
    question: "What is JSX, and why is it needed?",
    answer:
      "JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. The browser never sees it — a compiler like Babel turns it into `React.createElement()` calls that produce plain JavaScript objects describing the UI. It's needed because it makes component structure readable at a glance while still letting you embed any JavaScript expression directly in the markup. Because it compiles to ordinary expressions, JSX can go anywhere a value can: assigned to a variable, returned from a function, or stored in an array. It also explains the small differences from HTML — `className` instead of `class`, `onClick` instead of `onclick` — since you're setting object properties, not writing HTML.",
    code: {
      caption: "JSX and what it compiles to",
      snippet: `const element = <h1 className="title">Hello, {user.name}!</h1>;

// After compilation:
const element = React.createElement(
  "h1",
  { className: "title" },
  "Hello, ",
  user.name,
  "!"
);`,
    },
    related: "jsx-basics",
  },
  {
    id: "fragments",
    category: "fundamentals",
    question: "What are React Fragments, and why use them?",
    answer:
      "A Fragment groups multiple elements without adding a node to the DOM. A component must return a single parent element, and the lazy fix is to wrap everything in a `div` — but those wrappers accumulate, bloat the tree, and frequently break CSS layouts like flexbox and grid, where an unexpected element between a container and its children changes the layout entirely. The shorthand is `<>...</>`; use the long form `<React.Fragment key={id}>` when you need to pass a key, which is the one attribute a Fragment accepts and the reason the long form still exists.",
    code: {
      caption: "Shorthand, and the keyed long form",
      snippet: `function Header() {
  return (
    <>
      <h1>Hello, World!</h1>
      <p>Welcome to React!</p>
    </>
  );
}

// A key requires the long form
{items.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </React.Fragment>
))}`,
    },
    related: "jsx-basics",
  },
  {
    id: "why-react-popular",
    category: "fundamentals",
    question: "Why did React become so popular? What principles drive it?",
    answer:
      "Four ideas, and they reinforce each other. Declarative rendering means you describe what the UI should look like for a given state and React works out the DOM operations — you stop writing update instructions and the whole class of 'forgot to sync that' bugs disappears. Component composition means the unit of reuse is a self-contained piece of UI plus its logic, so applications are built by nesting components rather than by wiring templates to controllers. One-way data flow means data moves parent to child and changes are explicit, so when something is wrong there's one direction to trace. And 'just JavaScript' — no template DSL, no custom loop syntax, so any JavaScript skill transfers directly. On top of those, the practical reasons: an enormous ecosystem, React Native reusing the same mental model for mobile, and years of backwards compatibility that made it a safe long-term bet for companies.",
    points: [
      "Declarative — describe the result, not the steps to get there",
      "Component-based — composable, self-contained units of UI and behaviour",
      "One-way data flow — predictable, traceable state changes",
      "Just JavaScript — no template language to learn separately",
      "Ecosystem and longevity — libraries, tooling, React Native, stable upgrade path",
    ],
    related: "what-is-react",
  },
  {
    id: "dom-slow",
    category: "fundamentals",
    question: "What actually makes DOM manipulation slow?",
    answer:
      "The DOM itself isn't slow to touch — what's expensive is what a change triggers. Modifying a node can invalidate layout, forcing the browser to recompute the geometry of affected elements, then repaint and composite them. The real killer is layout thrashing: writing to the DOM and then immediately reading a property like `offsetHeight` forces a synchronous reflow, and doing that in a loop makes the browser recalculate layout on every iteration. Browsers normally batch changes and flush once per frame, so the fix is to batch writes and reads separately. React helps by computing all changes against its in-memory tree first and committing them in a single pass, but it's worth being clear in an interview that React doesn't make the DOM faster — it just makes fewer and better-ordered changes to it.",
    related: "what-is-react",
  },
  {
    id: "virtual-dom",
    category: "fundamentals",
    question: "What is the Virtual DOM, and how does it work?",
    answer:
      "The Virtual DOM is a lightweight in-memory description of what the UI should look like. When state changes, React builds a new tree, diffs it against the previous one, works out the minimal set of changes, and applies only those to the real DOM. It is not inherently faster than well-written manual DOM code — a hand-optimised direct update will beat it. What it buys you is near-optimal updates for free while you write straightforward declarative code, instead of hand-tuning every update path yourself.",
    code: {
      caption: "The update pipeline",
      snippet: `State / props change
        |
        v
New Virtual DOM tree (plain JS objects)
        |
        v
Diffing (compare new tree against previous)
        |
        v
Reconciliation (work out minimal set of changes)
        |
        v
Commit to the real DOM (apply only what changed)`,
    },
    related: "what-is-react",
  },
  {
    id: "class-vs-functional",
    category: "fundamentals",
    question: "What's the difference between class and functional components?",
    answer:
      "Class components are ES6 classes extending React.Component that hold state on `this.state` and run side effects in lifecycle methods. Functional components are plain functions that return JSX and use hooks for both. Before hooks arrived in React 16.8, classes were the only way to hold state, so older codebases are full of them. Since then functional components can do everything classes can, with less boilerplate and no `this` binding, and they're what all current React documentation and features target. Classes aren't deprecated and still have exactly one exclusive capability — error boundaries, which have no hook equivalent.",
    table: {
      columns: ["Class components", "Functional components"],
      rows: [
        ["ES6 class extending React.Component", "Plain function returning JSX"],
        ["State in this.state, updated via setState", "State via useState / useReducer"],
        ["Lifecycle methods (componentDidMount, etc.)", "useEffect and other hooks"],
        ["Props read from this.props", "Props received as a function argument"],
        ["Requires understanding of this binding", "No this — closures instead"],
        ["PureComponent / shouldComponentUpdate", "React.memo"],
        ["Only way to hold state before React 16.8", "Standard for all modern React"],
        ["Still required for error boundaries", "No hook equivalent for error boundaries yet"],
      ],
    },
    related: "components-props",
  },
  {
    id: "props-vs-state",
    category: "fundamentals",
    question: "What's the difference between props and state?",
    answer:
      "Props are passed in from the parent and are read-only inside the component that receives them — a component cannot change its own props. State is owned by the component, created with something like `useState`, and changing it triggers a re-render. A useful test: if the value comes from outside and the component only displays it, it's a prop; if the component itself needs to change it over time in response to interaction, it's state. Data two siblings both need usually belongs as state in their nearest common parent, passed down as props.",
    table: {
      columns: ["State", "Props"],
      rows: [
        ["Owned and managed by the component", "Passed in from the parent"],
        ["Mutable via its setter function", "Read-only inside the receiving component"],
        ["Changing it re-renders that component", "Changing it re-renders the child"],
        ["For data that changes over time", "For configuration and data from outside"],
        ["Local — not directly visible to others", "The channel for parent-to-child communication"],
      ],
    },
    related: "components-props",
  },
  {
    id: "keys",
    category: "fundamentals",
    question: "Why does React need a key when rendering a list?",
    answer:
      "Keys let React match items between renders. Without a stable key, React pairs elements by position, so inserting at the front makes it think every item changed — which throws away DOM state like input values, focus, and scroll position, and does far more work than needed. The key must be stable and unique among siblings, which is why a database id is right and the array index is usually wrong. Index keys are only safe when the list is never reordered, filtered, or inserted into.",
    related: "lists-and-keys",
  },
  {
    id: "controlled-uncontrolled",
    category: "fundamentals",
    question: "Controlled vs uncontrolled components — what's the difference?",
    answer:
      "In a controlled component React state is the single source of truth: the input's value comes from state and every keystroke goes through an onChange handler. In an uncontrolled component the DOM keeps the value and you read it when you need it, usually via a ref or from the submitted FormData. Controlled inputs are the default choice because validation, conditional disabling, and formatting-as-you-type all become straightforward. Uncontrolled inputs are simpler for large forms where you only care about values at submit time.",
    table: {
      columns: ["Controlled", "Uncontrolled"],
      rows: [
        ["React state holds the value", "The DOM holds the value"],
        ["value + onChange on every input", "defaultValue, read later via a ref"],
        ["React is the single source of truth", "The DOM is the single source of truth"],
        ["Easy live validation and formatting", "Values read on submit"],
        ["More code, fully predictable", "Less code, harder to coordinate"],
        ["Default choice in modern React", "Fine for simple or very large forms"],
      ],
    },
    related: "forms",
  },
  {
    id: "pure-components",
    category: "fundamentals",
    question: "What are pure components, and what does purity mean in React?",
    answer:
      "There are two related meanings, and interviewers often want both. A pure component in the general sense returns the same output for the same props and state and changes nothing outside itself while rendering — no mutating props, no writing to outside variables, no fetching or DOM work during render. React depends on this, because it may call your component twice, discard a render, or re-run it in Strict Mode. The second meaning is the API: `React.PureComponent` for classes and `React.memo` for functions, both of which shallowly compare props and skip the re-render when nothing changed. Note that shallow comparison is why a new object or array prop defeats them even when the contents are identical.",
    code: {
      caption: "Purity as a rule, and purity as an optimisation",
      snippet: `// Impure — mutates something outside itself during render
let renders = 0;
function Bad({ items }) {
  renders++;              // side effect during render
  items.push("extra");    // mutating a prop
  return <List items={items} />;
}

// Pure — same input, same output, no outside changes
function Good({ items }) {
  return <List items={[...items, "extra"]} />;
}

// The optimisation APIs
const MemoRow = React.memo(Row);              // function components
class PureRow extends React.PureComponent {}  // class components`,
    },
    related: "rules-of-hooks",
  },
  {
    id: "synthetic-events",
    category: "fundamentals",
    question: "What are synthetic events in React?",
    answer:
      "A SyntheticEvent is React's cross-browser wrapper around the native browser event. It exposes the same interface — `preventDefault`, `stopPropagation`, `target` — but normalises behaviour so you don't write browser-specific code. React attaches one listener at the root container rather than binding a handler to every DOM node, then dispatches through the React component tree. That delegation is why portalled content still bubbles to its JSX parent rather than its DOM parent. One historical detail worth knowing: React used to pool and reuse event objects for performance, so accessing them asynchronously gave you a cleared-out object and required `event.persist()`. Pooling was removed in React 17, so this no longer applies — but it still shows up in old answers and older Stack Overflow posts.",
    code: {
      caption: "The event is a wrapper, with the native one available",
      snippet: `function SearchForm() {
  function handleSubmit(event) {
    event.preventDefault();          // works the same in every browser
    console.log(event.target);       // the form element
    console.log(event.nativeEvent);  // the underlying browser event
  }

  return <form onSubmit={handleSubmit}>…</form>;
}`,
    },
    related: "events",
  },
  {
    id: "event-handlers",
    category: "fundamentals",
    question: "How do event handlers work in React, and how do you pass arguments?",
    answer:
      "You pass a function to a camelCased prop like `onClick` — a function reference, not a call, which is the most common beginner mistake: `onClick={handleClick()}` runs immediately during render, while `onClick={handleClick}` runs on click. To pass arguments, wrap in an arrow function so the call is deferred. Returning false doesn't prevent default behaviour as it does in plain HTML — you must call `event.preventDefault()` explicitly. In class components handlers need binding or a class field, because `this` is otherwise undefined; functional components sidestep that entirely with closures.",
    code: {
      caption: "Reference vs call, and passing arguments",
      snippet: `// Runs on click
<button onClick={handleClick}>Save</button>

// Runs immediately during render — a bug
<button onClick={handleClick()}>Save</button>

// Passing an argument: wrap so the call is deferred
<button onClick={() => handleDelete(item.id)}>Delete</button>

// Preventing default must be explicit
function handleSubmit(event) {
  event.preventDefault();
  submit();
}`,
    },
    related: "events",
  },
  {
    id: "parent-child-communication",
    category: "fundamentals",
    question: "How do you pass data from parent to child, and from child back to parent?",
    answer:
      "Parent to child is just props — the parent renders the child with values, and the child reads them read-only. Child to parent has no direct channel, because data flows one way; instead the parent passes down a callback function, and the child calls it with whatever it wants to report. The state still lives in the parent, so the parent stays the single source of truth. For siblings, lift the state to their nearest common ancestor and pass both the value and the setter down. When the chain gets long, Context or a store replaces the drilling — but callbacks remain the standard answer for one or two levels.",
    code: {
      caption: "Props down, callbacks up",
      snippet: `function Parent() {
  const [message, setMessage] = useState("");

  return (
    <>
      {/* down: a value */}
      <Display message={message} />

      {/* up: a callback the child invokes */}
      <Input onSend={(text) => setMessage(text)} />
    </>
  );
}

function Display({ message }) {
  return <p>{message}</p>;
}

function Input({ onSend }) {
  return <button onClick={() => onSend("Hello from the child")}>Send</button>;
}`,
    },
    related: "components-props",
  },
  {
    id: "lifecycle-methods",
    category: "fundamentals",
    question: "What are the lifecycle methods in class components?",
    answer:
      "They're hooks into three phases of a component's life: mounting, updating, and unmounting. Mounting runs the constructor, render, and then `componentDidMount` — the usual place for initial data fetching and subscriptions. Updating re-runs render and then `componentDidUpdate`, where you react to changed props or state, guarding against infinite loops by comparing against the previous values. Unmounting calls `componentWillUnmount`, where you tear down anything ongoing. Two more matter in practice: `shouldComponentUpdate` for skipping re-renders, and `getDerivedStateFromError` plus `componentDidCatch`, which together make a component an error boundary.",
    points: [
      "Mounting — constructor → render → componentDidMount (fetch data, subscribe)",
      "Updating — render → componentDidUpdate (respond to changed props/state)",
      "Unmounting — componentWillUnmount (clear timers, unsubscribe, abort requests)",
      "shouldComponentUpdate — return false to skip a re-render",
      "getDerivedStateFromError + componentDidCatch — makes the component an error boundary",
    ],
    related: "use-effect",
  },

  // ------------------------------------------------------------------------ hooks
  {
    id: "hooks-reference",
    category: "hooks",
    question: "What are the core React hooks, and what is each one for?",
    answer:
      "Five cover the overwhelming majority of real code. `useState` adds a piece of local state. `useEffect` synchronises a component with something outside React. `useContext` reads a context value without prop drilling. `useReducer` manages state with several related transitions. `useRef` holds a mutable value or a DOM node without triggering renders. Everything else — `useMemo`, `useCallback`, `useTransition`, `useOptimistic` — is either an optimisation or a more specialised tool you reach for once you have a specific reason.",
    points: [
      "useState — local state. const [count, setCount] = useState(0)",
      "useEffect — side effects and external synchronisation, with a cleanup return and a dependency array",
      "useContext — read a context value directly. const theme = useContext(ThemeContext)",
      "useReducer — complex or related state transitions. const [state, dispatch] = useReducer(reducer, init)",
      "useRef — mutable value or DOM node that persists across renders without causing one",
    ],
    related: "hooks-overview",
  },
  {
    id: "why-hooks",
    category: "hooks",
    question: "Why were hooks introduced?",
    answer:
      "Three problems with classes drove them. Reusing stateful logic was the big one — the only options were higher-order components and render props, both of which share logic by wrapping components, so a few of them produced deeply nested trees full of wrappers that existed purely for plumbing. Second, related code was scattered: a subscription was set up in `componentDidMount`, updated in `componentDidUpdate`, and torn down in `componentWillUnmount`, while unrelated concerns sat side by side in the same method. An effect keeps setup and teardown in one place, grouped by what it does rather than by when it fires. Third, classes themselves were friction — `this` binding, constructors, and boilerplate that confused people and machines alike, since class methods are harder to optimise and minify.",
    related: "hooks-overview",
  },
  {
    id: "rules-of-hooks",
    category: "hooks",
    question: "What are the Rules of Hooks, and why do they exist?",
    answer:
      "Hooks must be called at the top level of a component or another hook — never inside a condition, loop, or nested function — and only from React functions. The reason is that React tracks hooks by call order, not by name: it keeps an internal list per component and matches the first call to the first slot, the second to the second, and so on. Putting a hook behind an `if` changes the number or order of calls between renders, so React hands back the wrong slot's value. `use` is the one deliberate exception in React 19 and may be called conditionally.",
    related: "rules-of-hooks",
  },
  {
    id: "usestate-vs-usereducer",
    category: "hooks",
    question: "What's the difference between useState and useReducer?",
    answer:
      "`useState` updates a value directly through its setter and suits independent, simple pieces of state. `useReducer` routes every update through a reducer function that receives the current state and an action and returns the next state, which centralises the logic. Reach for a reducer when the next state depends on the previous one in non-trivial ways, when several values must change together, or when the same transition is triggered from many places. A reducer is also a plain function, so it can be unit-tested without rendering anything, and `dispatch` is guaranteed stable across renders.",
    table: {
      columns: ["useState", "useReducer"],
      rows: [
        ["Simple, independent values", "Several related values changing together"],
        ["Updated directly via the setter", "Updated by dispatching an action"],
        ["Logic spread across event handlers", "All transitions centralised in one function"],
        ["Hard to test in isolation", "Reducer is a pure function — trivially testable"],
        ["Setter identity is stable", "dispatch identity is stable too"],
        ["Less code for simple cases", "More structure that scales better"],
      ],
    },
    related: "use-reducer",
  },
  {
    id: "useeffect-cleanup",
    category: "hooks",
    question: "When exactly does an effect's cleanup function run?",
    answer:
      "In two situations: immediately before the effect runs again because a dependency changed, and once when the component unmounts. It exists so anything ongoing — a timer, a subscription, an event listener, a socket — can be torn down before a replacement is set up. Skipping cleanup is how you end up with duplicate intervals, listeners stacking on every render, and state updates fired at unmounted components.",
    code: {
      caption: "Setup and teardown kept symmetrical",
      snippet: `useEffect(() => {
  const timer = setInterval(() => console.log("Tick"), 1000);

  // Runs before the next effect, and on unmount
  return () => clearInterval(timer);
}, []);`,
    },
    related: "use-effect",
  },
  {
    id: "unmount-late-response",
    category: "hooks",
    question: "What happens if a component unmounts before its API call finishes — is that a memory leak?",
    answer:
      "It used to look like one. In React 16 and 17, calling a state setter after unmount printed a console warning — 'Can't perform a React state update on an unmounted component' — and that warning is where the memory-leak framing comes from. React 18 removed it: a stale setState call after unmount is now a harmless no-op, and there's no actual memory being retained by the call itself. The real reasons to still cancel the request are different and better: a wasted network request that nobody will ever see the result of, and — the more important one — a genuine race condition. If a fast second request can resolve before a slow first one, the first response can land after the second and overwrite newer data with stale data, with no unmount involved at all. AbortController fixes both: pass its signal to fetch, and cancel it in the effect's cleanup function.",
    code: {
      caption: "Cancelling on unmount — and on every re-run",
      snippet: `useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/users/\${id}\`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });

  // Runs on unmount, AND before the effect re-runs for a new id —
  // that second case is what actually prevents the race condition
  return () => controller.abort();
}, [id]);`,
    },
    related: "fetching-data",
  },
  {
    id: "dependency-array",
    category: "hooks",
    question: "What's the difference between omitting the dependency array, passing [], and listing values?",
    answer:
      "Omitting it entirely runs the effect after every render. Passing an empty array runs it once after the first render, cleaning up on unmount. Listing values runs it after the first render and again whenever any listed value changes. The array is not a timing control — it's a declaration of what the effect reads. Leaving out something the effect actually uses gives you a stale closure, where the effect keeps seeing the value from the render that created it.",
    code: {
      caption: "The three forms",
      snippet: `// After every render
useEffect(() => {
  console.log("rendered");
});

// Once, after mount
useEffect(() => {
  console.log("mounted");
}, []);

// After mount, then whenever count changes
useEffect(() => {
  console.log("count is now", count);
}, [count]);`,
    },
    related: "use-effect",
  },
  {
    id: "lifecycle-with-hooks",
    category: "hooks",
    question: "How do you replicate class lifecycle methods with hooks?",
    answer:
      "All three phases collapse into `useEffect`, with the dependency array deciding which one you get. An empty array behaves like `componentDidMount`, a populated array like `componentDidUpdate`, and the returned cleanup function like `componentWillUnmount`. The mapping isn't perfectly one-to-one, and the difference matters: an effect with dependencies also runs after the first render, whereas `componentDidUpdate` does not. The better mental model is to stop thinking in lifecycles altogether — an effect describes synchronisation with something external, and the dependency array says what it depends on.",
    code: {
      caption: "The three mappings",
      snippet: `// componentDidMount
useEffect(() => {
  fetchData();
}, []);

// componentDidUpdate — but note this also runs on mount
useEffect(() => {
  console.log("userId changed");
}, [userId]);

// componentWillUnmount
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);`,
    },
    related: "use-effect",
  },
  {
    id: "useeffect-usecases",
    category: "hooks",
    question: "What are the legitimate use cases for useEffect?",
    answer:
      "Effects exist to synchronise a component with something outside React. That means subscriptions and event listeners on window or document, timers, manually controlling a non-React widget like a map or chart library, logging and analytics, and — historically — data fetching. The more useful half of the answer is what does not belong in an effect: transforming data for rendering (just compute it during render, memoizing only if it's expensive), responding to a user event (that belongs in the handler that caused it), and syncing one piece of state to another, which causes an extra render pass and usually means the second value should have been derived rather than stored. Modern React also prefers a framework loader or a library like TanStack Query over hand-rolled fetching effects.",
    points: [
      "Yes — subscriptions, event listeners, timers, sockets",
      "Yes — integrating a non-React library that owns its own DOM",
      "Yes — logging, analytics, syncing to localStorage or document.title",
      "No — transforming props/state for display; compute during render instead",
      "No — reacting to a user action; put that in the event handler",
      "No — copying one state value into another; derive it instead",
    ],
    related: "use-effect",
  },
  {
    id: "useeffect-infinite-loop",
    category: "hooks",
    question: "What causes an infinite loop in useEffect, and how do you fix it?",
    answer:
      "The loop is always the same shape: the effect updates state, the state update re-renders, and the re-render re-runs the effect. There are three common triggers. First, no dependency array at all combined with a `setState` inside — it runs after every render, forever. Second, an object, array, or function in the dependency array that's recreated every render, so the reference comparison always says 'changed' even when the contents are identical. Third, setting state to a new object each time, so even a correct dependency list keeps seeing a new value. Fixes in order of preference: remove the effect entirely if the value can just be derived during render; otherwise add a correct dependency array, memoize the offending object with `useMemo` or the function with `useCallback`, or depend on a primitive like `user.id` rather than the whole `user` object.",
    code: {
      caption: "Three loops and their fixes",
      snippet: `// 1. No dependency array + setState → runs forever
useEffect(() => {
  setCount(count + 1);
});                       // fix: add [] or remove the effect

// 2. Object recreated every render → always "changed"
const options = { pageSize: 10 };
useEffect(() => {
  fetchData(options);
}, [options]);            // fix: useMemo, or depend on options.pageSize

// 3. Depend on a primitive rather than the object
useEffect(() => {
  loadProfile(user.id);
}, [user.id]);            // stable across renders`,
    },
    related: "use-effect",
  },
  {
    id: "state-vs-ref",
    category: "hooks",
    question: "What's the difference between state and a ref?",
    answer:
      "Both persist across renders; the difference is whether changing them re-renders. Updating state schedules a re-render and the new value is visible on the next one. Updating `ref.current` mutates immediately, is visible right away, and never triggers a render. So the rule is simple: if the UI displays it, it's state; if it's bookkeeping the UI doesn't show — a timer id, the previous value, whether a request should be ignored, a DOM node — it's a ref. The classic bug is using a ref for something rendered: the value updates correctly but the screen never changes, which looks baffling until you remember refs don't notify React.",
    table: {
      columns: ["State (useState)", "Ref (useRef)"],
      rows: [
        ["Changing it triggers a re-render", "Changing it never triggers a re-render"],
        ["New value visible on the next render", "New value visible immediately"],
        ["Treated as immutable — replace via setter", "Mutable — assign to .current directly"],
        ["Snapshotted per render", "One object shared across all renders"],
        ["For anything the UI displays", "For bookkeeping the UI doesn't display"],
        ["Cannot be read/written during render safely", "Also must not be written during render"],
      ],
    },
    related: "use-ref",
  },
  {
    id: "usememo-vs-usecallback",
    category: "hooks",
    question: "What's the difference between useMemo and useCallback?",
    answer:
      "Both take a function and a dependency array, and both cache across renders — but `useMemo` caches the return value of calling the function, while `useCallback` caches the function itself without calling it. `useCallback(fn, deps)` is exactly equivalent to `useMemo(() => fn, deps)`. Reach for `useMemo` when a calculation is genuinely expensive, and for `useCallback` when you need a stable function reference — usually to avoid breaking a dependency array or to stop a `React.memo` child re-rendering. Neither prevents anything on its own; they only pay off when something downstream compares by reference.",
    code: {
      caption: "Caching a value vs caching a function",
      snippet: `// Caches the RESULT of the computation
const sorted = useMemo(
  () => hugeList.slice().sort(compare),
  [hugeList]
);

// Caches the FUNCTION itself
const handleSelect = useCallback(
  (id) => setSelected(id),
  []
);`,
    },
    related: "use-callback",
  },
  {
    id: "useref-uses",
    category: "hooks",
    question: "What are the two things useRef is used for?",
    answer:
      "First, getting a handle on a DOM node — attaching it via the `ref` attribute so you can focus an input, measure an element, or play a video. Second, storing a mutable value that should survive re-renders without causing one, such as a timer id, a previous value, or a flag. The defining property is that writing to `ref.current` never triggers a render, which is exactly why it's wrong for anything the UI displays: the value changes but the screen doesn't update.",
    related: "use-ref",
  },
  {
    id: "custom-hooks",
    category: "hooks",
    question: "What is a custom hook, and what does it actually share?",
    answer:
      "A custom hook is just a function whose name starts with 'use' and which calls other hooks. It shares stateful logic, not state itself — each component calling `useFetch()` gets its own independent state, exactly as if it had written the hook's body inline. That distinction matters in interviews: people often assume a custom hook creates shared state across components, which is what Context or a store is for. Custom hooks are for reusing behaviour, not for sharing a single value.",
    code: {
      caption: "Extracting fetch logic into a reusable hook",
      snippet: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
          setLoading(false);
        }
      });

    // Guards against an earlier request resolving last
    return () => { ignore = true; };
  }, [url]);

  return { data, loading };
}`,
    },
    related: "custom-hooks",
  },
  {
    id: "strict-mode-double",
    category: "hooks",
    question: "Why does my effect run twice in development?",
    answer:
      "Strict Mode intentionally mounts, unmounts, and remounts each component once in development, which runs effects twice. It's a diagnostic: an effect that breaks under double invocation is an effect missing cleanup, and that same bug would appear in production as a duplicated subscription or leaked timer. The fix is never to disable Strict Mode or add a 'has run' ref — it's to write the cleanup function so setup and teardown are symmetrical. This does not happen in production builds.",
    related: "use-effect",
  },

  // ------------------------------------------------------------------ state mgmt
  {
    id: "prop-drilling",
    category: "state",
    question: "What is prop drilling, and how do you avoid it?",
    answer:
      "Prop drilling is passing a value down through components that don't use it themselves, purely to reach something deeper. It's noisy and makes refactoring painful, because every intermediate component's signature mentions data it doesn't care about. Worth saying in an interview: two or three levels is usually fine and not automatically a problem worth solving — reaching for a global store to avoid passing one prop through one layer is the more common mistake.",
    points: [
      "Restructure first — move state closer to where it's actually used",
      "Component composition — pass elements as children so data never traverses the middle",
      "Context API — for genuinely global, low-frequency values like theme, locale, or current user",
      "A store (Zustand, Redux) — when many unrelated parts read overlapping slices that change often",
      "TanStack Query or SWR — for server data, fetch in the component that needs it instead of drilling",
    ],
    related: "context-api",
  },
  {
    id: "context-rerenders",
    category: "state",
    question: "Why does Context cause performance problems, and when does it matter?",
    answer:
      "Every consumer of a context re-renders whenever the provider's value changes, regardless of whether it uses the part that changed. The classic mistake is passing a fresh object literal as the value, which creates a new reference on every provider render and so re-renders every consumer every time. Memoize the value, and split unrelated concerns into separate contexts rather than one large object. It only genuinely matters for values that change often — a theme that changes twice a session is not a performance problem.",
    code: {
      caption: "The object-literal trap",
      snippet: `// New object every render — every consumer re-renders
<ThemeContext.Provider value={{ theme, toggle }}>

// Stable until theme actually changes
const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
<ThemeContext.Provider value={value}>`,
    },
    related: "context-api",
  },
  {
    id: "context-vs-redux",
    category: "state",
    question: "Context API or a state library like Redux/Zustand?",
    answer:
      "Context is a dependency injection mechanism, not a state manager — it moves a value down the tree without re-plumbing props, and that's all. It suits low-frequency, widely-read values: theme, locale, authenticated user. A store earns its place when state updates frequently, when many unrelated parts read overlapping slices, or when you want selector-based subscriptions so only components reading the changed slice re-render. Zustand gets you that with far less ceremony than Redux; Redux's advantage is convention, middleware, and tooling at large team scale.",
    table: {
      columns: ["Context API", "Redux / Zustand"],
      rows: [
        ["Built into React, no dependency", "External library and setup"],
        ["Dependency injection — moves a value down", "Full state container with defined update flow"],
        ["Every consumer re-renders on any change", "Selector subscriptions — only affected components re-render"],
        ["Best for low-frequency global values", "Best for frequently-changing shared state"],
        ["Minimal API to learn", "More concepts; Redux Toolkit cuts the boilerplate"],
        ["Limited debugging tooling", "DevTools with time-travel and action logs"],
      ],
    },
    related: "redux-zustand",
  },
  {
    id: "redux-basics",
    category: "state",
    question: "What is Redux, and how does it integrate with React?",
    answer:
      "Redux is a predictable state container built on three ideas: a single store holding all state, actions that describe what happened, and reducers — pure functions that take the current state and an action and return the next state. Updates always flow one way, which makes them traceable and enables time-travel debugging. React integrates through react-redux: a `Provider` puts the store in context, `useSelector` reads a slice and subscribes to just that slice, and `useDispatch` sends actions. Two things worth saying: Redux Toolkit is the current standard and removes most of the boilerplate Redux was criticised for, and much of what apps used Redux for was really server-state caching, which TanStack Query handles better.",
    code: {
      caption: "The react-redux wiring",
      snippet: `import { Provider, useSelector, useDispatch } from "react-redux";

<Provider store={store}>
  <App />
</Provider>;

function Counter() {
  // Subscribes to this slice only
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({ type: "counter/increment" })}>
      {count}
    </button>
  );
}`,
    },
    related: "redux-zustand",
  },
  {
    id: "global-state",
    category: "state",
    question: "How do you manage global state in React?",
    answer:
      "Start by questioning whether the state is really global — most state people reach for a store to hold is either server data or belongs to one screen. Once that's settled there are three tiers. Context suits low-frequency values read in many places: theme, locale, current user. A client-state store like Zustand or Redux Toolkit suits state that changes often and is read by unrelated parts of the tree, because selector subscriptions mean only components reading the changed slice re-render. And server data — anything fetched from an API — belongs in TanStack Query rather than any of the above, since what you actually need there is caching, deduplication, background refetching, and staleness, not a place to put a variable. The most common architectural mistake is putting API responses in Redux and hand-writing all of that cache logic yourself.",
    points: [
      "Local useState first — most state isn't global",
      "Context — theme, locale, auth user; values that rarely change",
      "Zustand / Redux Toolkit — frequently-changing state shared across unrelated components",
      "TanStack Query or SWR — anything that came from a server",
      "URL / search params — filters, tabs, and pagination that should survive a refresh or be shareable",
    ],
    related: "redux-zustand",
  },
  {
    id: "lifting-state",
    category: "state",
    question: "What does 'lifting state up' mean?",
    answer:
      "Moving state to the nearest common ancestor of the components that need it, then passing it down as props along with any functions needed to change it. It's the standard answer to two siblings needing to stay in sync — instead of duplicating the value in both and trying to keep them matched, one owner holds it and both read from that owner. The trade-off is that the parent re-renders on every change, which is why you don't lift state higher than it actually needs to go.",
    code: {
      caption: "One owner, two consumers",
      snippet: `function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Controls count={count} setCount={setCount} />
      <Display count={count} />
    </>
  );
}

function Controls({ count, setCount }) {
  return <button onClick={() => setCount(count + 1)}>Increment</button>;
}

function Display({ count }) {
  return <p>Count is: {count}</p>;
}`,
    },
    related: "components-props",
  },
  {
    id: "state-async",
    category: "state",
    question: "Why doesn't state update immediately after I call the setter?",
    answer:
      "Because the setter schedules a re-render rather than mutating a variable. The `count` in the current render is a constant captured by that render's closure — it will never change value, no matter what you do. React batches updates and renders again with the new value. This is why calling `setCount(count + 1)` three times in one handler increments by one, and why the functional form `setCount(c => c + 1)` increments by three: the updater receives the latest pending value instead of the stale captured one.",
    related: "state",
  },

  // ---------------------------------------------------------------- performance
  {
    id: "rerender-triggers",
    category: "performance",
    question: "What triggers a re-render, and how does React decide what to update?",
    answer:
      "Exactly three things cause a component to re-render: its own state changes, its parent re-renders, or a context it consumes changes. Props changing is not separately a trigger — props only change because the parent re-rendered. 'Re-render' means React calls the component function again to produce a new element tree; it does not mean touching the DOM. React then reconciles that tree against the previous one and commits only the actual differences. That's the distinction interviewers listen for: a re-render is cheap by itself, and the cost only appears when there are many of them or the render body does expensive work. So you optimise by cutting unnecessary renders — `React.memo`, stable references via `useCallback` and `useMemo`, keeping state local so fewer components sit below it — but only after profiling shows it matters.",
    points: [
      "Its own state changed (setState / dispatch)",
      "Its parent re-rendered — so every child function runs again by default",
      "A context it consumes got a new value",
      "Re-render = the function runs again; the DOM is only touched where output actually differs",
    ],
    related: "rerenders-and-memo",
  },
  {
    id: "why-child-rerenders",
    category: "performance",
    question: "Why does a child re-render when its parent does, even if its props didn't change?",
    answer:
      "By default rendering a parent means calling every child's function again — React doesn't compare props unless you ask it to. That's usually fine, because rendering is just running a function and diffing the result. `React.memo` opts a component into a shallow props comparison so it can bail out early. The catch is that inline objects, arrays, and functions create new references on every parent render, so a memoized child still re-renders unless those are stabilised with `useMemo` or `useCallback`.",
    related: "rerenders-and-memo",
  },
  {
    id: "react-memo",
    category: "performance",
    question: "What does React.memo do, and when is it counterproductive?",
    answer:
      "It wraps a component so React shallowly compares new props against previous ones and skips the re-render when they're all equal. It's counterproductive when the comparison costs more than the render it saves — cheap components that render often — or when props change every time anyway, in which case you've added a comparison for no benefit. It's also useless if the parent passes new object or function references each render, which is the most common reason people say it 'doesn't work'.",
    code: {
      caption: "memo only helps with stable references",
      snippet: `const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }) {
  // Without useCallback, this is a new function every
  // render and every memoized Row re-renders anyway
  const onSelect = useCallback((id) => console.log(id), []);

  return items.map((item) => (
    <Row key={item.id} item={item} onSelect={onSelect} />
  ));
}`,
    },
    related: "rerenders-and-memo",
  },
  {
    id: "react-memo-comparison",
    category: "performance",
    question: "How does React.memo's prop comparison actually work?",
    answer:
      "It's a shallow comparison — React checks each prop with Object.is against its previous value, one level deep, not a deep equality check. For primitives (strings, numbers, booleans) that comparison is by value, so passing the number 5 twice in a row always counts as 'unchanged'. For objects, arrays, and functions it's by reference, so two objects with identical contents still count as 'changed' if they're not the literal same object in memory. That's the entire explanation behind the classic 'I wrapped it in memo but it still re-renders' complaint: a prop like `user={{ name }}` or `onClick={() => ...}` written inline creates a brand-new object or function on every parent render, so the reference comparison reports a change every single time even though nothing meaningful is different.",
    code: {
      caption: "Same values, different verdicts",
      snippet: `const Row = React.memo(function Row({ id, config }) {
  console.log("rendered");
  return <li>{id}</li>;
});

// id is a primitive — compared by value.
// Passing 5 twice in a row: memo skips the re-render.
<Row id={5} config={stableConfig} />

// config is an object literal created fresh on every
// parent render — compared by reference. Even with
// identical { theme: "dark" } contents each time,
// memo sees a "new" object and re-renders anyway.
<Row id={5} config={{ theme: "dark" }} />`,
    },
    related: "rerenders-and-memo",
  },
  {
    id: "optimize-checklist",
    category: "performance",
    question: "How do you optimize the performance of a React application?",
    answer:
      "Measure first — the honest answer to this question starts by refusing to guess. Profile with React DevTools to find what actually re-renders and what it costs, then apply the specific fix. Broadly the wins fall into three buckets: render less often (memoization, stable references, keeping state local), render less at once (virtualisation, pagination), and ship less code (code splitting, lazy loading, a production build). Applying memoization everywhere before profiling reliably makes codebases slower and harder to read, so treat the list below as a menu, not a checklist to apply wholesale.",
    table: {
      columns: ["Common problem", "What to do instead"],
      rows: [
        ["Wrapping everything in extra divs", "Use Fragments to keep the DOM tree flat"],
        ["Inline functions passed to memoized children", "Stabilise with useCallback"],
        ["Inline objects/arrays recreated each render", "Memoize with useMemo"],
        ["One large bundle loaded upfront", "Code split with lazy() and Suspense"],
        ["Everything re-renders on any change", "React.memo on expensive, stable-prop components"],
        ["Global state for values used in one place", "Keep state local; lift only when shared"],
        ["Rendering thousands of rows directly", "Virtualise with TanStack Virtual or react-window"],
        ["Expensive computation inside render", "Move it out, or cache it with useMemo"],
        ["Large unoptimised images", "Compress, lazy-load, serve responsive sizes"],
        ["Effects without cleanup", "Always return a teardown to avoid leaks"],
        ["Benchmarking a dev build", "Measure a production build — dev adds heavy checks"],
      ],
    },
    related: "rerenders-and-memo",
  },
  {
    id: "find-perf-problems",
    category: "performance",
    question: "How do you actually find a performance problem in a React app?",
    answer:
      "Measure before changing anything. The React DevTools Profiler records a session and shows which components rendered, how long each took, and why it re-rendered — that last part usually identifies the problem directly. The 'Highlight updates' option makes unnecessary re-renders visible as you interact. Beyond React, the browser's Performance panel shows whether time is going to your components at all or to layout, network, or a third-party script. Reaching for `memo` before profiling is how codebases end up slower and harder to read.",
    related: "rerenders-and-memo",
  },
  {
    id: "code-splitting",
    category: "performance",
    question: "What are code splitting and lazy loading, and how do you do them in React?",
    answer:
      "Code splitting breaks the bundle into chunks; lazy loading fetches a chunk only when it's actually needed. They're two halves of the same optimisation — splitting creates the chunks, lazy loading defers them. In React that's `lazy(() => import('./Thing'))` paired with a `<Suspense>` boundary for the loading state. Route level is the natural boundary since users rarely visit every route, and it's also worth splitting heavy components behind an interaction — a rich text editor or charting library in a modal. Bundlers handle the actual splitting automatically once they see the dynamic import.",
    code: {
      caption: "Splitting at the route level",
      snippet: `import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));

<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Suspense>;`,
    },
    related: "code-splitting",
  },
  {
    id: "long-lists",
    category: "performance",
    question: "How would you render a list of ten thousand rows?",
    answer:
      "Virtualisation — only render the rows currently visible plus a small buffer, and recycle them as the user scrolls. Libraries like TanStack Virtual or react-window handle the measurement and positioning. The reason it matters is that the cost is in the DOM nodes rather than in React: ten thousand rows means ten thousand sets of elements the browser has to lay out, style, and paint. Pagination or infinite scroll are the other valid answers, and are often better product decisions than showing ten thousand rows at all.",
  },
  {
    id: "pagination-vs-infinite-scroll",
    category: "performance",
    question: "What's the difference between pagination and infinite scroll, and how do you choose?",
    answer:
      "Both exist to avoid rendering a huge list at once, and both are compatible with virtualisation on top — they're not an alternative to it, they're an alternative to each other for how the user requests more data. Pagination shows a fixed page and waits for an explicit action — clicking 'Next' or a page number — which gives the user a stable, bookmarkable, shareable position ('page 3') and a sense of total size ('142 results'). Infinite scroll fetches the next batch automatically as the user nears the bottom, which reads as more effortless but loses that stable position — there's no honest way to bookmark or return to 'partway down an infinite scroll,' and a footer becomes unreachable or has to be handled specially. Pick pagination for data people search, reference, or need to return to a specific position in — admin tables, search results, order history. Pick infinite scroll for content meant to be consumed as a continuous stream — a social feed, a photo grid — where position doesn't matter and momentum does.",
    table: {
      columns: ["Pagination", "Infinite scroll"],
      rows: [
        ["User explicitly requests the next page", "Next batch loads automatically near the bottom"],
        ["Bookmarkable, shareable position (page 3)", "No stable position to return to"],
        ["Shows total size — '142 results'", "Total size is often unknown or irrelevant"],
        ["Footer stays reachable", "Footer can become unreachable without special handling"],
        ["Best for search results, tables, order history", "Best for feeds and continuous browsing"],
      ],
    },
    related: "lists-and-keys",
  },
  {
    id: "debounce-vs-throttle",
    category: "performance",
    question: "What's the difference between debounce and throttle, and when do you use each?",
    answer:
      "Both limit how often a function runs in response to a rapid-fire event, but they wait for different things. Debounce waits for a pause — it keeps pushing the call back on every new event, and only actually runs once the events stop for a given delay. That's exactly right for a search box: firing a request on every keystroke wastes calls on states the user is about to type past anyway, and debouncing waits until they've actually stopped typing. Throttle runs at most once per fixed interval regardless of how many events fire in between, which fits a continuous stream you need to sample rather than wait out — a scroll handler, a resize handler, a drag. Debouncing a scroll handler would mean it never fires at all while the user keeps scrolling, which is usually the wrong behaviour.",
    code: {
      caption: "Same shape, different trigger condition",
      snippet: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
// Search box: only fires after typing stops for 300ms
const debouncedSearch = debounce(runSearch, 300);

function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
// Scroll handler: fires at most once every 200ms,
// no matter how many scroll events fire in between
const throttledOnScroll = throttle(updatePosition, 200);`,
    },
    related: "use-effect",
  },

  // ------------------------------------------------------------------- advanced
  {
    id: "react-fiber",
    category: "advanced",
    question: "What is React Fiber, and why was it introduced?",
    answer:
      "Fiber is the rewrite of React's core reconciliation algorithm that shipped in React 16. The old reconciler walked the tree recursively and could not be interrupted once it started, so a large update blocked the main thread and the page froze — no typing, no scrolling, until it finished. Fiber restructures the work into a linked list of units that React can pause, resume, abandon, and prioritise. That's the foundation everything concurrent is built on: Suspense, transitions, and automatic batching all depend on being able to interrupt rendering. Most developers never touch Fiber directly, but it's why `useTransition` can abandon a half-finished render when you keep typing.",
    related: "transitions",
  },
  {
    id: "error-boundaries",
    category: "advanced",
    question: "What is an error boundary, and what can't it catch?",
    answer:
      "A component that catches JavaScript errors thrown while rendering its subtree and shows fallback UI instead of unmounting the whole app. It has to be a class component, since there's still no hook equivalent — `getDerivedStateFromError` sets the fallback state and `componentDidCatch` logs the error. It does not catch errors in event handlers, in asynchronous code like setTimeout or promise callbacks, in server-side rendering, or in the boundary itself — those need ordinary try/catch. Structurally it's the mirror of Suspense: one catches 'this failed', the other catches 'this isn't ready'.",
    code: {
      caption: "The minimum viable boundary",
      snippet: `class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return <p>Something went wrong.</p>;
    return this.props.children;
  }
}`,
    },
    related: "error-boundaries",
  },
  {
    id: "portals",
    category: "advanced",
    question: "What are portals for, and what surprises people about them?",
    answer:
      "A portal renders a component's DOM into a different part of the document while keeping it in the same place in the React tree. It exists to escape CSS containment — a parent with `overflow: hidden`, a transform, or a stacking context will clip or trap children no matter what z-index you set, which breaks modals, dropdowns, and tooltips. The surprise is that only DOM placement changes: context still flows in, and React events still bubble through the React tree rather than the DOM tree, so a click inside a portalled dropdown fires handlers on the JSX parent that rendered it.",
    related: "portals",
  },
  {
    id: "suspense",
    category: "advanced",
    question: "What does Suspense do, and where should boundaries go?",
    answer:
      "It declaratively handles the 'not ready yet' state of a subtree: when a descendant suspends during render, React renders the nearest Suspense boundary's fallback instead, then retries once the work resolves. Placement is the whole design decision — a single boundary at the root makes the page all-or-nothing, gated by its slowest component, while boundaries around each fetching region let the page fill in progressively. Fallbacks should mirror the real layout rather than showing a bare spinner, so content doesn't jump when it lands.",
    related: "suspense",
  },
  {
    id: "reconciliation",
    category: "advanced",
    question: "How does reconciliation work in React?",
    answer:
      "React compares the newly returned element tree with the previous one and works out the minimal set of DOM operations. A full tree diff would be prohibitively expensive, so it uses two heuristics: if an element's type changes, the old subtree is torn down and rebuilt rather than compared, and within a list, elements are matched by key. Those heuristics explain a lot of real behaviour — why changing a component's type resets all of its state, why conditionally rendering two different components loses everything between them, and why unstable keys destroy and recreate rows instead of moving them.",
    related: "lists-and-keys",
  },
  {
    id: "hoc",
    category: "advanced",
    question: "What are Higher-Order Components, and should you still use them?",
    answer:
      "A higher-order component is a function that takes a component and returns a new one wrapping it with extra props or behaviour — the pattern used for cross-cutting concerns like authentication, logging, or injecting store data. Along with render props, it was how stateful logic was shared before hooks. Both work, but they share logic by adding layers to the tree, so nesting a few gives you deeply indented JSX and a hierarchy full of wrappers that exist purely for plumbing. Custom hooks share the same logic without touching the tree, which is why they're the default now. You'll still meet HOCs in older codebases and in libraries — react-redux's `connect` is the classic example.",
    code: {
      caption: "An HOC that injects behaviour",
      snippet: `function withLogger(WrappedComponent) {
  return function WithLogger(props) {
    useEffect(() => {
      console.log("Rendered with:", props);
    }, [props]);

    return <WrappedComponent {...props} />;
  };
}

const GreetingWithLogger = withLogger(Greeting);

// The modern equivalent is usually just a custom hook:
// function Greeting(props) { useLogger(props); ... }`,
    },
    related: "custom-hooks",
  },

  {
    id: "render-props",
    category: "advanced",
    question: "What is the render prop pattern?",
    answer:
      "A component takes a function as a prop — often `children` itself — and calls it with the data it manages, letting the caller decide what to render. The component owns the logic; the consumer owns the markup. It solved the same problem HOCs did, sharing stateful logic, but with two advantages: the data flow is explicit because you can see exactly what's being passed at the call site, and there's no prop-name collision from an invisible wrapper injecting things. The downsides are nesting — several render props produce a pyramid of callbacks — and that a new inline function is created every render. Custom hooks replaced it for most logic sharing, but render props are still the right tool when a component needs to control *when* and *how many times* something renders, which is exactly what list virtualizers and data-table libraries do.",
    code: {
      caption: "Logic in the component, markup at the call site",
      snippet: `function MousePosition({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return children(pos);
}

// The caller decides what to do with the value
<MousePosition>
  {({ x, y }) => <p>Cursor at {x}, {y}</p>}
</MousePosition>;

// The modern equivalent: const { x, y } = useMousePosition();`,
    },
    related: "custom-hooks",
  },
  {
    id: "atomic-design",
    category: "advanced",
    question: "What is Atomic Design, and how does it apply to React?",
    answer:
      "Atomic Design is Brad Frost's methodology for organising a UI into five levels of increasing complexity: atoms (a button, an input, a label), molecules (a search field combining input plus button), organisms (a header, a product card), templates (page layout with placeholder content), and pages (a template filled with real data). In React it maps to a component folder structure and, more usefully, to a dependency rule: lower levels never import from higher levels, so atoms stay dumb and reusable while data fetching and business logic live at the organism level and above. The honest caveat for an interview is that teams routinely argue about whether something is a molecule or an organism, and that debate produces no value — many codebases keep atoms as a shared UI library and then organise everything else by feature instead, which scales better than forcing every component into a taxonomy.",
    points: [
      "Atoms — indivisible primitives: Button, Input, Icon, Label",
      "Molecules — small groups of atoms with one job: SearchField, FormRow",
      "Organisms — self-contained sections: Header, ProductCard, CommentList",
      "Templates — page structure and layout with placeholder content",
      "Pages — templates rendered with real data",
      "The value is the dependency direction, not the labels: lower levels never import higher ones",
    ],
  },

  // ------------------------------------------------------------------ react 19
  {
    id: "react19-changes",
    category: "react19",
    question: "What changed in React 19 that you'd actually use?",
    answer:
      "The big practical additions are Actions — `useActionState` for forms plus the ability to pass a function to a form's action prop, which collapses the usual pending/error/success state into one hook — and `useOptimistic` for showing an expected result before the server confirms it. `use` reads a promise or context during render and is the only hook allowed inside a condition. Refs are now ordinary props on function components, so `forwardRef` is no longer needed. Removals matter too: `propTypes` and `defaultProps` for function components are gone and now do nothing silently.",
    related: "actions-and-optimistic",
  },
  {
    id: "usetransition",
    category: "react19",
    question: "What's the difference between useTransition and debouncing?",
    answer:
      "Debouncing delays starting the work by a fixed timeout you guessed at, so on a fast machine you've added latency for nothing and on a slow one the work still blocks the main thread once it runs. A transition starts the work immediately but marks it interruptible: React renders it in the background and, if an urgent update like a keystroke arrives, abandons the partial render and restarts with the newer input. No arbitrary delay, no blocked typing, and you get `isPending` as a real in-flight signal. Debouncing an actual network request still makes sense — this is about expensive rendering.",
    related: "transitions",
  },
  {
    id: "useoptimistic",
    category: "react19",
    question: "How is useOptimistic different from just calling setState early?",
    answer:
      "Setting state early gives the same instant feedback but makes rollback your problem: snapshot the old value, restore it on failure, and get it right when requests overlap — the classic bug being a failure reverting to a snapshot that a later successful request already replaced. `useOptimistic` layers a temporary value on top of real state for the duration of the action; when the action settles, React drops the layer and re-renders from whatever the real state is by then. Rollback is automatic and correct under concurrency, and real state is never polluted with a guess.",
    related: "actions-and-optimistic",
  },
  {
    id: "server-components",
    category: "react19",
    question: "What are React Server Components, at a high level?",
    answer:
      "Components that run only on the server and send rendered output to the client rather than shipping their code in the bundle. They can read from a database or filesystem directly with async/await, and because they never run in the browser they can't use state, effects, or event handlers — anything interactive has to be a client component marked with 'use client'. The payoff is a smaller bundle and data fetching without a round trip from the browser. In practice you meet them through a framework like Next.js rather than wiring them up yourself.",
  },

  // ----------------------------------------------------------------- practical
  {
    id: "ssr",
    category: "practical",
    question: "What is server-side rendering, and when is it worth it?",
    answer:
      "SSR renders the initial HTML on the server so the browser receives real markup instead of an empty div it has to fill in with JavaScript. Two concrete wins: content is visible sooner, which improves perceived performance and Largest Contentful Paint, and crawlers and link-preview scrapers see the actual content without executing JavaScript. It costs you a server to run, more complex data fetching, and hydration — the step where React attaches to server-rendered markup, during which the page looks ready but isn't yet interactive. Worth it for content and commerce sites where SEO and first paint matter; usually not worth it for an authenticated dashboard behind a login, where nothing is crawlable anyway. Static generation or build-time prerendering often gets you most of the benefit with far less machinery.",
    related: "code-splitting",
  },
  {
    id: "react-router",
    category: "practical",
    question: "How does React Router work?",
    answer:
      "It gives a single-page app URL-driven navigation without full page reloads. Under the hood it uses the browser's History API — `pushState` changes the URL without a request — and keeps the current location in state. A `<Link>` intercepts the click, prevents the default navigation, pushes the new URL, and the router re-renders whichever `<Route>` matches. That's the key point for interviews: nothing is fetched from the server on navigation, only the component tree changes. It also supports nested routes so child routes render inside a parent layout via `<Outlet>`, and dynamic segments like `/users/:id` read with `useParams`. The one deployment gotcha is that the server must return index.html for every path, or a hard refresh on a deep link 404s.",
    code: {
      caption: "Routes, links, and a dynamic segment",
      snippet: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

<BrowserRouter>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/users/42">A user</Link>
  </nav>

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<User />} />
  </Routes>
</BrowserRouter>;

function User() {
  const { id } = useParams();
  return <h1>User {id}</h1>;
}`,
    },
    related: "react-router-basics",
  },
  {
    id: "fetching-data",
    category: "practical",
    question: "How do you fetch data in a React component, and what usually goes wrong?",
    answer:
      "The basic version is an effect that fetches and sets state, with explicit loading and error states. What goes wrong: forgetting the loading state and reading properties off null, forgetting the error path so a failed request looks like a hang, missing dependencies so it never refetches when the id changes, and race conditions where a slow first request resolves after a fast second one and overwrites it — handled with an AbortController or an ignore flag in the cleanup. This is why most production apps use TanStack Query or a framework loader, which handle caching, deduplication, and staleness for you.",
    related: "fetching-data",
  },
  {
    id: "testing",
    category: "practical",
    question: "How do you test React components, and what should you test?",
    answer:
      "Vitest or Jest as the runner, React Testing Library to render and query. The guiding principle is to test what a user can observe rather than internals: render the component, interact through accessible queries like `getByRole`, and assert on visible output. That means prioritising form validation and submission, conditional rendering, async loading and error states, and anything with real branching — and avoiding assertions on internal state or whether a particular function was called, since those fail on harmless refactors and pass on visibly broken components. Prefer `userEvent` over `fireEvent`: it fires the full realistic interaction sequence rather than one synthetic event. Enzyme still comes up in older material, but it has no maintained adapter for modern React, so it isn't a viable choice for new work.",
    code: {
      caption: "A behaviour-focused test",
      snippet: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("shows the new total after clicking", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByText("Total: 1")).toBeVisible();
});`,
    },
    related: "testing-react",
  },
  {
    id: "forms-handling",
    category: "practical",
    question: "How do you handle forms in React?",
    answer:
      "For a couple of fields, controlled inputs with `useState` are fine — value from state, onChange updating it. That stops scaling around five or six fields, because every keystroke re-renders the whole form and you end up hand-writing validation, touched/dirty tracking, and error display. At that point use React Hook Form, which keeps inputs uncontrolled under the hood and subscribes only what needs updating, so typing doesn't re-render the form, usually paired with Zod for schema validation so the same rules run on client and server. On timing: validate on blur rather than on every keystroke, so the user isn't told they're wrong while still typing the answer, then re-validate on change once a field has errored. React 19 also added form actions and `useActionState`, which handle pending and error state natively for submission-time validation.",
    code: {
      caption: "Controlled for small forms; a library once it grows",
      snippet: `// Small form — controlled state is fine
function Login() {
  const [email, setEmail] = useState("");

  return (
    <input value={email} onChange={(e) => setEmail(e.target.value)} />
  );
}

// Larger form — no re-render per keystroke, validation declared once
const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

function Signup() {
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema), mode: "onBlur" });

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}`,
    },
    related: "forms",
  },
  {
    id: "styling-react",
    category: "practical",
    question: "What are the ways to style React components, and how do you choose?",
    answer:
      "Five approaches in common use. Plain CSS or Sass files are simplest but share one global namespace, so names collide as the app grows. CSS Modules scope class names automatically at build time with zero runtime cost. Utility-first CSS like Tailwind puts styles in the markup — fast to write and impossible to collide, at the cost of busy-looking JSX. CSS-in-JS such as styled-components or Emotion gives you real component-scoped styles with props-driven variation, but adds a runtime and has fallen out of favour with Server Components. Inline styles are fine for one dynamic value but can't do pseudo-classes, media queries, or hover states. The practical answer: CSS Modules or Tailwind for most apps today, plus a headless component library for anything with complex accessibility requirements.",
    table: {
      columns: ["Approach", "Trade-off"],
      rows: [
        ["Plain CSS / Sass", "Familiar, but one global namespace — names collide"],
        ["CSS Modules", "Scoped automatically, no runtime cost, needs a build step"],
        ["Tailwind / utility CSS", "Fast and collision-free; markup gets verbose"],
        ["CSS-in-JS (styled-components, Emotion)", "Props-driven styles; runtime cost, awkward with RSC"],
        ["Inline style prop", "Fine for one dynamic value; no hover, media queries, or pseudo-classes"],
      ],
    },
  },
  {
    id: "async-calls",
    category: "practical",
    question: "How do you handle asynchronous calls in React?",
    answer:
      "Where the call lives depends on what triggers it. If a user action triggers it, put it in the event handler and use async/await with try/catch/finally so loading and error states are set on every path. If it should happen because the component appeared or an id changed, it goes in an effect — but effect callbacks cannot be async themselves, since an async function returns a promise and React expects a cleanup function, so declare an inner async function and call it. The two things interviewers listen for are cancellation and race conditions: if the component unmounts or the id changes mid-flight, a late response must not set state, which you handle with an AbortController or an ignore flag in the cleanup. Beyond that, most production apps delegate all of it to TanStack Query or a framework loader for caching and deduplication.",
    code: {
      caption: "An effect that can't be raced or leak",
      snippet: `useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(\`/api/users/\${id}\`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(res.statusText);
      setUser(await res.json());
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
    }
  }

  load();
  return () => controller.abort();
}, [id]);`,
    },
    related: "fetching-data",
  },
  {
    id: "duplicate-click-prevention",
    category: "practical",
    question: "How do you stop a double-click from firing a duplicate API call?",
    answer:
      "Disable the trigger for the duration of the request — usually by driving the button's disabled prop off the same loading state that's already tracking the request, so there's no separate flag to keep in sync. The subtlety worth knowing: gating purely on state can still race, because state updates aren't applied synchronously. Two clicks that both fire before the first setLoading(true) has actually re-rendered the button can both slip through the check. A ref-based guard closes that gap, since a ref is read and written synchronously, in the same tick — check it and flip it before the request starts, not after a state update commits. Either way, this is a UX improvement, not a security boundary: a request forged directly against the API skips the disabled button entirely, so genuine protection against a duplicate action — booking two seats, charging twice — has to be enforced server-side too, typically with an idempotency key the client generates once per action and the server deduplicates on.",
    code: {
      caption: "State for the UI, a ref to close the race",
      snippet: `function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  async function handleClick() {
    if (inFlight.current) return; // synchronous — closes the double-click race
    inFlight.current = true;
    setLoading(true);

    try {
      await placeOrder();
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Placing order…" : "Place order"}
    </button>
  );
}`,
    },
    related: "fetching-data",
  },
  {
    id: "semver-ranges",
    category: "practical",
    question: "What do ~ and ^ mean in package.json?",
    answer:
      "They're semver ranges controlling which updates npm may install. Versions are MAJOR.MINOR.PATCH. A caret allows any change that doesn't increment the leftmost non-zero number — so `^1.2.3` accepts 1.9.0 but not 2.0.0. A tilde is stricter and normally allows patch releases only: `~1.2.3` accepts 1.2.9 but not 1.3.0. An exact version like `1.2.3` pins it. Caret is the npm default. The catch worth mentioning: for 0.x versions the rules tighten, because 0.x is considered unstable — `^0.2.3` only allows 0.2.x, not 0.3.0. And ranges are why a lockfile matters: package.json says what's acceptable, package-lock.json records exactly what was installed, which is what makes builds reproducible across machines and CI.",
    table: {
      columns: ["Range", "What it allows"],
      rows: [
        ["^1.2.3", "1.2.3 up to but excluding 2.0.0 — minor and patch"],
        ["~1.2.3", "1.2.3 up to but excluding 1.3.0 — patch only"],
        ["1.2.3", "Exactly that version, pinned"],
        ["^0.2.3", "0.2.3 to <0.3.0 — stricter, because 0.x is unstable"],
        [">=1.2.3 <2", "Explicit range, written out"],
        ["*  or  latest", "Anything — avoid; builds stop being reproducible"],
      ],
    },
  },
  {
    id: "service-workers",
    category: "practical",
    question: "What are service workers, and how do they relate to a React app?",
    answer:
      "A service worker is a script the browser runs in the background, separate from your page, that sits between the app and the network as a programmable proxy. It can intercept fetch requests and serve cached responses, which is what enables offline support, faster repeat loads, background sync, and push notifications — the foundation of a PWA. It's entirely independent of React: React renders the UI, the service worker handles network and caching. Three things worth mentioning: it requires HTTPS (localhost excepted), it has no DOM access so it communicates via postMessage, and its lifecycle causes real bugs — a new version installs but waits until every tab closes before activating, so users can be stuck on stale code. In practice you generate one with Workbox or the Vite PWA plugin rather than hand-writing it, and you make sure your HTML is never cached aggressively.",
  },
  {
    id: "keys-index",
    category: "practical",
    question: "Is it ever acceptable to use the array index as a key?",
    answer:
      "Yes, when the list is static — never reordered, filtered, sorted, or inserted into except at the end — and the items have no internal state or DOM state to preserve. A rendered list of constant strings is fine. The moment any of those conditions breaks, index keys cause real bugs: React matches by position, so deleting the first item makes every subsequent row look changed, and any input values, focus, or animation state gets attached to the wrong row.",
    related: "lists-and-keys",
  },
  {
    id: "spa-seo",
    category: "practical",
    question: "What are the SEO implications of a client-rendered React app?",
    answer:
      "Google executes JavaScript, so a client-rendered SPA can rank, but you're relying on a rendering queue and giving up speed. The bigger practical problem is that social and messaging link previews — Twitter, LinkedIn, Slack, WhatsApp — don't run JavaScript at all, so every route shows whatever meta tags are in the initial HTML. Fixes are server rendering, or build-time prerendering of known routes, which for a mostly-static content site is usually the cheaper option. You also need real URLs per view, unique titles and descriptions, and a sitemap.",
  },
  {
    id: "safer-props-js",
    category: "practical",
    question: "How do you keep a JavaScript React codebase safe without TypeScript?",
    answer:
      "Split it into two problems. For code you control, JSDoc comments plus `// @ts-check` give you autocomplete, hover documentation, and errors on typos or missing required props, with no build step and file-by-file adoption. For data crossing a boundary you don't control — API responses, localStorage, URL params — no static tool helps, because the value isn't known until runtime; that needs real guards or a schema library like Zod. Worth noting the second half applies to TypeScript too: declaring a fetch result as User is an assertion, not a validation. Note that `propTypes` is not the answer any more — React 19 removed it, and it now does nothing silently.",
    related: "safer-props",
  },

  // ------------------------------------------------------------------- coding
  {
    id: "reusable-button",
    category: "coding",
    question: "Write a generic Button component. What makes a component reusable?",
    answer:
      "A reusable component owns its appearance and nothing else — no business logic, no data fetching, no assumptions about where it sits. Three things make it work in practice. It takes a small set of named variants rather than a pile of booleans, because `variant=\"danger\"` scales where `isDanger` plus `isPrimary` plus `isGhost` produces impossible combinations. It spreads the rest of its props onto the underlying element, so every native attribute — `type`, `disabled`, `aria-label`, `onClick` — keeps working without you re-declaring each one. And it merges an incoming `className` rather than overwriting, so callers can adjust spacing without a new variant. Watch for the `type` default: a button inside a form submits it unless you set `type=\"button\"`, which is a genuinely common bug.",
    code: {
      caption: "Variants, prop spreading, and a safe type default",
      snippet: `const VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "px-2.5 py-1 text-sm",
  md: "px-4 py-2 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",     // don't accidentally submit forms
  className = "",
  children,
  ...rest              // onClick, disabled, aria-*, everything native
}) {
  return (
    <button
      type={type}
      className={\`rounded font-medium disabled:opacity-50 \${VARIANTS[variant]} \${SIZES[size]} \${className}\`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Usage
<Button variant="danger" onClick={remove} disabled={busy}>
  Delete
</Button>;`,
    },
    related: "components-props",
  },
  {
    id: "toggle-bulb",
    category: "coding",
    question: "Implement a bulb component that switches on and off.",
    answer:
      "A warm-up question testing whether you reach for boolean state and the functional updater. The two things an interviewer watches for: toggling with `setOn(prev => !prev)` rather than `setOn(!on)`, which is correct under batching and doesn't depend on a captured value, and putting real accessibility on the control — a button with `aria-pressed` communicates the toggle state, where a clickable div communicates nothing.",
    code: {
      caption: "Boolean state, functional updater, accessible toggle",
      snippet: `function Bulb() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: isOn ? "#facc15" : "#374151",
          boxShadow: isOn ? "0 0 40px #facc15" : "none",
          transition: "all 0.3s",
        }}
        role="img"
        aria-label={isOn ? "Bulb on" : "Bulb off"}
      />

      <button onClick={() => setIsOn((prev) => !prev)} aria-pressed={isOn}>
        Turn {isOn ? "off" : "on"}
      </button>
    </div>
  );
}`,
    },
    related: "state",
  },
  {
    id: "todo-list",
    category: "coding",
    question: "Build a to-do list with add and delete functionality.",
    answer:
      "The classic screening exercise. What's actually being assessed: immutable updates (build a new array with spread or `filter` rather than `push` or `splice`), stable keys from a generated id rather than the array index, a controlled input wired to state, and not submitting an empty value. Using the index as a key is the trap here — delete an item and every subsequent row shifts, so React reuses the wrong DOM nodes and any per-row state lands on the wrong item. Wrapping in a form means Enter works for free, which reviewers notice.",
    code: {
      caption: "Immutable add and delete, stable keys",
      snippet: `function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    // New array, never push
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed }]);
    setText("");
  }

  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>Nothing yet.</p>}
    </div>
  );
}`,
    },
    related: "lists-and-keys",
  },
  {
    id: "loan-calculator",
    category: "coding",
    question: "Implement a home loan EMI calculator using hooks.",
    answer:
      "This tests derived state more than arithmetic. The EMI is fully determined by the three inputs, so it must be calculated during render — storing it in its own `useState` and syncing it from an effect is the mistake the exercise is designed to catch, since it adds a render pass and can go stale. Use `useMemo` only if the calculation were expensive, which this isn't. The formula is P·r·(1+r)^n / ((1+r)^n − 1), with r the monthly rate and n the number of months. Guard the zero-interest case, where that formula divides by zero and the answer is simply principal divided by months.",
    code: {
      caption: "Derived during render, not stored in state",
      snippet: `function LoanCalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [years, setYears] = useState(20);

  // Derived — no useState, no useEffect
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayable = emi * months;

  return (
    <div>
      <label>
        Loan amount
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
        />
      </label>

      <label>
        Interest rate (% p.a.)
        <input
          type="number"
          step="0.1"
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
        />
      </label>

      <label>
        Tenure (years)
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
      </label>

      <p>Monthly EMI: {emi.toFixed(2)}</p>
      <p>Total payable: {totalPayable.toFixed(2)}</p>
      <p>Total interest: {(totalPayable - principal).toFixed(2)}</p>
    </div>
  );
}`,
    },
    related: "forms",
  },
  {
    id: "not-found-page",
    category: "coding",
    question: "How do you implement a 404 Not Found page in React?",
    answer:
      "In React Router, a `path=\"*\"` route matches anything no earlier route did, and it must be last. Two things elevate the answer beyond the routing line. First, a client-rendered SPA returns HTTP 200 for a missing page, so search engines see a soft 404 — the page renders 'not found' while the status says success. Adding `<meta name=\"robots\" content=\"noindex\">` on that route is the practical mitigation; a genuine 404 status needs server rendering. Second, don't redirect an unknown URL to the home page: the user loses the address they typed, can't tell whether they mistyped or the link is dead, and you lose the ability to spot broken inbound links. Render the 404 in place, with a route back.",
    code: {
      caption: "Catch-all route, rendered in place",
      snippet: `<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/lessons/:slug" element={<Lesson />} />

  {/* Must be last — matches anything unmatched above */}
  <Route path="*" element={<NotFound />} />
</Routes>;

function NotFound() {
  useEffect(() => {
    // Client-rendered 404s still return HTTP 200,
    // so tell crawlers not to index this
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex";
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  return (
    <div>
      <h1>404 — Page not found</h1>
      <p>That page doesn't exist.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}`,
    },
    related: "react-router-basics",
  },
]

export function getQuestionsByCategory(category: InterviewCategory) {
  return interviewQuestions.filter((entry) => entry.category === category)
}

/** Strips the backtick code markers, e.g. for structured data and search. */
export function toPlainText(answer: string): string {
  return answer.replace(/`/g, "")
}

/** Everything searchable about an entry, flattened into one lowercase string. */
export function searchableText(entry: InterviewQuestionEntry): string {
  return [
    entry.question,
    toPlainText(entry.answer),
    ...(entry.points ?? []),
    entry.code?.snippet ?? "",
    ...(entry.table ? entry.table.rows.flat() : []),
  ]
    .join(" ")
    .toLowerCase()
}
