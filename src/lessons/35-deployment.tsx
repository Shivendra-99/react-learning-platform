import { Callout } from "@/components/lesson/callout"
import { AnalogyCard } from "@/components/lesson/analogy-card"
import { CommonMistake } from "@/components/lesson/common-mistake"
import { Quiz } from "@/components/lesson/quiz"
import { InterviewQuestion } from "@/components/lesson/interview-question"
import { KeyTakeaways } from "@/components/lesson/key-takeaways"
import { CodeWalkthrough, type WalkthroughStep } from "@/components/lesson/code-walkthrough"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const buildCode = `npm run build

vite v8.2.0 building for production...
✓ 412 modules transformed.
dist/index.html                   1.2 kB
dist/assets/index-C4f9a2.css     47.8 kB │ gzip: 9.1 kB
dist/assets/index-B92kd1.js     142.4 kB │ gzip: 45.6 kB
dist/assets/lesson-14-A8f2.js      6.1 kB │ gzip: 2.3 kB
✓ built in 3.42s`

const buildSteps: WalkthroughStep[] = [
  {
    id: "b1",
    label: "One command, not a dev server",
    detail:
      "npm run dev runs a server that recompiles on every save, with helpful but heavy debug tooling. npm run build does none of that — it runs once and produces static files.",
    lines: 1,
  },
  {
    id: "b2",
    label: "Every file gets a content hash",
    detail:
      "index-C4f9a2.css — that C4f9a2 is derived from the file's own content. Change one line of CSS and the hash changes, which is the entire mechanism that makes aggressive caching safe (more on that below).",
    lines: 5,
  },
  {
    id: "b3",
    label: "Each lesson is its own chunk",
    detail:
      "This is lazy() and code splitting from earlier lessons, made concrete: lesson-14 has its own small file, fetched only when someone actually visits that lesson.",
    lines: 7,
  },
  {
    id: "b4",
    label: "Minified AND gzip-measured",
    detail:
      "142.4 kB is the real file size; 45.6 kB is what actually travels over the network, since virtually every host compresses text assets automatically. The gzip number is the one that matters for load time.",
    lines: 6,
  },
]

