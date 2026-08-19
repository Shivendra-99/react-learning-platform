import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const inlineStyleDemo = `
function Badge() {
  const [urgent, setUrgent] = useState(false);

  // Inline styles can react to state directly — no class-name juggling
  const style = {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: "white",
    background: urgent ? "#dc2626" : "#16a34a",
    transition: "background 0.2s",
  };

  return (
    <div>
      <span style={style}>{urgent ? "Urgent" : "Normal"}</span>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setUrgent((u) => !u)}>Toggle</button>
      </div>
    </div>
  );
}

render(<Badge />);
`

const globalClashDemo = `
// Two components, each with a class named ".card" — a realistic
// accident when a codebase has several people writing plain CSS.
// Open the CSS panel (it's injected below) and see which one wins.

function ProductCard() {
  return <div className="card">Product card</div>;
}

function UserCard() {
  return <div className="card">User card — but styled like a product!</div>;
}

function App() {
  return (
    <>
      <style>{\`
        /* From product-card.css */
        .card { background: #dbeafe; padding: 16px; border-radius: 8px; }
        /* From user-card.css, loaded after — wins the cascade */
        .card { background: #fecaca; padding: 8px; border: 2px dashed red; }
      \`}</style>
      <ProductCard />
      <div style={{ height: 8 }} />
      <UserCard />
    </>
  );
}

render(<App />);
`

const cssModulesConcept = `// Card.module.css
.card {
  padding: 16px;
  border-radius: 8px;
  background: #dbeafe;
}

// Card.jsx
import styles from "./Card.module.css";

function Card() {
  // styles.card is NOT the string "card" — the build tool rewrites
  // it to something globally unique, e.g. "Card_card__a3f1x"
  return <div className={styles.card}>I can never collide with anyone else's .card</div>;
}`

const tailwindConcept = `function Card() {
  return (
    <div className="rounded-lg bg-blue-100 p-4 hover:bg-blue-200 dark:bg-blue-950">
      Styling lives right here, not in a separate file
    </div>
  );
}

// No class names to invent, no separate file to keep in sync,
// no risk of a class existing but doing nothing (a real CSS-file
// failure mode) — but the JSX reads busier.`

const cssInJsConcept = `import styled from "styled-components";

// A real component, not just a class name
const Card = styled.div\`
  padding: 16px;
  border-radius: 8px;
  background: \${(props) => (props.urgent ? "#fecaca" : "#dbeafe")};
\`;

function App() {
  return <Card urgent={isUrgent}>Styles that read props directly</Card>;
}

// Scoped like CSS Modules, but the style/logic boundary is gone —
// and it costs a small runtime, generating styles as the app runs.`

const challengeStarter = `
function PriceTag({ price, onSale }) {
  // TODO: give the price a red, bold style when onSale is true,
  // and the normal dark colour otherwise — using the style prop.
  const style = {};

  return <span style={style}>\${price}</span>;
}

function App() {
  const [onSale, setOnSale] = useState(false);

  return (
    <div>
      <PriceTag price={49} onSale={onSale} />
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setOnSale((s) => !s)}>Toggle sale</button>
      </div>
    </div>
  );
}

render(<App />);
`

