import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const boundaryCode = `<Suspense fallback={<PageSkeleton />}>
  <Dashboard>
    <Suspense fallback={<ChartSkeleton />}>
      <RevenueChart />
    </Suspense>

    <Suspense fallback={<TableSkeleton />}>
      <RecentOrders />
    </Suspense>
  </Dashboard>
</Suspense>`

const boundarySteps: WalkthroughStep[] = [
  {
    id: "s1",
    label: "The outer boundary catches everything",
    detail:
      "While anything inside is still loading and has no closer boundary, the whole dashboard is replaced by PageSkeleton.",
    lines: [1, 11],
  },
  {
    id: "s2",
    label: "Inner boundaries catch first",
    detail:
      "Suspense bubbles up to the NEAREST boundary above the suspending component — not to the top. This one owns the chart alone.",
    range: [3, 5],
  },
  {
    id: "s3",
    label: "Siblings load independently",
    detail:
      "The orders table has its own boundary, so a slow chart no longer blocks it. Each region resolves on its own schedule.",
    range: [7, 9],
  },
  {
    id: "s4",
    label: "Boundary placement IS your loading design",
    detail:
      "Where you put the boundaries decides what the user sees mid-load. One boundary at the top means all-or-nothing; several means the page fills in progressively.",
    lines: [1, 3, 7],
  },
]

const lazyDemo = `
// A component that "suspends" — it throws a promise the first
// time it renders, then resolves with data.
let cache = null;
let promise = null;

function fetchGreeting() {
  if (cache) return cache;
  if (!promise) {
    promise = new Promise((resolve) =>
      setTimeout(() => {
        cache = "Hello from a suspended component!";
        resolve(cache);
      }, 1500)
    );
  }
  throw promise;
}

function Greeting() {
  const message = fetchGreeting();
  return <p style={{ fontWeight: 600 }}>{message}</p>;
}

function Demo() {
  const [show, setShow] = useState(false);

  if (!show) {
    return <button onClick={() => setShow(true)}>Load the greeting</button>;
  }

  return (
    <Suspense fallback={<p style={{ opacity: 0.6 }}>Loading…</p>}>
      <Greeting />
    </Suspense>
  );
}

render(<Demo />);
`

const nestedDemo = `
function makeResource(label, delay) {
  let cache = null;
  let promise = null;
  return function read() {
    if (cache) return cache;
    if (!promise) {
      promise = new Promise((resolve) =>
        setTimeout(() => {
          cache = label;
          resolve(cache);
        }, delay)
      );
    }
    throw promise;
  };
}

const readFast = makeResource("Fast panel ready (0.8s)", 800);
const readSlow = makeResource("Slow panel ready (2.5s)", 2500);

function Fast() {
  return <p>{readFast()}</p>;
}

function Slow() {
  return <p>{readSlow()}</p>;
}

function Demo() {
  const [go, setGo] = useState(false);
  if (!go) return <button onClick={() => setGo(true)}>Start loading</button>;

  return (
    <div style={{ textAlign: "left" }}>
      <Suspense fallback={<p style={{ opacity: 0.6 }}>Loading fast panel…</p>}>
        <Fast />
      </Suspense>
      <Suspense fallback={<p style={{ opacity: 0.6 }}>Loading slow panel…</p>}>
        <Slow />
      </Suspense>
    </div>
  );
}

render(<Demo />);
`

const challengeStarter = `
function makeResource(label, delay) {
  let cache = null;
  let promise = null;
  return function read() {
    if (cache) return cache;
    if (!promise) {
      promise = new Promise((resolve) =>
        setTimeout(() => {
          cache = label;
          resolve(cache);
        }, delay)
      );
    }
    throw promise;
  };
}

const readA = makeResource("Panel A loaded", 900);
const readB = makeResource("Panel B loaded", 2200);

function PanelA() { return <p>{readA()}</p>; }
function PanelB() { return <p>{readB()}</p>; }

function Demo() {
  const [go, setGo] = useState(false);
  if (!go) return <button onClick={() => setGo(true)}>Start</button>;

  // TODO: give PanelA and PanelB their OWN Suspense boundaries
  // so the fast one appears without waiting for the slow one.
  return (
    <Suspense fallback={<p style={{ opacity: 0.6 }}>Loading everything…</p>}>
      <PanelA />
      <PanelB />
    </Suspense>
  );
}

render(<Demo />);
`

