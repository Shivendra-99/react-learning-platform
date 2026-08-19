import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const testCode = `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { LoginForm } from "./LoginForm";

test("shows an error when the password is too short", async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={() => {}} />);

  await user.type(screen.getByLabelText("Email"), "a@b.com");
  await user.type(screen.getByLabelText("Password"), "123");
  await user.click(screen.getByRole("button", { name: "Log in" }));

  expect(
    await screen.findByText("Password must be at least 8 characters")
  ).toBeVisible();
});`

const testSteps: WalkthroughStep[] = [
  {
    id: "t1",
    label: "The test name is the requirement",
    detail:
      "Written as a sentence about behaviour, not implementation. When this fails in CI, the name alone should tell you what broke for the user.",
    lines: 6,
  },
  {
    id: "t2",
    label: "Render the component, not its internals",
    detail:
      "You mount the real component with real props. No shallow rendering, no reaching into state — the test only sees what a browser would.",
    lines: 8,
  },
  {
    id: "t3",
    label: "Query the way a user would find things",
    detail:
      "getByLabelText and getByRole locate elements by their accessible name. If your test can't find the input by its label, neither can a screen reader.",
    range: [10, 12],
  },
  {
    id: "t4",
    label: "Interact like a user, too",
    detail:
      "userEvent fires the full sequence a real interaction produces — focus, keydown, input, change — rather than one synthetic event.",
    range: [10, 12],
  },
  {
    id: "t5",
    label: "Assert on what's visible",
    detail:
      "The assertion is about the message a person sees. Nothing here mentions state, props, or the component's internal structure.",
    range: [14, 16],
  },
  {
    id: "t6",
    label: "findBy waits, getBy doesn't",
    detail:
      "findByText retries until the element appears or it times out — the right tool when the change is async. getBy throws immediately if it isn't already there.",
    lines: 15,
  },
]

