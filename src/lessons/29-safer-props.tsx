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

const jsdocCode = `/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} [avatarUrl]
 */

/**
 * A single row in the members list.
 *
 * @param {Object} props
 * @param {User} props.user
 * @param {"compact" | "full"} [props.variant]
 * @param {(user: User) => void} props.onSelect
 */
export function MemberRow({ user, variant = "compact", onSelect }) {
  return (
    <button className={variant} onClick={() => onSelect(user)}>
      {user.avatarUrl && <img src={user.avatarUrl} alt="" />}
      <span>{user.name}</span>
    </button>
  );
}`

const jsdocSteps: WalkthroughStep[] = [
  {
    id: "j1",
    label: "Describe the shape once with @typedef",
    detail:
      "This is a comment, so it ships nothing and runs nothing — but your editor reads it and now knows what a User is everywhere you mention one.",
    range: [1, 6],
  },
  {
    id: "j2",
    label: "Square brackets mean optional",
    detail:
      "[avatarUrl] marks the property as maybe-missing. Your editor will warn you when you use it without checking, which is exactly the bug you want caught.",
    lines: 5,
  },
  {
    id: "j3",
    label: "@param documents each prop",
    detail:
      "Hovering MemberRow anywhere in the codebase now shows this list. Autocomplete offers the prop names, and a typo gets flagged.",
    range: [11, 14],
  },
  {
    id: "j4",
    label: "Unions work here too",
    detail:
      'Writing "compact" | "full" instead of `string` means your editor suggests both valid values and highlights a typo like "compct".',
    lines: 13,
  },
  {
    id: "j5",
    label: "Function props get real signatures",
    detail:
      "Describing onSelect as (user: User) => void means the editor knows what your callback receives — no more guessing what the argument is.",
    lines: 14,
  },
  {
    id: "j6",
    label: "Defaults live in the destructuring",
    detail:
      "This is the only place defaults belong now. React 19 removed defaultProps for function components, so a default written any other way is silently ignored.",
    lines: 16,
  },
]

const validationDemo = `
// A tiny guard for data you didn't create
function isValidUser(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.name === "string"
  );
}

function UserCard({ data }) {
  if (!isValidUser(data)) {
    return (
      <p style={{ color: "#dc2626" }}>
        Couldn't load this profile.
      </p>
    );
  }
  return <p style={{ fontWeight: 600 }}>Welcome back, {data.name}!</p>;
}

function Demo() {
  const [payload, setPayload] = useState({ id: "1", name: "Ada" });

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <UserCard data={payload} />
      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setPayload({ id: "1", name: "Ada" })}>
          Good response
        </button>
        <button onClick={() => setPayload({ id: "1" })}>
          Missing name
        </button>
        <button onClick={() => setPayload(null)}>
          null
        </button>
      </div>
    </div>
  );
}

render(<Demo />);
`

const challengeStarter = `
function isValidPost(value) {
  // TODO: return true only when value is an object with
  // a string title AND a string body.
  return true;
}

function Post({ data }) {
  if (!isValidPost(data)) {
    return <p style={{ color: "#dc2626" }}>This post couldn't be shown.</p>;
  }
  return (
    <div>
      <p style={{ fontWeight: 600 }}>{data.title}</p>
      <p>{data.body}</p>
    </div>
  );
}

function Demo() {
  const [post, setPost] = useState({ title: "Hello", body: "First post!" });

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <Post data={post} />
      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setPost({ title: "Hello", body: "First post!" })}>
          Valid
        </button>
        <button onClick={() => setPost({ title: "Broken" })}>
          Missing body
        </button>
        <button onClick={() => setPost(null)}>null</button>
      </div>
    </div>
  );
}

render(<Demo />);
`

