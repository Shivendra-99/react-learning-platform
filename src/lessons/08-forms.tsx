import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const controlledInput = `
function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Type your name"
      />
      <p>Hello, {name || "stranger"}!</p>
    </div>
  );
}

render(<NameInput />);
`

const submitExample = `
function SignupForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    setSubmitted(email);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit">Sign up</button>
      {submitted && <p>Submitted: {submitted}</p>}
    </form>
  );
}

render(<SignupForm />);
`

const selectAndCheckbox = `
function Preferences() {
  const [plan, setPlan] = useState("free");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <select value={plan} onChange={(event) => setPlan(event.target.value)}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(event) => setNewsletter(event.target.checked)}
        />
        Subscribe to newsletter
      </label>

      <p>Plan: {plan}, Newsletter: {newsletter ? "yes" : "no"}</p>
    </div>
  );
}

render(<Preferences />);
`

export default function FormsLesson() {
  return (
    <>
      <p>
        By default, an <code>&lt;input&gt;</code> manages its own value internally in the DOM. In
        React, we usually make it a <strong>controlled input</strong> instead — its value comes
        from state, and every keystroke updates that state through <code>onChange</code>. This
        gives your component full control over what the input displays.
      </p>

      <h2>A controlled text input</h2>
      <LiveCodeBlock code={controlledInput} />

      <Callout variant="info">
        The pattern is always the same: <code>value={"{state}"}</code> to display the current
        value, and <code>onChange={"{(e) => setState(e.target.value)}"}</code> to update it when
        the user types.
      </Callout>

      <h2>Handling form submission</h2>
      <p>
        Call <code>event.preventDefault()</code> inside your <code>onSubmit</code> handler to
        stop the browser's default full-page reload, so you can handle the data with JavaScript
        instead.
      </p>
      <LiveCodeBlock code={submitExample} />

      <h2>Other input types</h2>
      <p>
        Checkboxes use <code>checked</code> instead of <code>value</code>, and read from{" "}
        <code>event.target.checked</code>. Selects work just like text inputs, using{" "}
        <code>value</code> and <code>onChange</code>.
      </p>
      <LiveCodeBlock code={selectAndCheckbox} />

      <Challenge
        hint={<p>Check <code>email.includes("@")</code> and disable the button when it's false.</p>}
      >
        Add a simple validation to the signup form: disable the submit button unless the email
        contains an <code>@</code> symbol.
      </Challenge>

      <Callout variant="tip" title="You've covered the fundamentals!">
        JSX, components, props, state, events, conditional rendering, lists, and forms are the
        core building blocks of almost every React app. From here, the natural next steps are
        the <code>useEffect</code> Hook for side effects, and <code>useContext</code> for sharing
        state across many components.
      </Callout>
    </>
  )
}
