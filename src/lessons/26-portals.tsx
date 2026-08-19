import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const portalCode = `import { createPortal } from "react-dom";

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function Card() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ overflow: "hidden" }}>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        I escape the clipping parent.
      </Modal>
    </div>
  );
}`

const portalSteps: WalkthroughStep[] = [
  {
    id: "p1",
    label: "createPortal takes two arguments",
    detail:
      "The JSX you want to render, and the real DOM node you want it to land in. Everything else about the component stays normal.",
    lines: [6, 13],
  },
  {
    id: "p2",
    label: "The second argument is the destination",
    detail:
      "document.body here, but it can be any existing DOM node — commonly a dedicated <div id=\"modal-root\"> sibling of your app root.",
    lines: 13,
  },
  {
    id: "p3",
    label: "The parent still owns the state",
    detail:
      "Modal is rendered inside Card in the React tree, so it reads Card's props and context exactly as any child would. Only the DOM placement changed.",
    range: [26, 31],
  },
  {
    id: "p4",
    label: "Which is why events still bubble to Card",
    detail:
      "React events follow the REACT tree, not the DOM tree. A click inside the portal bubbles to handlers on Card, even though the DOM nodes are nowhere near each other.",
    range: [7, 11],
  },
  {
    id: "p5",
    label: "And why overflow: hidden can't clip it",
    detail:
      "The overlay is a child of document.body in the actual DOM, so this container's clipping and z-index simply don't apply to it. That's the whole point.",
    lines: 29,
  },
]

const clippingDemo = `
function Demo() {
  const [openInline, setOpenInline] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);

  const box = {
    overflow: "hidden",
    border: "2px dashed #888",
    borderRadius: 8,
    padding: 12,
    height: 90,
    position: "relative",
    marginBottom: 12,
  };

  const popup = {
    position: "absolute",
    top: 60,
    left: 12,
    background: "#4f46e5",
    color: "white",
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 13,
  };

  return (
    <div style={{ textAlign: "left", minWidth: 260 }}>
      <div style={box}>
        <button onClick={() => setOpenInline(!openInline)}>
          Toggle normal popup
        </button>
        {openInline && <div style={popup}>I get cut off ✂️</div>}
      </div>

      <div style={box}>
        <button onClick={() => setOpenPortal(!openPortal)}>
          Toggle portal popup
        </button>
        {openPortal &&
          createPortal(
            <div
              style={{
                position: "fixed",
                bottom: 20,
                left: 20,
                background: "#16a34a",
                color: "white",
                padding: "8px 12px",
                borderRadius: 6,
                fontSize: 13,
                zIndex: 9999,
              }}
            >
              I escaped to document.body 🚀
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}

render(<Demo />);
`

const bubblingDemo = `
function Demo() {
  const [log, setLog] = useState([]);
  const [open, setOpen] = useState(false);

  function handleParentClick() {
    setLog((prev) => [...prev, "Parent heard the click"].slice(-3));
  }

  return (
    <div onClick={handleParentClick} style={{ textAlign: "left", minWidth: 260 }}>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        This whole box has an onClick handler.
      </p>
      <button onClick={() => setOpen(true)}>Open portal</button>

      {open &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ background: "white", color: "black", padding: 20, borderRadius: 8 }}>
              <p style={{ marginTop: 0 }}>Click me — the parent still hears it.</p>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>,
          document.body
        )}

      <ul style={{ fontSize: 13 }}>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

render(<Demo />);
`

const challengeStarter = `
function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ overflow: "hidden", height: 80, border: "2px dashed #888", padding: 12 }}>
      <button onClick={() => setOpen(!open)}>Toggle tooltip</button>

      {/* TODO: wrap this div in createPortal(..., document.body)
          so it isn't clipped by the overflow: hidden parent */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            background: "#4f46e5",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
          }}
        >
          Can you see all of me?
        </div>
      )}
    </div>
  );
}

render(<Demo />);
`

