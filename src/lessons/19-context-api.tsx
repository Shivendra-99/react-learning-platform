import { Megaphone, Users } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const propDrillingExample = `
function Header({ theme }) {
  return <h4>Header (theme: {theme})</h4>;
}

function SidebarButton({ theme }) {
  return <button>Sidebar button (theme: {theme})</button>;
}

function Sidebar({ theme }) {
  // Sidebar doesn't use theme itself — it only passes it through
  return <SidebarButton theme={theme} />;
}

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
      <Header theme={theme} />
      <Sidebar theme={theme} />
    </div>
  );
}

render(<App />);
`

const contextExample = `
const ThemeContext = createContext("light");

function Header() {
  const theme = useContext(ThemeContext);
  return <h4>Header (theme: {theme})</h4>;
}

function SidebarButton() {
  const theme = useContext(ThemeContext);
  return <button>Sidebar button (theme: {theme})</button>;
}

function Sidebar() {
  // Sidebar never touches theme at all anymore
  return <SidebarButton />;
}

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
      <Header />
      <Sidebar />
    </ThemeContext.Provider>
  );
}

render(<App />);
`

const challengeStarter = `
function Avatar({ name }) {
  return <span>👤 {name}</span>;
}

function Toolbar({ name }) {
  // Toolbar doesn't use "name" itself — just passes it through
  return <Avatar name={name} />;
}

// TODO: create UserContext with createContext(),
// wrap App's return value in <UserContext.Provider value={name}>,
// remove the name props from Toolbar and Avatar,
// and read it with useContext(UserContext) inside Avatar instead

function App() {
  const name = "Ada";
  return <Toolbar name={name} />;
}

render(<App />);
`

const flowSteps: FlowStep[] = [
  { id: "create", label: "1. createContext(defaultValue)", detail: "Creates a Context object — a shared channel components can tune into.", icon: Megaphone },
  { id: "provide", label: "2. <MyContext.Provider value={...}>", detail: "Wraps part of your tree and broadcasts a value to everything inside it.", icon: Megaphone },
  { id: "consume", label: "3. useContext(MyContext)", detail: "Any descendant, at any depth, reads the current value directly.", icon: Users, tone: "success" },
]

export default function ContextApiLesson() {
  return (
    <>
      <p>
        As an app grows, some data — the current theme, the logged-in user, the selected language
        — is needed by components scattered all over the tree. Passing it down through props at
        every level gets tedious fast. Context solves exactly this.
      </p>

      <AnalogyCard title="Context is a family announcement, not a note passed hand to hand.">
        If a parent has news for the household, they don't whisper it to one kid, who whispers it
        to the next, who finally tells the one who needed to know. They announce it once, out
        loud, and anyone in the house can hear it whenever they want — including someone in a
        room the message would otherwise never have passed through.
      </AnalogyCard>

      <h2>The three pieces</h2>
      <StepFlowDiagram title="Using Context" steps={flowSteps} autoPlayMs={1300} />

      <h2>Prop drilling vs. Context</h2>
      <p>
        Same result, two different approaches. In the first tab, <code>theme</code> has to pass
        through <code>Sidebar</code>, which never actually uses it. In the second,{" "}
        <code>Sidebar</code> is cut out of the conversation entirely.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="drilling">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drilling">Prop drilling</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
          </TabsList>
          <TabsContent value="drilling" className="mt-3">
            <LiveCodeBlock code={propDrillingExample} />
          </TabsContent>
          <TabsContent value="context" className="mt-3">
            <LiveCodeBlock code={contextExample} />
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="info">
        Click "Toggle theme" in either tab — both produce the identical result. The difference is
        entirely in how <code>theme</code> travels from <code>App</code> down to the components
        that actually display it.
      </Callout>

      <h2>One provider, many consumers</h2>
      <p>Nothing stops multiple, unrelated components from reading the same context directly.</p>
      <FanOutDiagram
        title="One Provider, many direct consumers"
        rootLabel="<ThemeContext.Provider>"
        consumers={["Header", "Card", "SettingsButton"]}
        description={
          <>
            Every one of these calls <code className="font-mono-code text-foreground">useContext(ThemeContext)</code>{" "}
            directly — none of them received it as a prop, and none of their parents had to know or care that it
            exists.
          </>
        }
      />

      <h2>Common mistake</h2>
      <CommonMistake
        title="passing a new object literal as the value"
        wrong={`<UserContext.Provider value={{ user, setUser }}>\n  {/* a NEW object every render of the parent — */}\n  {/* EVERY consumer re-renders, even if user is unchanged */}\n</UserContext.Provider>`}
        right={`const value = useMemo(() => ({ user, setUser }), [user]);\n<UserContext.Provider value={value}>\n  {/* stable reference — consumers only re-render */}\n  {/* when "user" actually changes */}\n</UserContext.Provider>`}
        explanation={
          <p>
            <code>{"{ user, setUser }"}</code> creates a brand-new object every single render,
            even when <code>user</code> itself hasn't changed. Since Context comparisons use
            reference equality, every consumer treats that as "the value changed" and re-renders —
            wrap object/array values in <code>useMemo</code> to avoid it.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What happens to components consuming a Context when the Provider's value prop changes?"
        options={[
          { id: "a", text: "Nothing — they need to be manually refreshed" },
          { id: "b", text: "Every component reading that context via useContext re-renders" },
          { id: "c", text: "Only the Provider's direct child re-renders" },
          { id: "d", text: "The whole page reloads" },
        ]}
        correctId="b"
        explanation="Every descendant component that calls useContext() for that specific context re-renders when the value changes, no matter how deeply nested — Context updates skip the normal prop-based bailout checks in between."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Cut Toolbar out of the conversation"
        hint={
          <p>
            <code>{"const UserContext = createContext();"}</code>, then wrap <code>{"<Toolbar />"}</code>{" "}
            in <code>{'<UserContext.Provider value={name}>'}</code>, remove the <code>name</code>{" "}
            prop from both components, and use <code>{"const name = useContext(UserContext);"}</code>{" "}
            inside <code>Avatar</code>.
          </p>
        }
      >
        <code>Toolbar</code> only passes <code>name</code> through — it never uses it. Rewire this
        with Context so <code>Toolbar</code> doesn't need to know <code>name</code> exists at all.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="When should you reach for Context instead of just passing props, and what are its downsides?"
        answer={
          <p>
            Context earns its keep for data many distant, unrelated components need — theme,
            current user, locale, feature flags — where prop drilling through components that
            don't themselves use the data becomes unwieldy. It's not a general-purpose state
            manager, though: every consumer re-renders whenever the value changes, with no
            fine-grained subscription like a dedicated state library offers, so the Provider's
            value should be memoized and Context should be avoided for high-frequency changing
            data (like tracking every keystroke or mouse position), since that would re-render
            every consumer on every change. For complex or frequently-updating global state,
            purpose-built tools — Redux, Zustand, Jotai, or React Query for server data — usually
            scale better.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Context lets you share a value with an entire subtree, without passing it through props at every level.",
          "Three steps: createContext(), wrap a subtree in <MyContext.Provider value={...}>, read it anywhere below with useContext().",
          "Every component reading that context re-renders whenever the value changes, no matter how deep.",
          "Memoize object/array Provider values, and reserve Context for data many distant components need — not everything.",
        ]}
      />
    </>
  )
}
