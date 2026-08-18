import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const basicProps = `
function Greeting(props) {
  return <p>Hello, {props.name}!</p>;
}

render(
  <div>
    <Greeting name="Ada" />
    <Greeting name="Grace" />
    <Greeting name="Katherine" />
  </div>
);
`

const destructuring = `
function Badge({ label, tone }) {
  const color = tone === "success" ? "#16a34a" : "#4f46e5";
  return (
    <span style={{ color, border: \`1px solid \${color}\`, borderRadius: 999, padding: "2px 10px", fontSize: 13 }}>
      {label}
    </span>
  );
}

render(
  <div style={{ display: "flex", gap: 8 }}>
    <Badge label="New" tone="success" />
    <Badge label="Beta" tone="info" />
  </div>
);
`

const composition = `
function Card({ title, children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 10, padding: 16, maxWidth: 260 }}>
      <h4 style={{ margin: "0 0 8px" }}>{title}</h4>
      {children}
    </div>
  );
}

render(
  <Card title="Profile">
    <p style={{ margin: 0 }}>Components can wrap other content via children.</p>
  </Card>
);
`

export default function ComponentsProps() {
  return (
    <>
      <p>
        A React <strong>component</strong> is just a JavaScript function that returns JSX.
        Component names always start with a capital letter — that's how React (and JSX) tells
        them apart from regular HTML tags like <code>div</code> or <code>span</code>.
      </p>

      <h2>Passing data with props</h2>
      <p>
        Components accept input through <strong>props</strong> (short for "properties") — a
        single object passed as the first function argument, similar to HTML attributes but able
        to hold any JavaScript value.
      </p>
      <LiveCodeBlock code={basicProps} />

      <h2>Destructuring props</h2>
      <p>
        Most React code destructures props right in the function signature instead of writing{" "}
        <code>props.name</code> everywhere. It's shorter and makes it obvious at a glance what a
        component expects.
      </p>
      <LiveCodeBlock code={destructuring} />

      <Callout variant="info">
        Props are <strong>read-only</strong>. A component should never modify the props it
        receives — if a value needs to change over time, that's what state (next lesson) is for.
      </Callout>

      <h2>The special "children" prop</h2>
      <p>
        Anything you nest between a component's opening and closing tags is passed automatically
        as <code>props.children</code>. This is how layout components like cards, modals, and
        panels let you fill them with arbitrary content.
      </p>
      <LiveCodeBlock code={composition} />

      <Challenge
        hint={<p>Add another prop like <code>subtitle</code> and render it under the title.</p>}
      >
        Give the <code>Card</code> component above a new prop and use it inside the component.
      </Challenge>
    </>
  )
}