export default function DeploymentLesson() {
  return (
    <>
      <p>
        Every lesson in this course has run in a dev server — the same one you'd use while
        building the app. What actually reaches a real user is a different, much smaller set of
        files, produced by one command, and how you configure that step is most of what
        "deploying a React app" turns out to mean.
      </p>

      <AnalogyCard title="npm run dev is the kitchen; npm run build is the sealed, labelled meal that ships.">
        The kitchen is full of half-finished dishes, extra ingredients, and tools nobody but the
        chef needs — perfect for cooking, useless to hand a customer. The build step plates one
        finished, minified, correctly-labelled version and throws away everything that was only
        there to help you cook.
      </AnalogyCard>

      <h2>What the production build actually does</h2>
      <p>
        This is this course's own build — the same <code>npm run build</code> that produced the
        site you're reading right now.
      </p>
      <div className="not-prose">
        <CodeWalkthrough title="Reading a real build" filename="terminal" code={buildCode} steps={buildSteps} />
      </div>

      <h2>Environment variables: the part everyone gets wrong once</h2>
      <p>
        A frontend build has no server-side secret vault — everything ends up as plain text in
        files anyone can view. That single fact drives every rule about environment variables in
        a Vite (or Create React App, or Next.js client-side) project.
      </p>
      <div className="not-prose">
        <Tabs defaultValue="vite">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vite">Vite convention</TabsTrigger>
            <TabsTrigger value="danger">What NOT to do</TabsTrigger>
          </TabsList>
          <TabsContent value="vite" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`// .env
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-12345

// Only variables prefixed VITE_ are exposed to your
// code — this is deliberate, not a limitation
console.log(import.meta.env.VITE_API_URL);

// .gitignore
.env.local        # never commit real secrets`}</pre>
          </TabsContent>
          <TabsContent value="danger" className="mt-3">
            <pre className="overflow-x-auto rounded-lg border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed text-gray-300">{`// .env
VITE_STRIPE_SECRET_KEY=sk_live_51H...
VITE_DATABASE_PASSWORD=hunter2

// This gets bundled into a public .js file.
// Anyone can open DevTools → Sources and
// read it in plain text. Both of these
// belong on a server, never in a frontend
// build at all.`}</pre>
          </TabsContent>
        </Tabs>
      </div>

      <Callout variant="warning" title="There is no such thing as a frontend secret">
        A frontend build ships to every visitor's browser as static files. Any value baked into it
        — API keys, tokens, passwords — is readable by anyone who opens DevTools, no exception.
        Only put values in a frontend <code>.env</code> that are safe to be fully public: a public
        API base URL, an analytics ID, a publishable (not secret) payment key. Anything that must
        stay private belongs on a server that the browser talks to, never in the browser bundle
        itself.
      </Callout>

      <h2>Caching: what those hashed filenames are for</h2>
      <p>
        <code>index.html</code> and the hashed asset files need opposite caching rules, and
        getting this backwards is a common real deployment bug.
      </p>
      <ul className="ml-5 list-disc space-y-1.5 text-muted-foreground">
        <li>
          <code>index.html</code> should <strong>never</strong> be cached — it's small, it's what
          references the current hashed files, and if it's stuck in a cache, users keep loading an
          old version of your app indefinitely.
        </li>
        <li>
          Hashed files like <code>index-C4f9a2.js</code> can be cached{" "}
          <strong>forever</strong> — safely — because any change to the file's content produces a{" "}
          <em>different</em> filename. There's no such thing as a stale cache for a file whose
          name changes the moment its content does.
        </li>
      </ul>
      <Callout variant="tip">
        This is exactly why the build hashes filenames instead of reusing{" "}
        <code>index.js</code> forever — the filename itself becomes the cache invalidation
        mechanism, which is more reliable than any cache-control header trick.
      </Callout>

      <h2>The SPA routing gotcha</h2>
      <p>
        This course uses React Router with real URLs like <code>/lessons/use-effect</code>. Refresh
        that page and the browser makes a real request to the server for exactly that path — but
        no file called <code>lessons/use-effect</code> actually exists on disk. Without
        configuration, that's a server-level 404 before React ever runs.
      </p>
      <pre className="not-prose overflow-x-auto rounded-xl border bg-[#0d1117] p-4 font-mono-code text-[13px] leading-relaxed whitespace-pre text-gray-300">{`// vercel.json — this course's own config
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

// Every path, real or not, serves index.html.
// React Router then reads the URL client-side
// and renders the matching route — or the
// app's own 404 page if nothing matches.`}</pre>

      <h2>Common mistake</h2>
      <CommonMistake
        title="checking the dev server instead of the production build before shipping"
        wrong={`npm run dev\n// looks fine, ship it\n\n// Dev mode has verbose error overlays,\n// unminified code, and no real caching\n// behaviour — several real bugs (a missing\n// env var, a broken route rewrite) only\n// show up in the actual production build`}
        right={`npm run build\nnpm run preview\n// now click through the real thing\n\n// preview serves the actual dist/ output,\n// so you catch env-var and routing issues\n// before a real user does`}
        explanation={
          <p>
            The dev server and the production build are genuinely different artifacts — different
            bundling, different environment variable resolution, no minification in dev. "Works in{" "}
            <code>npm run dev</code>" is not the same claim as "works in production," and the gap
            between them is exactly where deployment bugs hide. <code>npm run preview</code> serves
            the real <code>dist/</code> folder locally, which is the closest you can get to
            production before actually deploying.
          </p>
        }
      />

      <h2>Quick quiz</h2>
      <Quiz
        question="Why is it safe to cache a file like index-C4f9a2.js forever, but never safe to cache index.html?"
        options={[
          { id: "a", text: "JavaScript files are always safe to cache; HTML never is" },
          { id: "b", text: "The hash in the filename changes whenever the file's content changes, so a cached copy is never stale — but index.html has no hash and points to whichever hashed files are current" },
          { id: "c", text: "Browsers don't support caching HTML files at all" },
          { id: "d", text: "index.html is always larger than the JS bundle, so caching it wastes more space" },
        ]}
        correctId="b"
        explanation="The hash is derived from the file's own content, so any change produces a new filename — a cached copy of the old filename is simply never wrong, because it will never be served for the new content. index.html has no hash and is the one file that references the current set of hashed assets, so caching it risks stranding users on an old app version indefinitely."
      />

      <h2>Interview question</h2>
      <InterviewQuestion
        question="Walk through what happens between npm run build and a user loading your site."
        answer={
          <p>
            The build step bundles and minifies the app's JavaScript and CSS, splits it into
            chunks along the boundaries set by <code>lazy()</code> calls, appends a content hash
            to each output filename, and writes everything into a <code>dist</code> folder
            alongside an <code>index.html</code> that references the current hashed files. That
            folder gets uploaded to a static host or CDN. When a user requests the site, the host
            serves <code>index.html</code> — configured to never be cached, so it always reflects
            the latest deploy — which loads the hashed JS and CSS, both of which the browser (and
            any CDN in front of it) can cache aggressively and safely, since a changed file always
            gets a new name. For a single-page app using client-side routing, the host also needs
            a rewrite rule sending every path to <code>index.html</code>, or a hard refresh on any
            route other than the root 404s at the server before React ever gets a chance to run.
            And any environment variable baked into that JavaScript is public the moment it ships
            — genuinely private values need to live behind an API the browser calls, never in the
            frontend build itself.
          </p>
        }
      />

      <KeyTakeaways
        items={[
          "npm run build produces the real deployed artifact — minified, chunked, and content-hashed; the dev server is not a preview of it.",
          "Only prefix (VITE_ in Vite) variables are exposed to your code, and even those end up as public plain text in the shipped bundle.",
          "There is no such thing as a frontend secret — genuinely private values must live behind a server the browser calls.",
          "Content-hashed filenames are what make aggressive, permanent caching of JS/CSS safe; index.html must never be cached the same way.",
          "A single-page app needs a server rewrite sending every path to index.html, or deep links 404 before React Router ever runs.",
          "Run npm run preview before shipping — it's the closest local approximation of what a real user will actually load.",
        ]}
      />
    </>
  )
}