export default function PortalsLesson() {
  return (
    <>
      <p>
        Sooner or later you build a modal, and it gets cut in half by a parent with{" "}
        <code>overflow: hidden</code>. Or a dropdown that hides behind a sticky header no matter
        what <code>z-index</code> you throw at it. Portals fix this properly: they let a
        component render its DOM somewhere else entirely, while staying exactly where it was in
        your React tree.
      </p>

      <AnalogyCard title="A portal is a mailing address that differs from where you live.">
        You still live with your family — same household, same shared context, same people you
        answer to. But your mail gets delivered to a PO box across town. Portals split those two
        ideas apart: the React tree decides who your parents are, the DOM tree decides where your
        nodes physically sit.
      </AnalogyCard>

      <h2>How a portal is wired up</h2>
      <div className="not-prose">
        <CodeWalkthrough
          title="createPortal, line by line"
          filename="Modal.jsx"
          code={portalCode}
          steps={portalSteps}
        />
      </div>

      <h2>The clipping problem, side by side</h2>
      <p>
        Both boxes below have <code>overflow: hidden</code>. The first popup is a normal child
        and gets sliced off at the border. The second is portalled to{" "}
        <code>document.body</code> and appears in full at the bottom-left of your screen.
      </p>
      <LiveCodeBlock code={clippingDemo} />

      <Callout variant="info" title="Why z-index alone doesn't save you">
        A parent with <code>overflow: hidden</code>, <code>transform</code>, or{" "}
        <code>filter</code> creates a containing block its children can never escape — no
        <code>z-index</code> value gets a child out of it. Moving the node out of that subtree in
        the DOM is the only real fix, and that's exactly what a portal does.
      </Callout>

      <h2>Events still follow the React tree</h2>
      <p>
        This surprises almost everyone the first time. The overlay below is a direct child of{" "}
        <code>document.body</code> in the DOM, yet clicking inside it fires the{" "}
        <code>onClick</code> on the outer box — because React propagates events through the tree
        you wrote, not the tree the browser ended up with.
      </p>
      <LiveCodeBlock code={bubblingDemo} />

      <h2>Common mistake</h2>
      <CommonMistake
        title="assuming a portal escapes event bubbling too"
        wrong={`<div onClick={closeDropdown}>\n  <button>Menu</button>\n  {createPortal(\n    <Dropdown />,\n    document.body\n  )}\n</div>\n\n// Clicking anything inside Dropdown\n// bubbles up and closes it immediately`}
        right={`<div onClick={closeDropdown}>\n  <button>Menu</button>\n  {createPortal(\n    <div onClick={(e) => e.stopPropagation()}>\n      <Dropdown />\n    </div>,\n    document.body\n  )}\n</div>\n\n// The portal's own handler stops the\n// click before it reaches the parent`}
        explanation={
          <p>
            Portals change where nodes land in the DOM, not how React events travel. A click
            inside the portal still bubbles to every React ancestor — which produces
            "my dropdown closes the instant I click anything in it." Stop propagation at the
            portal's root, or check <code>event.target</code> before acting.
          </p>
        }
      />

      <h2>Don't forget accessibility</h2>
      <p>
        Moving a modal to the end of the body is only half the job. A real dialog also needs to
        trap focus while it's open, return focus to the trigger when it closes, close on{" "}
        <kbd>Esc</kbd>, and mark the rest of the page as inert for screen readers.
      </p>
      <Callout variant="tip" title="Use a headless library for real dialogs">
        This is exactly what Radix, React Aria, and Headless UI solve — and it's what powers the
        search palette in this site's header. They handle portalling, focus trapping, scroll
        locking, and ARIA wiring together. Hand-rolling all of that correctly is a lot more work
        than it looks.
      </Callout>

      <h2>Quick quiz</h2>
      <Quiz
        question="A button inside a portal is clicked. Which components see the event bubble?"
        options={[
          { id: "a", text: "Only ancestors of the DOM node the portal renders into" },
          { id: "b", text: "The React ancestors of the portal, as written in JSX" },
          { id: "c", text: "Neither — portals stop event propagation entirely" },
          { id: "d", text: "Both DOM ancestors and React ancestors" },
        ]}
        correctId="b"
        explanation="React's synthetic events propagate through the React tree, so the event reaches the components that render the portal in JSX — not the DOM ancestors of the destination node. This is why a portalled dropdown can accidentally trigger its parent's click handler."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Free the tooltip from its clipping parent"
        hint={
          <p>
            Wrap the whole conditional element:{" "}
            <code>{"{open && createPortal(<div style={...}>…</div>, document.body)}"}</code>
          </p>
        }
      >
        The tooltip is currently a normal child of a box with <code>overflow: hidden</code>, so
        it's clipped. Wrap it in <code>createPortal</code> targeting{" "}
        <code>document.body</code> so it renders in full.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What problem do portals solve, and what surprises people about them?"
        answer={
          <p>
            Portals let a component render its DOM output into a different part of the document
            while remaining in the same position in the React tree. The problem they solve is
            CSS containment: a parent with <code>overflow: hidden</code>,{" "}
            <code>transform</code>, or a stacking context will clip or trap its descendants no
            matter what <code>z-index</code> you apply, which breaks modals, dropdowns, and
            tooltips. Rendering into <code>document.body</code> sidesteps that entirely. The
            surprise is that <em>only</em> the DOM placement changes — context still flows down
            normally, and React's synthetic events still bubble through the React tree rather
            than the DOM tree. That last part causes real bugs: a click inside a portalled
            dropdown will fire click handlers on the JSX parent that rendered it, so you often
            need to stop propagation at the portal root.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "createPortal(children, domNode) renders children into a different DOM node while keeping the component in place in the React tree.",
          "It's the correct fix for modals and dropdowns clipped by overflow: hidden or trapped in a stacking context — z-index can't solve those.",
          "Context and props flow into a portal exactly as normal; only the physical DOM location changes.",
          "React events bubble through the React tree, not the DOM tree, so portalled content still triggers its JSX parents' handlers.",
          "A production dialog needs focus trapping, Esc handling, and ARIA wiring on top of the portal — reach for a headless library.",
        ]}
      />
    </>
  )
}
