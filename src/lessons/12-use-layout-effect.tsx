import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const timingCode = `// useEffect — runs AFTER the browser paints
useEffect(() => {
  measureAndReposition();
}, []);

// useLayoutEffect — runs BEFORE the browser paints
useLayoutEffect(() => {
  measureAndReposition();
}, []);`

const timingSteps: WalkthroughStep[] = [
  {
    id: "t1",
    label: "React commits the new DOM",
    detail:
      "Your component returned new JSX, React updated the actual DOM nodes to match. The browser has not drawn anything to the screen yet.",
    lines: 1,
  },
  {
    id: "t2",
    label: "useLayoutEffect runs here — synchronously",
    detail:
      "Before a single pixel is painted, React pauses and runs every useLayoutEffect. You can measure the DOM and make more changes, and the browser will paint the FINAL result — the user never sees the in-between state.",
    lines: 7,
  },
  {
    id: "t3",
    label: "The browser paints",
    detail:
      "Only now does anything actually appear on screen, reflecting whatever useLayoutEffect changed.",
    lines: 3,
  },
  {
    id: "t4",
    label: "useEffect runs here — after the paint",
    detail:
      "The user has already seen the result. If this effect changes the DOM in a way that affects layout, they'll see a flash: the wrong thing, then a flicker to the right thing.",
    lines: 3,
  },
]

const flickerDemo = `
function Tooltip() {
  const [text, setText] = useState("short");
  const boxRef = useRef(null);
  const [left, setLeft] = useState(0);

  // useEffect: the browser paints BEFORE this runs, so growing the
  // text first paints at the wrong position, then jumps — watch closely
  useEffect(() => {
    if (boxRef.current) {
      const width = boxRef.current.offsetWidth;
      setLeft(200 - width / 2);
    }
  }, [text]);

  return (
    <div style={{ position: "relative", height: 60 }}>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          left,
          background: "#1f2937",
          color: "white",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 13,
          whiteSpace: "nowrap",
        }}
      >
        {text === "short" ? "Hi" : "This is a much longer tooltip"}
      </div>
      <button
        style={{ position: "absolute", top: 36 }}
        onClick={() => setText((t) => (t === "short" ? "long" : "short"))}
      >
        Toggle text
      </button>
    </div>
  );
}

render(<Tooltip />);
`

const fixedDemo = `
function Tooltip() {
  const [text, setText] = useState("short");
  const boxRef = useRef(null);
  const [left, setLeft] = useState(0);

  // useLayoutEffect: runs and repositions BEFORE the browser paints,
  // so the user only ever sees the correctly centred version
  useLayoutEffect(() => {
    if (boxRef.current) {
      const width = boxRef.current.offsetWidth;
      setLeft(200 - width / 2);
    }
  }, [text]);

  return (
    <div style={{ position: "relative", height: 60 }}>
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          left,
          background: "#1f2937",
          color: "white",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 13,
          whiteSpace: "nowrap",
        }}
      >
        {text === "short" ? "Hi" : "This is a much longer tooltip"}
      </div>
      <button
        style={{ position: "absolute", top: 36 }}
        onClick={() => setText((t) => (t === "short" ? "long" : "short"))}
      >
        Toggle text
      </button>
    </div>
  );
}

render(<Tooltip />);
`

const challengeStarter = `
function AutoHeight() {
  const [lines, setLines] = useState(1);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  // TODO: change this to useLayoutEffect so the box resizes
  // before the browser paints, instead of flickering afterwards
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [lines]);

  return (
    <div>
      <div
        style={{
          height,
          overflow: "hidden",
          transition: "none",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        <div ref={contentRef} style={{ padding: 8 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <p key={i} style={{ margin: "4px 0" }}>Line {i + 1}</p>
          ))}
        </div>
      </div>
      <button onClick={() => setLines((l) => (l >= 4 ? 1 : l + 1))} style={{ marginTop: 8 }}>
        Add a line
      </button>
    </div>
  );
}

render(<AutoHeight />);
`

