import { MemoryRouter, Routes, Route, Link } from "react-router-dom"
import { MapPin, Navigation, GitCompare, MonitorSmartphone, RefreshCw } from "lucide-react"
import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveDemoBlock } from "@/components/lesson/live-demo-block"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { StepFlowDiagram, type FlowStep } from "@/components/diagram/step-flow-diagram"

function DemoHome() {
  return <h3>🏠 Home page</h3>
}

function DemoAbout() {
  return <h3>ℹ️ About page</h3>
}

function DemoContact() {
  return <h3>✉️ Contact page</h3>
}

function TwoPageApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<DemoHome />} />
        <Route path="/about" element={<DemoAbout />} />
      </Routes>
    </MemoryRouter>
  )
}

function ThreePageApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<DemoHome />} />
        <Route path="/about" element={<DemoAbout />} />
        <Route path="/contact" element={<DemoContact />} />
      </Routes>
    </MemoryRouter>
  )
}

const twoPageCode = `function Home() {
  return <h3>🏠 Home page</h3>;
}

function About() {
  return <h3>ℹ️ About page</h3>;
}

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}`

const threePageCode = `function Contact() {
  return <h3>✉️ Contact page</h3>;
}

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>{/* ← added */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />{/* ← added */}
      </Routes>
    </MemoryRouter>
  );
}`

const lifecycleSteps: FlowStep[] = [
  { id: "click", label: "1. User clicks a Link", detail: "Or types a URL, or clicks browser back/forward.", icon: Navigation },
  { id: "intercept", label: "2. React Router intercepts it", detail: "It prevents the browser's default full-page navigation.", icon: GitCompare },
  { id: "match", label: "3. It matches the new path against your routes", detail: "Comparing the URL against every <Route path=\"...\"> you've defined.", icon: MapPin },
  { id: "render", label: "4. The matching route's element renders", detail: "React swaps in the new component — no other part of the page is touched.", icon: RefreshCw, tone: "success" },
  { id: "url", label: "5. The address bar updates too", detail: "Using the browser's History API — so back/forward and bookmarking still work.", icon: MonitorSmartphone },
]

export default function ReactRouterBasicsLesson() {
  return (
    <>
      <p>
        Everything you've built so far has been a single page. Real apps usually have many —
        a home page, a settings page, a product page. React Router lets one React app show
        different UI for different URLs, without ever reloading the page.
      </p>

      <AnalogyCard title="React Router is a GPS for your app.">
        A GPS doesn't rebuild the road network every time you take a turn — it just recalculates
        which part of the map to show you, based on where you are. React Router works the same
        way: the URL says where you "are," and it decides which component to show, without
        throwing away and reloading everything else.
      </AnalogyCard>

      <h2>What happens on navigation</h2>
      <StepFlowDiagram title="Clicking a Link" steps={lifecycleSteps} autoPlayMs={1300} />

      <h2>Try it — real navigation, no page reload</h2>
      <p>
        This is a fully working router. Click between "Home" and "About" — notice nothing flashes
        or reloads.
      </p>
      <LiveDemoBlock code={twoPageCode} Component={TwoPageApp} />

      <Callout variant="info">
        Three building blocks: a <strong>Router</strong> (here, <code>MemoryRouter</code> — real
        apps use <code>BrowserRouter</code>) wraps everything; <code>&lt;Routes&gt;</code> holds
        your URL-to-component mapping; <code>&lt;Link&gt;</code> is how the user navigates between
        them.
      </Callout>

      <h2>Common mistake</h2>
      <CommonMistake
        title="using <a href> instead of <Link>"
        wrong={`<a href="/about">About</a>\n// triggers a full browser page reload —\n// your entire React app remounts from scratch`}
        right={`<Link to="/about">About</Link>\n// React Router intercepts the click and\n// updates the view without reloading anything`}
        explanation={
          <p>
            A plain <code>&lt;a href&gt;</code> is a real link — the browser will do exactly what
            it always does with one: throw away the current page and request a brand new one.{" "}
            <code>&lt;Link&gt;</code> renders an <code>&lt;a&gt;</code> under the hood but
            intercepts the click to navigate client-side instead.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="What's the main difference between <a href> and <Link to> in a React Router app?"
        options={[
          { id: "a", text: "No real difference — they're aliases for the same thing" },
          { id: "b", text: "<Link> only works inside class components" },
          { id: "c", text: "<a> triggers a full page reload; <Link> updates the URL and view without reloading" },
          { id: "d", text: "<Link> can only point to external websites" },
        ]}
        correctId="c"
        explanation="<a href> is a real browser link and always causes a full page navigation. <Link> intercepts the click, updates the URL via the History API, and lets React Router swap in the new component — no reload, no lost state."
      />

      <h2>Mini challenge</h2>
      <Challenge
        title="Add a third page"
        hint={<p>You need exactly two additions: a <code>{'<Link to="/contact">Contact</Link>'}</code> in the nav, and a <code>{'<Route path="/contact" element={<Contact />} />'}</code> in Routes.</p>}
      >
        Starting from the app above, what two lines would you add to wire up a{" "}
        <code>Contact</code> page? Think it through, then check the diff below.
      </Challenge>
      <LiveDemoBlock code={threePageCode} Component={ThreePageApp} label="The solution, live — click Contact" />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="How does React Router change the page without the browser doing a full reload?"
        answer={
          <p>
            It uses the browser's <strong>History API</strong> — specifically{" "}
            <code>history.pushState()</code>. Instead of letting a normal link request a new HTML
            document from the server, React Router's <code>Link</code> component intercepts the
            click, calls <code>pushState</code> to change the URL shown in the address bar (which
            does <em>not</em> trigger a network request or page reload), and then re-renders
            whichever <code>&lt;Route&gt;</code> now matches that new URL — entirely on the
            client. This is the core mechanism behind every single-page application.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "React Router shows different UI for different URLs, without full page reloads.",
          "Wrap your app in a Router (BrowserRouter in real apps) and map URLs to components with <Routes> and <Route>.",
          "Always use <Link> (or <NavLink>) instead of <a href> for internal navigation.",
          "Under the hood, it uses the browser's History API to change the URL client-side.",
        ]}
      />
    </>
  )
}
