import { NavLink } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import { getLessonsBySection } from "@/lib/lessons-data"
import { useProgress } from "@/context/progress-context"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { isComplete, completedCount, totalCount } = useProgress()
  const percent = Math.round((completedCount / totalCount) * 100)
  const groups = getLessonsBySection()

  return (
    <nav aria-label="Lessons" className="flex h-full flex-col">
      <div className="space-y-2 px-4 pt-5 pb-4">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Your progress</span>
          <span>
            {completedCount}/{totalCount}
          </span>
        </div>
        <Progress value={percent} className="h-1.5" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-2 pb-6">
        {groups.map((group) => (
          <div key={group.section}>
            <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground/80 uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.lessons.map((lesson) => {
                const complete = isComplete(lesson.slug)
                const Icon = lesson.icon
                return (
                  <li key={lesson.slug}>
                    <NavLink
                      to={`/lessons/${lesson.slug}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                        )
                      }
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">
                        {lesson.order}. {lesson.shortTitle}
                      </span>
                      {complete ? (
                        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                      ) : null}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
