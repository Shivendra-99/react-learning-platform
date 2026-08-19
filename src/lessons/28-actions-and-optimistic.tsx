import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const actionStateCode = `function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");

      if (!email.includes("@")) {
        return { error: "That doesn't look like an email." };
      }

      await subscribe(email);
      return { success: "You're on the list!" };
    },
    { }
  );

  return (
    <form action={formAction}>
      <input name="email" disabled={isPending} />
      <button disabled={isPending}>
        {isPending ? "Signing up…" : "Sign up"}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="ok">{state.success}</p>}
    </form>
  );
}`

const actionStateSteps: WalkthroughStep[] = [
  {
    id: "a1",
    label: "One hook replaces three useStates",
    detail:
      "Before React 19 you'd hand-roll isLoading, error, and success state. useActionState returns the result, the wired-up action, and the pending flag together.",
    range: [2, 3],
  },
  {
    id: "a2",
    label: "The action receives the previous state",
    detail:
      "First argument is whatever the last run returned. Handy for retry counts or keeping the previous value while a new attempt runs.",
    lines: 3,
  },
  {
    id: "a3",
    label: "And the form data, already collected",
    detail:
      "No refs, no controlled state for every field. React hands you a FormData built from the form's name attributes.",
    lines: 4,
  },
  {
    id: "a4",
    label: "Whatever you return becomes the new state",
    detail:
      "Return an error object or a success object — it lands in `state` on the next render. Errors are just return values, not exceptions.",
    lines: [7, 11],
  },
  {
    id: "a5",
    label: "Pass the action straight to the form",
    detail:
      "React 19 lets <form action={…}> take a function. On submit it calls your action with the FormData and manages pending state for you.",
    lines: 17,
  },
  {
    id: "a6",
    label: "isPending drives the whole UI",
    detail:
      "Disable inputs, swap the button label, prevent double submits — all from one flag you never had to maintain yourself.",
    range: [18, 21],
  },
]

const actionStateDemo = `
function fakeSubscribe(email) {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = String(formData.get("email") || "");
      if (!email.includes("@")) {
        return { error: "That doesn't look like an email." };
      }
      await fakeSubscribe(email);
      return { success: "You're on the list: " + email };
    },
    {}
  );

  return (
    <form action={formAction} style={{ textAlign: "left", minWidth: 260 }}>
      <input
        name="email"
        placeholder="you@example.com"
        disabled={isPending}
        style={{ padding: 6, width: "100%", marginBottom: 8 }}
      />
      <button disabled={isPending}>
        {isPending ? "Signing up…" : "Sign up"}
      </button>
      {state.error && (
        <p style={{ color: "#dc2626", fontSize: 13 }}>{state.error}</p>
      )}
      {state.success && (
        <p style={{ color: "#16a34a", fontSize: 13 }}>{state.success}</p>
      )}
    </form>
  );
}

render(<SignupForm />);
`

const optimisticDemo = `
function fakeSend(text) {
  // Half the time it fails, so you can watch the rollback
  return new Promise((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.5 ? resolve(text) : reject()), 1400)
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    { id: 0, text: "Welcome!", sending: false },
  ]);
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (current, newText) => [
      ...current,
      { id: "temp", text: newText, sending: true },
    ]
  );
  const [failed, setFailed] = useState(false);

  async function send(formData) {
    const text = String(formData.get("msg") || "");
    if (!text) return;
    setFailed(false);
    addOptimistic(text);
    try {
      const saved = await fakeSend(text);
      setMessages((prev) => [
        ...prev,
        { id: prev.length, text: saved, sending: false },
      ]);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <ul style={{ fontSize: 13, paddingLeft: 18 }}>
        {optimistic.map((m, i) => (
          <li key={i} style={{ opacity: m.sending ? 0.45 : 1 }}>
            {m.text} {m.sending ? "(sending…)" : ""}
          </li>
        ))}
      </ul>
      <form action={send}>
        <input name="msg" placeholder="Say something" style={{ padding: 6 }} />
        <button>Send</button>
      </form>
      {failed && (
        <p style={{ color: "#dc2626", fontSize: 13 }}>
          Send failed — notice the message disappeared again.
        </p>
      )}
    </div>
  );
}

render(<Chat />);
`