export default function SaferPropsLesson() {
  return (
    <>
      <p>
        JavaScript won't stop you passing a number where a component expected a string, or
        forgetting a required prop entirely. You find out when something renders{" "}
        <code>undefined</code> — or throws — in front of a user. You don't need to adopt
        TypeScript to close most of that gap. Three habits get you most of the way.
      </p>

      <AnalogyCard title="Label the breaker box.">
        Nothing physically stops you flipping the wrong switch, and no inspector is standing
        there checking. But a box with every breaker clearly labelled means you almost never get
        it wrong, and when you do, you find out in seconds instead of wandering the house. JSDoc
        is the label; runtime checks are the smoke alarm for the one time it still goes wrong.
      </AnalogyCard>

      <h2>1. Describe props with JSDoc</h2>
      <p>
        JSDoc is just a specially formatted comment — it adds nothing to your bundle and changes
        nothing at runtime. But VS Code reads it, so you get autocomplete, hover documentation,
        and squiggles on typos, in ordinary <code>.jsx</code> files.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="A documented component"
          filename="MemberRow.jsx"
          code={jsdocCode}
          steps={jsdocSteps}
        />
      </div>

      <Callout variant="tip" title="Turn the squiggles into real errors">
        Add <code>{'// @ts-check'}</code> as the first line of a file and your editor will
        actually check it against those JSDoc types — still plain JavaScript, no build step, no
        new dependency. Add it to one tricky file and see how it feels before doing anything
        more.
      </Callout>

      <h2>2. Put defaults in the destructuring</h2>
      <p>
        React 19 removed <code>defaultProps</code> for function components. If you learned the
        old pattern from an older tutorial, it now does nothing at all — silently.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="new">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="old">Removed in React 19</TabsTrigger>
            <TabsTrigger value="new">What to write now</TabsTrigger>
          </TabsList>
          <TabsContent value="old" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`function Badge({ label, tone }) {
  return <span className={tone}>{label}</span>;
}

// Ignored entirely in React 19.
// tone is undefined, and nothing warns you.
Badge.defaultProps = { tone: "neutral" };`}</pre>
          </TabsContent>
          <TabsContent value="new" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`function Badge({ label, tone = "neutral" }) {
  return <span className={tone}>{label}</span>;
}

// The default sits right next to the prop
// it belongs to, and always applies.`}</pre>
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="warning" title="PropTypes is gone too">
        <code>propTypes</code> was removed from React 19 alongside <code>defaultProps</code>.
        Older tutorials still teach the <code>prop-types</code> package heavily — those runtime
        warnings no longer fire. Don't add it to a new project.
      </Callout>

      <h2>3. Validate data you didn't create</h2>
      <p>
        JSDoc describes what you <em>intend</em>. It can't check what an API actually sent, what
        was in <code>localStorage</code>, or what a URL parameter contained. Those cross a
        boundary you don't control, so they need a real runtime check.
      </p>
      <p>
        Click through the three responses below. A missing field and a <code>null</code> body
        both produce a sensible message instead of a crash or a stray <code>undefined</code>.
      </p>
      <LiveCodeBlock code={validationDemo} />

      <Callout variant="info">
        This is the one place a schema library earns its keep. Zod or Valibot let you declare the
        shape once and get both validation and a clear error — worth it as soon as you're
        checking more than a couple of fields by hand.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="trusting the shape of an API response"
        wrong={`function Profile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    fetch("/api/user/" + userId)\n      .then((r) => r.json())\n      .then(setUser);\n  }, [userId]);\n\n  // Crashes the moment the API omits\n  // address, or returns an error object\n  return <p>{user.address.city}</p>;\n}`}
        right={`function Profile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    fetch("/api/user/" + userId)\n      .then((r) => r.json())\n      .then(setUser);\n  }, [userId]);\n\n  if (!user) return <Skeleton />;\n\n  return <p>{user.address?.city ?? "Unknown"}</p>;\n}`}
        explanation={
          <p>
            Reading <code>user.address.city</code> assumes three things at once: that the fetch
            finished, that <code>address</code> exists, and that it has a <code>city</code>.
            Every one of those can be false in production. Handle the not-loaded-yet case
            explicitly, then use optional chaining and a fallback for the fields the API doesn't
            guarantee.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Where does a default prop value belong in React 19?"
        options={[
          { id: "a", text: "In Component.defaultProps = { … }" },
          { id: "b", text: "In the destructured parameter: function C({ tone = 'neutral' })" },
          { id: "c", text: "In a propTypes declaration with .defaultValue" },
          { id: "d", text: "In a useState initial value inside the component" },
        ]}
        correctId="b"
        explanation="React 19 removed defaultProps for function components, so assigning it does nothing and produces no warning — a genuinely nasty silent failure if you learned the older pattern. Destructuring defaults are now the only way, and they read better anyway since the default sits next to the prop."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Write the guard"
        hint={
          <p>
            Mirror the <code>isValidUser</code> example:{" "}
            <code>
              {'return value !== null && typeof value === "object" && typeof value.title === "string" && typeof value.body === "string";'}
            </code>
          </p>
        }
      >
        <code>isValidPost</code> currently returns <code>true</code> for everything, so "Missing
        body" renders a blank line and <code>null</code> crashes the component. Fill it in so
        only a genuine post gets through.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How do you keep a JavaScript React codebase safe without TypeScript?"
        answer={
          <p>
            I separate the two problems, because they need different tools. For code I control —
            component props, hook return values — JSDoc plus{" "}
            <code>{'// @ts-check'}</code> gives me most of the practical benefit: autocomplete,
            hover docs, and errors on typos or missing required props, with no build step and no
            migration. It's also incremental, so a team can adopt it file by file. For data
            crossing a boundary I don't control — API responses, <code>localStorage</code>, URL
            params — no static tool helps, because the value simply isn't known until runtime;
            that needs an actual check, either hand-written guards or a schema library like Zod.
            Worth noting that this second half is true in TypeScript too. Declaring a fetch
            result as <code>User</code> is an assertion, not a validation — plenty of typed
            codebases crash on malformed responses for exactly this reason. So the runtime
            discipline matters regardless of which language you're in.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "JSDoc comments give you autocomplete, hover docs, and typo warnings in plain .jsx files — zero runtime cost, no build step.",
          "Adding // @ts-check to a file turns those JSDoc types into real editor errors, incrementally and without adopting TypeScript.",
          "React 19 removed defaultProps and propTypes for function components; put defaults in the destructured parameter instead.",
          "Static hints describe intent — data from an API, localStorage, or the URL still needs a real runtime check.",
          "Handle the loading case explicitly and use optional chaining with fallbacks for fields the server doesn't guarantee.",
        ]}
      />
    </>
  )
}
