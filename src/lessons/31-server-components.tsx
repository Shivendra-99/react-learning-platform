import { Callout } from "@/components/lesson/callout"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"

const treeCode = `// app/page.jsx — a Server Component by default
async function ProductPage({ params }) {
  // Runs on the server. Talks to the database directly —
  // no API route, no fetch, no loading state to write.
  const product = await db.products.findById(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* This one component opts into the browser */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// app/AddToCartButton.jsx
"use client";

function AddToCartButton({ productId }) {
  const [pending, setPending] = useState(false);

  return (
    <button onClick={() => addToCart(productId)} disabled={pending}>
      Add to cart
    </button>
  );
}`

const treeSteps: WalkthroughStep[] = [
  {
    id: "s1",
    label: "No directive means Server Component",
    detail:
      "This is the new default in a framework that supports them — not an opt-in. The component's code runs on the server and is never sent to the browser at all.",
    lines: 2,
  },
  {
    id: "s2",
    label: "Direct data access, no API layer",
    detail:
      "A Server Component can await a database call, read a file, or call a private API directly in its body — there's no client-server round trip to write a loading state for, because it never leaves the server.",
    lines: 5,
  },
  {
    id: "s3",
    label: "Rendered HTML is what reaches the browser",
    detail:
      "The user's browser receives finished markup for this part of the page — none of the code that produced it, none of the database client, nothing.",
    range: [8, 12],
  },
  {
    id: "s4",
    label: "\"use client\" draws the boundary",
    detail:
      "This one line at the top of a file is the entire opt-in mechanism. Everything below it — and everything it imports — becomes a Client Component, bundled and sent to the browser like React always has been.",
    lines: 17,
  },
  {
    id: "s5",
    label: "Only THIS component needs interactivity",
    detail:
      "useState, onClick, and everything else that needs to run in a browser lives here — in the smallest possible piece of the tree, not the whole page.",
    range: [19, 26],
  },
]

