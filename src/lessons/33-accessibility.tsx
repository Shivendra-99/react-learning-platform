import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const divButtonDemo = `
function DivButton() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        Click this, then try reaching it with only the Tab key.
      </p>
      <div
        onClick={() => setCount((c) => c + 1)}
        style={{
          display: "inline-block",
          padding: "8px 16px",
          background: "#4f46e5",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Clicked {count} times
      </div>
    </div>
  );
}

render(<DivButton />);
`

const realButtonDemo = `
function RealButton() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        Tab to this one — it's focusable, and Enter or Space both work.
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: "8px 16px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Clicked {count} times
      </button>
    </div>
  );
}

render(<RealButton />);
`

const iconButtonBad = `function CloseButton({ onClose }) {
  return (
    <button onClick={onClose}>
      <XIcon />
    </button>
  );
}
// A screen reader announces this as just "button" —
// no way to know what it does`

const iconButtonGood = `function CloseButton({ onClose }) {
  return (
    <button onClick={onClose} aria-label="Close dialog">
      <XIcon aria-hidden="true" />
    </button>
  );
}
// Announced as "Close dialog, button" — the icon
// itself is hidden from assistive tech, since the
// label already says what it needs to`

const modalFocusExample = `function Modal({ open, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabIndex={-1}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
// role="dialog" + aria-modal tell assistive tech this
// blocks the rest of the page. Moving focus in on open,
// and handling Escape, are both still your job — a
// headless library (Radix, React Aria) does the rest:
// trapping Tab inside, and returning focus on close.`

const challengeStarter = `
function IconButton() {
  const [liked, setLiked] = useState(false);

  // TODO: add an aria-label so a screen reader announces
  // what this button does, not just "button"
  return (
    <button onClick={() => setLiked((l) => !l)} style={{ fontSize: 20 }}>
      {liked ? "❤️" : "🤍"}
    </button>
  );
}

render(<IconButton />);
`