export default function UseLayoutEffectLesson() {
  return (
    <>
      <p>
        <code>useEffect</code> covers nearly everything you'll ever need. There's exactly one
        situation where its timing causes a real, visible bug — and React ships a second hook,{" "}
        <code>useLayoutEffect</code>, that exists solely to fix it.
      </p>

      <AnalogyCard title="useEffect reports after the show starts; useLayoutEffect edits the script before curtain-up.">
        Imagine a stage crew who only notices a prop is in the wrong place once the curtain has
        already opened and the audience is watching — they can fix it, but everyone saw the
        mistake first. <code>useLayoutEffect</code> is the same crew checking everything{" "}
        <em>before</em> the curtain opens, so the audience only ever sees the finished, correct
        scene.
      </AnalogyCard>

      <h2>The one difference: when it runs</h2>
      <p>
        Both hooks have an identical API. The only difference is timing relative to the browser
        painting the screen.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="Before the paint, or after it"
          filename="timing.js"
          code={timingCode}
          steps={timingSteps}
        />
      </div>

      <h2>See the flicker</h2>
      <p>
        This tooltip measures its own width after the text changes, then repositions itself to
        stay centred. Toggle the text a few times and watch closely — with{" "}
        <code>useEffect</code>, the box briefly appears at the old position before jumping to the
        new one.
      </p>
      <LiveCodeBlock code={flickerDemo} />

      <p>
        Same component, one word changed. The reposition now happens before anything reaches the
        screen — no jump, ever.
      </p>
      <LiveCodeBlock code={fixedDemo} />

      <Callout variant="warning" title="useLayoutEffect blocks painting — use it sparingly">
        Because it runs synchronously before the paint, slow work inside{" "}
        <code>useLayoutEffect</code> delays the browser from showing anything at all. It exists
        specifically for measuring and adjusting layout to prevent a visible flash — not as a
        general-purpose replacement for <code>useEffect</code>. Reach for it only when you're
        reading a DOM measurement and writing a style or state update in direct response to it.
      </Callout>

      <h2>The decision, in one line</h2>
      <p>
        Does the effect change something the user can visually see move, resize, or reposition,
        based on a DOM measurement? Use <code>useLayoutEffect</code>. Everything else — fetching
        data, subscriptions, logging, timers — stays <code>useEffect</code>. In server-rendered
        React, <code>useLayoutEffect</code> also produces a console warning when it runs on the
        server, since there's no DOM to measure yet, which is a good hint you're using it outside
        its actual use case.
      </p>

      <h2>Common mistake</h2>
      <CommonMistake
        title="reaching for useLayoutEffect out of habit or 'just in case'"
        wrong={`useLayoutEffect(() => {\n  fetchNotifications().then(setNotifications);\n}, []);\n\n// Blocks the browser from painting\n// anything until the fetch's promise\n// callback runs on the next microtask —\n// pure downside, no benefit`}
        right={`useEffect(() => {\n  fetchNotifications().then(setNotifications);\n}, []);\n\n// Fetching isn't a layout measurement —\n// there's nothing to synchronise with\n// the paint, so let it run after`}
        explanation={
          <p>
            <code>useLayoutEffect</code> only pays for itself when the alternative is a visible
            flicker. Data fetching, subscriptions, and anything else that doesn't touch layout
            gains nothing from running before the paint — it only adds a delay before the user
            sees anything at all.
          </p>
        }
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Stop the resize flicker"
        hint={<p>Change <code>useEffect</code> to <code>useLayoutEffect</code> — nothing else needs to change.</p>}
      >
        This box resizes to fit its content, but with <code>useEffect</code> you can catch it
        briefly showing the wrong height before snapping to the right one. Fix the flicker.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why does useLayoutEffect fix a visual flicker that useEffect can cause?"
        options={[
          { id: "a", text: "useLayoutEffect runs faster than useEffect" },
          { id: "b", text: "useLayoutEffect runs synchronously before the browser paints; useEffect runs after" },
          { id: "c", text: "useLayoutEffect has access to different DOM APIs" },
          { id: "d", text: "useEffect only runs once, so it can't respond to changes in time" },
        ]}
        correctId="b"
        explanation="The browser paints whatever React committed to the DOM before useEffect gets to run — so if that effect changes layout, the user briefly sees the wrong version. useLayoutEffect runs and finishes before the paint happens at all, so the browser only ever paints the final, corrected result."
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="When would you reach for useLayoutEffect instead of useEffect?"
        answer={
          <p>
            Specifically when an effect measures the DOM and then makes a visual change in direct
            response to that measurement — repositioning a tooltip based on its own rendered
            width, resizing a container to fit its content, or reading a scroll position to
            adjust something before the user sees it. In those cases <code>useEffect</code>{" "}
            genuinely produces a visible flicker: the browser paints the DOM as React first
            committed it, then the effect runs, changes something, and the browser paints again —
            two frames instead of one, and the first one is visibly wrong for an instant.{" "}
            <code>useLayoutEffect</code> runs synchronously before the first paint, so React
            commits the corrected result and the browser only ever draws one frame. The trade-off
            is that it blocks painting while it runs, so it should stay narrowly scoped to
            layout-and-measurement work — using it as a general default would make the whole app
            feel less responsive for no benefit, since most effects (fetching, subscriptions,
            logging) have nothing to synchronise with the paint in the first place.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useLayoutEffect has an identical API to useEffect — the only difference is when it runs.",
          "useEffect runs after the browser paints; useLayoutEffect runs synchronously before the paint.",
          "That timing difference matters only when an effect measures the DOM and changes layout in response — otherwise the two are interchangeable.",
          "Because it blocks painting, useLayoutEffect should stay narrowly scoped to measurement-and-reposition work, not used as a default.",
          "If in doubt, start with useEffect. Switch to useLayoutEffect only if you can actually see a flicker.",
        ]}
      />
    </>
  )
}
