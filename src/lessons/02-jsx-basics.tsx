import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const expressionExample = `
const name = "Ada";
const year = 1815 + 200;

render(<p>Hello, {name}! The year is {year}.</p>);
`

const attributesExample = `
const imageUrl = "https://picsum.photos/seed/react/80";

render(
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <img
      src={imageUrl}
      alt="Random"
      className="rounded"
      style={{ width: 48, height: 48, borderRadius: 8 }}
    />
    <p>Attributes use camelCase, and JS values go in curly braces.</p>
  </div>
);
`

const fragmentExample = `
function Profile() {
  return (
    <>
      <h3>Grace Hopper</h3>
      <p>Computer scientist &amp; Navy rear admiral.</p>
    </>
  );
}

render(<Profile />);
`

export default function JsxBasics() {
  return (
    <>
      <p>
        JSX is a syntax extension for JavaScript that looks like HTML. It's not a separate
        templating language — it compiles down to regular <code>React.createElement()</code>{" "}
        calls, which means you can use full JavaScript expressions right inside your markup.
      </p>

      <h2>Embedding JavaScript</h2>
      <p>
        Anything inside curly braces <code>{"{ }"}</code> is evaluated as a JavaScript
        expression — variables, function calls, arithmetic, ternaries.
      </p>
      <LiveCodeBlock code={expressionExample} />

      <h2>JSX attributes</h2>
      <p>
        Attributes are written in camelCase (<code>className</code> instead of{" "}
        <code>class</code>, <code>onClick</code> instead of <code>onclick</code>) because they map
        to JavaScript object properties, not HTML attribute names. The <code>style</code>{" "}
        attribute takes a JavaScript object rather than a CSS string.
      </p>
      <LiveCodeBlock code={attributesExample} />

      <Callout variant="warning">
        JSX must return a <strong>single root element</strong>. If you need to return two sibling
        elements without adding an extra <code>&lt;div&gt;</code>, wrap them in a{" "}
        <strong>Fragment</strong>: <code>&lt;&gt;...&lt;/&gt;</code>.
      </Callout>

      <h2>Fragments</h2>
      <LiveCodeBlock code={fragmentExample} />

      <Challenge
        hint={
          <p>
            Try <code>{"{"}2 + 2{"}"}</code> or a ternary like{" "}
            <code>{"{isHappy ? \"😀\" : \"😢\"}"}</code>.
          </p>
        }
      >
        In the first example above, replace <code>{"{year}"}</code> with any JavaScript expression
        of your own — a calculation, a ternary, or a function call.
      </Challenge>
    </>
  )
}
