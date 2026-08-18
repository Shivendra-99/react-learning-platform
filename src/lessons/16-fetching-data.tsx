import { Send, Server, PackageCheck, RefreshCw, MonitorSmartphone } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"

const userListExample = `
function UserList() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [users, setUsers] = useState([]);
  const [shouldFail, setShouldFail] = useState(false);

  useEffect(() => {
    let ignore = false; // avoids a stale response overwriting a newer one
    setStatus("loading");
    const url = shouldFail
      ? "https://jsonplaceholder.typicode.com/does-not-exist"
      : "https://jsonplaceholder.typicode.com/users?_limit=5";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        setUsers(data);
        setStatus("success");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [shouldFail]);

  return (
    <div>
      <button onClick={() => setShouldFail(!shouldFail)}>
        {shouldFail ? "Fix the URL" : "Break the URL (simulate an error)"}
      </button>

      {status === "loading" && <p>Loading users...</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
      {status === "success" && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

render(<UserList />);
`

const challengeStarter = `
function UserList() {
  const [status, setStatus] = useState("loading");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users?_limit=5")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Something went wrong.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
          {/* TODO: also show the user's company name, user.company.name */}
        </li>
      ))}
    </ul>
  );
}

render(<UserList />);
`

const lifecycleCode = [
  'useEffect(() => {',
  '  setStatus("loading");',
  "  fetch(url)",
  "    .then((res) => {",
  "      if (!res.ok) throw new Error();",
  "      return res.json();",
  "    })",
  "    .then((data) => {",
  "      setUsers(data);",
  '      setStatus("success");',
  "    })",
  '    .catch(() => setStatus("error"));',
  "}, [url]);",
]

const lifecycleSteps: FlowStep[] = [
  { id: "mount", label: "1. Component mounts", detail: "React renders the component for the first time.", icon: RefreshCw, codeLine: 1 },
  { id: "loading", label: "2. Effect runs → status becomes \"loading\"", detail: "Before the request even starts, the UI is told to show a loading state.", icon: Send, codeLine: 2 },
  { id: "request", label: "3. fetch() sends the request", detail: "A real HTTP request goes out to the server, over the network.", icon: Send, codeLine: 3 },
  { id: "server", label: "4. Server responds", detail: "Eventually — milliseconds or seconds later — a response comes back.", icon: Server, codeLine: 4 },
  { id: "update", label: "5. State updates with the real data", detail: "setUsers stores the parsed data, setStatus flips to \"success\".", icon: PackageCheck, codeLine: 9 },
  { id: "render", label: "6. React re-renders → the list appears", detail: "The component runs again, and this time status is \"success\".", icon: MonitorSmartphone, codeLine: 1, tone: "success" },
]

export default function FetchingDataLesson() {
  return (
    <>
      <p>
        Almost every real app needs data from somewhere else — a server, a database, a
        third-party service. Getting that data into your component combines two things you
        already know: <code>useEffect</code> to trigger the request, and <code>useState</code> to
        store what comes back.
      </p>

      <AnalogyCard title="An API call is a waiter carrying your order to the kitchen.">
        You (the component) don't cook the food yourself — you hand your order to a waiter
        (fetch), who carries it to the kitchen (the server). There's a real wait while the kitchen
        prepares it. Eventually the waiter comes back — either with your food, or to tell you
        something went wrong. A good restaurant tells you "your order is being prepared" instead
        of leaving you staring at an empty table wondering if anyone heard you.
      </AnalogyCard>

      <h2>The request lifecycle</h2>
      <p>Fetching data is always the same shape, whether it takes 50ms or 5 seconds.</p>
      <StepFlowDiagram title="Loading data on mount" steps={lifecycleSteps} code={lifecycleCode} autoPlayMs={1500} />

      <h2>Try it — a real, live network request</h2>
      <p>
        This isn't a simulation — it's a genuine request to a public API, running in your
        browser right now. Click the button to point it at a URL that doesn't exist, and watch
        every state the UI passes through.
      </p>
      <LiveCodeBlock code={userListExample} />

      <Callout variant="info">
        Notice all three states are handled explicitly in the JSX:{" "}
        <code>status === "loading"</code>, <code>"error"</code>, and <code>"success"</code>. The
        user is never staring at a blank screen wondering what's happening.
      </Callout>

      <h2>Common mistakes</h2>
      <CommonMistake
        title="forgetting to handle the loading state"
        wrong={`const [users, setUsers] = useState([]);\nuseEffect(() => {\n  fetch(url).then(r => r.json()).then(setUsers);\n}, []);\nreturn <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n// briefly renders an empty, unexplained list`}
        right={`const [users, setUsers] = useState([]);\nconst [loading, setLoading] = useState(true);\nuseEffect(() => {\n  fetch(url).then(r => r.json()).then((data) => {\n    setUsers(data);\n    setLoading(false);\n  });\n}, []);\nif (loading) return <p>Loading...</p>;`}
        explanation={
          <p>
            Without a loading state, the user sees an empty or confusing screen while the request
            is in flight, with no signal that anything is happening at all.
          </p>
        }
      />
      <CommonMistake
        title="not checking response.ok"
        wrong={`fetch(url)\n  .then((res) => res.json())\n  .then((data) => setUsers(data));\n// a 404 or 500 response still "succeeds" here —\n// fetch only rejects on network failure`}
        right={`fetch(url)\n  .then((res) => {\n    if (!res.ok) throw new Error("Request failed");\n    return res.json();\n  })\n  .then((data) => setUsers(data))\n  .catch(() => setStatus("error"));`}
        explanation={
          <p>
            <code>fetch()</code>'s promise only rejects for network-level failures, like being
            offline. An HTTP error response like 404 or 500 is still a "successful" fetch as far
            as the Promise is concerned — you have to check <code>response.ok</code> yourself.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Does fetch()'s promise reject when the server responds with a 404?"
        options={[
          { id: "a", text: "Yes, always" },
          { id: "b", text: "No — fetch only rejects on network failures; you must check response.ok yourself" },
          { id: "c", text: "Only for 500-level errors" },
          { id: "d", text: "Only when using async/await" },
        ]}
        correctId="b"
        explanation="fetch() treats any response the server actually sends — even a 404 or 500 — as a successful fetch. Only true network failures (offline, DNS errors, CORS blocks) cause the promise to reject. Checking response.ok is on you."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Show each user's company"
        hint={<p>Add <code>{"{\" — \" + user.company.name}"}</code> right after <code>{"{user.name}"}</code>.</p>}
      >
        Each user object from this API also has a <code>company.name</code> field. Display it
        next to each name.
      </Challenge>
      <LiveCodeBlock code={challengeStarter} />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why does fetch() need an explicit response.ok check, unlike some other HTTP libraries?"
        answer={
          <p>
            <code>fetch()</code> was designed to treat the network layer and the application layer
            as separate concerns: its promise resolves as soon as the browser successfully gets{" "}
            <em>any</em> HTTP response, regardless of status code — that's a fact about the
            network, not about your application logic. Whether a 404 or 500 counts as "an error"
            is up to your code to decide, so you check <code>response.ok</code> (true for status
            200–299) yourself. Libraries like Axios make an opinionated choice for you and reject
            the promise automatically for error status codes — convenient, but it's a design
            choice, not a difference in what actually happened over the network.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "useEffect + fetch is the standard pattern for loading data when a component mounts.",
          "Track loading, success, and error as explicit state — never assume data arrives instantly.",
          "fetch() only rejects on network failure; always check response.ok for HTTP errors.",
          "Handle all three states in your JSX so the user is never staring at a blank or broken screen.",
        ]}
      />
    </>
  )
}