export default function TestingReactLesson() {
  return (
    <>
      <p>
        The tests worth writing are the ones that fail when your app breaks and stay quiet when
        you refactor. That sounds obvious, but it rules out most of what people instinctively
        test — internal state, prop plumbing, whether a specific function was called. Test what
        the user experiences and your suite becomes an asset instead of a maintenance tax.
      </p>

      <AnalogyCard title="Test the car, not the wiring diagram.">
        A road test checks that the brakes stop the car. It doesn't care which hydraulic line
        runs where — swap the brake system for a better one and the test still passes, because
        the car still stops. A test bolted to the wiring fails the moment you improve anything,
        while telling you nothing about whether the car is safe.
      </AnalogyCard>

      <h2>What a good test looks like</h2>
      <div className="not-prose">
        <CodeWalkthrough
          title="A behaviour-focused test"
          filename="LoginForm.test.jsx"
          code={testCode}
          steps={testSteps}
        />
      </div>

      <Callout variant="info" title="The stack">
        <strong>Vitest</strong> runs the tests and shares Vite's config, so your path aliases and
        transforms just work. <strong>React Testing Library</strong> renders components and
        queries them like a user. <strong>@testing-library/user-event</strong> simulates realistic
        interaction. <strong>jsdom</strong> provides the fake DOM they run against.
      </Callout>

      <h2>Query priority</h2>
      <p>
        Testing Library deliberately makes accessible queries the easiest to write and
        implementation-coupled ones awkward. Work down this list and stop at the first that
        fits.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="best">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="best">Prefer</TabsTrigger>
            <TabsTrigger value="ok">Acceptable</TabsTrigger>
            <TabsTrigger value="last">Last resort</TabsTrigger>
          </TabsList>
          <TabsContent value="best" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`// Everyone can find these — including
// assistive technology
screen.getByRole("button", { name: "Save" })
screen.getByLabelText("Email address")
screen.getByPlaceholderText("you@example.com")
screen.getByText("Welcome back")

// A failing getByRole often means a real
// accessibility bug, not a bad test`}</pre>
          </TabsContent>
          <TabsContent value="ok" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`// Fine when there's no accessible name
// available — an icon-only button, say
screen.getByAltText("Company logo")
screen.getByTitle("Close")
screen.getByDisplayValue("current input value")`}</pre>
          </TabsContent>
          <TabsContent value="last" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`// Invisible to users; couples the test to
// markup. Reach for it only when nothing
// else can identify the element.
screen.getByTestId("submit-button")

// If you need this often, the component
// probably has an accessibility problem
// worth fixing instead.`}</pre>
          </TabsContent>
        </Tabs>
      </div>

      <h2>Common mistake</h2>
      <CommonMistake
        title="testing implementation details instead of behaviour"
        wrong={`test("increments count state", () => {\n  const { result } = renderHook(\n    () => useCounter()\n  );\n\n  act(() => result.current.increment());\n\n  expect(result.current.count).toBe(1);\n});\n\n// Rename count → total and this fails,\n// even though the app works perfectly`}
        right={`test("shows the new total after clicking", async () => {\n  const user = userEvent.setup();\n  render(<Counter />);\n\n  await user.click(\n    screen.getByRole("button", { name: "Add" })\n  );\n\n  expect(screen.getByText("Total: 1"))\n    .toBeVisible();\n});\n\n// Survives any internal refactor that\n// keeps the behaviour intact`}
        explanation={
          <p>
            A test coupled to internal names fails on refactors that changed nothing a user can
            see, and passes when the component is visibly broken — exactly backwards. Test
            through the public surface: render it, interact with it, assert on what appears.{" "}
            <code>renderHook</code> has its place for genuinely reusable library hooks, but it's
            the wrong default for application code.
          </p>
        }
      />

      <h2>What's worth testing</h2>
      <p>
        You don't need to cover everything. Aim at the places where a bug would actually hurt:
        conditional rendering, form validation and submission, async states (loading, error,
        empty), and any logic with real branching. Skip tests that only assert a component
        rendered some static text.
      </p>
      <Callout variant="tip" title="Coverage is a diagnostic, not a target">
        A number like "80% coverage" measures which lines executed, not whether anything
        meaningful was asserted. A suite can hit every line and verify nothing. Use coverage to
        find untested areas you'd forgotten, never as a goal to chase.
      </Callout>

      <h2>Setting it up in this project</h2>
      <p>
        This site has no test suite yet. Adding one is three steps: install the dependencies,
        point Vite at jsdom, and write the first test next to the component it covers.
      </p>
      <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`npm i -D vitest jsdom @testing-library/react \\
  @testing-library/user-event @testing-library/jest-dom

// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.js",
  },
});

// src/test-setup.js
import "@testing-library/jest-dom/vitest";`}</pre>

      <h2>Quick quiz</h2>
      <Quiz
        question="Why does Testing Library push you toward getByRole over getByTestId?"
        options={[
          { id: "a", text: "getByRole runs measurably faster" },
          { id: "b", text: "It finds elements the way users and assistive technology do, so tests reflect real usage" },
          { id: "c", text: "Test IDs are removed in production builds" },
          { id: "d", text: "getByTestId can only match one element per test file" },
        ]}
        correctId="b"
        explanation="Roles and accessible names are how real users — especially those using screen readers — locate things. Querying that way means your test exercises the same surface, and a query that fails to find a button often points at a genuine accessibility bug. A test ID is invisible to users and couples the test to markup."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Rewrite a brittle test"
        hint={
          <p>
            Render <code>&lt;ThemeToggle /&gt;</code>, click{" "}
            <code>{'screen.getByRole("button", { name: /theme/i })'}</code>, then assert on the
            text or accessible name the user would now see.
          </p>
        }
      >
        Imagine a test that asserts <code>{"expect(component.state.isDark).toBe(true)"}</code>{" "}
        after toggling a theme switch. Sketch out how you'd rewrite it as a behaviour test — what
        would you render, what would you click, and what would you assert on that a user could
        actually perceive?
      </Challenge>

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How do you decide what to test in a React application?"
        answer={
          <p>
            I start from the question "if this broke, would a user notice?" That points at
            behaviour rather than structure: form validation and submission, conditional
            rendering, async states, and anything with real branching logic. I write those as
            integration-style component tests — render the component with real children, interact
            through accessible queries, assert on visible output — because they survive
            refactors and catch the bugs that actually ship. I avoid asserting on internal state
            or whether a particular internal function was called, since those fail on harmless
            refactors and pass on visibly broken components. Pure logic that isn't tied to
            rendering — a reducer, a formatting utility — I test directly as plain functions,
            which is one practical argument for pulling complex state transitions into a reducer
            in the first place. And I treat coverage as a diagnostic for finding blind spots, not
            a target, because a suite can execute every line while asserting nothing meaningful.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Test behaviour a user can observe, not internal state, prop plumbing, or which functions were called.",
          "Query with getByRole and getByLabelText first; getByTestId is a last resort that couples tests to markup.",
          "Use userEvent rather than fireEvent — it simulates the full realistic interaction sequence.",
          "findBy* retries and awaits async changes; getBy* throws immediately if the element isn't already present.",
          "Prioritise conditional rendering, form validation, and async states; treat coverage as a diagnostic rather than a goal.",
        ]}
      />
    </>
  )
}