export default function StylingReactLesson() {
  return (
    <>
      <p>
        Every lesson so far has quietly used Tailwind classes in its examples without ever
        explaining why, or what the alternatives are. React itself has zero opinion about
        styling — no built-in system, no recommended approach. That's freedom, and it's also why
        this is one of the first real decisions a team has to make and often argues about.
      </p>

      <AnalogyCard title="Plain CSS is one shared whiteboard; the other approaches give everyone their own notebook.">
        Write on a shared whiteboard and anyone can accidentally erase or write over your note —
        that's a global class name colliding with someone else's. A notebook that's yours alone
        never has that problem, but you're carrying more notebooks around. Every styling approach
        below is really just a different answer to "how much isolation do you want, and what do
        you pay for it?"
      </AnalogyCard>

      <h2>The problem plain CSS has at scale</h2>
      <p>
        A <code>className</code> in JSX is just a string, and every stylesheet on the page shares
        one global namespace. Two components independently named <code>.card</code> is a
        realistic accident once a few people are writing CSS — and whichever stylesheet loads
        last quietly wins.
      </p>
      <LiveCodeBlock code={globalClashDemo} />

      <Callout variant="warning" title="This isn't a React problem — it's how CSS has always worked">
        Every approach below exists specifically to fix this one failure mode. The differences
        between them are really differences in <em>when</em> and <em>how</em> they guarantee your
        class name can't collide with someone else's.
      </Callout>

      <h2>Four approaches, and their actual trade-off</h2>
      <div className="not-prose">
        <Tabs defaultValue="modules">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">CSS Modules</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            <TabsTrigger value="cssinjs">CSS-in-JS</TabsTrigger>
            <TabsTrigger value="inline">Inline style</TabsTrigger>
          </TabsList>
          <TabsContent value="modules" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">
              {cssModulesConcept}
            </pre>
          </TabsContent>
          <TabsContent value="tailwind" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">
              {tailwindConcept}
            </pre>
          </TabsContent>
          <TabsContent value="cssinjs" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">
              {cssInJsConcept}
            </pre>
          </TabsContent>
          <TabsContent value="inline" className="mt-3">
            <p className="mb-2 text-sm text-muted-foreground">
              Real, running React — the <code>style</code> prop takes a plain object, camelCased,
              and can read component state directly.
            </p>
            <LiveCodeBlock code={inlineStyleDemo} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="not-prose overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="border-b px-3 py-2 text-left text-xs font-semibold text-foreground">Approach</th>
              <th className="border-b px-3 py-2 text-left text-xs font-semibold text-foreground">Trade-off</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Plain CSS / Sass</td>
              <td className="border-b px-3 py-2">Familiar, zero setup — one shared global namespace</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">CSS Modules</td>
              <td className="border-b px-3 py-2">Scoped automatically at build time, real .css file, zero runtime cost</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Tailwind</td>
              <td className="border-b px-3 py-2">No naming, no separate file — but busy-looking JSX</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">CSS-in-JS</td>
              <td className="border-b px-3 py-2">Styles read props directly — costs a small runtime, awkward with Server Components</td>
            </tr>
            <tr className="even:bg-muted/20">
              <td className="border-b px-3 py-2">Inline style prop</td>
              <td className="border-b px-3 py-2">Fine for one dynamic value — no hover, media queries, or pseudo-classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout variant="tip">
        This site is built with Tailwind — every <code>className="flex gap-2 rounded-lg..."</code>{" "}
        you've seen in earlier lessons' rendered UI (not the live-editor demos, which use inline
        styles so they work with zero setup) is this approach in practice.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="reaching for CSS-in-JS's dynamic styles when a class toggle would do"
        wrong={`const Card = styled.div\`\n  padding: 16px;\n  background: \${(p) => (p.active ? "#dbeafe" : "white")};\n\`;\n\n// A new styled-component render on every\n// prop change, for something CSS itself\n// can express`}
        right={`function Card({ active }) {\n  return (\n    <div className={active ? "card card--active" : "card"}>\n      ...\n    </div>\n  );\n}\n// .card--active { background: #dbeafe; }\n// A plain class toggle, no runtime style\n// generation`}
        explanation={
          <p>
            Dynamic CSS-in-JS is genuinely useful for values with no finite set — a colour
            computed from user data, a position from a drag gesture. For a value that's really one
            of two or three known states, a conditional class name does the same job without
            asking the browser to compute and inject new styles on every render.
          </p>
        }
      />

      <h2>Try it</h2>
      <p>
        Style the price using the <code>style</code> prop so it turns red and bold when on sale.
      </p>
      <Challenge
        title="Style based on a prop"
        hint={
          <p>
            <code>
              {'const style = onSale ? { color: "#dc2626", fontWeight: 700 } : { color: "#111827" };'}
            </code>
          </p>
        }
      >
        Give <code>PriceTag</code> a different colour and weight depending on its{" "}
        <code>onSale</code> prop.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Quick quiz</h2>
      <Quiz
        question="What problem do CSS Modules, Tailwind, and CSS-in-JS all independently solve?"
        options={[
          { id: "a", text: "They all make CSS run faster in the browser" },
          { id: "b", text: "They prevent class names from colliding across a growing codebase" },
          { id: "c", text: "They remove the need to write any CSS at all" },
          { id: "d", text: "They add TypeScript types to CSS properties" },
        ]}
        correctId="b"
        explanation="Plain CSS shares one global namespace, so two components independently choosing the same class name is a real, common bug once a codebase has more than one person writing styles. Each approach guarantees uniqueness differently — build-time renaming, no class names at all, or scoping generated at runtime — but that's the shared problem all of them exist to solve."
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How would you decide which styling approach to use on a new React project?"
        answer={
          <p>
            I'd weigh it against team size and how much the design system needs to flex. For most
            new projects I'd default to Tailwind or CSS Modules — both give collision-free scoping
            with no runtime cost, which matters more as the app grows and matters a lot if any
            part of the tree might become a Server Component, since CSS-in-JS libraries generally
            need a client boundary to generate styles. I'd reach for CSS-in-JS specifically when
            styles need to react to a wide, genuinely dynamic range of prop values — a theming
            system with user-configurable colours, for instance — where a finite set of Tailwind
            classes or CSS Module variants would get unwieldy. Plain global CSS I'd only choose for
            a very small project where the collision risk is genuinely low. The one wrong answer
            is picking based on personal preference alone without asking what the team's other
            projects already use — consistency across a codebase is worth more than any one
            approach's specific advantages.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "React has no built-in styling system — every approach here is a userland solution to the same problem: plain CSS shares one global namespace.",
          "CSS Modules scope class names automatically at build time with zero runtime cost — the closest thing to 'plain CSS but safe'.",
          "Tailwind removes class naming entirely by styling in the markup — fast to write, busier to read.",
          "CSS-in-JS lets styles read props and component logic directly, at the cost of a runtime and friction with Server Components.",
          "The inline style prop is fine for one dynamic value but can't express hover states, pseudo-classes, or media queries.",
          "Pick based on team size and how dynamic the styling genuinely needs to be — and match whatever the rest of the codebase already uses.",
        ]}
      />
    </>
  )
}
