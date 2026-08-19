/**
 * Plain-English versions of every interview answer, keyed by question id.
 *
 * Kept separate from interview-questions.ts purely so the two kinds of writing
 * stay easy to review side by side — the formal answer is what you'd say in the
 * room, this is the version you'd give a friend. Every id in the question bank
 * must appear here; `missingSimpleAnswers` below is used to assert that in dev.
 *
 * Backticks render as inline code, same as in the main answers.
 */

export const SIMPLE_ANSWERS: Record<string, string> = {
  // ------------------------------------------------------------ fundamentals
  "what-is-react":
    "Imagine updating a scoreboard by hand. Every time the score changes you have to remember every place the number appears — the big display, the summary, the printout — and if you forget one, it shows the wrong thing. React lets you write down what the scoreboard should look like for any score, and it updates all the right places for you. You describe the result; React does the fiddly updating.",

  jsx: "JSX is the HTML-looking code you write inside JavaScript. It isn't real HTML — a tool converts it into normal JavaScript before the browser sees it. Think of it like writing a letter in shorthand: it's quicker and easier to read while you write, and it gets typed up properly before anyone else reads it.",

  fragments:
    "A component has to hand back one single thing, so people wrap everything in a `<div>`. But those extra boxes pile up and can break your layout. A Fragment (`<>...</>`) is an invisible box — it lets you group things together without actually adding anything to the page. Like a paperclip holding pages together instead of stapling them into a folder.",

  "why-react-popular":
    "React caught on because you say what you want rather than how to build it, and because you build pages out of small reusable pieces — like LEGO bricks instead of carving one big statue. Add a huge collection of ready-made libraries, the fact that the same skills work for mobile apps, and years of not breaking people's code, and companies felt safe betting on it.",

  "dom-slow":
    "Changing the page isn't slow on its own — it's what the browser has to redo afterwards. Move one thing and it may need to re-measure and repaint everything around it. It's like moving one book on a packed shelf: the book move is instant, but shuffling everything else to fit takes the time. Doing that hundreds of times in a row is what makes things crawl.",

  "virtual-dom":
    "React keeps a lightweight sketch of the page in memory. When something changes, it draws a new sketch, compares it with the old one, spots the differences, and only changes those bits on the real page. Like editing a Google Doc instead of retyping the whole book — you only touch the lines that actually changed.",

  "class-vs-functional":
    "Two ways of writing the same thing. Class components are the older, wordier style with more ceremony. Function components are just plain functions, much shorter, and use hooks to do everything classes could. New code uses functions. You'll still meet classes in older projects — and in one special case, error boundaries, which still need a class.",

  "props-vs-state":
    "Props are things handed to a component from outside — like ingredients given to a chef. The chef can use them but can't change what was delivered. State is what the component keeps and manages itself — like the pot the chef is stirring. If the value comes from somewhere else, it's a prop. If the component changes it over time, it's state.",

  keys: "When you show a list, React needs a way to tell the items apart between updates. A key is a name tag. Without one it just goes by position — so if you add something at the top, it thinks every single item changed and gets confused about what belongs where. That's how you end up with text typed into one box suddenly appearing in another.",

  "controlled-uncontrolled":
    "Controlled means React holds what's typed in the box and the box just displays it. Uncontrolled means the box keeps its own value and you ask for it later. Controlled is like watching someone write and copying every letter down as they go — more work, but you always know exactly what's there. Uncontrolled is waiting until they hand you the finished form.",

  "pure-components":
    "'Pure' means predictable: same ingredients in, same meal out, and it doesn't secretly rearrange your kitchen while cooking. React needs components to behave this way because it might run them more than once. The related tools — `React.memo` and `PureComponent` — use that predictability to skip work: if nothing was handed in differently, don't bother cooking again.",

  "synthetic-events":
    "Browsers each handle clicks and typing slightly differently. React wraps them all in its own consistent version so your code works the same everywhere. Like a universal travel adapter — different sockets in different countries, but your plug always fits.",

  "event-handlers":
    "You tell React what to run when something happens: `onClick={handleClick}`. The classic mistake is writing `onClick={handleClick()}` with brackets — that runs it straight away, before anyone clicks anything. Passing the function is handing someone your phone number; calling it is phoning them right now.",

  "parent-child-communication":
    "Data flows downward like water — a parent hands values to its children as props. To send something back up, the parent gives the child a function to call, like handing someone a pre-addressed envelope. The child fills it in and posts it, and the parent decides what to do with it.",

  "lifecycle-methods":
    "In the old class style, a component had three moments you could hook into: when it first appears on screen, when it updates, and just before it disappears. Like moving into a flat, living there, and moving out. You'd set things up on arrival and tidy up before leaving.",

  // -------------------------------------------------------------------- hooks
  "hooks-reference":
    "Five do most of the work. `useState` remembers a value. `useEffect` deals with the outside world — timers, fetching, subscriptions. `useContext` grabs something shared without passing it hand to hand. `useReducer` handles state with lots of moving parts. `useRef` remembers something without redrawing the screen. Everything else is a specialist tool you reach for when you have a specific reason.",

  "why-hooks":
    "Before hooks, sharing logic between components meant wrapping them in other components, and you'd end up with layers upon layers, like nested Russian dolls, just to reuse one piece of behaviour. Related code also got split across three different places. Hooks let you pull that logic into a plain function you can reuse anywhere, and keep the setup and cleanup of one job sitting together.",

  "rules-of-hooks":
    "Always call hooks in the same order, at the top of your component — never inside an `if` or a loop. React doesn't remember them by name, it remembers them by order, like coats on numbered pegs. Skip a peg one day and everyone goes home with the wrong coat.",

  "usestate-vs-usereducer":
    "`useState` is a sticky note — quick, fine for one thing. `useReducer` is a proper form with checkboxes: you say what happened ('add to cart'), and one central place decides what that means. Use the sticky note for simple values, the form when several things change together or the rules get complicated.",

  "useeffect-cleanup":
    "If your code starts something ongoing — a timer, a subscription — you need to stop it again, or you'll have several running at once quietly eating memory. The cleanup function is turning the tap off. React calls it before starting the effect again and when the component disappears.",

  "dependency-array":
    "The list in square brackets tells React when to run your effect again. Empty list: run once and never again. A list with things in it: run again whenever one of those changes. No list at all: run after every single update. It's a list of what the effect cares about — leave something out and it'll keep using an old, stale copy of it.",

  "lifecycle-with-hooks":
    "The three old moments — appearing, updating, disappearing — all collapse into `useEffect`. Empty list means 'when it appears'. A list with values means 'when those change'. The function you return is 'before it disappears'. One tool instead of three, though it's better to stop thinking in moments and think about what the effect keeps in sync.",

  "useeffect-usecases":
    "Use an effect to talk to the world outside React: timers, subscriptions, browser APIs, or a chart library that owns its own bit of the page. Don't use it to work out something you could just calculate as you draw, and don't use it to react to a button press — that belongs in the button's own handler. Effects are for reaching outside, not for shuffling things around inside.",

  "useeffect-infinite-loop":
    "The loop is always the same story: the effect changes something, the change causes a redraw, the redraw runs the effect again, forever. Like a smoke alarm that sets itself off. Usually it's a missing list of dependencies, or an object rebuilt from scratch each time so it always looks new even when it's identical.",

  "state-vs-ref":
    "Both remember things between updates. The difference is whether the screen notices. Changing state tells React to redraw. Changing a ref doesn't — it's a private notepad. So: if it's shown on screen, use state. If it's just something you're keeping track of behind the scenes, use a ref.",

  "usememo-vs-usecallback":
    "Both are about not redoing work. `useMemo` saves the answer to a slow calculation so you don't work it out again. `useCallback` saves the function itself so it stays recognisably 'the same one' between updates. Saving the meal versus saving the recipe.",

  "useref-uses":
    "Two jobs. One: get hold of an actual element on the page so you can do something to it, like focus a text box. Two: remember a value quietly, without redrawing anything. It's a sticky note on your monitor — always there, but changing it doesn't change what's on screen.",

  "custom-hooks":
    "A custom hook is your own reusable chunk of behaviour, packaged as a function starting with 'use'. Important bit people get wrong: it shares the recipe, not the meal. Two components using the same hook each get their own separate copy of the data, like two people cooking from the same cookbook.",

  "strict-mode-double":
    "In development React deliberately runs your effect twice to check you've cleaned up properly. It's a fire drill, not a fault. If running twice breaks something, that's a real bug that would show up eventually anyway — usually a missing cleanup. It doesn't happen in the live version of your site.",

  // ---------------------------------------------------------- state management
  "prop-drilling":
    "Passing something down through five components when only the last one needs it — like passing a message down a row of people to reach the person at the end. Everyone in between has to handle it for no reason. Fix it with Context or a store. But passing through one or two is completely fine; don't over-engineer it.",

  "context-rerenders":
    "Context is a tannoy announcement — everyone listening reacts, even if the news doesn't concern them. If the announcement goes out constantly, everyone keeps stopping to listen. Fine for rare things like switching to dark mode, wasteful for something changing every second.",

  "context-vs-redux":
    "Context is a delivery route: it gets a value to wherever it's needed without passing it hand to hand. That's all it does. A store like Redux or Zustand is a proper warehouse with a system — it tracks what changed and only notifies the people who care. Small and rarely-changing: Context. Big, busy, shared everywhere: a store.",

  "redux-basics":
    "One central box holds your app's data. To change it you don't reach in — you fill in a slip saying what happened ('user logged in'), and one set of rules decides what the box should look like afterwards. Because every change goes through the same door, you can see exactly what happened and when, which makes bugs much easier to track down.",

  "global-state":
    "First ask if it's really global — most things aren't. Rarely-changing shared bits like theme or logged-in user: Context. Busy shared data: a store like Zustand. Anything that came from a server: a data-fetching library, because what you actually need is caching and refreshing, not just somewhere to park it. Putting server data in Redux means rebuilding all that yourself.",

  "lifting-state":
    "If two components need to agree on something, don't give them each their own copy — they'll drift apart. Move it up to the nearest component that contains both, and let it hand the value down. One family calendar on the fridge instead of everyone keeping their own diary.",

  "state-async":
    "Calling the setter doesn't change the value on the spot — it asks React to redraw with a new one. The value you're currently looking at is a photograph of this moment and it will never change. That's why setting it three times in a row only adds one. Use the `setCount(c => c + 1)` form and each update gets the latest number rather than the old photo.",

  // ------------------------------------------------------------- performance
  "rerender-triggers":
    "Three things make a component redraw: its own data changed, its parent redrew, or something shared it listens to changed. And 'redraw' just means React runs your function again to see what the result should be — it only touches the actual page where the result is genuinely different. Rechecking is cheap; it only matters when it's happening constantly or the work inside is heavy.",

  "why-child-rerenders":
    "When a parent redraws, all its children redraw too by default — React doesn't stop to check whether anything actually changed for them. `React.memo` asks it to check first. The catch: if you hand the child a freshly-made function or object each time, it looks brand new even when it's identical, so the check never saves you anything.",

  "react-memo":
    "`React.memo` tells React 'check whether anything changed before redrawing this'. Useful for components that are expensive and rarely change. Pointless — and slightly wasteful — for small ones, because the checking costs more than just redrawing. And it does nothing if you keep handing it new-looking things each time.",

  "optimize-checklist":
    "Measure before you change anything, or you'll spend a day speeding up something nobody was waiting on. Then it's three ideas: redraw less often, draw less at once, and send less code to the browser. Sprinkling optimisations everywhere before checking usually makes things slower and much harder to read.",

  "find-perf-problems":
    "Use the React DevTools Profiler — it records what happened and shows you what redrew, how long it took, and why. Guessing is how people spend a day optimising something that was never the problem. Same as a doctor running tests before prescribing anything.",

  "code-splitting":
    "Instead of sending your whole app to the browser upfront, split it into pieces and send each one only when it's actually needed. Like a restaurant bringing each course as you order it, rather than putting the entire menu on your table at once.",

  "long-lists":
    "Don't put ten thousand rows on the page — the browser has to deal with every single one even though only about twenty fit on screen. Virtualisation renders just the visible ones and swaps them as you scroll. Like a train window: the countryside is huge, but you only ever see one frame of it.",

  // ---------------------------------------------------------------- advanced
  "react-fiber":
    "React's old engine, once it started updating, couldn't stop until it finished — so a big update froze the page and typing did nothing. Fiber rebuilt it so React can pause partway, deal with something urgent like a keystroke, then carry on. A chef who can put down the slow-cooking dish to take your order, instead of ignoring you until it's plated.",

  "error-boundaries":
    "A safety net. If part of your page crashes, an error boundary catches it and shows a friendly message instead of the whole app going blank. Like a circuit breaker: one room loses power, the rest of the house is fine. It can't catch everything though — errors inside button clicks or delayed code need ordinary error handling.",

  portals:
    "Sometimes a popup gets cut off or trapped inside its container, no matter what you try in CSS. A portal lets it be displayed somewhere else on the page while still belonging to the same component. Your post goes to a PO box across town, but you still live with your family — same household, different delivery address.",

  suspense:
    "A placeholder for something not ready yet. While a part of the page is loading, React shows a stand-in and swaps in the real thing when it arrives. The important choice is how much you wrap: wrap everything and the whole page waits for the slowest bit, wrap each section and they appear as they're ready — like courses arriving as they're cooked instead of everything landing at once.",

  reconciliation:
    "React's way of comparing 'what's on screen now' with 'what should be on screen' and doing only the difference. To keep it fast it takes shortcuts: if something has changed type completely, it rebuilds rather than compares. It's spot-the-difference, not redrawing the whole picture.",

  hoc: "A function that takes a component and gives you back an upgraded version with something extra added — like sending a jacket to be lined. It was how people shared behaviour before hooks. It still works, but it adds a wrapper each time, so a few of them get messy. Custom hooks do the same job without the extra layers.",

  "render-props":
    "A component does the hard work — tracking the mouse, loading data — then hands the result to you and lets you decide what to show. Like a weather service: it gathers the forecast, you choose whether to display a sunshine icon or a warning. Hooks replaced it for most things, but it's still handy when a component needs to control how often something is drawn.",

  "atomic-design":
    "A way of organising components by size: atoms are the smallest pieces like a button, molecules combine a few of those, organisms are whole sections like a header, and so on up to full pages. Same idea as LEGO — bricks, small assemblies, finished builds. The genuinely useful part is that small pieces never depend on big ones; the naming argument itself isn't worth having.",

  // ---------------------------------------------------------------- react 19
  "react19-changes":
    "The headline additions make forms much less work — one hook now handles the value, the 'saving...' state, and the error, instead of you tracking three things by hand. There's also a way to show a result immediately before the server confirms it. And a couple of old things were removed quietly, so code that used them now does nothing at all.",

  usetransition:
    "Tells React 'this update matters less than what the user is doing right now'. So if you're typing while a big list is filtering, your letters appear instantly and the list catches up. Like a receptionist putting a long phone call on hold to answer someone standing at the desk.",

  useoptimistic:
    "Show the result straight away and assume it worked, then quietly undo it if it didn't. Like a barista writing your name on the cup before the payment clears — nearly always fine, and everyone gets served faster. React handles the undoing for you, which is the bit that's easy to get wrong by hand.",

  "server-components":
    "Components that run on the server and send back finished output, so their code never reaches the browser at all. That makes downloads smaller and lets them read from a database directly. The trade-off: they can't respond to clicks or hold state, so anything interactive still has to run in the browser.",

  // --------------------------------------------------------------- practical
  ssr: "Normally the browser gets a nearly empty page and builds it with JavaScript. With server-side rendering the server sends a finished page, so people see content sooner and Google and link previews can read it without running anything. The cost is you need a server and things get more complicated. Worth it for public content; usually not for a dashboard behind a login.",

  "react-router":
    "It makes the address bar work without reloading the page. Click a link and the URL changes, but instead of fetching a whole new page from the server, it just swaps which component is shown. Like changing channels on a TV rather than buying a new TV each time.",

  "fetching-data":
    "Ask for data, show a spinner while it's coming, then show the result — and handle it failing, which people forget. The sneaky bug is ordering: ask for A, then quickly ask for B, and if A comes back last you'll show A's data even though you wanted B. Most apps use a library because getting all this right by hand is fiddly.",

  testing:
    "Test what someone using your app would notice: click the button, check the right thing appeared. Don't test how it's wired up inside, because then renaming something breaks your tests even though the app works perfectly. Test that the car stops when you brake, not which wire connects to what.",

  "forms-handling":
    "For a couple of fields, just keep what's typed in state. Once you've got ten fields plus validation, use a form library — otherwise every keystroke redraws the whole form and you end up writing a lot of fiddly checking code yourself. Also: tell people what's wrong when they leave a field, not while they're still typing it.",

  "styling-react":
    "Several options. Plain CSS files are familiar but names can clash across a big project. CSS Modules keep names unique automatically. Tailwind puts styling right in the markup — quick, though it looks busy. CSS-in-JS lets styles change with your data but costs a bit of speed. Most new projects pick CSS Modules or Tailwind.",

  "async-calls":
    "Anything that takes time — fetching data, saving a form — needs three things covered: show it's happening, show the result, and show what went wrong if it fails. The forgotten one is cancelling: if someone navigates away or changes what they asked for, the old answer shouldn't come back and overwrite the new one.",

  "semver-ranges":
    "Version numbers go major.minor.patch. `^` says 'take small improvements but nothing that could break things'. `~` is stricter — only tiny fixes. No symbol means exactly this version, nothing else. The lock file then records precisely what got installed, so everyone on your team ends up with identical code rather than 'works on my machine'.",

  "service-workers":
    "A little helper that sits between your app and the internet. It can save responses so your site still works offline or loads instantly next time, and it's what makes notifications possible. Like keeping tinned food in the cupboard so you can still eat when the shops are shut.",

  "keys-index":
    "Using the position number as a name tag is fine only if the list never changes order and nothing gets added or removed from the middle. The moment it does, positions shift and React attaches the wrong things to the wrong rows — delete the first item and everything below inherits the wrong name tag.",

  "spa-seo":
    "Google can run JavaScript, so your site can still show up in search. But when someone shares a link on WhatsApp or LinkedIn, those previews don't run any JavaScript — they just read the raw page, so every link shows the same generic title. Fixing that means generating real pages, either on a server or when you build the site.",

  "safer-props-js":
    "Plain JavaScript won't warn you when you pass the wrong thing to a component. Special comments (JSDoc) give your editor enough information to catch mistakes as you type, without switching to TypeScript. And anything coming from a server needs an actual check at runtime, because no editor can know what a server will send back.",

  // ------------------------------------------------------------------ coding
  "reusable-button":
    "A good reusable button knows how to look, not what the app does. Give it a few named looks ('primary', 'danger') rather than a pile of true/false switches, and let it pass through anything else you hand it so it still behaves like a normal button. One watch-out: a button inside a form submits it unless you say otherwise — a very common surprise.",

  "toggle-bulb":
    "A warm-up. Keep a true/false value, flip it on click, and change how it looks. The one detail worth getting right is flipping it based on the previous value rather than the one you're currently looking at — safer, and interviewers notice.",

  "todo-list":
    "The classic exercise. Type something, add it to a list, delete items. What's really being checked: do you make a new list rather than changing the old one, and do you give each item a proper id instead of using its position? Using positions means deleting one item makes all the others shuffle into the wrong slots.",

  "loan-calculator":
    "Three inputs — amount, interest rate, years — and a monthly payment worked out from them. The trap is storing that result as its own separate value and trying to keep it updated. Just calculate it each time you draw, like a till showing the total: you don't store the total, you add up what's in the basket.",

  "not-found-page":
    "Add a catch-all route at the very bottom that matches anything the earlier routes didn't. Two things people miss: tell search engines not to index it, because the page technically reports 'everything's fine' even though it isn't; and don't bounce people to the homepage, because then they can't see what they mistyped.",
}

/** Ids in the question bank with no plain-English version yet. */
export function missingSimpleAnswers(ids: string[]): string[] {
  return ids.filter((id) => !(id in SIMPLE_ANSWERS))
}