export default function SuspenseLesson() {
  return (
    <>
      <p>
        You met <code>&lt;Suspense&gt;</code> in the code-splitting lesson as the thing that
        shows a spinner while a lazy chunk downloads. That's one use of a much more general
        idea: Suspense is React's built-in way to say <em>"this part of the tree isn't ready
        yet — show this instead."</em> Where you place those boundaries is a design decision,
        not a technical detail.
      </p>

      <AnalogyCard title="Suspense boundaries are like a restaurant serving courses.">
        A kitchen that waits until every dish is plated before anything leaves means you stare at
        an empty table. A kitchen that sends each course out as it's ready keeps you fed while
        the slow roast finishes. Each <code>&lt;Suspense&gt;</code> boundary is a decision about
        which dishes travel together.
      </AnalogyCard>

      <h2>Boundaries decide what the user sees</h2>
      <p>
        When a component suspends, React walks up the tree to the <strong>nearest</strong>{" "}
        <code>&lt;Suspense&gt;</code> above it and swaps in that fallback. Nothing outside that
        boundary is affected.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="Where the fallback appears"
          filename="Dashboard.jsx"
          code={boundaryCode}
          steps={boundarySteps}
        />
      </div>

      <h2>A component that suspends</h2>
      <p>
        Under the hood, "not ready yet" is signalled by throwing a promise while rendering. You
        will almost never write this by hand — a framework or data library does it for you — but
        seeing it once makes the whole mechanism click.
      </p>
      <LiveCodeBlock code={lazyDemo} />

      <Callout variant="warning" title="Don't ship hand-rolled promise throwing">
        The cache-and-throw pattern above is deliberately simplified to show the mechanism. Real
        apps get suspense-ready data from a framework or library that handles caching,
        invalidation, and request deduplication. Writing it yourself leaks memory and refetches
        in ways that are painful to debug.
      </Callout>

      <h2>Independent boundaries, independent loading</h2>
      <p>
        Two panels, two different speeds, two boundaries. The fast one appears at 0.8s without
        waiting for the slow one at 2.5s — that's the whole payoff.
      </p>
      <LiveCodeBlock code={nestedDemo} />

      <h2>Common mistake</h2>
      <CommonMistake
        title="one boundary at the very top of the app"
        wrong={`<Suspense fallback={<FullPageSpinner />}>\n  <Header />\n  <Sidebar />\n  <SlowReport />\n</Suspense>\n\n// The entire page is a spinner until the\n// slowest thing in it is ready — even the\n// header that had nothing to wait for`}
        right={`<Header />\n<Sidebar />\n<Suspense fallback={<ReportSkeleton />}>\n  <SlowReport />\n</Suspense>\n\n// Header and sidebar render instantly.\n// Only the part that actually waits\n// shows a placeholder`}
        explanation={
          <p>
            A single top-level boundary is the easiest thing to write and almost always the worst
            experience — it converts your entire page into an all-or-nothing load gated by its
            slowest component. Put boundaries around the specific regions that fetch, and let
            everything else render immediately.
          </p>
        }
      />

      <h2>Fallbacks should match the shape of what's coming</h2>
      <p>
        A centred spinner tells the user "something is happening." A skeleton that mirrors the
        real layout tells them what's about to appear <em>and</em> stops the page from jumping
        when content lands. Reserve the same space the real content will occupy.
      </p>
      <Callout variant="tip">
        If your fallback and your loaded content have different heights, the page shifts when
        loading finishes. That shift is measured by Cumulative Layout Shift, one of Google's Core
        Web Vitals — so matching the skeleton to the real layout is a ranking factor, not just
        a nicety.
      </Callout>

      <h2>Quick quiz</h2>
      <Quiz
        question="A component deep in the tree suspends. Which fallback does React show?"
        options={[
          { id: "a", text: "The fallback of the outermost Suspense boundary in the app" },
          { id: "b", text: "The fallback of the nearest Suspense boundary above it" },
          { id: "c", text: "Every fallback between it and the root, stacked" },
          { id: "d", text: "Nothing — the component renders empty until it's ready" },
        ]}
        correctId="b"
        explanation="React walks up from the suspending component and stops at the first Suspense boundary it finds. That's why adding a closer boundary shrinks the region that gets replaced — placement is how you control the loading experience."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Let the fast panel appear first"
        hint={
          <p>
            Wrap each panel separately:{" "}
            <code>{"<Suspense fallback={<p>Loading A…</p>}><PanelA /></Suspense>"}</code>, then do
            the same for <code>PanelB</code>.
          </p>
        }
      >
        Both panels currently share one boundary, so Panel A waits 2.2 seconds for Panel B even
        though it was ready at 0.9. Give each panel its own <code>&lt;Suspense&gt;</code> so the
        fast one shows up immediately.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What does Suspense actually do, and how does it relate to error boundaries?"
        answer={
          <p>
            <code>&lt;Suspense&gt;</code> declaratively handles the "not ready yet" state of a
            subtree. When a descendant suspends during render, React finds the nearest Suspense
            boundary above it and renders that boundary's <code>fallback</code> instead of the
            subtree, then retries once the work resolves. Structurally it's the mirror image of
            an error boundary: both catch a signal travelling up from a child and substitute
            replacement UI, one for "still loading" and one for "it failed." That's why they pair
            naturally — an error boundary wrapping a Suspense boundary covers both the pending
            and the failed path for the same region. The key practical insight is that boundary{" "}
            <em>placement</em> defines the loading experience: one boundary at the root makes the
            page all-or-nothing, while boundaries around each fetching region let the page fill
            in progressively.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Suspense shows a fallback while part of the tree isn't ready, then swaps in the real content when it is.",
          "React uses the NEAREST Suspense boundary above the suspending component — placement decides how much of the screen is replaced.",
          "One boundary at the root makes the whole page wait for its slowest component; several boundaries let regions load independently.",
          "Fallbacks should mirror the real layout, not just show a spinner, so content doesn't jump when it arrives.",
          "Suspense is the loading counterpart to error boundaries: one catches 'pending', the other catches 'failed'.",
        ]}
      />
    </>
  )
}
