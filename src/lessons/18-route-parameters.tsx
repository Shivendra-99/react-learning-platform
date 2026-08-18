import { useEffect, useState } from "react"
import { MemoryRouter, Routes, Route, Link, useParams } from "react-router-dom"
import { Hash, MapPin, Braces, Search, MonitorSmartphone } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveDemoBlock } from "@/components/lesson/live-demo-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"

interface Post {
  id: number
  title: string
  body: string
}

function DemoPostList() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then(setPosts)
  }, [])

  return (
    <ul style={{ margin: 0, paddingLeft: 20 }}>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}

function DemoPostDetail({ showHeading = false }: { showHeading?: boolean }) {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    setPost(null)
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then(setPost)
  }, [id])

  return (
    <div>
      <Link to="/">← Back to list</Link>
      {showHeading ? <h4 style={{ margin: "8px 0 4px" }}>Post #{id}</h4> : null}
      {post ? <p>{post.body}</p> : <p>Loading post...</p>}
    </div>
  )
}

function BasicApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<DemoPostList />} />
        <Route path="/posts/:id" element={<DemoPostDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

function SolvedApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<DemoPostList />} />
        <Route path="/posts/:id" element={<DemoPostDetail showHeading />} />
      </Routes>
    </MemoryRouter>
  )
}

const basicCode = `function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={"/posts/" + post.id}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(null);
    fetch("https://jsonplaceholder.typicode.com/posts/" + id)
      .then((res) => res.json())
      .then(setPost);
  }, [id]);

  return (
    <div>
      <Link to="/">← Back to list</Link>
      {post ? <p>{post.body}</p> : <p>Loading post...</p>}
    </div>
  );
}`

const solvedCode = `function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(null);
    fetch("https://jsonplaceholder.typicode.com/posts/" + id)
      .then((res) => res.json())
      .then(setPost);
  }, [id]);

  return (
    <div>
      <Link to="/">← Back to list</Link>
      <h4>Post #{id}</h4>{/* ← added */}
      {post ? <p>{post.body}</p> : <p>Loading post...</p>}
    </div>
  );
}`

const paramSteps: FlowStep[] = [
  { id: "click", label: "1. User clicks a Link to /posts/3", detail: "Navigating to a URL with a real, specific value baked in.", icon: MapPin },
  { id: "match", label: "2. React Router matches it against /posts/:id", detail: "The :id segment is a placeholder that matches anything in that position.", icon: Braces },
  { id: "extract", label: "3. id is captured as the string \"3\"", detail: "Whatever appeared in that segment of the real URL.", icon: Hash },
  { id: "read", label: "4. useParams() returns { id: \"3\" }", detail: "Called inside the component that the route renders.", icon: Search },
  { id: "use", label: "5. The component uses it to fetch or display data", detail: "Usually paired with useEffect to load the right data for that id.", icon: MonitorSmartphone, tone: "success" },
]

export default function RouteParametersLesson() {
  return (
    <>
      <p>
        Most real apps don't just navigate between a fixed set of pages — they navigate to a{" "}
        <em>specific</em> thing: this product, that user, post #3. Route parameters let a single
        route definition handle all of them.
      </p>

      <AnalogyCard title="A route parameter is a blank in a mad-libs sentence.">
        The route <code>/posts/:id</code> is a template with a blank in it — like "post number
        ___." When the URL is actually <code>/posts/3</code>, React Router fills in that blank
        with <code>"3"</code> and hands it to your component. Same template, different value
        every time.
      </AnalogyCard>

      <h2>From URL to value</h2>
      <StepFlowDiagram title="Reading a route parameter" steps={paramSteps} autoPlayMs={1300} />

      <h2>Try it — a list that links to details</h2>
      <p>
        Real posts, fetched live. Click any title to navigate to its detail page — notice the URL
        segment changes and a fresh request fires for that specific post.
      </p>
      <LiveDemoBlock code={basicCode} Component={BasicApp} />

      <Callout variant="tip">
        This combines everything so far: <code>useState</code> + <code>useEffect</code> to fetch,{" "}
        <code>Link</code> to navigate, and <code>useParams</code> to know{" "}
        <em>which</em> post to fetch on the detail page.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="assuming route params are numbers"
        wrong={`const { id } = useParams();\nif (id === 3) { ... }\n// never true — id is the STRING "3", not the number 3`}
        right={`const { id } = useParams();\nif (Number(id) === 3) { ... }\n// convert it first`}
        explanation={
          <p>
            URLs are text. React Router has no way to know whether a segment is "meant" to be a
            number, a UUID, or a slug — it always hands back exactly what appeared in the URL, as
            a string. Convert it yourself with <code>Number(id)</code> when you need it as one.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What type is the value returned by useParams() for a route like /posts/:id?"
        options={[
          { id: "a", text: "Always a number" },
          { id: "b", text: "Always a string" },
          { id: "c", text: "Depends on what the URL segment looks like" },
          { id: "d", text: "An array of characters" },
        ]}
        correctId="b"
        explanation="Every value captured by useParams() is a string, always — because URLs themselves are just text. Convert with Number() or parseInt() whenever you need it as a different type."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Show which post you're viewing"
        hint={<p>Add <code>{"<h4>Post #{id}</h4>"}</code> right above the <code>{"{post ? ... : ...}"}</code> line — id is already in scope from useParams().</p>}
      >
        <code>PostDetail</code> knows the current post's <code>id</code>, but never displays it.
        What one line would you add? Check your answer below.
      </Challenge>
      <LiveDemoBlock code={solvedCode} Component={SolvedApp} label="The solution, live — click a post" />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Why are useParams() values always strings, even for numeric-looking IDs?"
        answer={
          <p>
            A URL is fundamentally a string — the segment after <code>/posts/</code> is just
            characters as far as the browser and the router are concerned. React Router doesn't
            inspect your database schema or guess your intent; it captures exactly what's written
            in that position of the URL and hands it back unmodified. Whether that value
            represents a number, a UUID, or a text slug is application-specific knowledge that
            only your code has — so converting it to the right type is your responsibility, not
            the router's.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "A dynamic segment in a route path, like :id, captures part of the URL as a parameter.",
          "useParams() reads those captured values inside the component the matching route renders.",
          "Route parameter values are always strings — convert them yourself when you need a number.",
          "Pairing useParams with useEffect lets you fetch data specific to whatever the URL points at.",
        ]}
      />
    </>
  )
}