const challengeStarter = `
function fakeSave(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 1000));
}

function Demo() {
  // TODO: replace this manual loading state with useActionState.
  // It should give you [state, formAction, isPending].
  const [saved, setSaved] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    const value = new FormData(e.target).get("note");
    const result = await fakeSave(String(value));
    setSaved(result);
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "left", minWidth: 260 }}>
      <input name="note" placeholder="A note" disabled={isPending} style={{ padding: 6 }} />
      <button disabled={isPending}>{isPending ? "Saving…" : "Save"}</button>
      {saved && <p style={{ fontSize: 13 }}>Saved: {saved}</p>}
    </form>
  );
}

render(<Demo />);
`

export default function ActionsLesson() {
  return (
    <>
      <p>
        Every form you've ever written needed the same four things: the submitted values, a
        pending flag, an error, and a success result. For years you wired those up by hand with
        four <code>useState</code> calls and a <code>try/finally</code>. React 19 ships hooks
        that do it for you — and one that lets the UI update <em>before</em> the server has
        answered.
      </p>

      <AnalogyCard title="Optimistic UI is a barista writing your name on the cup.">
        They don't wait for the payment to clear before starting your order — they assume it'll
        go through, because it almost always does. If the card is declined, they undo it. You
        got a faster coffee 99 times out of 100, and the rare rollback costs less than making
        everyone wait every time.
      </AnalogyCard>

      <h2>useActionState: forms without the boilerplate</h2>
      <div className="not-prose">
        <CodeWalkthrough
          title="A signup form in one hook"
          filename="SignupForm.jsx"
          code={actionStateCode}
          steps={actionStateSteps}
        />
      </div>

      <h2>Try the form</h2>
      <p>
        Submit an invalid address to see the error path, then a valid one to watch the pending
        state. Notice there isn't a single <code>useState</code> in the component.
      </p>
      <LiveCodeBlock code={actionStateDemo} />

      <Callout variant="info" title="Errors are return values here">
        Notice the validation failure is <em>returned</em>, not thrown. Returning{" "}
        <code>{"{ error: … }"}</code> keeps expected failures — bad input, taken username — in
        normal control flow, and leaves exceptions and error boundaries for genuinely unexpected
        crashes.
      </Callout>

      <h2>useOptimistic: show the result before it's real</h2>
      <p>
        Sending a chat message over a slow connection shouldn't mean staring at a spinner for a
        second and a half. <code>useOptimistic</code> lets you render the expected result
        immediately, and React automatically discards it if the real update never arrives.
      </p>
      <p>
        Send a few messages below. Roughly half fail on purpose — watch those messages vanish
        again when the request rejects.
      </p>
      <LiveCodeBlock code={optimisticDemo} />

      <Callout variant="warning" title="Only be optimistic when you'd usually be right">
        Optimistic updates are a bet that the request will succeed. That's a good bet for liking
        a post or sending a message; it's a bad bet for a payment, a booking that might be sold
        out, or anything the server can legitimately reject. Showing "Payment complete" and then
        snatching it back is worse than a spinner.
      </Callout>

      <h2>The `use` hook</h2>
      <p>
        <code>use</code> reads a resource — a promise or a context — during render. Unlike every
        other hook, it can be called conditionally, inside loops and <code>if</code> blocks.
        Given a promise it suspends until that promise resolves, which is what ties it back to
        the Suspense lesson.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="promise">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="promise">Reading a promise</TabsTrigger>
            <TabsTrigger value="context">Reading context</TabsTrigger>
          </TabsList>
          <TabsContent value="promise" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`function Profile({ userPromise }) {
  // Suspends until the promise resolves —
  // the nearest <Suspense> shows its fallback
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}`}</pre>
          </TabsContent>
          <TabsContent value="context" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`function Item({ isHighlighted }) {
  // Legal! useContext could never be
  // called conditionally like this
  if (isHighlighted) {
    const theme = use(ThemeContext);
    return <b style={{ color: theme.accent }}>Featured</b>;
  }
  return <span>Normal</span>;
}`}</pre>
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="tip">
        <code>use</code> is the one exception to the rules-of-hooks lesson. Every other hook must
        run in the same order on every render; <code>use</code> is explicitly designed to be
        called conditionally.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="creating the promise inside the component that reads it"
        wrong={`function Profile({ userId }) {\n  // New promise on EVERY render →\n  // suspends, re-renders, new promise,\n  // suspends… an infinite loop\n  const user = use(fetchUser(userId));\n  return <h1>{user.name}</h1>;\n}`}
        right={`function Page({ userId }) {\n  // Created once, in a stable place\n  const userPromise = useMemo(\n    () => fetchUser(userId),\n    [userId]\n  );\n  return <Profile userPromise={userPromise} />;\n}`}
        explanation={
          <p>
            A promise created during render is a brand-new promise each time the component
            renders. Since <code>use</code> suspends on an unresolved promise and suspending
            triggers another render, you get an endless fetch loop. The promise has to be created
            somewhere stable — a parent, a cache, a framework loader, or a memo keyed to the
            input.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What happens to an optimistic update when the underlying async action fails?"
        options={[
          { id: "a", text: "It stays on screen until you manually remove it" },
          { id: "b", text: "React discards it and the UI reverts to the real state" },
          { id: "c", text: "It's committed permanently and the error is ignored" },
          { id: "d", text: "The component unmounts and remounts" },
        ]}
        correctId="b"
        explanation="useOptimistic's value only exists while the action is in flight. When the action settles, React drops the optimistic layer and re-renders from the real state — so a failed request rolls back automatically, with no cleanup code from you."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Replace the manual state with useActionState"
        hint={
          <p>
            Use{" "}
            <code>
              {"const [saved, formAction, isPending] = useActionState(async (prev, formData) => { … }, \"\")"}
            </code>{" "}
            and change the form to <code>{"<form action={formAction}>"}</code>.
          </p>
        }
      >
        This form tracks pending and result state by hand, with a <code>preventDefault</code> and
        a manual <code>FormData</code>. Rewrite it with <code>useActionState</code> so React
        manages all of that.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How does useOptimistic differ from just calling setState before the request?"
        answer={
          <p>
            Setting state early gives you the same instant feedback but makes the rollback your
            problem: you have to snapshot the previous value, restore it in a{" "}
            <code>catch</code>, and get it right when several requests overlap — the classic bug
            being one failure reverting to a snapshot that a later successful request already
            replaced. <code>useOptimistic</code> instead layers a temporary value <em>on top
            of</em> the real state for the duration of the action. When the action settles,
            React drops the layer and re-renders from the actual state, whatever it is by then.
            So the rollback is automatic and correct under concurrency, and the real state is
            never polluted with a value that was only ever a guess. It also composes with{" "}
            <code>useActionState</code>, since both are built around the same notion of an
            action being in flight.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useActionState returns [state, formAction, isPending] — the result, a wired-up action, and a pending flag, replacing several useState calls.",
          "React 19 forms accept a function in the action prop, which receives FormData and manages pending state automatically.",
          "Return errors from an action rather than throwing them; keep exceptions for genuinely unexpected failures.",
          "useOptimistic shows the expected result immediately and rolls back automatically if the action fails — no cleanup code needed.",
          "use reads a promise or context during render and is the only hook that may be called conditionally; never create its promise inside the component that reads it.",
        ]}
      />
    </>
  )
}