export default function ServerComponentsLesson() {
  return (
    <>
      <p>
        Every lesson so far has assumed one thing: your component's code ends up in the user's
        browser. That assumption is baked into React's original design — but it's no longer
        universal. In frameworks that support them (Next.js's App Router is the common one),
        Server Components let part of your tree run <em>only</em> on the server and never ship to
        the browser at all.
      </p>

      <Callout variant="info" title="This is a framework feature, not a plain-React one">
        Server Components need a framework with a server to run on — they don't exist in a
        Vite single-page app like this course's demos, which is why nothing in this lesson is a
        live editable example. The goal here is to recognise the model when you meet a framework
        that has it, not to write it from scratch.
      </Callout>

      <AnalogyCard title="A Server Component is a finished dish sent from the kitchen; a Client Component is a tabletop grill.">
        You don't need the kitchen's stove, ingredients, or recipe at your table just to eat a
        cooked meal — the kitchen (the server) did that work and sent you the result. But a
        tabletop grill genuinely needs to be at the table, because you're the one interacting with
        it. Most of a page is a finished dish; only the truly interactive parts need to be a grill
        sitting in the browser.
      </AnalogyCard>

      <h2>Two kinds of component, in one tree</h2>
      <p>
        The default changes, not the mental model. A component with no directive is a Server
        Component; adding <code>"use client"</code> at the top of a file marks it — and everything
        it imports — as a Client Component, bundled and shipped exactly as React components
        always have been.
      </p>
      <div className="not-prose">
        <CodeWalkthrough
          title="Server by default, client where it's needed"
          filename="ProductPage.jsx"
          code={treeCode}
          steps={treeSteps}
        />
      </div>

      <h2>What a Server Component can't do</h2>
      <p>
        It never runs in a browser, so anything that needs a browser is off-limits: no{" "}
        <code>useState</code>, no <code>useEffect</code>, no event handlers, no browser APIs like{" "}
        <code>localStorage</code>. It can be <code>async</code> and can render Client Components as
        children — but a Client Component can never render a Server Component back, since by the
        time client code is running, the server has already finished its part.
      </p>

      <h2>Why this exists</h2>
      <p>
        Two concrete wins. First, less JavaScript reaches the browser — a Server Component's code,
        and every library it uses (a Markdown renderer, a date-formatting library, a database
        client), stays on the server and never adds a single byte to the client bundle. Second, no
        client-server round trip for data: a component that needs data just reads it directly
        during render, instead of rendering a loading state, firing a <code>useEffect</code>, and
        waiting for a response — the pattern taught in the Fetching Data lesson, which Server
        Components replace for anything that doesn't need to happen after the page has already
        loaded.
      </p>

      <h2>Common mistake</h2>
      <CommonMistake
        title="marking a whole page 'use client' just to use one interactive widget"
        wrong={`"use client";\n\nasync function ProductPage({ params }) {\n  const product = await db.products.findById(params.id);\n  // Error: Server-only APIs like db aren't\n  // available here anymore, AND the entire\n  // page's code now ships to the browser\n  return (\n    <div>\n      <h1>{product.name}</h1>\n      <AddToCartButton />\n    </div>\n  );\n}`}
        right={`// No directive — stays a Server Component\nasync function ProductPage({ params }) {\n  const product = await db.products.findById(params.id);\n  return (\n    <div>\n      <h1>{product.name}</h1>\n      {/* Only this one opts into the client */}\n      <AddToCartButton productId={product.id} />\n    </div>\n  );\n}`}
        explanation={
          <p>
            <code>"use client"</code> marks the entire file, and adding it to a page-level
            component pulls that whole page's code into the client bundle — including everything
            it imports — while also losing direct server access like a database client. The
            pattern is to push the boundary as far down the tree as possible: keep the page a
            Server Component, and mark only the specific leaf that genuinely needs state or
            events.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question='What does the "use client" directive actually do?'
        options={[
          { id: "a", text: "It tells React to render that component faster" },
          { id: "b", text: "It marks that file and its imports as a Client Component, bundled and sent to the browser" },
          { id: "c", text: "It disables server-side rendering for the entire app" },
          { id: "d", text: "It's required at the top of every React component file" },
        ]}
        correctId="b"
        explanation='Without any directive, a component in a framework that supports Server Components is a Server Component by default — it runs only on the server. "use client" at the top of a file opts that file, and anything it imports, into being a Client Component: bundled into the JavaScript sent to the browser, with access to state, effects, and events, same as classic React.'
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="What problem do Server Components solve, and what are their limits?"
        answer={
          <p>
            They solve two things at once. Bundle size: a Server Component's code, and everything
            it imports, never reaches the browser — a heavy library used only to format a date or
            render Markdown on the server costs the client nothing. And data fetching: a Server
            Component can <code>await</code> a database call or a private API directly during
            render, so there's no loading spinner, no client-side effect, no waterfall of requests
            firing after the page has already painted. The limits follow directly from where they
            run: no <code>useState</code>, no <code>useEffect</code>, no event handlers, no
            browser-only APIs, because the component's code genuinely never executes in a browser.
            That's why they compose with Client Components rather than replace them — the pattern
            is a mostly-server tree with small, deliberately placed client islands wherever actual
            interactivity is needed. It's worth being clear this is a framework feature built on
            top of React, not a plain-React capability — a Vite SPA has no server to run them on.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "In a framework that supports them, a component with no directive is a Server Component by default — its code runs only on the server.",
          "\"use client\" at the top of a file marks it, and everything it imports, as a Client Component — bundled and shipped to the browser as normal.",
          "Server Components can be async and read data directly (a database, a filesystem, a private API) with no client-server round trip to write.",
          "They cannot use state, effects, event handlers, or any browser API — anything interactive has to live in a Client Component.",
          "The pattern is pushing the client boundary as far down the tree as possible, so only the truly interactive leaves ship JavaScript.",
          "This is a framework capability (Next.js App Router is the common example), not something available in a plain Vite SPA like this course.",
        ]}
      />
    </>
  )
}
