import { Callout } from "@/components/lesson/callout"
import { Challenge } from "@/components/lesson/challenge"
import { LiveCodeBlock } from "@/components/lesson/live-code-block"

const basicMap = `
function FruitList() {
  const fruits = ["Apple", "Banana", "Cherry"];

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}

render(<FruitList />);
`

const objectList = `
function TaskList() {
  const tasks = [
    { id: "t1", label: "Learn JSX", done: true },
    { id: "t2", label: "Learn state", done: true },
    { id: "t3", label: "Learn lists", done: false },
  ];

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <li key={task.id} style={{ textDecoration: task.done ? "line-through" : "none" }}>
          {task.label}
        </li>
      ))}
    </ul>
  );
}

render(<TaskList />);
`

const filterExample = `
function ActiveTasks() {
  const tasks = [
    { id: "t1", label: "Buy milk", done: true },
    { id: "t2", label: "Walk the dog", done: false },
    { id: "t3", label: "Write React lesson", done: false },
  ];

  const active = tasks.filter((task) => !task.done);

  return (
    <div>
      <p>{active.length} tasks remaining:</p>
      <ul>
        {active.map((task) => (
          <li key={task.id}>{task.label}</li>
        ))}
      </ul>
    </div>
  );
}

render(<ActiveTasks />);
`

export default function ListsAndKeysLesson() {
  return (
    <>
      <p>
        A huge amount of UI is really just "take an array of data and render one element per
        item." In React, that's done with the regular JavaScript array method{" "}
        <code>.map()</code> — no special looping syntax required.
      </p>

      <h2>Mapping an array to JSX</h2>
      <LiveCodeBlock code={basicMap} />

      <h2>The key prop</h2>
      <p>
        Notice the <code>key</code> prop on each <code>&lt;li&gt;</code>. React uses{" "}
        <code>key</code> to tell list items apart between renders, so it can update, reorder, or
        remove exactly the right DOM nodes instead of rebuilding the whole list. Keys must be{" "}
        <strong>unique among siblings</strong> — usually a stable ID from your data.
      </p>

      <Callout variant="warning">
        Avoid using the array <strong>index</strong> as a key when the list can be reordered,
        filtered, or have items inserted/removed — it can cause React to mix up which item is
        which, leading to subtle bugs with component state. It's fine only for lists that never
        change.
      </Callout>

      <h2>Lists of objects</h2>
      <p>
        Real data is usually an array of objects, each with its own unique <code>id</code> — the
        natural choice for a key.
      </p>
      <LiveCodeBlock code={objectList} />

      <h2>Combining map with filter</h2>
      <p>
        Because it's plain JavaScript, you can chain array methods like <code>.filter()</code>{" "}
        before <code>.map()</code> to render a derived subset of your data.
      </p>
      <LiveCodeBlock code={filterExample} />

      <Challenge
        hint={<p>Use <code>tasks.filter((task) =&gt; task.done)</code> before mapping.</p>}
      >
        Change the task list example to show only the <strong>completed</strong> tasks instead of
        all of them.
      </Challenge>
    </>
  )
}