export default function AccessibilityLesson() {
  return (
    <>
      <p>
        Accessibility means your app works for someone using only a keyboard, someone using a
        screen reader, someone who's colour-blind, or someone whose hand shakes slightly on a
        trackpad. None of that requires a separate "accessible version" of your app — it requires
        writing the same JSX slightly more carefully.
      </p>

      <AnalogyCard title="A ramp next to the stairs helps far more people than just wheelchair users.">
        Someone pushing a stroller, wheeling a suitcase, or on crutches uses that ramp too — it
        was built for one group and ends up helping many. Accessible markup is the same: captions
        help someone in a loud room as much as someone who's deaf, and a properly labelled button
        helps a screen reader user and someone glancing at their phone in bright sunlight.
      </AnalogyCard>

      <h2>The most common bug: a div pretending to be a button</h2>
      <p>
        Both of these look identical and do the same thing when clicked with a mouse. Try
        reaching each one with only the <kbd>Tab</kbd> key, then pressing <kbd>Enter</kbd>.
      </p>
      <p className="text-sm font-medium text-foreground">A clickable div — looks right, isn't</p>
      <LiveCodeBlock code={divButtonDemo} />
      <p className="text-sm font-medium text-foreground">A real button</p>
      <LiveCodeBlock code={realButtonDemo} />

      <Callout variant="warning" title="A div has none of this for free">
        A real <code>&lt;button&gt;</code> is focusable with Tab, activates on both Enter and
        Space, is announced by a screen reader as "button," and gets a visible focus ring — all
        without a single line of extra code. Recreating that on a <code>&lt;div&gt;</code> means{" "}
        <code>tabIndex="0"</code>, an <code>onKeyDown</code> handler for two different keys,{" "}
        <code>role="button"</code>, and your own focus styling — real work to rebuild something
        the platform already gives you.
      </Callout>

      <h2>Semantic HTML is most of the work</h2>
      <p>
        Before reaching for an ARIA attribute, reach for the right element — <code>&lt;button&gt;</code>{" "}
        for anything clickable, <code>&lt;nav&gt;</code> for navigation, <code>&lt;label&gt;</code>{" "}
        for form fields, headings in order (<code>h1</code> then <code>h2</code>, never skipping a
        level). Each of these carries built-in behaviour and meaning that a generic{" "}
        <code>&lt;div&gt;</code> has none of.
      </p>

      <h2>When you do need ARIA: labelling icon-only controls</h2>
      <p>
        A button with only an icon inside it has no text a screen reader can announce. This is
        the single most common real ARIA need in an ordinary app.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="good">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bad">Unlabelled</TabsTrigger>
            <TabsTrigger value="good">Labelled</TabsTrigger>
          </TabsList>
          <TabsContent value="bad" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">
              {iconButtonBad}
            </pre>
          </TabsContent>
          <TabsContent value="good" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">
              {iconButtonGood}
            </pre>
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="tip" title="This site's own topbar does exactly this">
        The theme toggle button you've clicked in every lesson has{" "}
        <code>aria-label={'{theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}'}</code>{" "}
        — without it, a screen reader would only announce "button," with no way to know what
        pressing it does.
      </Callout>

      <h2>Focus management in a modal</h2>
      <p>
        A dialog needs three things beyond just appearing: focus should move into it when it
        opens, <kbd>Escape</kbd> should close it, and screen readers need to know it's a dialog
        blocking the rest of the page.
      </p>
      <pre className="not-prose overflow-x-auto rounded-xl border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed whitespace-pre text-gray-300">
        {modalFocusExample}
      </pre>
      <Callout variant="info">
        The Portals lesson built a modal without any of this. A real production dialog also needs
        to <em>trap</em> Tab inside itself while open (so tabbing doesn't escape to the page
        behind it) and return focus to whatever triggered it on close — genuinely fiddly to get
        right by hand, which is exactly why Radix, React Aria, and Headless UI exist. This site's
        own command palette is built on Radix's Dialog for precisely this reason.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="removing the focus outline without replacing it"
        wrong={`button:focus {\n  outline: none;\n}\n\n/* Now nobody navigating by keyboard can\n   see which element is focused, anywhere\n   this style applies */`}
        right={`button:focus-visible {\n  outline: 2px solid #4f46e5;\n  outline-offset: 2px;\n}\n\n/* focus-visible shows the ring for keyboard\n   navigation but not for a mouse click — the\n   outline stays, but only when it's useful */`}
        explanation={
          <p>
            <code>outline: none</code> on focus is one of the most common real accessibility bugs,
            usually added because a designer disliked the default blue ring on a mouse click.{" "}
            <code>:focus-visible</code> solves the actual complaint: browsers show it for keyboard
            navigation and hide it for a mouse click, so the ring comes back exactly where it's
            actually needed.
          </p>
        }
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Label the icon button"
        hint={<p><code>{'aria-label={liked ? "Unlike" : "Like"}'}</code> on the button.</p>}
      >
        This like button has no visible text — a screen reader currently announces only "button."
        Add an <code>aria-label</code> that describes what it does.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why does a <div onClick={...}> fail accessibility even though it works fine with a mouse?"
        options={[
          { id: "a", text: "Browsers render div elements more slowly than buttons" },
          { id: "b", text: "A div isn't focusable by default and doesn't respond to Enter or Space — only a mouse click reaches it" },
          { id: "c", text: "React doesn't support onClick on div elements" },
          { id: "d", text: "Screen readers can't read text inside a div at all" },
        ]}
        correctId="b"
        explanation="A <button> is focusable with Tab, activates on both Enter and Space, and is announced with its role by assistive technology — all built into the element. A <div> has none of that by default, so it's invisible to Tab navigation and does nothing when a keyboard user who has somehow reached it presses Enter."
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How do you approach accessibility in a React application?"
        answer={
          <p>
            I start with semantic HTML rather than ARIA, because the right element carries
            behaviour ARIA can't fully replace — a real <code>&lt;button&gt;</code> is focusable
            and keyboard-operable with zero extra code, while a <code>&lt;div role="button"&gt;</code>{" "}
            needs a tabIndex, a keydown handler for two keys, and manual focus styling just to
            match what the real element gives for free. From there: every interactive element
            needs an accessible name — text content for a button, an <code>aria-label</code> for
            an icon-only one, a <code>&lt;label&gt;</code> associated with every form field. Every
            interactive element needs to be reachable and operable by keyboard alone, which I
            check by literally tabbing through the page. And anything that opens as an overlay —
            a modal, a dropdown, a toast — needs deliberate focus management: moved in on open,
            trapped while open, and returned to the trigger on close, which for anything beyond a
            simple case I'd build on a headless library like Radix or React Aria rather than
            hand-roll, since focus trapping has a lot of easy-to-miss edge cases. I'd also actually
            test with a keyboard and a screen reader rather than only checking against a linter,
            since automated tools like <code>eslint-plugin-jsx-a11y</code> catch maybe a third of
            real issues — missing alt text and bad ARIA usage, not "can I actually operate this
            with a keyboard."
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "Reach for the right semantic element before reaching for ARIA — a real <button> is keyboard-operable for free.",
          "Every interactive element needs an accessible name: text content, or an aria-label when there's only an icon.",
          "Test with a keyboard: Tab to every interactive element, and confirm Enter/Space activate it.",
          "A modal or dropdown needs deliberate focus management — moved in on open, trapped while open, returned on close.",
          "Never remove a focus outline without replacing it; use :focus-visible so it still appears for keyboard navigation.",
          "Automated linters catch a fraction of real accessibility issues — actually testing with a keyboard finds what they miss.",
        ]}
      />
    </>
  )
}
