import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CustomHookDiagram } from "@/components/diagram/custom-hook-diagram"

const toggleExample = `
function useToggle(initialValue) {
  const [on, setOn] = useState(initialValue);
  const toggle = () => setOn((prev) => !prev);
  return [on, toggle];
}

function WifiSwitch() {
  const [on, toggle] = useToggle(false);
  return <button onClick={toggle}>WiFi: {on ? "ON" : "OFF"}</button>;
}

function BluetoothSwitch() {
  const [on, toggle] = useToggle(true);
  return <button onClick={toggle}>Bluetooth: {on ? "ON" : "OFF"}</button>;
}

function Settings() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <WifiSwitch />
      <BluetoothSwitch />
    </div>
  );
}

render(<Settings />);
`

const challengeStarter = `
// TODO: turn this repeated logic into a custom hook called useCounter

function CounterA() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Counter A: {count}</button>
  );
}

function CounterB() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Counter B: {count}</button>
  );
}

function App() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <CounterA />
      <CounterB />
    </div>
  );
}

render(<App />);
`

export default function CustomHooksLesson() {
  return (
    <>
      <p>
        Once you've written the same <code>useState</code> + a bit of logic pattern in two
        different components, it's time to extract it. Custom Hooks let you package stateful
        logic into your own reusable function.
      </p>

      <AnalogyCard title="A custom Hook is a recipe card, not a shared meal.">
        Hand the same recipe card to three different cooks, and each of them follows the exact
        same steps — but they each end up with their own dish. Nobody is sharing a plate. A custom
        Hook works the same way: every component that calls it follows the same logic, but gets
        its own completely independent state.
      </AnalogyCard>

      <h2>What a custom Hook actually is</h2>
      <p>
        There's no special API for this — a custom Hook is just a regular JavaScript function,
        named starting with <code>use</code>, that calls other Hooks inside it.
      </p>
      <CustomHookDiagram />

      <h2>Extracting a useToggle Hook</h2>
      <p>
        Here, both switches need the exact same "on/off with a toggle function" logic. Instead of
        repeating <code>useState</code> and a toggle function in each one, it's extracted once.
      </p>
      <LiveCodeBlock code={toggleExample} />

      <Callout variant="tip">
        Click both switches — notice they're completely independent. That's the "recipe card, not
        a shared meal" idea in action: same logic, separate state.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title={'skipping the "use" prefix'}
        wrong={`function getToggleLogic(initial) {\n  const [on, setOn] = useState(initial);\n  // ESLint can't verify Hook rules here!\n  return [on, () => setOn((o) => !o)];\n}`}
        right={`function useToggle(initial) {\n  const [on, setOn] = useState(initial);\n  // starts with "use" — linter checks it properly\n  return [on, () => setOn((o) => !o)];\n}`}
        explanation={
          <p>
            The <code>use</code> prefix isn't just a style convention — it's how React's linter
            recognizes a function as a Hook and enforces the Rules of Hooks on it. Skip the
            prefix, and calling <code>useState</code> inside goes completely unchecked.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What makes a function a 'custom Hook' in React?"
        options={[
          { id: "a", text: "It's defined in a file named hooks.js" },
          { id: "b", text: "It starts with \"use\" and calls one or more other Hooks inside it" },
          { id: "c", text: "It returns JSX" },
          { id: "d", text: "It's wrapped in React.memo" },
        ]}
        correctId="b"
        explanation="A custom Hook is just a regular function, conventionally named starting with 'use', that calls other Hooks (useState, useEffect, etc.) inside it. No special React API is required to create one."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Extract a useCounter Hook"
        hint={
          <p>
            Write <code>{"function useCounter(initial = 0) { const [count, setCount] = useState(initial); const increment = () => setCount(count + 1); return [count, increment]; }"}</code>{" "}
            above both components, then replace their bodies with{" "}
            <code>const [count, increment] = useCounter();</code>.
          </p>
        }
      >
        <code>CounterA</code> and <code>CounterB</code> duplicate the same counting logic. Extract
        it into a <code>useCounter</code> custom Hook and use it in both.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why are custom Hooks considered a way to reuse logic but not state?"
        answer={
          <p>
            Each call to a custom Hook creates its own, completely independent instance of
            whatever state it manages internally — calling <code>useToggle()</code> in two
            different components gives each of them their own separate <code>on</code> value, not
            a shared one. What gets reused is the <strong>logic</strong> — the code that creates
            and updates that state — not the data itself. If multiple components actually need to
            share the same state, a custom Hook doesn't solve that; you'd lift the state up to a
            common parent, or use Context instead.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "A custom Hook is just a function starting with \"use\" that calls other Hooks inside it.",
          "It lets you extract and reuse stateful logic across components without duplicating code.",
          "Each component that calls it gets its own independent state — the logic is shared, the data isn't.",
          "The \"use\" prefix isn't optional — it's how React's linter enforces the Rules of Hooks on it too.",
        ]}
      />
    </>
  )
}
