import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const ifElse = `
function Status({ loggedIn }) {
  if (loggedIn) {
    return <p>Welcome back!</p>;
  }
  return <p>Please sign in.</p>;
}

render(
  <div>
    <Status loggedIn={true} />
    <Status loggedIn={false} />
  </div>
);
`

const ternary = `
function StatusBadge({ online }) {
  return (
    <span style={{ color: online ? "#16a34a" : "#6b7280" }}>
      {online ? "● Online" : "○ Offline"}
    </span>
  );
}

render(
  <div style={{ display: "flex", gap: 12 }}>
    <StatusBadge online={true} />
    <StatusBadge online={false} />
  </div>
);
`

const andOperator = `
function Inbox({ unreadCount }) {
  return (
    <div>
      <p>Inbox</p>
      {unreadCount > 0 && <p>You have {unreadCount} unread messages.</p>}
    </div>
  );
}

render(<Inbox unreadCount={3} />);
`

const toggleExample = `
function Details() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} details
      </button>
      {open && <p>Here are the extra details you wanted to see.</p>}
    </div>
  );
}

render(<Details />);
`

export default function ConditionalRenderingLesson() {
  return (
    <>
      <p>
        Because JSX is just JavaScript, showing or hiding UI is a matter of ordinary JavaScript
        control flow — <code>if</code> statements, ternaries, and logical operators — rather than
        special template directives.
      </p>

      <h2>Returning different JSX with if/else</h2>
      <p>Inside a component function, you can return early based on a condition.</p>
      <LiveCodeBlock code={ifElse} />

      <h2>The ternary operator</h2>
      <p>
        For choosing between two small pieces of JSX inline, the ternary operator{" "}
        <code>condition ? a : b</code> is the most common pattern.
      </p>
      <LiveCodeBlock code={ternary} />

      <h2>The && operator</h2>
      <p>
        When you only want to render something <strong>or nothing</strong>, the{" "}
        <code>&amp;&amp;</code> operator is a common shorthand: if the left side is falsy, React
        renders nothing at all.
      </p>
      <LiveCodeBlock code={andOperator} />

      <Callout variant="warning">
        Be careful with numbers before <code>&amp;&amp;</code> — <code>{"{count && <p>...</p>}"}</code>{" "}
        will render a literal <code>0</code> on the page when <code>count</code> is <code>0</code>,
        since <code>0</code> is falsy but still a renderable value. Use{" "}
        <code>{"{count > 0 && <p>...</p>}"}</code> instead.
      </Callout>

      <h2>Putting it together with state</h2>
      <LiveCodeBlock code={toggleExample} />

      <Challenge
        hint={<p>Wrap it as <code>{"{open && <p>...</p>}"}</code> just like the details example.</p>}
      >
        In the inbox example, only show the "unread messages" line when{" "}
        <code>unreadCount</code> is greater than zero — try setting it to <code>0</code> and
        confirm nothing extra renders.
      </Challenge>
    </>
  )
}
