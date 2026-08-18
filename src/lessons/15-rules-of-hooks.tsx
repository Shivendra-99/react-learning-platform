import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { HookOrderDiagram } from "@/components/diagram/hook-order-diagram"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const breakItExample = `
function Profile({ show }) {
  if (show) {
    const [liked, setLiked] = useState(false);
  }
  return <p>Toggle the button, then read the error below.</p>;
}

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <Profile show={show} />
    </div>
  );
}

render(<App />);
`

const challengeStarter = `
function Profile({ user }) {
  if (!user) {
    return <p>Loading...</p>;
  }

  // TODO: this Hook is called AFTER a possible early return — move it above the if
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}

render(<Profile user={{ name: "Ada" }} />);
`

export default function RulesOfHooksLesson() {
  return (
    <>
      <p>
        You've now met five Hooks. All of them share the exact same two rules — and unlike most
        JavaScript rules, breaking these doesn't just cause a bug, it silently corrupts your
        component's state. This lesson explains why.
      </p>

      <AnalogyCard title="Hooks are a numbered coat check, not a name tag.">
        A coat check attendant doesn't remember your coat by your name — they hand you a numbered
        ticket, and later find your coat by matching that number. React does the same thing with
        Hook calls: the 1st Hook call in your component always reads ticket #0, the 2nd always
        reads ticket #1, and so on. If some renders skip a ticket and others don't, the numbers
        stop lining up — and you go home with someone else's coat.
      </AnalogyCard>

      <h2>Order is the entire mechanism</h2>
      <p>
        React doesn't know your Hooks by their variable names — it only knows the{" "}
        <strong>order</strong> they were called in. Toggle between the two tabs below.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="consistent">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consistent">Consistent order</TabsTrigger>
            <TabsTrigger value="conditional">Conditional call</TabsTrigger>
          </TabsList>
          <TabsContent value="consistent" className="mt-3">
            <HookOrderDiagram variant="consistent" />
          </TabsContent>
          <TabsContent value="conditional" className="mt-3">
            <HookOrderDiagram variant="conditional" />
          </TabsContent>
        </Tabs>
      </div>

      <h2>The two rules</h2>
      <ol>
        <li>
          <strong>Only call Hooks at the top level.</strong> Never inside an <code>if</code>, a
          loop, a nested function, or after an early <code>return</code>.
        </li>
        <li>
          <strong>Only call Hooks from React functions.</strong> A component, or another custom
          Hook — never a regular helper function.
        </li>
      </ol>

      <h2>What this looks like broken</h2>
      <p>
        Here's the rule violated directly: <code>Profile</code> only calls <code>useState</code>{" "}
        when <code>show</code> is true, so it calls a different number of Hooks depending on the
        render. In a real app, toggling this throws{" "}
        <code>"Rendered fewer Hooks than expected"</code> — React catching the exact corruption
        the diagram above describes.
      </p>
      <LiveCodeBlock code={breakItExample} />
      <Callout variant="warning">
        Depending on your React version and environment, this may fail loudly with an error, or
        fail silently by mixing up state. Either way, the code is broken — never leave a Hook call
        like this in real code, whether or not it happens to crash for you locally.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="a Hook call after an early return"
        wrong={`function Profile({ user }) {\n  if (!user) {\n    return <p>Loading...</p>;\n  }\n  const [liked, setLiked] = useState(false);\n  // sometimes runs, sometimes doesn't!\n  ...\n}`}
        right={`function Profile({ user }) {\n  const [liked, setLiked] = useState(false);\n  // always runs first, no matter what\n  if (!user) {\n    return <p>Loading...</p>;\n  }\n  ...\n}`}
        explanation={
          <p>
            It's not only <code>if</code> statements wrapped directly around a Hook that break the
            rule — any early <code>return</code> that happens <em>before</em> a Hook call has the
            same effect. Always call every Hook before any conditional return.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why can't you call useState inside an if statement?"
        options={[
          { id: "a", text: "It's just a style preference, not actually enforced" },
          { id: "b", text: "React matches Hook calls to their stored data purely by call order, and a conditional call can shift that order between renders" },
          { id: "c", text: "useState only works on even-numbered lines of code" },
          { id: "d", text: "It works fine — ESLint is just being overly cautious" },
        ]}
        correctId="b"
        explanation="React has no other way to know which stored data belongs to which useState call except the order they're called in. A conditional call can change that order from one render to the next, corrupting which value each Hook call reads."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Fix the Hook order"
        hint={<p>Cut the <code>useState</code> line and paste it as the very first line in the function, before the <code>if</code>.</p>}
      >
        Move the <code>useState</code> call so it always runs before the early return.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How does React know which stored state belongs to which useState call?"
        answer={
          <p>
            React doesn't match Hook calls by name or by the variable they're assigned to — it
            matches them purely by the <strong>order</strong> they're called in during a render,
            per component instance. Internally, each component's Hook calls are stored in an
            ordered list on that component's fiber: the first <code>useState</code> call always
            reads/writes slot 0, the second always slot 1, and so on. This only works if the exact
            same sequence of Hook calls happens on every render — which is precisely why Hooks
            can't be called conditionally, in loops, or after an early return: any of those could
            change how many Hooks run or their order, silently corrupting which stored value each
            call reads.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "React matches each Hook call to its stored data by call ORDER, not by name.",
          "Every render of a component must call the exact same Hooks, in the exact same order.",
          "Never call a Hook inside a condition, a loop, or after an early return.",
          "Only call Hooks from React components or other custom Hooks — never from a regular function.",
        ]}
      />
    </>
  )
}
