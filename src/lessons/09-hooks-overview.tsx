import { Link } from "react-router-dom"
import { ArrowRight, ToggleLeft } from "lucide-react"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { Callout } from "@/components/lesson/callout"
import { lessons } from "@/lib/lessons-data"

const hookLessons = lessons.filter((lesson) => lesson.section === "hooks" && lesson.slug !== "hooks-overview")

export default function HooksOverview() {
  return (
    <>
      <p>
        You've already used one Hook: <code>useState</code>. This lesson steps back and explains
        what Hooks are as a category, then points you to a dedicated lesson for each one.
      </p>

      <h2>What is a Hook?</h2>
      <AnalogyCard title="Hooks are power tools you attach to a plain component.">
        On its own, a function component just takes props in and returns JSX out — it can't
        remember anything or reach outside itself. A Hook is a special function, always starting
        with <code>use</code>, that "plugs in" one extra capability: memory (<code>useState</code>),
        reacting to the outside world (<code>useEffect</code>), a direct handle to a DOM node (
        <code>useRef</code>), and more. Attach the tool you need, nothing you don't.
      </AnalogyCard>

      <h2>Why Hooks exist</h2>
      <p>
        Before Hooks, only class components could hold state or run code on mount/update — plain
        function components were "dumb," display-only. Sharing stateful logic between class
        components meant wrapping components in other components, several layers deep, just to
        pass behavior down. Hooks let a plain function component do everything a class could, and
        let you extract and reuse that logic directly as a function — no extra wrapping components
        required. You'll see this in the <strong>Custom Hooks</strong> lesson later.
      </p>

      <h2>The hook you already know</h2>
      <div className="not-prose">
        <Link
          to="/lessons/state"
          className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ToggleLeft className="size-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-medium text-foreground group-hover:text-primary">useState — component memory</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">Already covered in lesson 4. Revisit it any time.</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
        </Link>
      </div>

      <h2>The rest of the toolbox</h2>
      <p>Each of these gets its own lesson, with live examples and common mistakes to avoid.</p>
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {hookLessons.map((lesson) => {
          const Icon = lesson.icon
          return (
            <Link
              key={lesson.slug}
              to={`/lessons/${lesson.slug}`}
              className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-medium text-foreground group-hover:text-primary">{lesson.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{lesson.description}</span>
              </span>
            </Link>
          )
        })}
      </div>

      <h2>Two rules, always</h2>
      <p>
        Every Hook you'll ever use follows the same two rules. The dedicated{" "}
        <strong>Rules of Hooks</strong> lesson explains <em>why</em> — for now, just know they
        exist:
      </p>
      <ol>
        <li>
          <strong>Only call Hooks at the top level</strong> of a component — never inside an{" "}
          <code>if</code>, a loop, or a nested function.
        </li>
        <li>
          <strong>Only call Hooks from React functions</strong> — a component, or another Hook.
        </li>
      </ol>

      <CommonMistake
        title="calling a Hook conditionally"
        wrong={`if (isLoggedIn) {\n  const [name, setName] = useState("");\n}\n// breaks React's ability to track state`}
        right={`const [name, setName] = useState("");\nif (isLoggedIn) {\n  // use "name" conditionally instead\n}`}
        explanation={
          <p>
            The Hook call itself must always run, every render, in the same order. Put the
            condition <em>inside</em> the logic that uses the value, not around the Hook call.
          </p>
        }
      />

      <Callout variant="info">
        Function names starting with <code>use</code> are a convention React's linter relies on —
        it's how tools like <code>eslint-plugin-react-hooks</code> know to check a function for
        these rules.
      </Callout>

      <h2>Quick quiz</h2>
      <Quiz
        question="Which of these is a real Hook rule?"
        options={[
          { id: "a", text: "Hooks can only be used in components with fewer than 100 lines" },
          { id: "b", text: "Hooks must always be called in the same order on every render" },
          { id: "c", text: "You can only use one Hook per component" },
          { id: "d", text: "Hooks only work with TypeScript" },
        ]}
        correctId="b"
        explanation="React matches each Hook call to its stored data purely by the order it was called in. Calling Hooks conditionally or in loops can change that order between renders and silently corrupt state."
      />

      <KeyTakeaways
        items={[
          "A Hook is a function starting with \"use\" that gives a function component an extra capability.",
          "Hooks replaced the need for class components and complex wrapper patterns for sharing logic.",
          "useState, useEffect, useRef, useMemo, useCallback, and custom Hooks each solve a different problem.",
          "Every Hook must be called at the top level of a component or another Hook, unconditionally.",
        ]}
      />
    </>
  )
}
