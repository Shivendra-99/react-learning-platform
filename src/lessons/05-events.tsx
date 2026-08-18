import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const basicClick = `
function Alerter() {
  function handleClick() {
    alert("Button was clicked!");
  }

  return <button onClick={handleClick}>Click me</button>;
}

render(<Alerter />);
`

const inlineHandler = `
function Hover() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 16,
        borderRadius: 8,
        background: hovered ? "#4f46e5" : "#e5e7eb",
        color: hovered ? "white" : "black",
        textAlign: "center",
      }}
    >
      {hovered ? "You're hovering!" : "Hover over me"}
    </div>
  );
}

render(<Hover />);
`

const eventObject = `
function KeyLogger() {
  const [lastKey, setLastKey] = useState("(none yet)");

  return (
    <div>
      <input
        placeholder="Type here..."
        onKeyDown={(event) => setLastKey(event.key)}
      />
      <p>Last key pressed: <strong>{lastKey}</strong></p>
    </div>
  );
}

render(<KeyLogger />);
`

export default function EventsLesson() {
  return (
    <>
      <p>
        React lets you respond to user interaction with event handler props like{" "}
        <code>onClick</code>, <code>onChange</code>, <code>onMouseEnter</code>, and{" "}
        <code>onKeyDown</code>. You pass a <strong>function</strong> — React calls it for you when
        the event happens.
      </p>

      <h2>A basic click handler</h2>
      <LiveCodeBlock code={basicClick} />

      <Callout variant="warning">
        Pass the function itself (<code>onClick={"{handleClick}"}</code>), not the result of
        calling it (<code>onClick={"{handleClick()}"}</code>). The second form runs immediately
        during render instead of when the button is clicked.
      </Callout>

      <h2>Combining events with state</h2>
      <p>
        Event handlers are most useful when paired with state — the handler updates state, and
        React re-renders the UI to reflect it.
      </p>
      <LiveCodeBlock code={inlineHandler} />

      <h2>Reading the event object</h2>
      <p>
        React passes a <strong>synthetic event</strong> object to your handler, which works the
        same way across browsers and gives you details like which key was pressed or what value
        an input currently holds.
      </p>
      <LiveCodeBlock code={eventObject} />

      <Challenge
        hint={<p>Try <code>onClick={"{() => setHovered((h) => !h)}"}</code> to toggle on click too.</p>}
      >
        Modify the hover box example so it also toggles color when clicked, not just hovered.
      </Challenge>
    </>
  )
}
