import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { DifficultyLevels } from "@/components/lesson/difficulty-levels"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { ReactLoopDiagram } from "@/components/diagram/react-loop-diagram"

const example = `
function Welcome() {
  return <h2>Hello, I'm a React component 👋</h2>;
}

render(<Welcome />);
`

export default function WhatIsReact() {
  return (
    <>
      <p>
        React is a JavaScript library for building user interfaces. Instead of manually updating
        the DOM step by step, you describe <strong>what the UI should look like</strong> for any
        given state of your data, and React figures out how to update the screen to match.
      </p>

      <h2>See it in action</h2>
      <p>
        Every React app, from a single button to a full dashboard, runs the same loop. This is
        the mental model to keep in your head for the rest of this course.
      </p>
      <ReactLoopDiagram />

      <h2>What is React, really?</h2>
      <AnalogyCard title="React is like a whiteboard assistant that redraws for you.">
        Imagine a whiteboard covered in notes. Normally, when something changes, you have to find
        the right spot, erase it, and rewrite it by hand — and it's easy to erase the wrong thing.
        React is an assistant standing at the board: you just tell it "here's what the board
        should say now," and it figures out exactly which words changed and rewrites{" "}
        <em>only those</em>, instantly and correctly, every single time.
      </AnalogyCard>

      <DifficultyLevels
        simple={<p>React is a tool for building websites out of small, reusable pieces called components. When your data changes, React updates the screen for you.</p>}
        developer={
          <p>
            React is a declarative, component-based JavaScript library for building UIs. You
            write components that return a description of the UI (JSX), and React handles
            translating that description into real DOM updates, re-running components whenever
            their state or props change.
          </p>
        }
        interview={
          <p>
            React is a library (not a framework) focused on the view layer. It uses a virtual DOM
            to diff successive render outputs and apply the minimal set of real DOM mutations
            needed, batches state updates for performance, and organizes UI as a tree of
            composable components with unidirectional data flow.
          </p>
        }
      />

      <h2>Why not just use plain JavaScript?</h2>
      <p>
        You can absolutely build a UI with plain JavaScript — find an element, change its text,
        add a class, repeat. The problem shows up as your app grows: you end up manually tracking
        which parts of the page depend on which pieces of data, and one missed update leaves the
        screen out of sync with reality.
      </p>
      <CommonMistake
        title="reaching for manual DOM updates"
        wrong={`document.getElementById("count")\n  .textContent = count + 1;\n// you must remember every place\n// that needs to change, by hand`}
        right={`function Counter() {\n  const [count, setCount] = useState(0);\n  return <p>{count}</p>;\n}\n// describe the result — React finds\n// and updates only what changed`}
        explanation={
          <p>
            The imperative version works for one counter. The declarative version works the same
            way whether your UI has one element or ten thousand — you never write update logic by
            hand.
          </p>
        }
      />

      <h2>Your first component</h2>
      <p>
        Below is a real, running React component. The left side is editable code, the right side
        is the live result. Try changing the text inside the <code>&lt;h2&gt;</code> tag.
      </p>
      <LiveCodeBlock code={example} />

      <Callout variant="tip">
        Every example in this course works exactly like this one — read the explanation, then
        experiment directly in the editor. You can't break anything; click{" "}
        <strong>Reset</strong> to restore the original code.
      </Callout>

      <Challenge hint={<p>Change the string inside the quotes, e.g. <code>const name = "Ada";</code></p>}>
        Open the editor above and add a second line that renders a <code>&lt;p&gt;</code> with
        your own name in it.
      </Challenge>

      <h2>Quick quiz</h2>
      <Quiz
        question="What does React do when the data behind your UI changes?"
        options={[
          { id: "a", text: "It reloads the entire page from the server" },
          { id: "b", text: "Nothing — you must manually update the DOM yourself" },
          { id: "c", text: "It figures out what changed and updates only that part of the screen" },
          { id: "d", text: "It rewrites your JavaScript file" },
        ]}
        correctId="c"
        explanation="React compares what the UI should look like now against what it looked like before, and applies only the minimal set of changes to the real page — no manual DOM surgery, no full reload."
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What specific problem does React solve compared to plain JavaScript DOM manipulation?"
        answer={
          <p>
            As an app grows, keeping the DOM in sync with application state by hand becomes error
            prone — every place data is used needs its own manual update code, and it's easy to
            forget one. React solves this by letting you describe the UI <strong>declaratively</strong>{" "}
            as a function of state: you return what the UI should look like, and React's
            reconciliation process diffs that against the previous output and applies only the
            necessary DOM updates. This removes an entire class of "forgot to update this bit of
            the page" bugs and makes UI code easier to reason about as it scales.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "React lets you describe what the UI should look like, not how to update it step by step.",
          "A React app is built from small, reusable pieces called components.",
          "When data changes, React figures out what changed and updates only that part of the page.",
          "This is called declarative UI, as opposed to manually manipulating the DOM (imperative UI).",
        ]}
      />
    </>
  )
}
